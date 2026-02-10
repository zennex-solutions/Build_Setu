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
    
    // Check if admin already exists
    db.query('SELECT id FROM Registration WHERE Email = ?', ['admin@buildsetu.com'], async (err, results) => {
        if (err) {
            console.error('❌ Check admin error:', err.message);
            return;
        }
        
        if (results.length === 0) {
            // Insert new admin
            console.log('📝 Creating new SUPER_ADMIN...');
            insertSuperAdmin(hashedPassword);
        } else {
            // Update existing admin password
            console.log('🔄 Updating existing SUPER_ADMIN password...');
            updateSuperAdmin(hashedPassword, results[0].id);
        }
    });
}

function insertSuperAdmin(hashedPassword) {
    const insertSQL = `
        INSERT INTO Registration (Username, Email, Password, Role, Status)
        VALUES (?, ?, ?, 'SUPER_ADMIN', 'APPROVED')
    `;
    
    db.query(insertSQL, ['superadmin', 'admin@buildsetu.com', hashedPassword], (err, result) => {
        if (err) {
            console.error('❌ Insert admin error:', err.message);
            return;
        }
        
        console.log('✅ SUPER_ADMIN created successfully!');
        console.log('   📧 Email: admin@buildsetu.com');
        console.log('   🔑 Password: Admin@123');
        console.log('   👤 User ID:', result.insertId);
    });
}

function updateSuperAdmin(hashedPassword, adminId) {
    db.query(
        'UPDATE Registration SET Password = ?, Status = "APPROVED", is_active = TRUE WHERE id = ?',
        [hashedPassword, adminId],
        (err) => {
            if (err) {
                console.error('❌ Update admin error:', err.message);
                return;
            }
            console.log('✅ SUPER_ADMIN password updated');
            console.log('   📧 Email: admin@buildsetu.com');
            console.log('   🔑 Password: Admin@123');
        }
    );
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

// ==================== ADMIN ENDPOINTS ====================

// Get all users for admin (excluding SUPER_ADMIN)
app.get('/api/admin/users', (req, res) => {
    console.log('\n👑 ADMIN: Fetching users for approval...');
    
    db.query(`
        SELECT 
            id, 
            Username, 
            Email, 
            Role, 
            Status,
            is_active,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
        FROM Registration 
        WHERE Role != 'SUPER_ADMIN'
        ORDER BY 
            CASE Status 
                WHEN 'PENDING' THEN 1
                WHEN 'APPROVED' THEN 2
                WHEN 'REJECTED' THEN 3
            END,
            created_at DESC
    `, (err, results) => {
        if (err) {
            console.error('❌ Get admin users error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        console.log(`✅ Found ${results.length} users for admin`);
        res.json({ 
            success: true, 
            count: results.length,
            users: results 
        });
    });
});

// Approve/Reject user
app.put('/api/admin/users/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, adminId } = req.body;
    
    console.log(`\n👑 ADMIN ACTION ======================`);
    console.log(`Admin ${adminId} changing user ${id} status to: ${status}`);
    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be APPROVED or REJECTED'
        });
    }
    
    if (!adminId) {
        return res.status(400).json({
            success: false,
            message: 'Admin ID is required'
        });
    }
    
    // Verify admin exists and is SUPER_ADMIN
    db.query('SELECT Role FROM Registration WHERE id = ?', [adminId], (err, results) => {
        if (err) {
            console.error('❌ Verify admin error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        
        if (results.length === 0 || results[0].Role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only SUPER_ADMIN can perform this action'
            });
        }
        
        // Update user status
        db.query(
            `UPDATE Registration 
             SET Status = ?, approved_by = ?, updated_at = NOW() 
             WHERE id = ? AND Role != 'SUPER_ADMIN'`,
            [status, adminId, id],
            (err, result) => {
                if (err) {
                    console.error('❌ Update error:', err.message);
                    return res.status(500).json({
                        success: false,
                        message: 'Database error'
                    });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found or cannot modify SUPER_ADMIN'
                    });
                }
                
                console.log(`✅ User ${id} ${status.toLowerCase()} by admin ${adminId}`);
                
                res.json({
                    success: true,
                    message: `User ${status.toLowerCase()} successfully`
                });
            }
        );
    });
});

// Activate/Deactivate user
app.put('/api/admin/users/:id/active', (req, res) => {
    const { id } = req.params;
    const { is_active, adminId } = req.body;
    
    console.log(`\n👑 ADMIN ACTION ======================`);
    console.log(`Admin ${adminId} setting user ${id} active status to: ${is_active}`);
    
    if (typeof is_active !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'is_active must be boolean (true/false)'
        });
    }
    
    if (!adminId) {
        return res.status(400).json({
            success: false,
            message: 'Admin ID is required'
        });
    }
    
    // Verify admin exists and is SUPER_ADMIN
    db.query('SELECT Role FROM Registration WHERE id = ?', [adminId], (err, results) => {
        if (err || results.length === 0 || results[0].Role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only SUPER_ADMIN can perform this action'
            });
        }
        
        db.query(
            'UPDATE Registration SET is_active = ?, updated_at = NOW() WHERE id = ?',
            [is_active, id],
            (err, result) => {
                if (err) {
                    console.error('❌ Update error:', err.message);
                    return res.status(500).json({
                        success: false,
                        message: 'Database error'
                    });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }
                
                console.log(`✅ User ${id} ${is_active ? 'activated' : 'deactivated'} by admin ${adminId}`);
                
                res.json({
                    success: true,
                    message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
                });
            }
        );
    });
});

// Get admin dashboard stats
app.get('/api/admin/stats', (req, res) => {
    const statsQuery = `
        SELECT 
            (SELECT COUNT(*) FROM Registration WHERE Role != 'SUPER_ADMIN') as total_users,
            (SELECT COUNT(*) FROM Registration WHERE Status = 'APPROVED' AND Role != 'SUPER_ADMIN') as approved_users,
            (SELECT COUNT(*) FROM Registration WHERE Status = 'PENDING') as pending_users,
            (SELECT COUNT(*) FROM Registration WHERE Status = 'REJECTED') as rejected_users,
            (SELECT COUNT(*) FROM Registration WHERE is_active = 1 AND Role != 'SUPER_ADMIN') as active_users
    `;
    
    db.query(statsQuery, (err, results) => {
        if (err) {
            console.error('❌ Stats error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        res.json({
            success: true,
            stats: results[0]
        });
    });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ==================== START SERVER ====================
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
    console.log(`   GET  http://localhost:${PORT}/api/admin/users`);
    console.log(`   PUT  http://localhost:${PORT}/api/admin/users/:id/status`);
    console.log(`   PUT  http://localhost:${PORT}/api/admin/users/:id/active`);
    console.log(`   GET  http://localhost:${PORT}/api/admin/stats`);
    console.log('='.repeat(60));
    console.log('\n👑 Test Credentials:');
    console.log('   📧 Email: admin@buildsetu.com');
    console.log('   🔑 Password: Admin@123');
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down server gracefully...');
    db.end();
    console.log('✅ Database connection closed');
    process.exit(0);
});