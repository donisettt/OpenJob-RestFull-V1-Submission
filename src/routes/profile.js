const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const auth = require('../middleware/auth');

router.get('/', auth, ProfileController.getProfile);
router.get('/applications', auth, ProfileController.getMyApplications);
router.get('/bookmarks', auth, ProfileController.getMyBookmarks);

module.exports = router;
