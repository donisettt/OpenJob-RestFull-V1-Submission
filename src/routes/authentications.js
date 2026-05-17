const express = require('express');
const router = express.Router();
const AuthenticationsController = require('../controllers/AuthenticationsController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { loginSchema, refreshTokenSchema, logoutSchema } = require('../validators/authentications');

router.post('/', validate(loginSchema), AuthenticationsController.login);
router.put('/', validate(refreshTokenSchema), AuthenticationsController.refreshToken);
router.delete('/', auth, validate(logoutSchema), AuthenticationsController.logout);

module.exports = router;
