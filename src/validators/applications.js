const Joi = require('joi');

const createApplicationSchema = Joi.object({
  user_id: Joi.string().uuid().optional(),
  userId: Joi.string().uuid().optional(),
  job_id: Joi.string().uuid().optional(),
  jobId: Joi.string().uuid().optional(),
  document_id: Joi.string().uuid().allow(null, '').optional(),
  documentId: Joi.string().uuid().allow(null, '').optional(),
  cover_letter: Joi.string().allow('', null).optional(),
  coverLetter: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').optional(),
  expected_salary: Joi.any().optional(),
  availability: Joi.any().optional(),
}).or('job_id', 'jobId');

const updateApplicationSchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').required(),
});

module.exports = { createApplicationSchema, updateApplicationSchema };
