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

// Get all teams
app.get('/api/teams', (req, res) => {
    console.log('\n👥 FETCHING TEAMS ======================');
    
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    db.query(
        'SELECT * FROM teams ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error('❌ Get teams error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            console.log(`✅ Found ${results.length} teams`);
            res.json({ 
                success: true, 
                teams: results 
            });
        }
    );
});

// Get single team by ID
app.get('/api/teams/:id', (req, res) => {
    const teamId = req.params.id;
    
    db.query(
        'SELECT * FROM teams WHERE id = ?',
        [teamId],
        (err, results) => {
            if (err) {
                console.error('❌ Get team error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Team not found' });
            }
            
            res.json({ success: true, team: results[0] });
        }
    );
});

// Create new team
app.post('/api/teams', (req, res) => {
    const { name, lead, trade, members, project, status } = req.body;
    
    console.log('\n📝 CREATE TEAM ======================');
    console.log('Name:', name);
    console.log('Lead:', lead);
    console.log('Trade:', trade);
    
    // Validation
    if (!name || !lead || !trade) {
        return res.status(400).json({
            success: false,
            message: 'Name, lead and trade are required'
        });
    }
    
    db.query(
        'INSERT INTO teams (name, lead, trade, members, project, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, lead, trade, members || 0, project || null, status || 'Idle'],
        (err, result) => {
            if (err) {
                console.error('❌ Create team error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            // Fetch the created team
            db.query(
                'SELECT * FROM teams WHERE id = ?',
                [result.insertId],
                (err2, rows) => {
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
                }
            );
        }
    );
});

// Update team
app.put('/api/teams/:id', (req, res) => {
    const teamId = req.params.id;
    const { name, lead, trade, members, project, status } = req.body;
    
    console.log('\n📝 UPDATE TEAM ======================');
    console.log('Team ID:', teamId);
    
    db.query(
        'UPDATE teams SET name = ?, lead = ?, trade = ?, members = ?, project = ?, status = ? WHERE id = ?',
        [name, lead, trade, members, project, status, teamId],
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
            
            // Fetch updated team
            db.query(
                'SELECT * FROM teams WHERE id = ?',
                [teamId],
                (err2, rows) => {
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
                }
            );
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

// Get team statistics for dashboard
app.get('/api/teams/stats/summary', (req, res) => {
    db.query(
        `SELECT 
            COUNT(*) as total_crews,
            SUM(members) as total_manpower,
            SUM(CASE WHEN status = 'On Site' THEN 1 ELSE 0 END) as on_site_crews,
            SUM(CASE WHEN status = 'Idle' THEN 1 ELSE 0 END) as idle_crews,
            SUM(CASE WHEN status = 'Off Duty' THEN 1 ELSE 0 END) as off_duty_crews,
            SUM(CASE WHEN trade = 'Civil/Masonry' THEN members ELSE 0 END) as masonry_workers,
            SUM(CASE WHEN trade = 'Electrical' THEN members ELSE 0 END) as electrical_workers,
            SUM(CASE WHEN trade = 'Plumbing' THEN members ELSE 0 END) as plumbing_workers,
            SUM(CASE WHEN trade = 'Carpentry' THEN members ELSE 0 END) as carpentry_workers
        FROM teams`,
        (err, results) => {
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
        }
    );
});

// ==================== TASK ASSIGNMENTS ENDPOINTS ====================

// Get all tasks
app.get('/api/tasks', (req, res) => {
    console.log('\n📋 FETCHING TASKS ======================');
    
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    db.query(
        'SELECT * FROM task_assignments ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error('❌ Get tasks error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            console.log(`✅ Found ${results.length} tasks`);
            res.json({ 
                success: true, 
                tasks: results 
            });
        }
    );
});

// Get single task by ID
app.get('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    db.query(
        'SELECT * FROM task_assignments WHERE id = ?',
        [taskId],
        (err, results) => {
            if (err) {
                console.error('❌ Get task error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }
            
            res.json({ success: true, task: results[0] });
        }
    );
});

// Create new task
app.post('/api/tasks', (req, res) => {
    const { title, assignedTo, project, dueDate, priority, status, description } = req.body;
    
    console.log('\n📝 CREATE TASK ======================');
    console.log('Title:', title);
    console.log('Assigned To:', assignedTo);
    console.log('Project:', project);
    
    // Validation
    if (!title || !assignedTo || !project) {
        return res.status(400).json({
            success: false,
            message: 'Title, assigned to, and project are required'
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
        `INSERT INTO task_assignments 
         (title, assigned_to, project, due_date, priority, status, description, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, assignedTo, project, dueDate || null, priority || 'Medium', status || 'Pending', description || null, createdBy],
        (err, result) => {
            if (err) {
                console.error('❌ Create task error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            // Fetch the created task
            db.query(
                'SELECT * FROM task_assignments WHERE id = ?',
                [result.insertId],
                (err2, rows) => {
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
                }
            );
        }
    );
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, assignedTo, project, dueDate, priority, status, description } = req.body;
    
    console.log('\n📝 UPDATE TASK ======================');
    console.log('Task ID:', taskId);
    
    // If status is being set to 'Completed', set completed_at timestamp
    let completedAtSql = '';
    const params = [];
    
    if (status === 'Completed') {
        completedAtSql = ', completed_at = CURRENT_TIMESTAMP';
    }
    
    db.query(
        `UPDATE task_assignments 
         SET title = ?, assigned_to = ?, project = ?, due_date = ?, 
             priority = ?, status = ?, description = ? ${completedAtSql}
         WHERE id = ?`,
        [title, assignedTo, project, dueDate, priority, status, description, taskId],
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
            
            // Fetch updated task
            db.query(
                'SELECT * FROM task_assignments WHERE id = ?',
                [taskId],
                (err2, rows) => {
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
                }
            );
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

// Get task statistics for dashboard
app.get('/api/tasks/stats/summary', (req, res) => {
    db.query(
        `SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
            SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high_priority_tasks,
            SUM(CASE WHEN priority = 'Medium' THEN 1 ELSE 0 END) as medium_priority_tasks,
            SUM(CASE WHEN priority = 'Low' THEN 1 ELSE 0 END) as low_priority_tasks,
            SUM(CASE WHEN due_date < CURDATE() AND status != 'Completed' THEN 1 ELSE 0 END) as overdue_tasks
        FROM task_assignments`,
        (err, results) => {
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
        }
    );
});

// Get tasks by project
app.get('/api/tasks/project/:project', (req, res) => {
    const project = req.params.project;
    
    db.query(
        'SELECT * FROM task_assignments WHERE project = ? ORDER BY due_date',
        [project],
        (err, results) => {
            if (err) {
                console.error('❌ Get tasks by project error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, tasks: results });
        }
    );
});

// Get tasks assigned to specific person/crew
app.get('/api/tasks/assigned/:assignee', (req, res) => {
    const assignee = req.params.assignee;
    
    db.query(
        'SELECT * FROM task_assignments WHERE assigned_to = ? ORDER BY due_date',
        [assignee],
        (err, results) => {
            if (err) {
                console.error('❌ Get tasks by assignee error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, tasks: results });
        }
    );
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

// ==================== LABOUR ENDPOINTS ====================

// Get all labour
app.get('/api/labour', (req, res) => {
    console.log('\n👷 FETCHING LABOUR ======================');
    
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
        'SELECT * FROM labour ORDER BY created_at DESC',
        (err, results) => {
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
        }
    );
});

// Get single labour by ID
app.get('/api/labour/:id', (req, res) => {
    const labourId = req.params.id;
    
    db.query(
        'SELECT * FROM labour WHERE id = ?',
        [labourId],
        (err, results) => {
            if (err) {
                console.error('❌ Get labour error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Labour not found' });
            }
            
            res.json({ success: true, labour: results[0] });
        }
    );
});

// Create new labour
app.post('/api/labour', (req, res) => {
    const { 
        labourId, name, contactNumber, email, category, trade, 
        dailyRate, contractType, status, assignedProject, address, notes 
    } = req.body;
    
    console.log('\n📝 CREATE LABOUR ======================');
    console.log('Labour ID:', labourId);
    console.log('Name:', name);
    console.log('Trade:', trade);
    
    // Validation
    if (!labourId || !name) {
        return res.status(400).json({
            success: false,
            message: 'Labour ID and name are required'
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
        `INSERT INTO labour (
            labour_id, name, contact_number, email, category, trade, 
            daily_rate, contract_type, status, assigned_project, address, notes, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            labourId, name, contactNumber || null, email || null, 
            category || 'Semi-skilled', trade || 'Helper', 
            dailyRate || null, contractType || 'Daily', status || 'Active', 
            assignedProject || null, address || null, notes || null, createdBy
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Create labour error:', err.message);
                
                // Check for duplicate labour_id
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
            
            // Fetch the created labour
            db.query(
                'SELECT * FROM labour WHERE id = ?',
                [result.insertId],
                (err2, rows) => {
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
                }
            );
        }
    );
});

// Update labour
app.put('/api/labour/:id', (req, res) => {
    const labourId = req.params.id;
    const { 
        labourId: newLabourId, name, contactNumber, email, category, trade, 
        dailyRate, contractType, status, assignedProject, address, notes 
    } = req.body;
    
    console.log('\n📝 UPDATE LABOUR ======================');
    console.log('Labour Record ID:', labourId);
    
    db.query(
        `UPDATE labour 
         SET labour_id = ?, name = ?, contact_number = ?, email = ?, 
             category = ?, trade = ?, daily_rate = ?, contract_type = ?, 
             status = ?, assigned_project = ?, address = ?, notes = ?
         WHERE id = ?`,
        [
            newLabourId, name, contactNumber, email, category, trade, 
            dailyRate, contractType, status, assignedProject, address, notes, 
            labourId
        ],
        (err, result) => {
            if (err) {
                console.error('❌ Update labour error:', err.message);
                
                // Check for duplicate labour_id
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Labour ID already exists' 
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
                    message: 'Labour not found' 
                });
            }
            
            // Fetch updated labour
            db.query(
                'SELECT * FROM labour WHERE id = ?',
                [labourId],
                (err2, rows) => {
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
                }
            );
        }
    );
});

// Delete labour
app.delete('/api/labour/:id', (req, res) => {
    const labourId = req.params.id;
    
    console.log('\n🗑️ DELETE LABOUR ======================');
    console.log('Labour ID:', labourId);
    
    db.query('DELETE FROM labour WHERE id = ?', [labourId], (err, result) => {
        if (err) {
            console.error('❌ Delete labour error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Labour not found' 
            });
        }
        
        console.log('✅ Labour deleted:', labourId);
        res.json({ 
            success: true, 
            message: 'Labour deleted successfully' 
        });
    });
});

// Get labour statistics
app.get('/api/labour/stats/summary', (req, res) => {
    db.query(
        `SELECT 
            COUNT(*) as total_labour,
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_labour,
            SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as on_leave_labour,
            SUM(CASE WHEN status = 'Terminated' THEN 1 ELSE 0 END) as terminated_labour,
            SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive_labour,
            SUM(CASE WHEN category = 'Skilled' THEN 1 ELSE 0 END) as skilled_labour,
            SUM(CASE WHEN category = 'Semi-skilled' THEN 1 ELSE 0 END) as semi_skilled_labour,
            SUM(CASE WHEN category = 'Unskilled' THEN 1 ELSE 0 END) as unskilled_labour,
            SUM(CASE WHEN category = 'Foreman' THEN 1 ELSE 0 END) as foreman_labour,
            SUM(CASE WHEN category = 'Supervisor' THEN 1 ELSE 0 END) as supervisor_labour,
            COUNT(DISTINCT trade) as unique_trades,
            SUM(daily_rate * 26) as estimated_monthly_cost
        FROM labour`,
        (err, results) => {
            if (err) {
                console.error('❌ Labour stats error:', err.message);
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

// Get labour by project
app.get('/api/labour/project/:projectName', (req, res) => {
    const projectName = req.params.projectName;
    
    db.query(
        'SELECT * FROM labour WHERE assigned_project = ? ORDER BY name',
        [projectName],
        (err, results) => {
            if (err) {
                console.error('❌ Get labour by project error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, labour: results });
        }
    );
});

// Get labour by trade
app.get('/api/labour/trade/:trade', (req, res) => {
    const trade = req.params.trade;
    
    db.query(
        'SELECT * FROM labour WHERE trade = ? AND status = "Active" ORDER BY name',
        [trade],
        (err, results) => {
            if (err) {
                console.error('❌ Get labour by trade error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({ success: true, labour: results });
        }
    );
});

// Bulk update labour status
app.patch('/api/labour/bulk/status', (req, res) => {
    const { labourIds, status } = req.body;
    
    if (!labourIds || !Array.isArray(labourIds) || labourIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Labour IDs array is required'
        });
    }
    
    if (!['Active', 'On Leave', 'Terminated', 'Inactive'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status'
        });
    }
    
    const placeholders = labourIds.map(() => '?').join(',');
    
    db.query(
        `UPDATE labour SET status = ? WHERE id IN (${placeholders})`,
        [status, ...labourIds],
        (err, result) => {
            if (err) {
                console.error('❌ Bulk update error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({
                success: true,
                message: `Updated ${result.affectedRows} labour records to ${status}`,
                updatedCount: result.affectedRows
            });
        }
    );
});

// Get labour skill distribution
app.get('/api/labour/skills/distribution', (req, res) => {
    db.query(
        `SELECT 
            trade,
            COUNT(*) as count,
            SUM(CASE WHEN category = 'Skilled' THEN 1 ELSE 0 END) as skilled_count,
            SUM(CASE WHEN category = 'Semi-skilled' THEN 1 ELSE 0 END) as semi_skilled_count,
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_count
        FROM labour
        GROUP BY trade
        ORDER BY count DESC`,
        (err, results) => {
            if (err) {
                console.error('❌ Skill distribution error:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            res.json({
                success: true,
                distribution: results
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

// Add to your existing console.log section
console.log(`   GET  http://localhost:${PORT}/api/tasks`);
console.log(`   GET  http://localhost:${PORT}/api/tasks/:id`);
console.log(`   POST http://localhost:${PORT}/api/tasks`);
console.log(`   PUT  http://localhost:${PORT}/api/tasks/:id`);
console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id`);
console.log(`   GET  http://localhost:${PORT}/api/tasks/stats/summary`);
console.log(`   GET  http://localhost:${PORT}/api/tasks/project/:project`);
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