const Joi = require('joi');

const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().max(20).optional().default('candidate'),
});

module.exports = { registerUserSchema };
