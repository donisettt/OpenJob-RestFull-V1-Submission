const UsersService = require('../services/UsersService');
const CacheService = require('../services/CacheService');

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
      const cacheKey = CacheService.keys.user(id);
      const cachedUser = await CacheService.get(cacheKey);
      if (cachedUser) {
        return res
          .set('X-Data-Source', 'cache')
          .status(200)
          .json({
            status: 'success',
            data: cachedUser,
          });
      }

      const user = await UsersService.getUserById(id);
      await CacheService.set(cacheKey, user);
      return res
        .set('X-Data-Source', 'database')
        .status(200)
        .json({
          status: 'success',
          data: user,
        });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
