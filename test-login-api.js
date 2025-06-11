// Test de login vía API usando fetch
console.log('🔐 Probando login del Super Admin vía API...');

async function testLogin() {
    const loginData = {
        email: 'superadmin@mawi.com',
        password: 'SuperAdmin2025!'
    };
    
    console.log('📡 Enviando credenciales:', {
        email: loginData.email,
        password: '***********'
    });
    
    try {
        const response = await fetch('http://localhost:5000/Consultas/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        console.log('📊 Status de respuesta:', response.status);
        console.log('📊 Status text:', response.statusText);
        
        const data = await response.json();
        console.log('📦 Datos recibidos:', data);
        
        if (response.ok && data.token) {
            console.log('✅ ¡LOGIN EXITOSO!');
            console.log('🎫 Token recibido:', data.token ? 'Sí' : 'No');
            console.log('👤 Rol:', data.rol);
            console.log('📋 Estado:', data.estado);
            
            // Guardar token en localStorage si estamos en el browser
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('token', data.token);
                console.log('💾 Token guardado en localStorage');
            }
            
            return { success: true, data };
        } else {
            console.log('❌ Error en login:', data);
            return { success: false, error: data };
        }
        
    } catch (error) {
        console.error('💥 Error de red:', error);
        return { success: false, error };
    }
}

// Ejecutar el test
testLogin().then(result => {
    console.log('\n🏁 Resultado final:', result);
});

console.log('📋 Instrucciones:');
console.log('1. Copia este código');
console.log('2. Abre http://localhost:5000/login.html en el navegador');
console.log('3. Abre las herramientas de desarrollador (F12)');
console.log('4. Ve a la consola');
console.log('5. Pega y ejecuta este código');
console.log('6. Si el login es exitoso, podrás navegar a http://localhost:5000/indexSAdmin.html');
