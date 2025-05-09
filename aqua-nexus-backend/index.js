// backend/index.js
const express = require('express');
<<<<<<< Updated upstream
// PostgreSQL client for Node.js.
// This library allows you to interact with PostgreSQL databases.
=======
>>>>>>> Stashed changes
const { Pool } = require('pg');
const dotenv = require('dotenv');
<<<<<<< Updated upstream
=======
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
>>>>>>> Stashed changes

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
<<<<<<< Updated upstream
  connectionString: process.env.DB_STRING
=======
  connectionString: process.env.DB_STRING,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
>>>>>>> Stashed changes
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No Authorization header provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Authorization header format invalid');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Initialize database
const initializeDatabase = async () => {
<<<<<<< Updated upstream
  try {
    // 1. Test database connection
    const connection = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', connection.rows[0].now);

    // 2. Enable PostGIS extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis');
    const postgisCheck = await pool.query('SELECT postgis_version()');
    console.log('✅ PostGIS enabled:', postgisCheck.rows[0].postgis_version);

    // 3. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) CHECK (role IN ('user', 'provider', 'admin')),
        created_at TIMESTAMP DEFAULT NOW()
      )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        service_type VARCHAR(50) CHECK (service_type IN ('rwh', 'borehole')),
        location GEOMETRY(POINT, 4326),
        budget NUMERIC,
        created_at TIMESTAMP DEFAULT NOW()
      )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id SERIAL PRIMARY KEY,
        project_id INT REFERENCES projects(id),
        provider_id INT REFERENCES users(id),
        amount NUMERIC NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
        created_at TIMESTAMP DEFAULT NOW()
      )`);

    console.log("✅ Tables created successfully");
    
    // 4. Start server AFTER successful initialization
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ Initialization error:", err);
    process.exit(1); // Exit with failure code
=======
  const maxRetries = 3;
  let attempt = 1;
  while (attempt <= maxRetries) {
    try {
      console.log(`Attempt ${attempt} to connect to database...`);
      const connection = await pool.query('SELECT NOW()');
      console.log('✅ Database connected at:', connection.rows[0].now);

      await pool.query('CREATE EXTENSION IF NOT EXISTS postgis');
      const postgisCheck = await pool.query('SELECT postgis_version()');
      console.log('✅ PostGIS enabled:', postgisCheck.rows[0].postgis_version);

      console.log('Creating users table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(20) CHECK (role IN ('user', 'provider', 'admin')),
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      console.log('✅ Users table created');

      console.log('Creating projects table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          service_type VARCHAR(50) CHECK (service_type IN ('rwh', 'borehole')),
          location GEOMETRY(POINT, 4326),
          budget NUMERIC,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      console.log('✅ Projects table created');

      console.log('Creating bids table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS bids (
          id SERIAL PRIMARY KEY,
          project_id INT REFERENCES projects(id),
          provider_id INT REFERENCES users(id),
          amount NUMERIC NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      console.log('✅ Bids table created');

      console.log('Creating providers table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS providers (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id),
          name VARCHAR(255) NOT NULL,
          certifications JSONB,
          services JSONB,
          rating NUMERIC,
          location GEOMETRY(POINT, 4326),
          created_at TIMESTAMP DEFAULT NOW(),
          service_type VARCHAR(50) CHECK (service_type IN ('rwh', 'borehole')),
          license_number VARCHAR(100),
          service_areas TEXT[],
          UNIQUE(user_id)
        )`);
      console.log('✅ Providers table created');

      console.log('Creating reviews table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          provider_id INT REFERENCES users(id),
          user_id INT REFERENCES users(id),
          rating INT CHECK (rating BETWEEN 1 AND 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      console.log('✅ Reviews table created');

      console.log('Creating gallery_images table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS gallery_images (
          id SERIAL PRIMARY KEY,
          provider_id INT REFERENCES users(id),
          image_url TEXT NOT NULL,
          caption TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      console.log('✅ Gallery_images table created');

      console.log('Creating messages table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          sender_id INT REFERENCES users(id),
          receiver_id INT REFERENCES users(id),
          project_id INT REFERENCES projects(id),
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      console.log('✅ Messages table created');

      console.log('✅ Database initialization completed successfully');
      break;
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed:`, err.message);
      if (attempt === maxRetries) {
        console.error('❌ Max retries reached. Database initialization failed.');
        return;
      }
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
>>>>>>> Stashed changes
  }
};

// Basic route
app.get('/', (req, res) => {
  res.send('AquaNexus Backend is Running 🚀');
});

<<<<<<< Updated upstream
// Start the initialization process
=======
// Test database route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role, name, phone } = req.body;
  try {
    if (!email || !password || !role || (role === 'provider' && !name)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['user', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, password_hash, role, phone]
    );
    const userId = userResult.rows[0].id;

    if (role === 'provider') {
      await pool.query(
        'INSERT INTO providers (user_id, name, service_type) VALUES ($1, $2, $3)',
        [userId, name, role === 'provider' ? 'rwh' : null] // Default service_type for providers
      );
    }

    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, userId, role });
  } catch (err) {
    console.error('Register error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id, role: user.role });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Failed to login', details: err.message });
  }
});

// Providers endpoint
app.get('/api/providers', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.user_id, p.name, p.service_type, p.rating, p.service_areas, p.certifications, p.services,
             ST_X(p.location) AS longitude, ST_Y(p.location) AS latitude
      FROM providers p
      JOIN users u ON p.user_id = u.id
      WHERE u.role = 'provider'
    `);
    console.log('Providers fetched:', result.rows); // Debug log
    res.json(result.rows);
  } catch (err) {
    console.error('Providers error:', err.message);
    res.status(500).json({ error: 'Failed to fetch providers', details: err.message });
  }
});

// Provider by ID endpoint
app.get('/api/provider/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.id, p.user_id, p.name, p.service_type, p.rating, p.service_areas, p.certifications, p.services,
             ST_X(p.location) AS longitude, ST_Y(p.location) AS latitude
      FROM providers p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND u.role = 'provider'
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Provider error:', err.message);
    res.status(500).json({ error: 'Failed to fetch provider', details: err.message });
  }
});

// Provider reviews endpoint
app.get('/api/provider/:id/reviews', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.email AS reviewer_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.provider_id = (
        SELECT user_id FROM providers WHERE id = $1
      )
      ORDER BY r.created_at DESC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Provider reviews error:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
});

// User endpoint (for Dashboard)
app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, phone FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('User error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Initialize database
>>>>>>> Stashed changes
initializeDatabase();