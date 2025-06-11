// Script para generar contraseñas hasheadas para usuarios MAWI
const bcrypt = require('bcrypt');

const passwords = {
    'superadmin@mawi.com': 'SuperAdmin2025!',
    'admin@mawi.com': 'Admin2025!',
    'biomonitor@mawi.com': 'Biomonitor2025!',
    'usuario@mawi.com': 'Usuario2025!'
};

async function generatePasswords() {
    console.log('🔐 GENERANDO CONTRASEÑAS HASHEADAS PARA USUARIOS MAWI');
    console.log('======================================================');
    
    for (const [email, password] of Object.entries(passwords)) {
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            console.log(`\n📧 Email: ${email}`);
            console.log(`🔑 Contraseña: ${password}`);
            console.log(`🔒 Hash: ${hashedPassword}`);
            console.log('---');
        } catch (error) {
            console.error(`Error generando hash para ${email}:`, error);
        }
    }
    
    console.log('\n✅ CONTRASEÑAS GENERADAS EXITOSAMENTE');
    console.log('\n📋 CREDENCIALES DE ACCESO:');
    console.log('======================================================');
    console.log('🔴 SUPER ADMIN:');
    console.log('   Email: superadmin@mawi.com');
    console.log('   Password: SuperAdmin2025!');
    console.log('');
    console.log('🟠 ADMIN:');
    console.log('   Email: admin@mawi.com');
    console.log('   Password: Admin2025!');
    console.log('');
    console.log('🟡 BIOMONITOR:');
    console.log('   Email: biomonitor@mawi.com');
    console.log('   Password: Biomonitor2025!');
    console.log('');
    console.log('🟢 USUARIO:');
    console.log('   Email: usuario@mawi.com');
    console.log('   Password: Usuario2025!');
}

generatePasswords();
