const pool = require('../config/database');
const ClientError = require('../exceptions/ClientError');

class AuthenticationsService {
  async saveRefreshToken(token) {
    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
  }

  async verifyRefreshToken(token) {
    const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [token]);
    if (result.rowCount === 0) {
      throw new ClientError('Refresh token is invalid', 400);
    }
  }

  async deleteRefreshToken(token) {
    await pool.query('DELETE FROM authentications WHERE token = $1', [token]);
  }
}

module.exports = new AuthenticationsService();
