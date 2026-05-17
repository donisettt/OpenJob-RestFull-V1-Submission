const Joi = require('joi');

const createJobSchema = Joi.object({
  company_id: Joi.string().uuid().optional(),
  companyId: Joi.string().uuid().optional(),
  category_id: Joi.string().uuid().optional(),
  categoryId: Joi.string().uuid().optional(),
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().required(),
  requirements: Joi.string().allow('', null).optional(),
  salary_min: Joi.number().integer().min(0).allow(null).optional(),
  salaryMin: Joi.number().integer().min(0).allow(null).optional(),
  salary_max: Joi.number().integer().min(0).allow(null).optional(),
  salaryMax: Joi.number().integer().min(0).allow(null).optional(),
  location: Joi.string().max(150).allow('', null).optional(),
  location_type: Joi.string().allow('', null).optional(),
  locationType: Joi.string().allow('', null).optional(),
  job_type: Joi.string().allow('', null).optional(),
  jobType: Joi.string().allow('', null).optional(),
  experience_level: Joi.string().allow('', null).optional(),
  experienceLevel: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('open', 'closed').default('open'),
  location_city: Joi.any().optional(),
  is_salary_visible: Joi.any().optional(),
}).or('company_id', 'companyId').or('category_id', 'categoryId');

const updateJobSchema = Joi.object({
  company_id: Joi.string().uuid().optional(),
  companyId: Joi.string().uuid().optional(),
  category_id: Joi.string().uuid().optional(),
  categoryId: Joi.string().uuid().optional(),
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional(),
  requirements: Joi.string().allow('', null).optional(),
  salary_min: Joi.number().integer().min(0).allow(null).optional(),
  salaryMin: Joi.number().integer().min(0).allow(null).optional(),
  salary_max: Joi.number().integer().min(0).allow(null).optional(),
  salaryMax: Joi.number().integer().min(0).allow(null).optional(),
  location: Joi.string().max(150).allow('', null).optional(),
  location_type: Joi.string().allow('', null).optional(),
  locationType: Joi.string().allow('', null).optional(),
  job_type: Joi.string().allow('', null).optional(),
  jobType: Joi.string().allow('', null).optional(),
  experience_level: Joi.string().allow('', null).optional(),
  experienceLevel: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('open', 'closed').optional(),
}).min(1);

const jobQuerySchema = Joi.object({
  title: Joi.string().max(200).allow('', null).optional(),
  'company-name': Joi.string().max(150).allow('', null).optional(),
});

module.exports = { createJobSchema, updateJobSchema, jobQuerySchema };
