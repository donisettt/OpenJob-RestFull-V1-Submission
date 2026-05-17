const Joi = require('joi');

const createCompanySchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  description: Joi.string().required(),
  industry: Joi.string().max(100).allow('', null).optional(),
  location: Joi.string().max(150).required(),
  website: Joi.string().uri().allow('', null).optional(),
  logo_url: Joi.string().uri().allow('', null).optional(),
  logoUrl: Joi.string().uri().allow('', null).optional(),
  established_year: Joi.any().optional(),
  company_size: Joi.any().optional(),
});

const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(150).optional(),
  description: Joi.string().allow('', null).optional(),
  industry: Joi.string().max(100).allow('', null).optional(),
  location: Joi.string().max(150).allow('', null).optional(),
  website: Joi.string().uri().allow('', null).optional(),
  logo_url: Joi.string().uri().allow('', null).optional(),
  logoUrl: Joi.string().uri().allow('', null).optional(),
}).min(1);

module.exports = { createCompanySchema, updateCompanySchema };
