require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUsers() {
    try {
        console.log('🔍 VERIFICANDO USUARIOS EN LA BASE DE DATOS');
        console.log('=====================================');
          const connection = await mysql.createConnection({
            host: process.env.HOST || 'localhost',
            port: process.env.PORT || 3306,
            user: process.env.USR || 'root',
            password: process.env.PASS || 'root',
            database: process.env.DB || 'mawi_db'
        });

        console.log('✅ Conectado a la base de datos');        // Check all users
        const [users] = await connection.execute(
            'SELECT idUsuario, email, Nombre, Apellidos, rol, estado, fechaRegistro FROM usuarios ORDER BY idUsuario'
        );

        console.log(`\n📊 Total de usuarios encontrados: ${users.length}`);
        console.log('\n👥 LISTA DE USUARIOS:');
        console.log('=====================================');
          users.forEach(user => {
            const roleName = getRoleName(user.rol);
            const estadoName = getEstadoName(user.estado);
            console.log(`ID: ${user.idUsuario}`);
            console.log(`📧 Email: ${user.email}`);
            console.log(`👤 Nombre: ${user.Nombre} ${user.Apellidos}`);
            console.log(`🏷️ Rol: ${user.rol} (${roleName})`);
            console.log(`📍 Estado: ${user.estado} (${estadoName})`);
            console.log(`📅 Registro: ${user.fechaRegistro}`);
            console.log('---');
        });

        // Check specifically for superadmin
        const [superadmin] = await connection.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            ['superadmin@mawi.com']
        );

        console.log('\n🔍 BÚSQUEDA ESPECÍFICA DE SUPERADMIN:');
        console.log('=====================================');
        if (superadmin.length > 0) {
            console.log('✅ Superadmin encontrado:');
            console.log(JSON.stringify(superadmin[0], null, 2));
        } else {
            console.log('❌ Superadmin NO encontrado');
            console.log('🔄 Verificando si existe algún usuario con rol 4...');
            
            const [adminUsers] = await connection.execute(
                'SELECT * FROM usuarios WHERE rol = 4'
            );
            
            if (adminUsers.length > 0) {
                console.log(`✅ Encontrados ${adminUsers.length} usuarios con rol 4:`);                adminUsers.forEach(admin => {
                    console.log(`- ${admin.email} (${admin.Nombre} ${admin.Apellidos})`);
                });
            } else {
                console.log('❌ No hay usuarios con rol 4 (Super Admin)');
            }
        }

        await connection.end();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

function getRoleName(rol) {
    const roles = {
        1: 'Usuario',
        2: 'Biomonitor', 
        3: 'Admin',
        4: 'Super Admin'
    };
    return roles[rol] || 'Desconocido';
}

function getEstadoName(estado) {
    const estados = {
        'A': 'Activo',
        'P': 'Pendiente',
        'I': 'Inactivo/Rechazado'
    };
    return estados[estado] || 'Desconocido';
}

checkUsers();
