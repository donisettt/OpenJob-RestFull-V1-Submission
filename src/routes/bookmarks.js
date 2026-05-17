const express = require('express');
const router = express.Router();
const BookmarksController = require('../controllers/BookmarksController');
const auth = require('../middleware/auth');
router.get('/', auth, BookmarksController.getAllBookmarks);

module.exports = router;
