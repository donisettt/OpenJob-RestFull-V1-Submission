const Joi = require('joi');

const documentMimeTypes = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png'];

module.exports = { documentMimeTypes };
