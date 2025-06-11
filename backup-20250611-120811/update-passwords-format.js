require('dotenv').config();
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const SALT_SIZE = parseInt(process.env.SALT_SIZE || '12');

function getSalt() {
    return crypto.randomBytes(SALT_SIZE).toString('base64url').substring(0, SALT_SIZE);
}

function encryptPassword(password, salt) {
    const iterations = 100000;
    const keylen = 64; // bytes
    const digest = 'sha512';

    const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('base64url');
    return hash;
}

async function updatePasswords() {
    try {
        console.log('🔄 ACTUALIZANDO CONTRASEÑAS AL FORMATO SISTEM ACTUAL');
        console.log('====================================================');
        
        const connection = await mysql.createConnection({
            host: process.env.HOST || 'localhost',
            port: process.env.PORT || 3306,
            user: process.env.USR || 'root',
            password: process.env.PASS || 'root',
            database: process.env.DB || 'mawi_db'
        });

        console.log('✅ Conectado a la base de datos');

        // Credenciales que necesitamos actualizar
        const credentials = [
            { email: 'superadmin@mawi.com', password: 'SuperAdmin2025!' },
            { email: 'admin@mawi.com', password: 'Admin2025!' },
            { email: 'biomonitor@mawi.com', password: 'Bio2025!' },
            { email: 'usuario@mawi.com', password: 'User2025!' }
        ];

        for (const cred of credentials) {
            console.log(`\n🔄 Procesando: ${cred.email}`);
            
            // Generar salt y hash usando el sistema actual
            const salt = getSalt();
            const hash = encryptPassword(cred.password, salt);
            const finalPassword = salt + hash;
            
            console.log(`   🧂 Salt: ${salt}`);
            console.log(`   🔐 Hash: ${hash.substring(0, 20)}...`);
            console.log(`   📦 Password final (primeros 50 chars): ${finalPassword.substring(0, 50)}...`);
            
            // Actualizar en la base de datos
            const [result] = await connection.execute(
                'UPDATE usuarios SET password = ? WHERE email = ?',
                [finalPassword, cred.email]
            );
            
            if (result.affectedRows > 0) {
                console.log(`   ✅ Password actualizado exitosamente`);
            } else {
                console.log(`   ❌ Usuario no encontrado o no actualizado`);
            }
        }

        console.log('\n🔍 VERIFICANDO LAS NUEVAS CONTRASEÑAS:');
        console.log('=====================================');

        // Verificar que las contraseñas funcionan
        for (const cred of credentials) {
            console.log(`\n🧪 Testing: ${cred.email}`);
            
            const [users] = await connection.execute(
                'SELECT email, password FROM usuarios WHERE email = ?',
                [cred.email]
            );
            
            if (users.length > 0) {
                const user = users[0];
                const storedPassword = user.password;
                const salt = storedPassword.substring(0, SALT_SIZE);
                const storedHash = storedPassword.substring(SALT_SIZE);
                const testHash = encryptPassword(cred.password, salt);
                
                if (storedHash === testHash) {
                    console.log(`   ✅ Password verificado correctamente`);
                } else {
                    console.log(`   ❌ Password NO coincide`);
                    console.log(`   Expected: ${testHash.substring(0, 20)}...`);
                    console.log(`   Stored:   ${storedHash.substring(0, 20)}...`);
                }
            } else {
                console.log(`   ❌ Usuario no encontrado`);
            }
        }

        await connection.end();
        console.log('\n🎉 PROCESO COMPLETADO');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

updatePasswords();
