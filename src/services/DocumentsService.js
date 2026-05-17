const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class DocumentsService {
  async saveDocument({ user_id, filename, originalName, filePath, fileSize, mimeType }) {
    const id = uuidv4();
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO documents (id, user_id, filename, original_name, file_path, file_size, mime_type, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, user_id, filename, originalName, filePath, fileSize, mimeType, now, now]
    );
    return result.rows[0];
  }

  async getAllDocuments() {
    const result = await pool.query(
      `SELECT d.*, u.name AS owner_name, u.email AS owner_email
       FROM documents d LEFT JOIN users u ON d.user_id = u.id
       ORDER BY d.created_at DESC`
    );
    return result.rows;
  }

  async getDocumentById(id) {
    const result = await pool.query(
      `SELECT d.*, u.name AS owner_name FROM documents d
       LEFT JOIN users u ON d.user_id = u.id WHERE d.id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Document not found');
    }
    return result.rows[0];
  }

  async deleteDocument(id, userId) {
    const doc = await this.getDocumentById(id);
    if (doc.user_id !== userId) {
      throw new AuthorizationError('You are not authorized to delete this document');
    }

    try {
      fs.unlinkSync(path.resolve(doc.file_path));
    } catch {
    }

    await pool.query('DELETE FROM documents WHERE id = $1', [id]);
  }
}

module.exports = new DocumentsService();
