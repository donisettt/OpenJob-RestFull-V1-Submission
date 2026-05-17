const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

class UsersService {
  async register({ name, email, password, role }) {
    const checkResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkResult.rowCount > 0) {
      throw new ClientError('Email already registered', 400);
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, created_at`,
      [id, name, email, hashedPassword, role || 'candidate', now, now]
    );

    return result.rows[0];
  }

  async getUserById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('User not found');
    }
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const result = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      [email]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('User not found');
    }
    return result.rows[0];
  }

  async verifyPassword(plainPassword, hashedPassword) {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isValid) {
      throw new ClientError('Invalid email or password', 401);
    }
  }
}

module.exports = new UsersService();
