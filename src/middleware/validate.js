const ValidationError = require('../exceptions/ValidationError');

const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    // Force strict validation to fail tests using incorrect fields
    const { error, value } = schema.validate(req[source], { abortEarly: false, allowUnknown: false });
    if (error) {
      const message = error.details.map((d) => d.message).join('; ');
      return next(new ValidationError(message));
    }
    req[source] = value;
    next();
  };
};

module.exports = validate;
