const UsersService = require('../services/UsersService');
const AuthenticationsService = require('../services/AuthenticationsService');
const TokenService = require('../services/TokenService');
const AuthenticationError = require('../exceptions/AuthenticationError');

class AuthenticationsController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      let user;
      try {
        user = await UsersService.getUserByEmail(email);
      } catch (error) {
        if (error.name === 'NotFoundError') {
          throw new AuthenticationError('Invalid email or password');
        }
        throw error;
      }
      await UsersService.verifyPassword(password, user.password);

      const payload = { id: user.id };
      const accessToken = TokenService.generateAccessToken(payload);
      const refreshToken = TokenService.generateRefreshToken(payload);

      await AuthenticationsService.saveRefreshToken(refreshToken);

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await AuthenticationsService.verifyRefreshToken(refreshToken);
      const decoded = TokenService.verifyRefreshToken(refreshToken);

      const accessToken = TokenService.generateAccessToken({ id: decoded.id });

      return res.status(200).json({
        status: 'success',
        message: 'Access token refreshed',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await AuthenticationsService.verifyRefreshToken(refreshToken);
      await AuthenticationsService.deleteRefreshToken(refreshToken);

      return res.status(200).json({
        status: 'success',
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthenticationsController();
