// Framework for building REST APIs.
const express = require('express');
// PostgreSQL client for Node.js.
const { Pool } = require('pg');
// Securely loads credentials from .env (never commit this!).
const dotenv = require('dotenv');
// For password hashing
const bcrypt = require('bcrypt');
// For JWT authentication
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Parse JSON bodies
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DB_STRING,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000 // 30 seconds
});

// Async function to initialize database
const initializeDatabase = async () => {
  const maxRetries = 3;
  let attempt = 1;
  while (attempt <= maxRetries) {
    try {
      console.log(`Attempt ${attempt} to connect to database...`);
      // 1. Test database connection
      const connection = await pool.query('SELECT NOW()');
      console.log('✅ Database connected at:', connection.rows[0].now);

      // 2. Enable PostGIS extension
      await pool.query('CREATE EXTENSION IF NOT EXISTS postgis');
      const postgisCheck = await pool.query('SELECT postgis_version()');
      console.log('✅ PostGIS enabled:', postgisCheck.rows[0].postgis_version);

      // 3. Create tables
      console.log('Creating users table');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(20) CHECK (role IN ('user', 'provider', 'admin')),
          created_at TIMESTAMP DEFAULT NOW()
        )`);

      console.log('Creating projects table');
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

      console.log('Creating bids table');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS bids (
          id SERIAL PRIMARY KEY,
          project_id INT REFERENCES projects(id),
          provider_id INT REFERENCES users(id),
          amount NUMERIC NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
          created_at TIMESTAMP DEFAULT NOW()
        )`);

      console.log('Creating providers table');
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

      console.log('Creating reviews table');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          provider_id INT REFERENCES users(id),
          user_id INT REFERENCES users(id),
          rating INT CHECK (rating BETWEEN 1 AND 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )`);

      console.log('Creating gallery_images table');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS gallery_images (
          id SERIAL PRIMARY KEY,
          provider_id INT REFERENCES users(id),
          image_url TEXT NOT NULL,
          caption TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )`);

      console.log('Creating messages table');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          sender_id INT REFERENCES users(id),
          receiver_id INT REFERENCES users(id),
          project_id INT REFERENCES projects(id),
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )`);

      console.log('✅ Tables created successfully');
      break; // Exit loop on success
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed:`, err);
      if (attempt === maxRetries) {
        console.error('❌ Max retries reached. Database initialization failed.');
        return;
      }
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  }
};

// Basic route
app.get('/', (req, res) => {
  console.log('Handling GET / request');
  res.send('AquaNexus Backend is Running 🚀');
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error('Query error:', err.stack);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Signup endpoint
app.post('/auth/signup', async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    // Validate input
    if (!email || !password || !role || (role === 'provider' && !name)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['user', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email, password_hash, role]
    );
    const userId = userResult.rows[0].id;

    // If provider, insert into providers table
    if (role === 'provider') {
      await pool.query(
        'INSERT INTO providers (user_id, name) VALUES ($1, $2)',
        [userId, name]
      );
    }

    res.status(201).json({ userId, message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === '23505') { // Unique violation (duplicate email)
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Providers endpoint
app.get('/providers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.user_id, p.name, p.service_type, p.rating, p.service_areas
      FROM providers p
      JOIN users u ON p.user_id = u.id
      WHERE u.role = 'provider'
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Providers error:', err);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

app.post('/auth/login', async (req, res) => {
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
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/provider/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.id, p.user_id, p.name, p.service_type, p.rating, p.service_areas, p.certifications, p.services
      FROM providers p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND u.role = 'provider'
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Provider error:', err);
    res.status(500).json({ error: 'Failed to fetch provider' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Initialize database
initializeDatabase();