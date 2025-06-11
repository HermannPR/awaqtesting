// Script de prueba para verificar endpoints del super admin
// Ejecutar en la consola del navegador después de hacer login

console.log('🧪 Iniciando pruebas de endpoints del Super Admin...');

const token = localStorage.getItem('token');
const baseURL = 'http://localhost:5000/Consultas/api';

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

// Función para hacer peticiones de prueba
async function testEndpoint(name, url, method = 'GET') {
    try {
        const response = await fetch(url, { 
            method, 
            headers 
        });
        const data = await response.json();
        
        console.log(`✅ ${name}:`, {
            status: response.status,
            data: data
        });
        
        return { success: true, data };
    } catch (error) {
        console.error(`❌ ${name}:`, error);
        return { success: false, error };
    }
}

// Ejecutar todas las pruebas
async function runAllTests() {
    console.log('\n📊 Probando estadísticas...');
    await testEndpoint('Estadísticas Super Admin', `${baseURL}/stats/superadmin`);
    
    console.log('\n👥 Probando usuarios...');
    await testEndpoint('Usuarios Pendientes', `${baseURL}/getUsersNA`);
    await testEndpoint('Usuarios Rechazados', `${baseURL}/getUsersRechazados`);
    await testEndpoint('Contador Pendientes', `${baseURL}/listpendientes`);
    await testEndpoint('Contador Rechazados', `${baseURL}/getRechazadosCount`);
    await testEndpoint('Usuarios Activos', `${baseURL}/usuariosActivos`);
    await testEndpoint('Total Registros', `${baseURL}/totalRegistros`);
    
    console.log('\n🔄 Probando actividad...');
    await testEndpoint('Actividad del Sistema', `${baseURL}/stats/activity`);
    
    console.log('\n✅ Pruebas completadas!');
}

// Ejecutar las pruebas
runAllTests();
