const BookmarksService = require('../services/BookmarksService');
const CacheService = require('../services/CacheService');

class BookmarksController {
  async createBookmark(req, res, next) {
    try {
      const user_id = req.user.id;
      const job_id = req.params.jobId;
      const bookmark = await BookmarksService.createBookmark({ user_id, job_id });
      await CacheService.delete(CacheService.keys.bookmarksByUser(user_id));
      return res.status(201).json({
        status: 'success',
        message: 'Job bookmarked successfully',
        data: { id: bookmark.id, bookmarkId: bookmark.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarkById(req, res, next) {
    try {
      const bookmark = await BookmarksService.getBookmarkById(req.params.id);
      return res.status(200).json({
        status: 'success',
        data: bookmark,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmark(req, res, next) {
    try {
      const user_id = req.user.id;
      const job_id = req.params.jobId;
      await BookmarksService.deleteBookmarkByUserAndJob({ user_id, job_id });
      await CacheService.delete(CacheService.keys.bookmarksByUser(user_id));
      return res.status(200).json({
        status: 'success',
        message: 'Bookmark removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllBookmarks(req, res, next) {
    try {
      const user_id = req.user.id;
      const cacheKey = CacheService.keys.bookmarksByUser(user_id);
      const cachedBookmarks = await CacheService.get(cacheKey);
      if (cachedBookmarks) {
        return res
          .set('X-Data-Source', 'cache')
          .status(200)
          .json({
            status: 'success',
            data: { bookmarks: cachedBookmarks },
          });
      }

      const bookmarks = await BookmarksService.getAllBookmarksByUser(user_id);
      await CacheService.set(cacheKey, bookmarks);
      return res
        .set('X-Data-Source', 'database')
        .status(200)
        .json({
          status: 'success',
          data: { bookmarks },
        });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookmarksController();
