const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

class ApplicationsService {
  async createApplication({ user_id, job_id, document_id, cover_letter }) {
    const existing = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      [user_id, job_id]
    );
    if (existing.rowCount > 0) {
      throw new ClientError('You have already applied to this job', 400);
    }

    const id = uuidv4();
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO applications (id, user_id, job_id, document_id, cover_letter, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'pending',$6,$7) RETURNING *`,
      [id, user_id, job_id, document_id || null, cover_letter || null, now, now]
    );
    return result.rows[0];
  }

  async getAllApplications() {
    const result = await pool.query(
      `SELECT a.*, u.name AS applicant_name, u.email AS applicant_email,
              j.title AS job_title, c.name AS company_name, c.id AS company_id
       FROM applications a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN companies c ON j.company_id = c.id
       ORDER BY a.created_at DESC`
    );
    return result.rows;
  }

  async getApplicationById(id) {
    const result = await pool.query(
      `SELECT a.*, u.name AS applicant_name, u.email AS applicant_email,
              j.title AS job_title, c.name AS company_name
       FROM applications a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE a.id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Application not found');
    }
    return result.rows[0];
  }

  async getApplicationNotificationData(id) {
    const result = await pool.query(
      `SELECT a.id, a.created_at,
              applicant.name AS applicant_name,
              applicant.email AS applicant_email,
              owner.email AS owner_email
       FROM applications a
       JOIN users applicant ON a.user_id = applicant.id
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       JOIN users owner ON c.user_id = owner.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Application not found');
    }

    return result.rows[0];
  }

  async getApplicationsByUser(userId) {
    if (!isUuid(userId)) return [];

    const result = await pool.query(
      `SELECT a.*, j.title AS job_title, j.description AS job_description,
              j.job_type, j.location_type, j.status AS job_status,
              c.name AS company_name, c.location AS company_location
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE a.user_id = $1 ORDER BY a.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async getApplicationsByJob(jobId) {
    if (!isUuid(jobId)) return [];

    const result = await pool.query(
      `SELECT a.*, u.name AS applicant_name, u.email AS applicant_email,
              j.title AS job_title, c.name AS company_name, c.id AS company_id
       FROM applications a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE a.job_id = $1 ORDER BY a.created_at DESC`,
      [jobId]
    );
    return result.rows;
  }

  async updateApplicationStatus(id, status) {
    const result = await pool.query(
      `UPDATE applications SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, status]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Application not found');
    }
    return result.rows[0];
  }

  async deleteApplication(id) {
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Application not found');
    }
  }
}

module.exports = new ApplicationsService();
