// Test login functionality
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/Consultas/api';

async function testLogin() {
    try {
        console.log('🔄 Testing login for superadmin@mawi.com...');
        
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'superadmin@mawi.com',
                password: 'SuperAdmin2025!'
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            console.log('✅ Login successful!');
            console.log('🎫 Token received:', data.token ? 'Yes' : 'No');
            console.log('🏷️ Role:', data.rol);
            console.log('📍 Estado:', data.estado);
        } else {
            console.log('❌ Login failed:', data.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLogin();
