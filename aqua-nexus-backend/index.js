// Framework for building REST APIs.
const express = require('express');
// PostgreSQL client for Node.js.
const { Pool } = require('pg');
// Securely loads credentials from .env (never commit this!).
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DB_STRING
});

// Async function to initialize database
const initializeDatabase = async () => {
  try {
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

  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    // Don't exit, let server run
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

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Initialize database
initializeDatabase();