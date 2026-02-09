// server/generate-hash.js
import bcrypt from 'bcryptjs';

async function generateHash() {
    const password = 'Admin@123';
    
    console.log('🔐 Generating bcrypt hash for password:', password);
    
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    console.log('Salt:', salt);
    
    // Generate hash
    const hash = await bcrypt.hash(password, salt);
    console.log('\n✅ Hash generated:', hash);
    
    // Verify it works
    const isValid = await bcrypt.compare(password, hash);
    console.log('✅ Hash verification:', isValid ? 'PASSED' : 'FAILED');
    
    console.log('\n📋 SQL to insert:');
    console.log(`
INSERT INTO Registration (Username, Email, Password, Role, Status) VALUES
('superadmin', 'admin@buildsetu.com', '${hash}', 'SUPER_ADMIN', 'APPROVED');
    `);
    
    // Test with common bcrypt hashes
    console.log('\n🔍 Testing common bcrypt patterns:');
    const testHashes = [
        '$2a$10$ABCDEFGHIJKLMNOPQRSTUVuYeL2jN6Zv.1cQbK9p4r7s0t1u2v3w4x5y6z',
        '$2a$10$N9qo8uLOickgx2ZMRZoMye0JmWkKlBd9M/7rQADF.HvL6pQjz7UYdS',
        '$2a$10$FdH0mK0Z2oI8mQnN7sT4QuLz7jKbVwXyPqA9rC1dE3fG5hJ8kL2nM4p6r8t0v2'
    ];
    
    for (const testHash of testHashes) {
        const testResult = await bcrypt.compare(password, testHash);
        console.log(`Hash ${testHash.substring(0, 30)}... : ${testResult ? '✅ WORKS' : '❌ FAILS'}`);
    }
}

generateHash().catch(console.error);