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
        process.exit(1);
    }
    console.log('✅ Connected to MySQL Database: buildsetu');
    console.log('📊 Using users table');
});

// ==================== API ENDPOINTS ====================

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'BuildSetu API is working!',
        timestamp: new Date().toISOString()
    });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log('\n🔐 LOGIN ATTEMPT ======================');
    console.log('Email:', email);
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
    
    // Check user exists in users table
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
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
        console.log('👤 Found user:', user.name, `(ID: ${user.id}, Role: ${user.role})`);
        
        // For demo purposes, accept 'password123' or check against a password field
        // Since your users table doesn't have a password field, we'll use a simple check
        // In production, you should add a password field to your users table
        if (password !== '123456') {
            console.log('❌ Password incorrect');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Check status
        if (user.status !== 'Active') {
            console.log(`❌ Account not active (Status: ${user.status})`);
            return res.status(403).json({
                success: false,
                message: `Account is inactive. Please contact administrator.`
            });
        }
        
        // Generate a simple token
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
        
        console.log('✅ Login successful!');
        
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    });
});

// Get all users - NOW USING users TABLE
app.get('/api/users', (req, res) => {
    console.log('\n👥 FETCHING USERS ======================');
    
    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        console.log('❌ No token provided');
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    // Simple query to get all users
    db.query(
        'SELECT id, name, email, phone, role, status, department, created_at FROM users ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error('❌ Get users error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            console.log(`✅ Found ${results.length} users`);
            
            // Log first user as sample
            if (results.length > 0) {
                console.log('Sample user:', {
                    id: results[0].id,
                    name: results[0].name,
                    email: results[0].email,
                    role: results[0].role,
                    status: results[0].status
                });
            }
            
            res.json({ 
                success: true, 
                users: results 
            });
        }
    );
});

// Get single user by ID
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    db.query(
        'SELECT id, name, email, phone, role, status, department, created_at FROM users WHERE id = ?',
        [userId],
        (err, results) => {
            if (err) {
                console.error('❌ Get user error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            
            res.json({ success: true, user: results[0] });
        }
    );
});

// Create new user
app.post('/api/users', (req, res) => {
    const { name, email, phone, role, status, department } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: 'Name and email are required'
        });
    }
    
    db.query(
        'INSERT INTO users (name, email, phone, role, status, department) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone || '', role || 'SITE_ENGINEER', status || 'Active', department || ''],
        (err, result) => {
            if (err) {
                console.error('❌ Create user error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({
                success: true,
                message: 'User created successfully',
                userId: result.insertId
            });
        }
    );
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, phone, role, status, department } = req.body;
    
    db.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, status = ?, department = ? WHERE id = ?',
        [name, email, phone, role, status, department, userId],
        (err, result) => {
            if (err) {
                console.error('❌ Update user error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            
            res.json({ success: true, message: 'User updated successfully' });
        }
    );
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('❌ Delete user error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, message: 'User deleted successfully' });
    });
});

// Dashboard summary stats
app.get('/api/dashboard/summary', (req, res) => {
    db.query(
        `SELECT 
            COUNT(*) as total_users,
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_users,
            SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive_users,
            SUM(CASE WHEN role = 'SUPER_ADMIN' THEN 1 ELSE 0 END) as super_admins
        FROM users`,
        (err, results) => {
            if (err) {
                console.error('❌ Stats error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({
                success: true,
                summary: results[0]
            });
        }
    );
});

// Debug endpoint to check database structure
app.get('/api/debug/db-structure', (req, res) => {
    db.query('DESCRIBE users', (err, structure) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        
        db.query('SELECT * FROM users LIMIT 5', (err2, sample) => {
            if (err2) {
                return res.status(500).json({ success: false, error: err2.message });
            }
            
            res.json({
                success: true,
                table_name: 'users',
                structure: structure,
                sample_data: sample
            });
        });
    });
});
// Registration endpoint (using Registration table for pending approvals)
app.post('/api/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    
    console.log('\n📝 REGISTRATION ATTEMPT ======================');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Role:', role || 'CLIENT');
    
    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username, email and password are required'
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }
    
    // Validate role
    const validRoles = ['PROJECT_MANAGER', 'SITE_ENGINEER', 'SUPERVISOR', 'ACCOUNTANT', 'CONTRACTOR', 'CLIENT'];
    const userRole = role || 'CLIENT';
    
    if (!validRoles.includes(userRole)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role selected'
        });
    }
    
    // Check if user already exists in either table
    db.query(
        'SELECT id FROM Registration WHERE Email = ? OR Username = ? UNION SELECT id FROM users WHERE email = ? OR name = ?',
        [email, username, email, username],
        async (err, results) => {
            if (err) {
                console.error('❌ Database error:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }
            
            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Username or email already exists'
                });
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Insert into Registration table with PENDING status
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

// ==================== TEAMS ENDPOINTS ====================

// Get all teams with project details
app.get('/api/teams', (req, res) => {
    console.log('\n👥 FETCHING TEAMS ======================');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    const query = `
        SELECT 
            t.id,
            t.name,
            t.lead,
            t.trade,
            t.members,
            t.project_id,
            t.status,
            t.created_at,
            t.updated_at,
            p.id as project_id,
            p.name as project_name,
            p.location as project_location,
            p.status as project_status
        FROM teams t
        LEFT JOIN projects p ON t.project_id = p.id
        ORDER BY t.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Get teams error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message 
            });
        }
        
        console.log(`✅ Found ${results.length} teams`);
        
        // Log each team to debug
        results.forEach(team => {
            console.log(`Team ${team.id}: ${team.name} -> Project: ${team.project_name || 'No Project'} (ID: ${team.project_id})`);
        });
        
        res.json({ 
            success: true, 
            teams: results 
        });
    });
});

// Get single team with project details
app.get('/api/teams/:id', (req, res) => {
    const teamId = req.params.id;
    
    const query = `
        SELECT 
            t.*,
            p.name as project_name,
            p.location as project_location,
            p.status as project_status
        FROM teams t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.id = ?
    `;

    db.query(query, [teamId], (err, results) => {
        if (err) {
            console.error('❌ Get team error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        
        res.json({ success: true, team: results[0] });
    });
});

// Create new team
app.post('/api/teams', (req, res) => {
    const { name, lead, trade, members, project_id, status } = req.body;
    
    console.log('\n📝 CREATE TEAM ======================');
    console.log('Name:', name);
    console.log('Lead:', lead);
    console.log('Trade:', trade);
    console.log('Project ID:', project_id);
    
    // Validation
    if (!name || !lead || !trade) {
        return res.status(400).json({
            success: false,
            message: 'Name, lead and trade are required'
        });
    }
    
    db.query(
        'INSERT INTO teams (name, lead, trade, members, project_id, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, lead, trade, members || 0, project_id || null, status || 'Idle'],
        (err, result) => {
            if (err) {
                console.error('❌ Create team error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            // Fetch the created team with project details
            const query = `
                SELECT 
                    t.*,
                    p.name as project_name,
                    p.location as project_location
                FROM teams t
                LEFT JOIN projects p ON t.project_id = p.id
                WHERE t.id = ?
            `;
            
            db.query(query, [result.insertId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Team created successfully',
                        teamId: result.insertId 
                    });
                }
                
                console.log('✅ Team created with ID:', result.insertId);
                res.status(201).json({
                    success: true,
                    message: 'Team created successfully',
                    team: rows[0]
                });
            });
        }
    );
});

// Update team
app.put('/api/teams/:id', (req, res) => {
    const teamId = req.params.id;
    const { name, lead, trade, members, project_id, status } = req.body;
    
    console.log('\n📝 UPDATE TEAM ======================');
    console.log('Team ID:', teamId);
    
    db.query(
        'UPDATE teams SET name = ?, lead = ?, trade = ?, members = ?, project_id = ?, status = ? WHERE id = ?',
        [name, lead, trade, members, project_id, status, teamId],
        (err, result) => {
            if (err) {
                console.error('❌ Update team error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Team not found' 
                });
            }
            
            // Fetch updated team with project details
            const query = `
                SELECT 
                    t.*,
                    p.name as project_name,
                    p.location as project_location
                FROM teams t
                LEFT JOIN projects p ON t.project_id = p.id
                WHERE t.id = ?
            `;
            
            db.query(query, [teamId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Team updated successfully' 
                    });
                }
                
                console.log('✅ Team updated:', teamId);
                res.json({ 
                    success: true, 
                    message: 'Team updated successfully',
                    team: rows[0]
                });
            });
        }
    );
});

// Delete team
app.delete('/api/teams/:id', (req, res) => {
    const teamId = req.params.id;
    
    console.log('\n🗑️ DELETE TEAM ======================');
    console.log('Team ID:', teamId);
    
    db.query('DELETE FROM teams WHERE id = ?', [teamId], (err, result) => {
        if (err) {
            console.error('❌ Delete team error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team not found' 
            });
        }
        
        console.log('✅ Team deleted:', teamId);
        res.json({ 
            success: true, 
            message: 'Team deleted successfully' 
        });
    });
});

// Get team statistics with project info
app.get('/api/teams/stats/summary', (req, res) => {
    const query = `
        SELECT 
            COUNT(*) as total_crews,
            SUM(members) as total_manpower,
            SUM(CASE WHEN t.status = 'On Site' THEN 1 ELSE 0 END) as on_site_crews,
            SUM(CASE WHEN t.status = 'Idle' THEN 1 ELSE 0 END) as idle_crews,
            SUM(CASE WHEN t.status = 'Off Duty' THEN 1 ELSE 0 END) as off_duty_crews,
            SUM(CASE WHEN t.trade = 'Civil/Masonry' THEN t.members ELSE 0 END) as masonry_workers,
            SUM(CASE WHEN t.trade = 'Electrical' THEN t.members ELSE 0 END) as electrical_workers,
            SUM(CASE WHEN t.trade = 'Plumbing' THEN t.members ELSE 0 END) as plumbing_workers,
            SUM(CASE WHEN t.trade = 'Carpentry' THEN t.members ELSE 0 END) as carpentry_workers,
            COUNT(DISTINCT t.project_id) as active_projects
        FROM teams t
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Team stats error:', err.message);
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

// Get teams by project ID
app.get('/api/teams/project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    
    const query = `
        SELECT 
            t.*,
            p.name as project_name,
            p.location as project_location
        FROM teams t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.project_id = ?
        ORDER BY t.name
    `;

    db.query(query, [projectId], (err, results) => {
        if (err) {
            console.error('❌ Get teams by project error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, teams: results });
    });
});

// Get teams by status
app.get('/api/teams/status/:status', (req, res) => {
    const status = req.params.status;
    
    const query = `
        SELECT 
            t.*,
            p.name as project_name,
            p.location as project_location
        FROM teams t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.status = ?
        ORDER BY t.name
    `;

    db.query(query, [status], (err, results) => {
        if (err) {
            console.error('❌ Get teams by status error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, teams: results });
    });
});

// Get teams by trade
app.get('/api/teams/trade/:trade', (req, res) => {
    const trade = req.params.trade;
    
    const query = `
        SELECT 
            t.*,
            p.name as project_name,
            p.location as project_location
        FROM teams t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.trade = ?
        ORDER BY t.name
    `;

    db.query(query, [trade], (err, results) => {
        if (err) {
            console.error('❌ Get teams by trade error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, teams: results });
    });
});

// ==================== TASK ASSIGNMENTS ENDPOINTS ====================

// Get all tasks with project details
// Get all tasks with project details
app.get('/api/tasks', (req, res) => {
    console.log('\n📋 FETCHING TASKS ======================');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    // Clean SQL query - NO COMMENTS INSIDE THE QUERY
    const query = `
        SELECT 
            t.id,
            t.title,
            t.assigned_to,
            t.project_id as task_project_id,
            p.id as project_id,
            DATE_FORMAT(t.due_date, '%Y-%m-%d') as due_date,
            t.priority,
            t.status,
            t.description,
            t.created_at,
            t.updated_at,
            t.completed_at,
            p.name as project_name,
            p.location as project_location
        FROM task_assignments t
        LEFT JOIN projects p ON t.project_id = p.id
        ORDER BY 
            CASE t.status
                WHEN 'Pending' THEN 1
                WHEN 'In Progress' THEN 2
                WHEN 'Completed' THEN 3
            END,
            t.due_date ASC,
            t.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Get tasks error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message 
            });
        }
        
        console.log(`✅ Found ${results.length} tasks`);
        
        // Log each task to verify
        results.forEach(task => {
            console.log(`Task ${task.id}: ${task.title} -> Project ID: ${task.project_id}, Project Name: ${task.project_name}`);
        });
        
        res.json({ 
            success: true, 
            tasks: results 
        });
    });
});

// Get single task with project details
// Get single task
app.get('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    const query = `
        SELECT 
            t.*,
            p.name as project_name,
            p.location as project_location,
            p.status as project_status
        FROM task_assignments t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.id = ?
    `;

    db.query(query, [taskId], (err, results) => {
        if (err) {
            console.error('❌ Get task error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        res.json({ success: true, task: results[0] });
    });
});

// Create new task
app.post('/api/tasks', (req, res) => {
    const { title, assignedTo, project_id, dueDate, priority, status, description } = req.body;
    
    console.log('\n📝 CREATE TASK ======================');
    console.log('Title:', title);
    console.log('Assigned To:', assignedTo);
    console.log('Project ID:', project_id);
    
    if (!title || !assignedTo || !project_id) {
        return res.status(400).json({
            success: false,
            message: 'Title, assigned to, and project are required'
        });
    }
    
    const authHeader = req.headers.authorization;
    let createdBy = null;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            createdBy = payload.id;
        } catch (e) {
            console.log('Could not parse user from token');
        }
    }
    
    db.query(
        `INSERT INTO task_assignments 
         (title, assigned_to, project_id, due_date, priority, status, description, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, assignedTo, project_id, dueDate || null, priority || 'Medium', status || 'Pending', description || null, createdBy],
        (err, result) => {
            if (err) {
                console.error('❌ Create task error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            const query = `
                SELECT 
                    t.*,
                    p.name as project_name,
                    p.location as project_location
                FROM task_assignments t
                LEFT JOIN projects p ON t.project_id = p.id
                WHERE t.id = ?
            `;
            
            db.query(query, [result.insertId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Task created successfully',
                        taskId: result.insertId 
                    });
                }
                
                console.log('✅ Task created with ID:', result.insertId);
                res.status(201).json({
                    success: true,
                    message: 'Task created successfully',
                    task: rows[0]
                });
            });
        }
    );
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, assignedTo, project_id, dueDate, priority, status, description } = req.body;
    
    console.log('\n📝 UPDATE TASK ======================');
    console.log('Task ID:', taskId);
    
    let completedAtSql = '';
    let params = [title, assignedTo, project_id, dueDate, priority, status, description];
    
    if (status === 'Completed') {
        completedAtSql = ', completed_at = CURRENT_TIMESTAMP';
    }
    
    db.query(
        `UPDATE task_assignments 
         SET title = ?, assigned_to = ?, project_id = ?, due_date = ?, 
             priority = ?, status = ?, description = ? ${completedAtSql}
         WHERE id = ?`,
        [...params, taskId],
        (err, result) => {
            if (err) {
                console.error('❌ Update task error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Task not found' 
                });
            }
            
            const query = `
                SELECT 
                    t.*,
                    p.name as project_name,
                    p.location as project_location
                FROM task_assignments t
                LEFT JOIN projects p ON t.project_id = p.id
                WHERE t.id = ?
            `;
            
            db.query(query, [taskId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Task updated successfully' 
                    });
                }
                
                console.log('✅ Task updated:', taskId);
                res.json({ 
                    success: true, 
                    message: 'Task updated successfully',
                    task: rows[0]
                });
            });
        }
    );
});
// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    console.log('\n🗑️ DELETE TASK ======================');
    console.log('Task ID:', taskId);
    
    db.query('DELETE FROM task_assignments WHERE id = ?', [taskId], (err, result) => {
        if (err) {
            console.error('❌ Delete task error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }
        
        console.log('✅ Task deleted:', taskId);
        res.json({ 
            success: true, 
            message: 'Task deleted successfully' 
        });
    });
});

// Get task statistics with project info
app.get('/api/tasks/stats/summary', (req, res) => {
    const query = `
        SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
            SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high_priority_tasks,
            SUM(CASE WHEN priority = 'Medium' THEN 1 ELSE 0 END) as medium_priority_tasks,
            SUM(CASE WHEN priority = 'Low' THEN 1 ELSE 0 END) as low_priority_tasks,
            SUM(CASE WHEN due_date < CURDATE() AND status != 'Completed' THEN 1 ELSE 0 END) as overdue_tasks,
            COUNT(DISTINCT project_id) as total_projects
        FROM task_assignments
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Task stats error:', err.message);
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

// Get tasks by project ID
app.get('/api/tasks/project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    
    const query = `
        SELECT 
            t.*,
            p.name as project_name,
            p.location as project_location
        FROM task_assignments t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.project_id = ?
        ORDER BY 
            CASE t.status
                WHEN 'Pending' THEN 1
                WHEN 'In Progress' THEN 2
                WHEN 'Completed' THEN 3
            END,
            t.due_date ASC
    `;

    db.query(query, [projectId], (err, results) => {
        if (err) {
            console.error('❌ Get tasks by project error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, tasks: results });
    });
});

// Get tasks assigned to specific person/crew
app.get('/api/tasks/assigned/:assignee', (req, res) => {
    const assignee = req.params.assignee;
    
    const query = `
        SELECT 
            t.*,
            p.name as project_name,
            p.location as project_location
        FROM task_assignments t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.assigned_to = ?
        ORDER BY 
            CASE t.status
                WHEN 'Pending' THEN 1
                WHEN 'In Progress' THEN 2
                WHEN 'Completed' THEN 3
            END,
            t.due_date ASC
    `;

    db.query(query, [assignee], (err, results) => {
        if (err) {
            console.error('❌ Get tasks by assignee error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, tasks: results });
    });
});

// Bulk update task status
app.patch('/api/tasks/bulk/status', (req, res) => {
    const { taskIds, status } = req.body;
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Task IDs array is required'
        });
    }
    
    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status'
        });
    }
    
    const placeholders = taskIds.map(() => '?').join(',');
    const completedAtSql = status === 'Completed' ? ', completed_at = CURRENT_TIMESTAMP' : '';
    
    db.query(
        `UPDATE task_assignments SET status = ? ${completedAtSql} WHERE id IN (${placeholders})`,
        [status, ...taskIds],
        (err, result) => {
            if (err) {
                console.error('❌ Bulk update error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({
                success: true,
                message: `Updated ${result.affectedRows} tasks to ${status}`,
                updatedCount: result.affectedRows
            });
        }
    );
});

// ==================== ADMIN ENDPOINTS ====================

// Get all users for admin (from Registration table)
app.get('/api/admin/users', (req, res) => {
    console.log('\n👑 ADMIN: Fetching users for approval...');
    
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

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
    
    // First, get the user details before updating
    db.query('SELECT * FROM Registration WHERE id = ?', [id], (err, userResults) => {
        if (err) {
            console.error('❌ Get user error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (userResults.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const user = userResults[0];
        
        // Update user status in Registration table
        db.query(
            `UPDATE Registration 
             SET Status = ?, approved_by = ?, updated_at = NOW() 
             WHERE id = ?`,
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
                        message: 'User not found'
                    });
                }
                
                // If approved, also add to users table
                if (status === 'APPROVED') {
                    // Check if user already exists in users table
                    db.query('SELECT id FROM users WHERE email = ?', [user.Email], (err, existingUsers) => {
                        if (!err && existingUsers.length === 0) {
                            // Add to users table with default values
                            db.query(
                                `INSERT INTO users (name, email, phone, role, status, department) 
                                 VALUES (?, ?, ?, ?, ?, ?)`,
                                [user.Username, user.Email, '', user.Role, 'Active', ''],
                                (err2) => {
                                    if (err2) {
                                        console.error('❌ Error adding to users table:', err2.message);
                                    } else {
                                        console.log(`✅ User ${user.Username} added to users table`);
                                    }
                                }
                            );
                        }
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
    
    // Update in Registration table
    db.query(
        'UPDATE Registration SET is_active = ?, updated_at = NOW() WHERE id = ?',
        [is_active ? 1 : 0, id],
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
            
            // Also update in users table if user exists there
            db.query('SELECT Email FROM Registration WHERE id = ?', [id], (err, userResults) => {
                if (!err && userResults.length > 0) {
                    const email = userResults[0].Email;
                    db.query(
                        'UPDATE users SET status = ? WHERE email = ?',
                        [is_active ? 'Active' : 'Inactive', email],
                        (err2) => {
                            if (err2) {
                                console.error('❌ Error updating users table:', err2.message);
                            }
                        }
                    );
                }
            });
            
            console.log(`✅ User ${id} ${is_active ? 'activated' : 'deactivated'} by admin ${adminId}`);
            
            res.json({
                success: true,
                message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
            });
        }
    );
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

// ==================== PROJECTS ENDPOINTS ====================

// Get all projects
app.get('/api/projects', (req, res) => {
    console.log('\n🏗️ FETCHING PROJECTS ======================');
    
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('❌ No token provided');
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    // Simple query to get all projects
    db.query(
        'SELECT * FROM projects ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error('❌ Get projects error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            console.log(`✅ Found ${results.length} projects`);
            res.json({ 
                success: true, 
                projects: results 
            });
        }
    );
});

// Get single project by ID
app.get('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    
    db.query(
        'SELECT * FROM projects WHERE id = ?',
        [projectId],
        (err, results) => {
            if (err) {
                console.error('❌ Get project error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            
            res.json({ success: true, project: results[0] });
        }
    );
});

// Create new project
app.post('/api/projects', (req, res) => {
    const { name, location, manager, taskTime, budget, status, description } = req.body;
    
    console.log('\n📝 CREATE PROJECT ======================');
    console.log('Name:', name);
    console.log('Location:', location);
    console.log('Manager:', manager);
    console.log('Budget:', budget);
    console.log('Status:', status);
    
    // Validation
    if (!name || !location) {
        return res.status(400).json({
            success: false,
            message: 'Project name and location are required'
        });
    }
    
    db.query(
        `INSERT INTO projects (name, location, manager, task_time, budget, status, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, location, manager || null, taskTime || null, budget || 0, status || 'Planning', description || null],
        (err, result) => {
            if (err) {
                console.error('❌ Create project error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            console.log('✅ Project created with ID:', result.insertId);
            res.status(201).json({
                success: true,
                message: 'Project created successfully',
                projectId: result.insertId
            });
        }
    );
});

// Update project
app.put('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const { name, location, manager, taskTime, budget, status, description } = req.body;
    
    console.log('\n📝 UPDATE PROJECT ======================');
    console.log('Project ID:', projectId);
    
    db.query(
        `UPDATE projects 
         SET name = ?, location = ?, manager = ?, task_time = ?, 
             budget = ?, status = ?, description = ?
         WHERE id = ?`,
        [name, location, manager, taskTime, budget, status, description, projectId],
        (err, result) => {
            if (err) {
                console.error('❌ Update project error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Project not found' 
                });
            }
            
            console.log('✅ Project updated:', projectId);
            res.json({ 
                success: true, 
                message: 'Project updated successfully'
            });
        }
    );
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    
    console.log('\n🗑️ DELETE PROJECT ======================');
    console.log('Project ID:', projectId);
    
    db.query('DELETE FROM projects WHERE id = ?', [projectId], (err, result) => {
        if (err) {
            console.error('❌ Delete project error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found' 
            });
        }
        
        console.log('✅ Project deleted:', projectId);
        res.json({ 
            success: true, 
            message: 'Project deleted successfully' 
        });
    });
});

// Get project statistics
app.get('/api/projects/stats/summary', (req, res) => {
    db.query(
        `SELECT 
            COUNT(*) as total_projects,
            SUM(CASE WHEN status = 'Planning' THEN 1 ELSE 0 END) as planning_projects,
            SUM(CASE WHEN status = 'On Site' THEN 1 ELSE 0 END) as on_site_projects,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_projects,
            SUM(budget) as total_budget
        FROM projects`,
        (err, results) => {
            if (err) {
                console.error('❌ Project stats error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            res.json({
                success: true,
                stats: results[0]
            });
        }
    );
});

// Get all labour with project details
app.get('/api/labour', (req, res) => {
    console.log('\n👷 FETCHING LABOUR ======================');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('❌ No token provided');
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    const query = `
        SELECT 
            l.*,
            p.name as project_name,
            p.location as project_location
        FROM labour l
        LEFT JOIN projects p ON l.project_id = p.id
        ORDER BY l.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Get labour error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message 
            });
        }
        
        console.log(`✅ Found ${results.length} labour records`);
        res.json({ 
            success: true, 
            labour: results 
        });
    });
});

// Create new labour
app.post('/api/labour', (req, res) => {
    const { 
        labourId, name, contactNumber, email, category, trade, 
        dailyRate, contractType, status, project_id, address, notes 
    } = req.body;
    
    console.log('\n📝 CREATE LABOUR ======================');
    console.log('Labour ID:', labourId);
    console.log('Name:', name);
    console.log('Project ID:', project_id);
    
    if (!labourId || !name) {
        return res.status(400).json({
            success: false,
            message: 'Labour ID and name are required'
        });
    }
    
    const authHeader = req.headers.authorization;
    let createdBy = null;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            createdBy = payload.id;
        } catch (e) {
            console.log('Could not parse user from token');
        }
    }
    
    db.query(
        `INSERT INTO labour (
            labour_id, name, contact_number, email, category, trade, 
            daily_rate, contract_type, status, project_id, address, notes, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            labourId, name, contactNumber || null, email || null, 
            category || 'Semi-skilled', trade || 'Helper', 
            dailyRate || null, contractType || 'Daily', status || 'Active', 
            project_id || null, address || null, notes || null, createdBy
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Create labour error:', err.message);
                
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Labour ID already exists' 
                    });
                }
                
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            const query = `
                SELECT 
                    l.*,
                    p.name as project_name,
                    p.location as project_location
                FROM labour l
                LEFT JOIN projects p ON l.project_id = p.id
                WHERE l.id = ?
            `;
            
            db.query(query, [result.insertId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Labour created successfully',
                        labourId: result.insertId 
                    });
                }
                
                console.log('✅ Labour created with ID:', result.insertId);
                res.status(201).json({
                    success: true,
                    message: 'Labour created successfully',
                    labour: rows[0]
                });
            });
        }
    );
});

// Update labour
app.put('/api/labour/:id', (req, res) => {
    const labourId = req.params.id;
    const { 
        labourId: newLabourId, name, contactNumber, email, category, trade, 
        dailyRate, contractType, status, project_id, address, notes 
    } = req.body;
    
    console.log('\n📝 UPDATE LABOUR ======================');
    console.log('Labour Record ID:', labourId);
    console.log('Project ID:', project_id);
    
    if (!newLabourId || !name) {
        return res.status(400).json({
            success: false,
            message: 'Labour ID and name are required'
        });
    }
    
    const query = `
        UPDATE labour 
        SET labour_id = ?, name = ?, contact_number = ?, email = ?, 
            category = ?, trade = ?, daily_rate = ?, contract_type = ?, 
            status = ?, project_id = ?, address = ?, notes = ?
        WHERE id = ?
    `;
    
    const params = [
        newLabourId, name, contactNumber || null, email || null, 
        category || 'Semi-skilled', trade || 'Helper', 
        dailyRate || null, contractType || 'Daily', status || 'Active', 
        project_id || null, address || null, notes || null, 
        labourId
    ];
    
    db.query(query, params, (err, result) => {
        if (err) {
            console.error('❌ Update labour error:', err.message);
            
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Labour ID already exists' 
                });
            }
            
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Labour not found' 
            });
        }
        
        const selectQuery = `
            SELECT 
                l.*,
                p.name as project_name,
                p.location as project_location
            FROM labour l
            LEFT JOIN projects p ON l.project_id = p.id
            WHERE l.id = ?
        `;
        
        db.query(selectQuery, [labourId], (err2, rows) => {
            if (err2) {
                return res.json({ 
                    success: true, 
                    message: 'Labour updated successfully' 
                });
            }
            
            console.log('✅ Labour updated:', labourId);
            res.json({ 
                success: true, 
                message: 'Labour updated successfully',
                labour: rows[0]
            });
        });
    });
});


// ==================== MATERIALS ENDPOINTS ====================

// Get all materials
app.get('/api/materials', (req, res) => {
    console.log('\n📦 FETCHING MATERIALS ======================');
    
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('❌ No token provided');
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    db.query(
        'SELECT * FROM materials ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error('❌ Get materials error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            console.log(`✅ Found ${results.length} materials`);
            res.json({ 
                success: true, 
                materials: results 
            });
        }
    );
});

// Get single material by ID
app.get('/api/materials/:id', (req, res) => {
    const materialId = req.params.id;
    
    db.query(
        'SELECT * FROM materials WHERE id = ?',
        [materialId],
        (err, results) => {
            if (err) {
                console.error('❌ Get material error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Material not found' });
            }
            
            res.json({ success: true, material: results[0] });
        }
    );
});

// Create new material
app.post('/api/materials', (req, res) => {
    const { 
        code, name, category, unit, unitPrice, quantity, 
        minQuantity, maxQuantity, supplier, supplierContact, 
        location, description, isActive 
    } = req.body;
    
    console.log('\n📝 CREATE MATERIAL ======================');
    console.log('Code:', code);
    console.log('Name:', name);
    console.log('Category:', category);
    
    // Validation
    if (!code || !name || !category || !unit) {
        return res.status(400).json({
            success: false,
            message: 'Code, name, category, and unit are required'
        });
    }
    
    // Get user from token for created_by
    const authHeader = req.headers.authorization;
    let createdBy = null;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            createdBy = payload.id;
        } catch (e) {
            console.log('Could not parse user from token');
        }
    }
    
    db.query(
        `INSERT INTO materials (
            code, name, category, unit, unit_price, quantity, 
            min_quantity, max_quantity, supplier, supplier_contact, 
            location, description, is_active, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            code, name, category, unit, unitPrice || 0, quantity || 0, 
            minQuantity || 0, maxQuantity || 0, supplier || null, 
            supplierContact || null, location || null, description || null, 
            isActive !== undefined ? isActive : true, createdBy
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Create material error:', err.message);
                
                // Check for duplicate code
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Material code already exists' 
                    });
                }
                
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            // Fetch the created material
            db.query(
                'SELECT * FROM materials WHERE id = ?',
                [result.insertId],
                (err2, rows) => {
                    if (err2) {
                        return res.json({ 
                            success: true, 
                            message: 'Material created successfully',
                            materialId: result.insertId 
                        });
                    }
                    
                    console.log('✅ Material created with ID:', result.insertId);
                    res.status(201).json({
                        success: true,
                        message: 'Material created successfully',
                        material: rows[0]
                    });
                }
            );
        }
    );
});

// Update material
app.put('/api/materials/:id', (req, res) => {
    const materialId = req.params.id;
    const { 
        code, name, category, unit, unitPrice, quantity, 
        minQuantity, maxQuantity, supplier, supplierContact, 
        location, description, isActive 
    } = req.body;
    
    console.log('\n📝 UPDATE MATERIAL ======================');
    console.log('Material ID:', materialId);
    
    db.query(
        `UPDATE materials 
         SET code = ?, name = ?, category = ?, unit = ?, unit_price = ?, 
             quantity = ?, min_quantity = ?, max_quantity = ?, supplier = ?, 
             supplier_contact = ?, location = ?, description = ?, is_active = ?
         WHERE id = ?`,
        [
            code, name, category, unit, unitPrice, quantity, 
            minQuantity, maxQuantity, supplier, supplierContact, 
            location, description, isActive, materialId
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Update material error:', err.message);
                
                // Check for duplicate code
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Material code already exists' 
                    });
                }
                
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Material not found' 
                });
            }
            
            // Fetch updated material
            db.query(
                'SELECT * FROM materials WHERE id = ?',
                [materialId],
                (err2, rows) => {
                    if (err2) {
                        return res.json({ 
                            success: true, 
                            message: 'Material updated successfully' 
                        });
                    }
                    
                    console.log('✅ Material updated:', materialId);
                    res.json({ 
                        success: true, 
                        message: 'Material updated successfully',
                        material: rows[0]
                    });
                }
            );
        }
    );
});

// Delete material
app.delete('/api/materials/:id', (req, res) => {
    const materialId = req.params.id;
    
    console.log('\n🗑️ DELETE MATERIAL ======================');
    console.log('Material ID:', materialId);
    
    db.query('DELETE FROM materials WHERE id = ?', [materialId], (err, result) => {
        if (err) {
            console.error('❌ Delete material error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Material not found' 
            });
        }
        
        console.log('✅ Material deleted:', materialId);
        res.json({ 
            success: true, 
            message: 'Material deleted successfully' 
        });
    });
});

// Get material statistics
app.get('/api/materials/stats/summary', (req, res) => {
    db.query(
        `SELECT 
            COUNT(*) as total_materials,
            SUM(CASE WHEN quantity <= min_quantity THEN 1 ELSE 0 END) as low_stock_items,
            SUM(CASE WHEN quantity >= max_quantity * 0.9 THEN 1 ELSE 0 END) as full_stock_items,
            COUNT(DISTINCT category) as total_categories,
            COUNT(DISTINCT supplier) as total_suppliers,
            SUM(quantity * unit_price) as total_inventory_value,
            SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_materials
        FROM materials`,
        (err, results) => {
            if (err) {
                console.error('❌ Material stats error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            res.json({
                success: true,
                stats: results[0]
            });
        }
    );
});

// Get low stock materials
app.get('/api/materials/low-stock', (req, res) => {
    db.query(
        'SELECT * FROM materials WHERE quantity <= min_quantity ORDER BY (quantity / min_quantity) ASC',
        (err, results) => {
            if (err) {
                console.error('❌ Low stock query error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, materials: results });
        }
    );
});

// Get materials by category
app.get('/api/materials/category/:category', (req, res) => {
    const category = req.params.category;
    
    db.query(
        'SELECT * FROM materials WHERE category = ? ORDER BY name',
        [category],
        (err, results) => {
            if (err) {
                console.error('❌ Get materials by category error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, materials: results });
        }
    );
});

// Bulk update material stock
app.patch('/api/materials/bulk/stock', (req, res) => {
    const { materialIds, quantityChange } = req.body;
    
    if (!materialIds || !Array.isArray(materialIds) || materialIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Material IDs array is required'
        });
    }
    
    if (typeof quantityChange !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'Quantity change must be a number'
        });
    }
    
    const placeholders = materialIds.map(() => '?').join(',');
    
    db.query(
        `UPDATE materials SET quantity = quantity + ? WHERE id IN (${placeholders})`,
        [quantityChange, ...materialIds],
        (err, result) => {
            if (err) {
                console.error('❌ Bulk stock update error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({
                success: true,
                message: `Updated stock for ${result.affectedRows} materials`,
                updatedCount: result.affectedRows
            });
        }
    );
});

// Search materials
app.get('/api/materials/search/:query', (req, res) => {
    const query = `%${req.params.query}%`;
    
    db.query(
        `SELECT * FROM materials 
         WHERE code LIKE ? OR name LIKE ? OR supplier LIKE ? OR category LIKE ?
         ORDER BY name`,
        [query, query, query, query],
        (err, results) => {
            if (err) {
                console.error('❌ Material search error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, materials: results });
        }
    );
});


// ==================== SUPPLIERS ENDPOINTS ====================

// Get all suppliers
app.get('/api/suppliers', (req, res) => {
    console.log('\n🏭 FETCHING SUPPLIERS ======================');
    
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('❌ No token provided');
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    db.query(
        'SELECT * FROM suppliers ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error('❌ Get suppliers error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            console.log(`✅ Found ${results.length} suppliers`);
            res.json({ 
                success: true, 
                suppliers: results 
            });
        }
    );
});

// Get single supplier by ID
app.get('/api/suppliers/:id', (req, res) => {
    const supplierId = req.params.id;
    
    db.query(
        'SELECT * FROM suppliers WHERE id = ?',
        [supplierId],
        (err, results) => {
            if (err) {
                console.error('❌ Get supplier error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Supplier not found' });
            }
            
            res.json({ success: true, supplier: results[0] });
        }
    );
});

// Create new supplier
app.post('/api/suppliers', (req, res) => {
    const { 
        code, name, contactPerson, email, phone, address, 
        category, rating, isActive, notes 
    } = req.body;
    
    console.log('\n📝 CREATE SUPPLIER ======================');
    console.log('Code:', code);
    console.log('Name:', name);
    console.log('Category:', category);
    
    // Validation
    if (!code || !name || !contactPerson || !phone || !category) {
        return res.status(400).json({
            success: false,
            message: 'Code, name, contact person, phone, and category are required'
        });
    }
    
    // Get user from token for created_by
    const authHeader = req.headers.authorization;
    let createdBy = null;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            createdBy = payload.id;
        } catch (e) {
            console.log('Could not parse user from token');
        }
    }
    
    db.query(
        `INSERT INTO suppliers (
            code, name, contact_person, email, phone, address, 
            category, rating, is_active, notes, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            code, name, contactPerson, email || null, phone, address || null,
            category, rating || 0, isActive !== undefined ? isActive : true, 
            notes || null, createdBy
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Create supplier error:', err.message);
                
                // Check for duplicate code
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Supplier code already exists' 
                    });
                }
                
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            // Fetch the created supplier
            db.query(
                'SELECT * FROM suppliers WHERE id = ?',
                [result.insertId],
                (err2, rows) => {
                    if (err2) {
                        return res.json({ 
                            success: true, 
                            message: 'Supplier created successfully',
                            supplierId: result.insertId 
                        });
                    }
                    
                    console.log('✅ Supplier created with ID:', result.insertId);
                    res.status(201).json({
                        success: true,
                        message: 'Supplier created successfully',
                        supplier: rows[0]
                    });
                }
            );
        }
    );
});

// Update supplier
app.put('/api/suppliers/:id', (req, res) => {
    const supplierId = req.params.id;
    const { 
        code, name, contactPerson, email, phone, address, 
        category, rating, isActive, notes 
    } = req.body;
    
    console.log('\n📝 UPDATE SUPPLIER ======================');
    console.log('Supplier ID:', supplierId);
    
    db.query(
        `UPDATE suppliers 
         SET code = ?, name = ?, contact_person = ?, email = ?, phone = ?, 
             address = ?, category = ?, rating = ?, is_active = ?, notes = ?
         WHERE id = ?`,
        [
            code, name, contactPerson, email, phone, address,
            category, rating, isActive, notes, supplierId
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Update supplier error:', err.message);
                
                // Check for duplicate code
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Supplier code already exists' 
                    });
                }
                
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Supplier not found' 
                });
            }
            
            // Fetch updated supplier
            db.query(
                'SELECT * FROM suppliers WHERE id = ?',
                [supplierId],
                (err2, rows) => {
                    if (err2) {
                        return res.json({ 
                            success: true, 
                            message: 'Supplier updated successfully' 
                        });
                    }
                    
                    console.log('✅ Supplier updated:', supplierId);
                    res.json({ 
                        success: true, 
                        message: 'Supplier updated successfully',
                        supplier: rows[0]
                    });
                }
            );
        }
    );
});

// Delete supplier
app.delete('/api/suppliers/:id', (req, res) => {
    const supplierId = req.params.id;
    
    console.log('\n🗑️ DELETE SUPPLIER ======================');
    console.log('Supplier ID:', supplierId);
    
    db.query('DELETE FROM suppliers WHERE id = ?', [supplierId], (err, result) => {
        if (err) {
            console.error('❌ Delete supplier error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Supplier not found' 
            });
        }
        
        console.log('✅ Supplier deleted:', supplierId);
        res.json({ 
            success: true, 
            message: 'Supplier deleted successfully' 
        });
    });
});

// Get supplier statistics
app.get('/api/suppliers/stats/summary', (req, res) => {
    db.query(
        `SELECT 
            COUNT(*) as total_suppliers,
            SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_suppliers,
            COUNT(DISTINCT category) as total_categories,
            SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as top_rated_suppliers,
            AVG(rating) as average_rating
        FROM suppliers`,
        (err, results) => {
            if (err) {
                console.error('❌ Supplier stats error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            res.json({
                success: true,
                stats: results[0]
            });
        }
    );
});

// Get suppliers by category
app.get('/api/suppliers/category/:category', (req, res) => {
    const category = req.params.category;
    
    db.query(
        'SELECT * FROM suppliers WHERE category = ? ORDER BY name',
        [category],
        (err, results) => {
            if (err) {
                console.error('❌ Get suppliers by category error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, suppliers: results });
        }
    );
});

// Get active suppliers
app.get('/api/suppliers/active', (req, res) => {
    db.query(
        'SELECT * FROM suppliers WHERE is_active = 1 ORDER BY name',
        (err, results) => {
            if (err) {
                console.error('❌ Get active suppliers error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, suppliers: results });
        }
    );
});

// Search suppliers
app.get('/api/suppliers/search/:query', (req, res) => {
    const query = `%${req.params.query}%`;
    
    db.query(
        `SELECT * FROM suppliers 
         WHERE code LIKE ? OR name LIKE ? OR contact_person LIKE ? OR category LIKE ?
         ORDER BY name`,
        [query, query, query, query],
        (err, results) => {
            if (err) {
                console.error('❌ Supplier search error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, suppliers: results });
        }
    );
});

// Bulk update supplier status
app.patch('/api/suppliers/bulk/status', (req, res) => {
    const { supplierIds, isActive } = req.body;
    
    if (!supplierIds || !Array.isArray(supplierIds) || supplierIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Supplier IDs array is required'
        });
    }
    
    const placeholders = supplierIds.map(() => '?').join(',');
    
    db.query(
        `UPDATE suppliers SET is_active = ? WHERE id IN (${placeholders})`,
        [isActive ? 1 : 0, ...supplierIds],
        (err, result) => {
            if (err) {
                console.error('❌ Bulk update error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({
                success: true,
                message: `Updated ${result.affectedRows} suppliers`,
                updatedCount: result.affectedRows
            });
        }
    );
});



// ==================== VARIATIONS ENDPOINTS ====================

// Get all variations with project details
// Get all variations with project details - FIXED DATE FORMATTING
app.get('/api/variations', (req, res) => {
    console.log('\n📝 FETCHING VARIATIONS ======================');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Use DATE_FORMAT to ensure dates are sent as YYYY-MM-DD
    const query = `
        SELECT 
            v.id,
            v.project_id,
            v.amount,
            v.description,
            DATE_FORMAT(v.request_date, '%Y-%m-%d') as request_date,
            v.status,
            v.requested_by,
            v.approved_by,
            DATE_FORMAT(v.approval_date, '%Y-%m-%d') as approval_date,
            v.rejection_reason,
            v.notes,
            v.created_at,
            v.updated_at,
            p.name as project_name,
            p.location as project_location,
            p.manager as project_manager,
            p.status as project_status,
            p.budget as project_budget
        FROM variations v
        LEFT JOIN projects p ON v.project_id = p.id
        ORDER BY v.request_date DESC, v.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Get variations error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message 
            });
        }
        
        console.log(`✅ Found ${results.length} variations`);
        
        if (results.length > 0) {
            console.log('First variation:', {
                id: results[0].id,
                project_name: results[0].project_name,
                request_date: results[0].request_date,
                amount: results[0].amount
            });
        }
        
        res.json({ 
            success: true, 
            variations: results 
        });
    });
});

// Get single variation with project details
app.get('/api/variations/:id', (req, res) => {
    const variationId = req.params.id;
    
    const query = `
        SELECT 
            v.*,
            p.name as project_name,
            p.location as project_location,
            p.manager as project_manager,
            p.status as project_status
        FROM variations v
        LEFT JOIN projects p ON v.project_id = p.id
        WHERE v.id = ?
    `;

    db.query(query, [variationId], (err, results) => {
        if (err) {
            console.error('❌ Get variation error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Variation not found' });
        }
        
        res.json({ success: true, variation: results[0] });
    });
});

// Create new variation
app.post('/api/variations', (req, res) => {
    const { 
        project_id, amount, description, date, status, requestedBy 
    } = req.body;
    
    console.log('\n📝 CREATE VARIATION ======================');
    console.log('Project ID:', project_id);
    console.log('Amount:', amount);
    console.log('Status:', status);
    
    // Validation
    if (!project_id || !amount || !date || !status || !requestedBy) {
        return res.status(400).json({
            success: false,
            message: 'Project ID, amount, date, status, and requested by are required'
        });
    }
    
    // Get user from token for created_by
    const authHeader = req.headers.authorization;
    let createdBy = null;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            createdBy = payload.id;
        } catch (e) {
            console.log('Could not parse user from token');
        }
    }
    
    db.query(
        `INSERT INTO variations (
            project_id, amount, description, request_date, status, requested_by, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            project_id, amount, description || null, date, status, requestedBy, createdBy
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Create variation error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            // Fetch the created variation with project details
            const query = `
                SELECT 
                    v.*,
                    p.name as project_name,
                    p.location as project_location,
                    p.manager as project_manager,
                    p.status as project_status
                FROM variations v
                LEFT JOIN projects p ON v.project_id = p.id
                WHERE v.id = ?
            `;
            
            db.query(query, [result.insertId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Variation created successfully',
                        variationId: result.insertId 
                    });
                }
                
                console.log('✅ Variation created with ID:', result.insertId);
                res.status(201).json({
                    success: true,
                    message: 'Variation created successfully',
                    variation: rows[0]
                });
            });
        }
    );
});

// Update variation
app.put('/api/variations/:id', (req, res) => {
    const variationId = req.params.id;
    const { 
        project_id, amount, description, date, status, requestedBy 
    } = req.body;
    
    console.log('\n📝 UPDATE VARIATION ======================');
    console.log('Variation ID:', variationId);
    
    // First get the current variation to check status
    db.query('SELECT * FROM variations WHERE id = ?', [variationId], (err, results) => {
        if (err) {
            console.error('❌ Get variation error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Variation not found' });
        }
        
        const currentVariation = results[0];
        
        // If status is changing to Approved, set approval details
        let approvedBy = currentVariation.approved_by;
        let approvalDate = currentVariation.approval_date;
        let rejectionReason = currentVariation.rejection_reason;
        
        if (status === 'Approved' && currentVariation.status !== 'Approved') {
            // Get current user from token
            const authHeader = req.headers.authorization;
            if (authHeader) {
                try {
                    const token = authHeader.split(' ')[1];
                    const base64Payload = token.split('.')[1];
                    const payload = JSON.parse(atob(base64Payload));
                    approvedBy = payload.username || 'Admin';
                    approvalDate = new Date().toISOString().split('T')[0];
                } catch (e) {
                    console.log('Could not parse user from token');
                }
            }
        } else if (status === 'Rejected' && currentVariation.status !== 'Rejected') {
            rejectionReason = req.body.rejectionReason || 'No reason provided';
        }
        
        db.query(
            `UPDATE variations 
             SET project_id = ?, amount = ?, description = ?, request_date = ?, 
                 status = ?, requested_by = ?, approved_by = ?, approval_date = ?, 
                 rejection_reason = ?
             WHERE id = ?`,
            [
                project_id, amount, description, date, status, requestedBy,
                approvedBy, approvalDate, rejectionReason, variationId
            ],
            (err, result) => {
                if (err) {
                    console.error('❌ Update variation error:', err.message);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error' 
                    });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Variation not found' 
                    });
                }
                
                // Fetch updated variation with project details
                const query = `
                    SELECT 
                        v.*,
                        p.name as project_name,
                        p.location as project_location,
                        p.manager as project_manager,
                        p.status as project_status
                    FROM variations v
                    LEFT JOIN projects p ON v.project_id = p.id
                    WHERE v.id = ?
                `;
                
                db.query(query, [variationId], (err2, rows) => {
                    if (err2) {
                        return res.json({ 
                            success: true, 
                            message: 'Variation updated successfully' 
                        });
                    }
                    
                    console.log('✅ Variation updated:', variationId);
                    res.json({ 
                        success: true, 
                        message: 'Variation updated successfully',
                        variation: rows[0]
                    });
                });
            }
        );
    });
});

// Delete variation
app.delete('/api/variations/:id', (req, res) => {
    const variationId = req.params.id;
    
    console.log('\n🗑️ DELETE VARIATION ======================');
    console.log('Variation ID:', variationId);
    
    db.query('DELETE FROM variations WHERE id = ?', [variationId], (err, result) => {
        if (err) {
            console.error('❌ Delete variation error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Variation not found' 
            });
        }
        
        console.log('✅ Variation deleted:', variationId);
        res.json({ 
            success: true, 
            message: 'Variation deleted successfully' 
        });
    });
});

// Get variation statistics
app.get('/api/variations/stats/summary', (req, res) => {
    const query = `
        SELECT 
            COUNT(*) as total_requests,
            SUM(CASE WHEN v.status = 'Requested' THEN 1 ELSE 0 END) as pending_requests,
            SUM(CASE WHEN v.status = 'Approved' THEN 1 ELSE 0 END) as approved_requests,
            SUM(CASE WHEN v.status = 'Rejected' THEN 1 ELSE 0 END) as rejected_requests,
            SUM(CASE WHEN v.status = 'Approved' THEN v.amount ELSE 0 END) as approved_amount,
            SUM(v.amount) as total_amount,
            AVG(v.amount) as average_amount,
            COUNT(DISTINCT v.project_id) as total_projects,
            COUNT(DISTINCT p.name) as project_names
        FROM variations v
        LEFT JOIN projects p ON v.project_id = p.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Variation stats error:', err.message);
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

// Get variations by project ID
app.get('/api/variations/project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    
    const query = `
        SELECT 
            v.*,
            p.name as project_name,
            p.location as project_location
        FROM variations v
        LEFT JOIN projects p ON v.project_id = p.id
        WHERE v.project_id = ?
        ORDER BY v.request_date DESC
    `;

    db.query(query, [projectId], (err, results) => {
        if (err) {
            console.error('❌ Get variations by project error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, variations: results });
    });
});

// Get variations by status
app.get('/api/variations/status/:status', (req, res) => {
    const status = req.params.status;
    
    if (!['Requested', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid status. Must be Requested, Approved, or Rejected' 
        });
    }
    
    const query = `
        SELECT 
            v.*,
            p.name as project_name,
            p.location as project_location
        FROM variations v
        LEFT JOIN projects p ON v.project_id = p.id
        WHERE v.status = ?
        ORDER BY v.request_date DESC
    `;

    db.query(query, [status], (err, results) => {
        if (err) {
            console.error('❌ Get variations by status error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, variations: results });
    });
});

// Approve variation
app.patch('/api/variations/:id/approve', (req, res) => {
    const variationId = req.params.id;
    const { approvedBy } = req.body;
    
    console.log('\n✅ APPROVING VARIATION ======================');
    console.log('Variation ID:', variationId);
    
    db.query(
        `UPDATE variations 
         SET status = 'Approved', approved_by = ?, approval_date = CURDATE()
         WHERE id = ? AND status = 'Requested'`,
        [approvedBy || 'Admin', variationId],
        (err, result) => {
            if (err) {
                console.error('❌ Approve variation error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Variation not found or already processed' 
                });
            }
            
            // Fetch updated variation with project details
            const query = `
                SELECT 
                    v.*,
                    p.name as project_name,
                    p.location as project_location
                FROM variations v
                LEFT JOIN projects p ON v.project_id = p.id
                WHERE v.id = ?
            `;
            
            db.query(query, [variationId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Variation approved successfully' 
                    });
                }
                
                console.log('✅ Variation approved:', variationId);
                res.json({ 
                    success: true, 
                    message: 'Variation approved successfully',
                    variation: rows[0]
                });
            });
        }
    );
});

// Reject variation
app.patch('/api/variations/:id/reject', (req, res) => {
    const variationId = req.params.id;
    const { rejectedBy, reason } = req.body;
    
    console.log('\n❌ REJECTING VARIATION ======================');
    console.log('Variation ID:', variationId);
    
    db.query(
        `UPDATE variations 
         SET status = 'Rejected', approved_by = ?, rejection_reason = ?
         WHERE id = ? AND status = 'Requested'`,
        [rejectedBy || 'Admin', reason || 'No reason provided', variationId],
        (err, result) => {
            if (err) {
                console.error('❌ Reject variation error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Variation not found or already processed' 
                });
            }
            
            // Fetch updated variation
            const query = `
                SELECT 
                    v.*,
                    p.name as project_name,
                    p.location as project_location
                FROM variations v
                LEFT JOIN projects p ON v.project_id = p.id
                WHERE v.id = ?
            `;
            
            db.query(query, [variationId], (err2, rows) => {
                if (err2) {
                    return res.json({ 
                        success: true, 
                        message: 'Variation rejected successfully' 
                    });
                }
                
                console.log('✅ Variation rejected:', variationId);
                res.json({ 
                    success: true, 
                    message: 'Variation rejected successfully',
                    variation: rows[0]
                });
            });
        }
    );
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`🚀 BuildSetu Server Started!`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('\n📋 Available Endpoints:');
    // Add this to your server startup console output
console.log(`   GET  http://localhost:${PORT}/api/teams`);
console.log(`   GET  http://localhost:${PORT}/api/teams/:id`);
console.log(`   POST http://localhost:${PORT}/api/teams`);
console.log(`   PUT  http://localhost:${PORT}/api/teams/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/teams/:id`);
console.log(`   GET  http://localhost:${PORT}/api/teams/stats/summary`);
console.log(`   GET  http://localhost:${PORT}/api/teams/project/:projectId`);
console.log(`   GET  http://localhost:${PORT}/api/teams/status/:status`);
console.log(`   GET  http://localhost:${PORT}/api/teams/trade/:trade`);

// Add to your existing console.log section
console.log(`   GET  http://localhost:${PORT}/api/tasks`);
console.log(`   GET  http://localhost:${PORT}/api/tasks/:id`);
console.log(`   POST http://localhost:${PORT}/api/tasks`);
console.log(`   PUT  http://localhost:${PORT}/api/tasks/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id`);
console.log(`   GET  http://localhost:${PORT}/api/tasks/stats/summary`);
console.log(`   GET  http://localhost:${PORT}/api/tasks/project/:projectId`);
console.log(`   GET  http://localhost:${PORT}/api/tasks/assigned/:assignee`);
console.log(`   PATCH http://localhost:${PORT}/api/tasks/bulk/status`);
//
console.log(`   GET  http://localhost:${PORT}/api/admin/users`);
console.log(`   PUT  http://localhost:${PORT}/api/admin/users/:id/status`);
console.log(`   PUT  http://localhost:${PORT}/api/admin/users/:id/active`);
console.log(`   GET  http://localhost:${PORT}/api/admin/stats`);
//
// Add this to your existing console.log section
console.log(`   GET  http://localhost:${PORT}/api/projects`);
console.log(`   GET  http://localhost:${PORT}/api/projects/:id`);
console.log(`   POST http://localhost:${PORT}/api/projects`);
console.log(`   PUT  http://localhost:${PORT}/api/projects/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/projects/:id`);
console.log(`   GET  http://localhost:${PORT}/api/projects/stats/summary`);
//
// Add this to your existing console.log section
console.log(`   GET  http://localhost:${PORT}/api/labour`);
console.log(`   GET  http://localhost:${PORT}/api/labour/:id`);
console.log(`   POST http://localhost:${PORT}/api/labour`);
console.log(`   PUT  http://localhost:${PORT}/api/labour/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/labour/:id`);
console.log(`   GET  http://localhost:${PORT}/api/labour/stats/summary`);
console.log(`   GET  http://localhost:${PORT}/api/labour/project/:projectName`);
console.log(`   GET  http://localhost:${PORT}/api/labour/trade/:trade`);
console.log(`   PATCH http://localhost:${PORT}/api/labour/bulk/status`);
console.log(`   GET  http://localhost:${PORT}/api/labour/skills/distribution`);

//
// Add to the console.log section in app.listen()
console.log(`   GET  http://localhost:${PORT}/api/materials`);
console.log(`   GET  http://localhost:${PORT}/api/materials/:id`);
console.log(`   POST http://localhost:${PORT}/api/materials`);
console.log(`   PUT  http://localhost:${PORT}/api/materials/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/materials/:id`);
console.log(`   GET  http://localhost:${PORT}/api/materials/stats/summary`);
console.log(`   GET  http://localhost:${PORT}/api/materials/low-stock`);
console.log(`   GET  http://localhost:${PORT}/api/materials/category/:category`);
console.log(`   PATCH http://localhost:${PORT}/api/materials/bulk/stock`);
console.log(`   GET  http://localhost:${PORT}/api/materials/search/:query`);

console.log(`   GET  http://localhost:${PORT}/api/suppliers`);
console.log(`   GET  http://localhost:${PORT}/api/suppliers/:id`);
console.log(`   POST http://localhost:${PORT}/api/suppliers`);
console.log(`   PUT  http://localhost:${PORT}/api/suppliers/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/suppliers/:id`);
console.log(`   GET  http://localhost:${PORT}/api/suppliers/stats/summary`);
console.log(`   GET  http://localhost:${PORT}/api/suppliers/category/:category`);
console.log(`   GET  http://localhost:${PORT}/api/suppliers/active`);
console.log(`   GET  http://localhost:${PORT}/api/suppliers/search/:query`);
console.log(`   PATCH http://localhost:${PORT}/api/suppliers/bulk/status`);


console.log(`   GET  http://localhost:${PORT}/api/variations`);
console.log(`   GET  http://localhost:${PORT}/api/variations/:id`);
console.log(`   POST http://localhost:${PORT}/api/variations`);
console.log(`   PUT  http://localhost:${PORT}/api/variations/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/variations/:id`);
console.log(`   GET  http://localhost:${PORT}/api/variations/stats/summary`);
console.log(`   GET  http://localhost:${PORT}/api/variations/project/:projectId`);
console.log(`   GET  http://localhost:${PORT}/api/variations/status/:status`);
console.log(`   PATCH http://localhost:${PORT}/api/variations/:id/approve`);
console.log(`   PATCH http://localhost:${PORT}/api/variations/:id/reject`);


    console.log(`   GET  http://localhost:${PORT}/api/test`);
    console.log(`   GET  http://localhost:${PORT}/api/users`);
    console.log(`   GET  http://localhost:${PORT}/api/users/:id`);
    console.log(`   POST http://localhost:${PORT}/api/users`);
    console.log(`   PUT  http://localhost:${PORT}/api/users/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
    console.log(`   POST http://localhost:${PORT}/api/login`);
    console.log(`   GET  http://localhost:${PORT}/api/dashboard/summary`);
    console.log(`   GET  http://localhost:${PORT}/api/debug/db-structure`);
    console.log('='.repeat(60));
    console.log('\n👑 Test Credentials:');
    console.log('   📧 Email: john@company.com');
    console.log('   🔑 Password: 123456');
    console.log('   📧 Email: admin@buildsetu.com');
    console.log('   🔑 Password: 123456');
    console.log('   📧 Email: maria@company.com');
    console.log('   🔑 Password: 123456');
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down server gracefully...');
    db.end();
    console.log('✅ Database connection closed');
    process.exit(0);
});