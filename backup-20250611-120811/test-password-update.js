require('dotenv').config();
const mysql = require('mysql2/promise');
const crypto = require('crypto');

console.log('🚀 Iniciando actualización de contraseñas...');

const SALT_SIZE = parseInt(process.env.SALT_SIZE || '12');
console.log('📏 SALT_SIZE:', SALT_SIZE);

function getSalt() {
    return crypto.randomBytes(SALT_SIZE).toString('base64url').substring(0, SALT_SIZE);
}

function encryptPassword(password, salt) {
    const iterations = 100000;
    const keylen = 64;
    const digest = 'sha512';
    const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('base64url');
    return hash;
}

async function main() {
    console.log('🔄 Conectando a la base de datos...');
    
    const connection = await mysql.createConnection({
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3306,
        user: process.env.USR || 'root',
        password: process.env.PASS || 'root',
        database: process.env.DB || 'mawi_db'
    });

    console.log('✅ Conectado exitosamente');

    // Actualizar superadmin específicamente
    const email = 'superadmin@mawi.com';
    const password = 'SuperAdmin2025!';
    
    console.log(`\n🔄 Actualizando ${email}...`);
    console.log(`🔑 Password: ${password}`);
    
    const salt = getSalt();
    const hash = encryptPassword(password, salt);
    const finalPassword = salt + hash;
    
    console.log(`🧂 Salt generado: ${salt}`);
    console.log(`🔐 Hash generado: ${hash.substring(0, 30)}...`);
    console.log(`📦 Password final: ${finalPassword.substring(0, 50)}...`);
    console.log(`📏 Longitud total: ${finalPassword.length}`);
    
    try {
        const [result] = await connection.execute(
            'UPDATE usuarios SET password = ? WHERE email = ?',
            [finalPassword, email]
        );
        
        console.log('📊 Resultado de UPDATE:', result);
        console.log(`✅ Filas afectadas: ${result.affectedRows}`);
        
        // Verificar la actualización
        const [check] = await connection.execute(
            'SELECT email, password FROM usuarios WHERE email = ?',
            [email]
        );
        
        if (check.length > 0) {
            console.log(`\n🔍 Password actualizado: ${check[0].password.substring(0, 50)}...`);
            console.log(`📏 Nueva longitud: ${check[0].password.length}`);
            
            // Test de validación
            const storedPassword = check[0].password;
            const storedSalt = storedPassword.substring(0, SALT_SIZE);
            const storedHash = storedPassword.substring(SALT_SIZE);
            const testHash = encryptPassword(password, storedSalt);
            
            console.log(`\n🧪 TEST DE VALIDACIÓN:`);
            console.log(`Salt extraído: ${storedSalt}`);
            console.log(`Hash almacenado: ${storedHash.substring(0, 30)}...`);
            console.log(`Hash calculado: ${testHash.substring(0, 30)}...`);
            console.log(`¿Coinciden?: ${storedHash === testHash ? '✅ SÍ' : '❌ NO'}`);
            
        } else {
            console.log('❌ No se encontró el usuario después de la actualización');
        }
        
    } catch (error) {
        console.error('❌ Error en UPDATE:', error.message);
    }
    
    await connection.end();
    console.log('\n🎉 Proceso completado');
}

main().catch(console.error);
