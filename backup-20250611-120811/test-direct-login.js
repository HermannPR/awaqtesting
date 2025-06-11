const fetch = require('node-fetch');

async function testLogin() {
    const loginData = {
        email: 'superadmin@mawi.com',
        password: 'SuperAdmin2025!'
    };

    console.log('🧪 TESTING LOGIN');
    console.log('================');
    console.log('📧 Email:', loginData.email);
    console.log('🔑 Password:', loginData.password);
    console.log('🌐 URL: http://localhost:5000/Consultas/api/login');

    try {
        const response = await fetch('http://localhost:5000/Consultas/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        console.log('\n📊 RESPONSE STATUS:', response.status);
        console.log('📊 RESPONSE OK:', response.ok);

        const data = await response.json();
        console.log('\n📋 RESPONSE DATA:');
        console.log(JSON.stringify(data, null, 2));

        if (response.ok && data.token) {
            console.log('\n✅ LOGIN EXITOSO!');
            console.log('🎫 Token recibido:', data.token.substring(0, 50) + '...');
        } else {
            console.log('\n❌ LOGIN FALLIDO');
            console.log('💬 Mensaje:', data.message || 'Sin mensaje');
        }

    } catch (error) {
        console.error('\n❌ ERROR DE RED:', error.message);
    }
}

testLogin();
