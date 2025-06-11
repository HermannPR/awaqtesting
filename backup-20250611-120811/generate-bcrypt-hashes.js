const bcrypt = require('bcrypt');

async function generateBcryptHashes() {
    console.log('🔐 GENERANDO HASHES BCRYPT');
    console.log('==========================');
    
    const passwords = [
        { user: 'biomonitor', password: 'Bio2025!' },
        { user: 'usuario', password: 'User2025!' }
    ];
    
    for (const pwd of passwords) {
        const hash = await bcrypt.hash(pwd.password, 12);
        console.log(`\n👤 ${pwd.user}:`);
        console.log(`   🔑 Password: ${pwd.password}`);
        console.log(`   🔐 Hash: ${hash}`);
        console.log(`   📋 SQL: UPDATE usuarios SET password = '${hash}' WHERE email = '${pwd.user}@mawi.com';`);
    }
}

generateBcryptHashes().catch(console.error);
