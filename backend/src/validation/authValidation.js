const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(),
  mobile: Joi.string().length(11).pattern(/^\d+$/).required(),
  password: Joi.string().min(8).required(),
  location: Joi.string().min(3).max(50).required(),
  role: Joi.string().valid('volunteer', 'organization', 'coordinator', 'visitor').required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  resetCode: Joi.string().length(6).required(),
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required()
});

module.exports = { userRegistrationSchema, userLoginSchema, resetPasswordSchema };
