const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(),
  mobile: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(8).required(),
  location: Joi.string().min(3).max(50).required(),
  role: Joi.string().valid('volunteer', 'organization', 'coordinator').required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { userRegistrationSchema, userLoginSchema };
