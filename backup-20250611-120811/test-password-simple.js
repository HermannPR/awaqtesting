// Test simple de verificación de credenciales
console.log('🔐 Iniciando test de credenciales...');

const bcrypt = require('bcrypt');

async function testPasswordHash() {
    const password = 'SuperAdmin2025!';
    const storedHash = '$2b$12$u0rFU4OjonUNVQkWPSMhfOitfD7.kjLtzvStabBW88Rj4qt9BRVI4u';
    
    console.log('Password a verificar:', password);
    console.log('Hash almacenado:', storedHash);
    
    try {
        const isValid = await bcrypt.compare(password, storedHash);
        console.log('¿Es válida la contraseña?', isValid);
        
        if (!isValid) {
            console.log('❌ La contraseña no coincide con el hash');
            console.log('🔧 Generando nuevo hash...');
            
            const newHash = await bcrypt.hash(password, 12);
            console.log('Nuevo hash generado:', newHash);
            
            // Verificar el nuevo hash
            const newVerification = await bcrypt.compare(password, newHash);
            console.log('¿Nuevo hash válido?', newVerification);
        } else {
            console.log('✅ ¡Contraseña válida!');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testPasswordHash();
