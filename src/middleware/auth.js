const TokenService = require('../services/TokenService');
const AuthenticationError = require('../exceptions/AuthenticationError');

const auth = (req, _res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new AuthenticationError('Missing authentication token');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new AuthenticationError('Invalid authentication token format');
    }

    const decoded = TokenService.verifyAccessToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      return next(error);
    }
    next(new AuthenticationError('Invalid or expired access token'));
  }
};

module.exports = auth;
