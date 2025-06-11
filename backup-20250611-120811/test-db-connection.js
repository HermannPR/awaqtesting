// Prueba de conexión a la base de datos MAWI
const mysql = require('mysql2');
require('dotenv').config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const USR = process.env.USR;
const PASS = process.env.PASS;
const DB = process.env.DB;

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE BASE DE DATOS');
console.log('=====================================');
console.log(`HOST: ${HOST}`);
console.log(`PORT: ${PORT}`);
console.log(`USER: ${USR}`);
console.log(`PASS: ${PASS ? '***CONFIGURADO***' : 'NO CONFIGURADO'}`);
console.log(`DATABASE: ${DB}`);
console.log('=====================================\n');

async function testConnection() {
    console.log('🔄 Intentando conectar a MySQL...');
    
    try {
        // Primero probar conexión sin base de datos específica
        const connectionWithoutDB = mysql.createConnection({
            host: HOST,
            user: USR,
            port: PORT,
            password: PASS
        });

        await new Promise((resolve, reject) => {
            connectionWithoutDB.connect((err) => {
                if (err) {
                    console.log('❌ Error conectando a MySQL servidor:');
                    console.log(`   Código: ${err.code}`);
                    console.log(`   Mensaje: ${err.message}`);
                    reject(err);
                } else {
                    console.log('✅ Conexión exitosa al servidor MySQL');
                    resolve();
                }
            });
        });

        // Verificar si la base de datos existe
        console.log(`🔍 Verificando si la base de datos '${DB}' existe...`);
        
        await new Promise((resolve, reject) => {
            connectionWithoutDB.query(`SHOW DATABASES LIKE '${DB}'`, (err, results) => {
                if (err) {
                    console.log('❌ Error verificando bases de datos:', err.message);
                    reject(err);
                } else if (results.length === 0) {
                    console.log(`⚠️  La base de datos '${DB}' NO EXISTE`);
                    console.log('💡 Creando la base de datos...');
                    
                    connectionWithoutDB.query(`CREATE DATABASE ${DB}`, (createErr) => {
                        if (createErr) {
                            console.log('❌ Error creando base de datos:', createErr.message);
                            reject(createErr);
                        } else {
                            console.log(`✅ Base de datos '${DB}' creada exitosamente`);
                            resolve();
                        }
                    });
                } else {
                    console.log(`✅ La base de datos '${DB}' existe`);
                    resolve();
                }
            });
        });

        connectionWithoutDB.end();

        // Ahora probar conexión con la base de datos específica
        console.log(`🔄 Conectando a la base de datos '${DB}'...`);
        
        const connectionWithDB = mysql.createConnection({
            host: HOST,
            user: USR,
            port: PORT,
            password: PASS,
            database: DB
        });

        await new Promise((resolve, reject) => {
            connectionWithDB.connect((err) => {
                if (err) {
                    console.log('❌ Error conectando a la base de datos específica:');
                    console.log(`   Código: ${err.code}`);
                    console.log(`   Mensaje: ${err.message}`);
                    reject(err);
                } else {
                    console.log('✅ Conexión exitosa a la base de datos específica');
                    resolve();
                }
            });
        });

        // Probar una consulta simple
        console.log('🔄 Probando consulta simple...');
        
        await new Promise((resolve, reject) => {
            connectionWithDB.query('SELECT 1 as test', (err, results) => {
                if (err) {
                    console.log('❌ Error ejecutando consulta de prueba:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Consulta de prueba exitosa:', results);
                    resolve();
                }
            });
        });

        // Verificar tablas existentes
        console.log('🔍 Verificando tablas existentes...');
        
        await new Promise((resolve, reject) => {
            connectionWithDB.query('SHOW TABLES', (err, results) => {
                if (err) {
                    console.log('❌ Error listando tablas:', err.message);
                    reject(err);
                } else {
                    console.log(`📊 Tablas encontradas: ${results.length}`);
                    if (results.length > 0) {
                        results.forEach(table => {
                            console.log(`   - ${Object.values(table)[0]}`);
                        });
                    } else {
                        console.log('⚠️  No hay tablas en la base de datos');
                    }
                    resolve();
                }
            });
        });

        connectionWithDB.end();
        
        console.log('\n🎉 TODAS LAS PRUEBAS DE CONEXIÓN COMPLETADAS EXITOSAMENTE');
        
    } catch (error) {
        console.log('\n💥 ERROR EN LA PRUEBA DE CONEXIÓN:');
        console.log('=====================================');
        console.log(error);
        
        // Sugerencias de solución
        console.log('\n🔧 POSIBLES SOLUCIONES:');
        console.log('1. Verificar que MySQL esté ejecutándose');
        console.log('2. Verificar credenciales en el archivo .env');
        console.log('3. Verificar que el puerto 3306 esté disponible');
        console.log('4. Crear la base de datos mawi_db manualmente');
    }
}

// Ejecutar la prueba
testConnection();
