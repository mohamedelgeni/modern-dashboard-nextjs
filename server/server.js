// server.js
console.log('Starting server...');
try {
  const express = require('express');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const db = require('./db'); // Use local SQLite database instead of Supabase

  console.log('All modules loaded successfully');

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Log available routes
  console.log('Available routes:');
  ['/signup', '/login', '/users', '/update-profile', '/upload-data-file', '/get-user-profile', '/test-db'].forEach(route => {
    console.log(route);
  });

  const SECRET_KEY = process.env.SECRET_KEY || 'U6wk89CYFopPPShx'; // Replace in prod

  // Sign-Up Route
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
            
            const token = jwt.sign({ id: user.id, email }, SECRET_KEY);
            res.json({ token, name: user.name });
          });
        }
      );
    });
  });

  // Login Route
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
      
      const token = jwt.sign({ id: user.id, email }, SECRET_KEY);
      res.json({ token, name: user.name });
    });
  });

  // Middleware to verify JWT tokens
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Endpoint to view all users (for development purposes only)
  app.get('/users', (req, res) => {
    db.all(`SELECT id, name, email, created_at FROM users`, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  // Update Profile Route
  app.post('/update-profile', verifyToken, (req, res) => {
    console.log('Received profile update request');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);

    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get the current user from the database
    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Found user:', user.id, user.email);

      // If changing password, verify the current password
      if (newPassword) {
        const validPassword = bcrypt.compareSync(currentPassword, user.password);
        if (!validPassword) {
          console.log('Invalid current password');
          return res.status(400).json({ error: 'Current password is incorrect' });
        }
      }

      // Check if email is already in use by another user
      db.get(`SELECT * FROM users WHERE email = ? AND id != ?`, [email, userId], (err, existingUser) => {
        if (err) {
          console.error('Email check error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (existingUser) {
          console.log('Email already in use:', email);
          return res.status(400).json({ error: 'Email already in use' });
        }

        // Prepare update payload
        let updateQuery = `UPDATE users SET name = ?, email = ?`;
        let params = [name, email];

        if (newPassword) {
          updateQuery += `, password = ?`;
          params.push(bcrypt.hashSync(newPassword, 10));
        }

        updateQuery += ` WHERE id = ?`;
        params.push(userId);

        // Update the user
        db.run(updateQuery, params, function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to update profile' });
          }

          console.log('Profile updated successfully');

          // Get updated user
          db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, updatedUser) => {
            if (err) {
              console.error('Error retrieving updated user:', err);
              return res.status(500).json({ error: 'Error retrieving updated user' });
            }

            // Generate new token with updated info
            const newToken = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, SECRET_KEY);
            res.json({
              message: 'Profile updated successfully',
              token: newToken,
              name: updatedUser.name
            });
          });
        });
      });
    });
  });

  // File Upload Routes
  const multer = require('multer');
  const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  app.post('/upload-data-file', verifyToken, upload.single('dataFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully' });
  });

  // Endpoint to get user profile data
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

  // Add this to serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Test endpoint to check database connection
  app.get('/test-db', (req, res) => {
    console.log('Test DB endpoint hit');
    db.get(`SELECT COUNT(*) as count FROM users`, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database connection failed', details: err.message });
      }
      console.log('Database query result:', result);
      res.json({ message: 'Database connection successful', userCount: result.count });
    });
  });

  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

} catch (error) {
  console.error('Error starting server:', error);
}


