// Test de login para verificar credenciales del Super Admin
const bcrypt = require('bcrypt');
const mysql = require('./Datasource/MySQLMngr');

async function testSuperAdminLogin() {
    console.log('🔐 Probando credenciales del Super Admin...');
    
    const email = 'superadmin@mawi.com';
    const password = 'SuperAdmin2025!';
    
    try {
        // 1. Verificar que el usuario existe
        console.log('1️⃣ Verificando usuario en base de datos...');
        const userQuery = "SELECT * FROM Usuarios WHERE email = ?";
        const userResult = await mysql.getDataWithParams(userQuery, [email]);
        
        if (!userResult.getStatus() || userResult.getRows().length === 0) {
            console.log('❌ Usuario no encontrado');
            return;
        }
        
        const user = userResult.getRows()[0];
        console.log('✅ Usuario encontrado:', {
            id: user.idUsuario,
            nombre: user.Nombre,
            email: user.email,
            rol: user.rol,
            estado: user.estado
        });
        
        // 2. Verificar contraseña
        console.log('2️⃣ Verificando contraseña...');
        const storedHash = user.password;
        console.log('Hash almacenado:', storedHash);
        
        const isValid = await bcrypt.compare(password, storedHash);
        console.log('¿Contraseña válida?', isValid);
        
        if (isValid) {
            console.log('✅ ¡Credenciales correctas!');
            console.log('📋 Datos del usuario:');
            console.log('   - Email:', user.email);
            console.log('   - Nombre:', user.Nombre, user.Apellidos);
            console.log('   - Rol:', user.rol, '(Super Admin)');
            console.log('   - Estado:', user.estado);
        } else {
            console.log('❌ Contraseña incorrecta');
            
            // Generar nuevo hash para comparar
            console.log('3️⃣ Generando nuevo hash para verificar...');
            const newHash = await bcrypt.hash(password, 12);
            console.log('Nuevo hash generado:', newHash);
            
            // Verificar si el nuevo hash funciona
            const newVerification = await bcrypt.compare(password, newHash);
            console.log('¿Nuevo hash válido?', newVerification);
        }
        
    } catch (error) {
        console.error('❌ Error en test:', error);
    }
}

// 4. Test de login vía API
async function testLoginAPI() {
    console.log('\n🌐 Probando login vía API...');
    
    const loginData = {
        email: 'superadmin@mawi.com',
        password: 'SuperAdmin2025!'
    };
    
    try {
        const response = await fetch('http://localhost:5000/Consultas/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        console.log('Status de respuesta:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Login exitoso vía API!');
            console.log('Token recibido:', data.token ? 'Sí' : 'No');
            console.log('Rol:', data.rol);
            console.log('Estado:', data.estado);
        } else {
            const errorData = await response.json();
            console.log('❌ Error en login API:', errorData);
        }
        
    } catch (error) {
        console.error('❌ Error haciendo petición:', error);
    }
}

// Ejecutar tests
async function runTests() {
    await testSuperAdminLogin();
    await testLoginAPI();
    process.exit(0);
}

runTests();
