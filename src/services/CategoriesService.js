const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

class CategoriesService {
  async createCategory({ name, description }) {
    const checkResult = await pool.query('SELECT id FROM categories WHERE name = $1', [name]);
    if (checkResult.rowCount > 0) {
      throw new ClientError('Category name already exists', 400);
    }

    const id = uuidv4();
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO categories (id, name, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, name, description || null, now, now]
    );
    return result.rows[0];
  }

  async getAllCategories() {
    const result = await pool.query(
      'SELECT id, name, description, created_at FROM categories ORDER BY name ASC'
    );
    return result.rows;
  }

  async getCategoryById(id) {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Category not found');
    }
    return result.rows[0];
  }

  async updateCategory(id, payload) {
    const fields = Object.keys(payload);
    if (fields.length === 0) throw new ClientError('No fields to update');

    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const values = fields.map((f) => payload[f]);

    const result = await pool.query(
      `UPDATE categories SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Category not found');
    }
    return result.rows[0];
  }

  async deleteCategory(id) {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Category not found');
    }
  }
}

module.exports = new CategoriesService();
