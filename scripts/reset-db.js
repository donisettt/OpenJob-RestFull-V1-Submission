require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool();

async function resetDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      TRUNCATE TABLE
        authentications,
        bookmarks,
        applications,
        documents,
        jobs,
        categories,
        companies,
        users
      RESTART IDENTITY CASCADE;
    `);
    console.log('Database reset successful! All tables truncated.');
  } catch (err) {
    console.error('Reset failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
