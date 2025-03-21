// Simple Express server starter
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Use local SQLite database

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Handle CORS preflight requests
app.options('*', cors());

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'U6wk89CYFopPPShx');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test database connection
app.get('/test-db', (req, res) => {
  console.log('Test database endpoint hit');
  db.get(`SELECT COUNT(*) as count FROM users`, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
    console.log('Database query result:', result);
    res.json({ message: 'Database connection successful', userCount: result ? result.count : 0 });
  });
});

// User endpoints
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email }, 'U6wk89CYFopPPShx');
    res.json({ token, name: user.name });
  });
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Check if email already exists
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Insert new user
    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword],
      function(err) {
        if (err) {
          console.error('Signup error:', err);
          return res.status(400).json({ error: err.message });
        }

        // Get the inserted user to return
        db.get(`SELECT * FROM users WHERE id = ?`, [this.lastID], (err, user) => {
          if (err) {
            console.error('User retrieval error:', err);
            return res.status(500).json({ error: 'Failed to retrieve user' });
          }
          
          const token = jwt.sign({ id: user.id, email }, 'U6wk89CYFopPPShx');
          res.json({ token, name: user.name });
        });
      }
    );
  });
});

// Get user profile
app.get('/get-user-profile', verifyToken, (req, res) => {
  db.get(`SELECT id, name, email FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err) {
      console.error('Get user profile error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  });
});

// Update user profile
app.post('/update-profile', verifyToken, (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Get the current user to verify current password if needed
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password if changing password
    if (newPassword && !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Check if email is taken by another user
    db.get(`SELECT id FROM users WHERE email = ? AND id != ?`, [email, userId], (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
      
      // Update the user
      let query = `UPDATE users SET name = ?, email = ?`;
      let params = [name, email];
      
      if (newPassword) {
        query += `, password = ?`;
        params.push(bcrypt.hashSync(newPassword, 10));
      }
      
      query += ` WHERE id = ?`;
      params.push(userId);
      
      db.run(query, params, function(err) {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ error: 'Failed to update profile' });
        }
        
        // Generate new token with updated info
        const newToken = jwt.sign({ id: userId, email }, 'U6wk89CYFopPPShx');
        res.json({ 
          message: 'Profile updated successfully',
          token: newToken,
          name: name
        });
      });
    });
  });
});

// Start the server on all interfaces
const PORT = 4000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/test`);
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
}); 