require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkTables() {
    try {
        console.log('🔍 VERIFICANDO TABLAS Y USUARIOS');
        console.log('=====================================');
        
        const connection = await mysql.createConnection({
            host: process.env.HOST || 'localhost',
            port: process.env.PORT || 3306,
            user: process.env.USR || 'root',
            password: process.env.PASS || 'root',
            database: process.env.DB || 'mawi_db'
        });

        console.log('✅ Conectado a la base de datos');

        // Show all tables
        console.log('\n📊 TODAS LAS TABLAS:');
        const [allTables] = await connection.execute('SHOW TABLES');
        allTables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`- ${tableName}`);
        });

        // Check specifically for user-related tables
        console.log('\n🔍 BUSCANDO TABLAS DE USUARIOS:');
        const userTables = ['usuario', 'usuarios', 'user', 'users'];
        
        for (const tableName of userTables) {
            try {
                const [exists] = await connection.execute(`SHOW TABLES LIKE '${tableName}'`);
                if (exists.length > 0) {
                    console.log(`✅ Tabla "${tableName}" existe`);
                    
                    // Get structure
                    const [structure] = await connection.execute(`DESCRIBE ${tableName}`);
                    console.log(`\n🏗️ Estructura de "${tableName}":`);
                    structure.forEach(column => {
                        console.log(`  📌 ${column.Field} - ${column.Type} - Null: ${column.Null} - Key: ${column.Key}`);
                    });
                    
                    // Get count
                    const [count] = await connection.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
                    console.log(`📊 Total de registros: ${count[0].total}`);
                    
                    // If there are records, show some
                    if (count[0].total > 0) {
                        const [sample] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 3`);
                        console.log(`\n👥 Primeros registros:`);
                        sample.forEach((record, index) => {
                            console.log(`\n--- Registro ${index + 1} ---`);
                            Object.entries(record).forEach(([key, value]) => {
                                if (key.toLowerCase().includes('password') || key.toLowerCase().includes('pass')) {
                                    console.log(`${key}: ***OCULTO***`);
                                } else {
                                    console.log(`${key}: ${value}`);
                                }
                            });
                        });
                    }
                    console.log('\n' + '='.repeat(50));
                } else {
                    console.log(`❌ Tabla "${tableName}" NO existe`);
                }
            } catch (error) {
                console.log(`❌ Error verificando tabla "${tableName}": ${error.message}`);
            }
        }

        await connection.end();

    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

checkTables();
