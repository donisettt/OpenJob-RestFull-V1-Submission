const UsersService = require('../services/UsersService');

class UsersController {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      const user = await UsersService.register({ name, email, password, role });
      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: { id: user.id, userId: user.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UsersService.getUserById(id);
      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
