// Framework for building REST APIs.
const express = require('express');
// PostgreSQL client for Node.js.
// This library allows you to interact with PostgreSQL databases.
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
  }
};

// Basic route
app.get('/', (req, res) => {
  res.send('AquaNexus Backend is Running 🚀');
});

// Start the initialization process
initializeDatabase();