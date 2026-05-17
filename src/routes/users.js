const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const validate = require('../middleware/validate');
const { registerUserSchema } = require('../validators/users');

router.post('/', validate(registerUserSchema), UsersController.register);
router.get('/:id', UsersController.getUserById);

module.exports = router;
