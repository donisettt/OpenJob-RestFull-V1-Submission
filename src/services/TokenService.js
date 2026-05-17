require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;

const TokenService = {
  generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_TOKEN_KEY, { expiresIn: '3h' });
  },

  generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_KEY);
  },

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_KEY);
    } catch {
      throw new AuthenticationError('Invalid or expired access token');
    }
  },

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_KEY);
    } catch {
      const ClientError = require('../exceptions/ClientError');
      throw new ClientError('Refresh token is invalid', 400);
    }
  },
};

module.exports = TokenService;
