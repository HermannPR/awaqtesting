require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkTableStructure() {
    try {
        console.log('🔍 VERIFICANDO ESTRUCTURA DE LA TABLA USUARIOS');
        console.log('=====================================');
        
        const connection = await mysql.createConnection({
            host: process.env.HOST || 'localhost',
            port: process.env.PORT || 3306,
            user: process.env.USR || 'root',
            password: process.env.PASS || 'root',
            database: process.env.DB || 'mawi_db'
        });

        console.log('✅ Conectado a la base de datos');

        // Check if users table exists
        const [tables] = await connection.execute(
            "SHOW TABLES LIKE 'usuarios'"
        );

        if (tables.length === 0) {
            console.log('❌ La tabla "usuarios" no existe');
            
            // Show all tables
            const [allTables] = await connection.execute('SHOW TABLES');
            console.log('\n📊 Tablas disponibles:');
            allTables.forEach(table => {
                console.log(`- ${Object.values(table)[0]}`);
            });
            
            await connection.end();
            return;
        }

        console.log('✅ La tabla "usuarios" existe');

        // Describe the table structure
        const [structure] = await connection.execute('DESCRIBE usuarios');
        
        console.log('\n🏗️ ESTRUCTURA DE LA TABLA:');
        console.log('=====================================');
        structure.forEach(column => {
            console.log(`📌 ${column.Field} - ${column.Type} - ${column.Null} - ${column.Key} - ${column.Default}`);
        });

        // Try to get some data (using SELECT * to avoid column name issues)
        console.log('\n📊 INTENTANDO OBTENER DATOS:');
        console.log('=====================================');
        
        try {
            const [users] = await connection.execute('SELECT * FROM usuarios LIMIT 5');
            console.log(`✅ Encontrados ${users.length} usuarios (mostrando máximo 5):`);
            
            if (users.length > 0) {
                console.log('\n👥 PRIMEROS USUARIOS:');
                users.forEach((user, index) => {
                    console.log(`\n--- Usuario ${index + 1} ---`);
                    Object.entries(user).forEach(([key, value]) => {
                        if (key.toLowerCase().includes('password') || key.toLowerCase().includes('pass')) {
                            console.log(`${key}: ***OCULTO***`);
                        } else {
                            console.log(`${key}: ${value}`);
                        }
                    });
                });
            }
        } catch (selectError) {
            console.log('❌ Error al obtener datos:', selectError.message);
        }

        await connection.end();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkTableStructure();
