import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'buildsetu'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err.message);
        console.log('💡 Make sure MySQL is running and database "buildsetu" exists');
        console.log('💡 Run: CREATE DATABASE buildsetu;');
        process.exit(1);
    }
    console.log('✅ Connected to MySQL Database: buildsetu');
    
    setupDatabase();
});

async function setupDatabase() {
    // Create table
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS Registration (
            id INT PRIMARY KEY AUTO_INCREMENT,
            Username VARCHAR(50) NOT NULL UNIQUE,
            Email VARCHAR(100) NOT NULL UNIQUE,
            Password VARCHAR(255) NOT NULL,
            Role ENUM('SUPER_ADMIN','PROJECT_MANAGER','SITE_ENGINEER','SUPERVISOR','ACCOUNTANT','CONTRACTOR','CLIENT') DEFAULT 'CLIENT',
            Status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
            approved_by INT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;
    
    db.query(createTableSQL, async (err) => {
        if (err) {
            console.error('❌ Table Creation Error:', err.message);
            return;
        }
        console.log('✅ Registration table ready');
        
        // Ensure SUPER_ADMIN exists with correct password
        await ensureSuperAdmin();
    });
}

async function ensureSuperAdmin() {
    console.log('👑 Ensuring SUPER_ADMIN exists...');
    
    // Generate fresh hash
    const salt = await bcrypt.genSalt(10);
    const password = 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('🔐 Generated hash for Admin@123:', hashedPassword.substring(0, 30) + '...');
    
    // First, remove any existing entry to avoid conflicts
    db.query('DELETE FROM Registration WHERE Email = ?', ['admin@buildsetu.com'], (err) => {
        if (err) {
            console.error('❌ Cleanup error:', err.message);
            // Continue anyway
        }
        
        // Insert fresh admin
        const insertSQL = `
            INSERT INTO Registration (Username, Email, Password, Role, Status)
            VALUES (?, ?, ?, 'SUPER_ADMIN', 'APPROVED')
        `;
        
        db.query(insertSQL, ['superadmin', 'admin@buildsetu.com', hashedPassword], (err, result) => {
            if (err) {
                console.error('❌ Insert admin error:', err.message);
                
                // Try update if insert fails
                db.query(
                    'UPDATE Registration SET Password = ?, Role = "SUPER_ADMIN", Status = "APPROVED" WHERE Email = ?',
                    [hashedPassword, 'admin@buildsetu.com'],
                    (err) => {
                        if (err) {
                            console.error('❌ Update admin error:', err.message);
                            return;
                        }
                        console.log('✅ SUPER_ADMIN password updated');
                        verifyLogin();
                    }
                );
                return;
            }
            
            console.log('✅ SUPER_ADMIN created successfully!');
            console.log('   📧 Email: admin@buildsetu.com');
            console.log('   🔑 Password: Admin@123');
            console.log('   👤 User ID:', result.insertId);
            
            verifyLogin();
        });
    });
}

async function verifyLogin() {
    console.log('\n🔐 Verifying login works...');
    
    // Get the stored hash
    db.query('SELECT Password FROM Registration WHERE Email = ?', ['admin@buildsetu.com'], async (err, results) => {
        if (err || results.length === 0) {
            console.error('❌ Cannot verify: No admin found');
            return;
        }
        
        const storedHash = results[0].Password;
        const testPassword = 'Admin@123';
        
        try {
            const isValid = await bcrypt.compare(testPassword, storedHash);
            console.log(`Password "Admin@123" verification: ${isValid ? '✅ SUCCESS' : '❌ FAILED'}`);
            
            if (!isValid) {
                console.log('⚠️  Password mismatch! Regenerating...');
                await ensureSuperAdmin();
            }
        } catch (error) {
            console.error('❌ Verification error:', error.message);
        }
    });
}

// ==================== API ENDPOINTS ====================

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'BuildSetu API is working!',
        timestamp: new Date().toISOString()
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT id, Username, Email, Role, Status, created_at FROM Registration ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('❌ Get users error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, users: results });
    });
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    
    console.log('\n📝 REGISTRATION ATTEMPT ======================');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Role:', role || 'CLIENT');
    
    // Validation
    if (!username || !email || !password) {
        console.log('❌ Missing required fields');
        return res.status(400).json({
            success: false,
            message: 'Username, email and password are required'
        });
    }
    
    // Validate role
    const validRoles = ['PROJECT_MANAGER', 'SITE_ENGINEER', 'SUPERVISOR', 'ACCOUNTANT', 'CONTRACTOR', 'CLIENT'];
    const userRole = role || 'CLIENT';
    
    if (!validRoles.includes(userRole)) {
        console.log('❌ Invalid role:', userRole);
        return res.status(400).json({
            success: false,
            message: 'Invalid role selected'
        });
    }
    
    try {
        // Check if user already exists
        db.query('SELECT id FROM Registration WHERE Username = ? OR Email = ?', 
            [username, email], 
            async (err, results) => {
                if (err) {
                    console.error('❌ Database error:', err.message);
                    return res.status(500).json({
                        success: false,
                        message: 'Database error'
                    });
                }
                
                if (results.length > 0) {
                    console.log('❌ Username or email already exists');
                    return res.status(400).json({
                        success: false,
                        message: 'Username or email already exists'
                    });
                }
                
                // Hash password
                console.log('🔐 Hashing password...');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                // Insert new user with PENDING status
                const insertSQL = `
                    INSERT INTO Registration (Username, Email, Password, Role, Status)
                    VALUES (?, ?, ?, ?, 'PENDING')
                `;
                
                db.query(insertSQL, [username, email, hashedPassword, userRole], (err, result) => {
                    if (err) {
                        console.error('❌ Insert error:', err.message);
                        return res.status(500).json({
                            success: false,
                            message: 'Failed to register user'
                        });
                    }
                    
                    console.log('✅ User registered successfully!');
                    console.log('   User ID:', result.insertId);
                    console.log('   Status: PENDING (awaiting approval)');
                    
                    res.status(201).json({
                        success: true,
                        message: 'User registered successfully. Awaiting admin approval.',
                        userId: result.insertId,
                        username: username,
                        email: email,
                        role: userRole,
                        status: 'PENDING'
                    });
                });
            }
        );
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log('\n🔐 LOGIN ATTEMPT ======================');
    console.log('Email:', email);
    
    if (!email || !password) {
        console.log('❌ Missing email or password');
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
    
    // Check user exists
    db.query('SELECT * FROM Registration WHERE Email = ?', [email], async (err, results) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        
        if (results.length === 0) {
            console.log('❌ User not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        const user = results[0];
        console.log('👤 Found user:', user.Username, `(ID: ${user.id}, Status: ${user.Status})`);
        
        try {
            console.log('🔍 Comparing password...');
            const isPasswordValid = await bcrypt.compare(password, user.Password);
            console.log('Password valid:', isPasswordValid);
            
            if (!isPasswordValid) {
                console.log('❌ Password incorrect');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            
            // Check status
            if (user.Status !== 'APPROVED') {
                console.log(`❌ Account not approved (Status: ${user.Status})`);
                return res.status(403).json({
                    success: false,
                    message: `Account is ${user.Status.toLowerCase()}. Please contact administrator.`
                });
            }
            
            console.log('✅ Login successful!');
            
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.Username,
                    email: user.Email,
                    role: user.Role,
                    status: user.Status
                }
            });
            
        } catch (error) {
            console.error('❌ Password comparison error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`🚀 BuildSetu Server Started!`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('\n📋 Available Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/test`);
    console.log(`   GET  http://localhost:${PORT}/api/users`);
    console.log(`   POST http://localhost:${PORT}/api/register`);
    console.log(`   POST http://localhost:${PORT}/api/login`);
    console.log('='.repeat(60));
    console.log('\n👑 Test Credentials:');
    console.log('   📧 Email: admin@buildsetu.com');
    console.log('   🔑 Password: Admin@123');
    console.log('='.repeat(60));
});