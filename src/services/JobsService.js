const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

class JobsService {
  async createJob({ company_id, category_id, title, description, requirements, salary_min, salary_max, location, location_type, job_type, experience_level, status }) {
    const id = uuidv4();
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO jobs (id, company_id, category_id, title, description, requirements, salary_min, salary_max, location, location_type, job_type, experience_level, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [id, company_id, category_id, title, description, requirements || null, salary_min || null, salary_max || null, location || null, location_type || null, job_type || 'full-time', experience_level || null, status || 'open', now, now]
    );
    return result.rows[0];
  }

  async getAllJobs({ title, 'company-name': companyName } = {}) {
    let query = `
      SELECT j.id, j.company_id, j.category_id, j.title, j.description,
             j.job_type, j.experience_level, j.location_type, j.status,
             j.created_at, j.updated_at,
             c.name AS company_name, cat.name AS category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      WHERE 1=1
    `;
    const params = [];

    if (title) {
      params.push(`%${title}%`);
      query += ` AND j.title ILIKE $${params.length}`;
    }

    if (companyName) {
      params.push(`%${companyName}%`);
      query += ` AND c.name ILIKE $${params.length}`;
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getJobById(id) {
    const result = await pool.query(
      `SELECT j.*, c.name AS company_name, c.description AS company_description,
              c.location AS company_location, c.industry, c.website,
              cat.name AS category_name, cat.description AS category_description
       FROM jobs j
       LEFT JOIN companies c ON j.company_id = c.id
       LEFT JOIN categories cat ON j.category_id = cat.id
       WHERE j.id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Job not found');
    }
    return result.rows[0];
  }

  async getJobsByCompany(companyId) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId)) return [];
    const result = await pool.query(
      `SELECT j.*, cat.name AS category_name FROM jobs j
       LEFT JOIN categories cat ON j.category_id = cat.id
       WHERE j.company_id = $1 ORDER BY j.created_at DESC`,
      [companyId]
    );
    return result.rows;
  }

  async getJobsByCategory(categoryId) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId)) return [];
    const result = await pool.query(
      `SELECT j.*, c.name AS company_name FROM jobs j
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE j.category_id = $1 ORDER BY j.created_at DESC`,
      [categoryId]
    );
    return result.rows;
  }

  async updateJob(id, payload) {
    const fields = Object.keys(payload);
    if (fields.length === 0) throw new ClientError('No fields to update');

    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const values = fields.map((f) => payload[f]);

    const result = await pool.query(
      `UPDATE jobs SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Job not found');
    }
    return result.rows[0];
  }

  async deleteJob(id) {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Job not found');
    }
  }
}

module.exports = new JobsService();
