require('dotenv').config();
const mysql = require('mysql2/promise');

async function quickCheck() {
    const connection = await mysql.createConnection({
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3306,
        user: process.env.USR || 'root',
        password: process.env.PASS || 'root',
        database: process.env.DB || 'mawi_db'
    });

    try {
        // Check usuario table
        console.log('Checking usuario table...');
        const [usuarios] = await connection.execute('SELECT * FROM Usuarios LIMIT 5');
        console.log('usuario table records:', usuarios.length);
        if (usuarios.length > 0) {
            console.log('First record:', usuarios[0]);
        }
    } catch (error) {
        console.log('Error with usuario table:', error.message);
    }

    try {
        // Check usuarios table
        console.log('Checking usuarios table...');
        const [usuarios] = await connection.execute('SELECT * FROM Usuarios LIMIT 5');
        console.log('usuarios table records:', usuarios.length);
        if (usuarios.length > 0) {
            console.log('First record:', usuarios[0]);
        }
    } catch (error) {
        console.log('Error with usuarios table:', error.message);
    }

    await connection.end();
}

quickCheck().catch(console.error);
