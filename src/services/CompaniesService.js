const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

class CompaniesService {
  async createCompany({ name, description, industry, location, website, logo_url, userId }) {
    const checkResult = await pool.query('SELECT id FROM companies WHERE name = $1', [name]);
    if (checkResult.rowCount > 0) {
      throw new ClientError('Company name already exists', 400);
    }

    const id = uuidv4();
    const now = new Date();

    const result = await pool.query(
      `INSERT INTO companies (id, user_id, name, description, industry, location, website, logo_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, userId, name, description || null, industry || null, location || null, website || null, logo_url || null, now, now]
    );

    return result.rows[0];
  }

  async getAllCompanies() {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async getCompanyById(id) {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Company not found');
    }
    return result.rows[0];
  }

  async updateCompany(id, payload) {
    const fields = Object.keys(payload);
    if (fields.length === 0) throw new ClientError('No fields to update');

    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const values = fields.map((f) => payload[f]);

    const result = await pool.query(
      `UPDATE companies SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Company not found');
    }
    return result.rows[0];
  }

  async deleteCompany(id) {
    const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Company not found');
    }
  }
}

module.exports = new CompaniesService();
