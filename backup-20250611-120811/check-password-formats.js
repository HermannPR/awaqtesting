require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkPasswordFormats() {
    try {
        console.log('🔍 VERIFICANDO FORMATOS DE CONTRASEÑAS');
        console.log('=====================================');
        
        const connection = await mysql.createConnection({
            host: process.env.HOST || 'localhost',
            port: process.env.PORT || 3306,
            user: process.env.USR || 'root',
            password: process.env.PASS || 'root',
            database: process.env.DB || 'mawi_db'
        });

        const emails = [
            'superadmin@mawi.com',
            'admin@mawi.com', 
            'biomonitor@mawi.com',
            'usuario@mawi.com'
        ];

        for (const email of emails) {
            const [users] = await connection.execute(
                'SELECT email, password FROM usuarios WHERE email = ?',
                [email]
            );
            
            if (users.length > 0) {
                const user = users[0];
                const password = user.password;
                
                console.log(`\n📧 ${email}:`);
                console.log(`   🔐 Password: ${password.substring(0, 50)}...`);
                console.log(`   📏 Length: ${password.length}`);
                
                // Determine format
                if (password.startsWith('$2b$') || password.startsWith('$2a$') || password.startsWith('$2y$')) {
                    console.log(`   🏷️ Format: BCRYPT ✅`);
                } else if (password.length > 50 && !password.includes('$')) {
                    console.log(`   🏷️ Format: CUSTOM SALT+HASH ⚠️`);
                } else {
                    console.log(`   🏷️ Format: UNKNOWN ❓`);
                }
            } else {
                console.log(`\n📧 ${email}: ❌ NOT FOUND`);
            }
        }

        await connection.end();
        console.log('\n🎉 ANÁLISIS COMPLETADO');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkPasswordFormats();
