const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

class BookmarksService {
  async createBookmark({ user_id, job_id }) {
    const existing = await pool.query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
      [user_id, job_id]
    );
    if (existing.rowCount > 0) {
      throw new ClientError('Job already bookmarked', 400);
    }

    const id = uuidv4();
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO bookmarks (id, user_id, job_id, created_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, user_id, job_id, now]
    );
    return result.rows[0];
  }

  async getBookmarkById(id) {
    const result = await pool.query(
      `SELECT b.*, j.title AS job_title, c.name AS company_name
       FROM bookmarks b
       LEFT JOIN jobs j ON b.job_id = j.id
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE b.id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Bookmark not found');
    }
    return result.rows[0];
  }

  async deleteBookmarkByUserAndJob({ user_id, job_id }) {
    const result = await pool.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      [user_id, job_id]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Bookmark not found');
    }
  }

  async getAllBookmarksByUser(user_id) {
    const result = await pool.query(
      `SELECT b.*, j.title AS job_title, j.location AS job_location, j.job_type AS job_type,
              j.status AS job_status, j.salary_min, j.salary_max,
              j.description AS job_description, j.requirements AS job_requirements,
              j.location_type, j.experience_level,
              c.id AS company_id, c.name AS company_name, c.location AS company_location,
              c.industry AS company_industry
       FROM bookmarks b
       LEFT JOIN jobs j ON b.job_id = j.id
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE b.user_id = $1 ORDER BY b.created_at DESC`,
      [user_id]
    );
    return result.rows;
  }
}

module.exports = new BookmarksService();
