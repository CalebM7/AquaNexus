// backend/seedProviders.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_STRING,
  ssl: { rejectUnauthorized: false },
});

const seedProviders = async () => {
  try {
    // Create user accounts for providers
    const userA = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['providerA@example.com', '$2b$10$examplehashedpassword', 'provider']
    );
    const userB = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['providerB@example.com', '$2b$10$examplehashedpassword', 'provider']
    );
    const userC = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['providerC@example.com', '$2b$10$examplehashedpassword', 'provider']
    );

    const providers = [
      {
        user_id: userA.rows[0].id,
        name: 'Provider A',
        service_type: 'borehole',
        rating: 4.5,
        service_areas: ['Nairobi', 'Kiambu'],
        certifications: JSON.stringify(['wra', 'verified']),
        services: JSON.stringify(['Drilling', 'Maintenance']),
        longitude: 36.8219,
        latitude: -1.2921,
      },
      {
        user_id: userB.rows[0].id,
        name: 'Provider B',
        service_type: 'rwh',
        rating: 4.0,
        service_areas: ['Mombasa', 'Kilifi'],
        certifications: JSON.stringify(['nema']),
        services: JSON.stringify(['Installation', 'Consulting']),
        longitude: 39.6682,
        latitude: -4.0435,
      },
      {
        user_id: userC.rows[0].id,
        name: 'Provider C',
        service_type: 'borehole',
        rating: 3.8,
        service_areas: ['Kisumu', 'Siaya'],
        certifications: JSON.stringify(['verified']),
        services: JSON.stringify(['Repairs', 'Inspection']),
        longitude: 34.7680,
        latitude: -0.0917,
      },
    ];

    // Clear existing providers and users (optional, for fresh seeding)
    await pool.query('DELETE FROM providers');
    await pool.query('DELETE FROM users WHERE role = $1', ['provider']);

    // Re-insert users (since we deleted them)
    const userA_new = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['providerA@example.com', '$2b$10$examplehashedpassword', 'provider']
    );
    const userB_new = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['providerB@example.com', '$2b$10$examplehashedpassword', 'provider']
    );
    const userC_new = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['providerC@example.com', '$2b$10$examplehashedpassword', 'provider']
    );

    providers[0].user_id = userA_new.rows[0].id;
    providers[1].user_id = userB_new.rows[0].id;
    providers[2].user_id = userC_new.rows[0].id;

    // Insert providers
    for (const provider of providers) {
      await pool.query(
        `INSERT INTO providers (user_id, name, service_type, rating, service_areas, certifications, services, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326))`,
        [
          provider.user_id,
          provider.name,
          provider.service_type,
          provider.rating,
          provider.service_areas,
          provider.certifications,
          provider.services,
          provider.longitude,
          provider.latitude,
        ]
      );
    }

    console.log('✅ Providers A, B, C seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding providers:', err.message);
  } finally {
    await pool.end();
  }
};

seedProviders();