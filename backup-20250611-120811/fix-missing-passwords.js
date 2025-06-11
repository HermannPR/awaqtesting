require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function updateMissingPasswords() {
    try {
        console.log('🔄 ACTUALIZANDO CONTRASEÑAS FALTANTES A BCRYPT');
        console.log('===============================================');
        
        const connection = await mysql.createConnection({
            host: process.env.HOST || 'localhost',
            port: process.env.PORT || 3306,
            user: process.env.USR || 'root',
            password: process.env.PASS || 'root',
            database: process.env.DB || 'mawi_db'
        });

        console.log('✅ Conectado a la base de datos');

        // Users to update with bcrypt passwords
        const users = [
            { email: 'biomonitor@mawi.com', password: 'Bio2025!' },
            { email: 'usuario@mawi.com', password: 'User2025!' }
        ];

        for (const user of users) {
            console.log(`\n🔄 Procesando: ${user.email}`);
            
            // Generate bcrypt hash
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            
            console.log(`   🔐 Nueva contraseña (bcrypt): ${hashedPassword}`);
            
            // Update in database
            const [result] = await connection.execute(
                'UPDATE usuarios SET password = ? WHERE email = ?',
                [hashedPassword, user.email]
            );
            
            if (result.affectedRows > 0) {
                console.log(`   ✅ Contraseña actualizada exitosamente`);
                
                // Test the new password
                const isValid = await bcrypt.compare(user.password, hashedPassword);
                console.log(`   🧪 Verificación: ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
            } else {
                console.log(`   ❌ No se pudo actualizar la contraseña`);
            }
        }

        await connection.end();
        console.log('\n🎉 ACTUALIZACIÓN COMPLETADA');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

updateMissingPasswords();
