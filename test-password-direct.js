// Test directo de password hash
const bcrypt = require('bcrypt');

console.log('🔐 Test de password hash iniciado...');

const password = 'SuperAdmin2025!';
const storedHash = '$2b$12$u0rFU4OjonUNVQkWPSMhfOitfD7.kjLtzvStabBW88Rj4qt9BRVI4u';

console.log('Password:', password);
console.log('Hash:', storedHash);

bcrypt.compare(password, storedHash)
    .then(result => {
        console.log('✅ Resultado de comparación:', result);
        if (result) {
            console.log('🎉 ¡LA CONTRASEÑA ES CORRECTA!');
        } else {
            console.log('❌ La contraseña NO coincide');
            console.log('🔧 Generando nuevo hash...');
            
            return bcrypt.hash(password, 12);
        }
    })
    .then(newHash => {
        if (newHash) {
            console.log('🆕 Nuevo hash generado:', newHash);
            return bcrypt.compare(password, newHash);
        }
    })
    .then(newResult => {
        if (newResult !== undefined) {
            console.log('✅ Verificación de nuevo hash:', newResult);
        }
        console.log('🏁 Test completado');
    })
    .catch(error => {
        console.error('❌ Error:', error);
    });
