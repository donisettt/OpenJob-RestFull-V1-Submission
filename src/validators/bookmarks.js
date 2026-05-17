const Joi = require('joi');

const createBookmarkSchema = Joi.object({
  job_id: Joi.string().uuid().optional(),
});

module.exports = { createBookmarkSchema };
