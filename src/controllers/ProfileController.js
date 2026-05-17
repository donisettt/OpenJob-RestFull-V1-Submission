const UsersService = require('../services/UsersService');
const ApplicationsService = require('../services/ApplicationsService');
const BookmarksService = require('../services/BookmarksService');

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const user = await UsersService.getUserById(req.user.id);
      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyApplications(req, res, next) {
    try {
      const applications = await ApplicationsService.getApplicationsByUser(req.user.id);
      return res.status(200).json({
        status: 'success',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyBookmarks(req, res, next) {
    try {
      const bookmarks = await BookmarksService.getAllBookmarksByUser(req.user.id);
      return res.status(200).json({
        status: 'success',
        data: { bookmarks },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
