const Joi = require('joi');

const createDisasterSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  type: Joi.string().valid("Earthquake", "Flood", "Hurricane", "Wildfire", "Tornado", "Tsunami", "Drought", "Pandemic", "Industrial", "Other").required(),
  description: Joi.string().min(10).required(),
  location: Joi.string().min(3).max(100).required(),
  startDate: Joi.date().required()
});


const assignDisasterToTeamSchema = Joi.object({
  teamId: Joi.number().integer().required(),
  disasterId: Joi.number().integer().required(),
  location: Joi.string().min(3).max(100).required(),
  responsibility: Joi.string().min(3).required()
});

const emergencyNotificationSchema = Joi.object({
  subject: Joi.string().min(3).max(100).required(),
  message: Joi.string().min(1).required()
});

const validateCityName = Joi.object({
  city: Joi.string().min(2).max(100).required()
});

module.exports = {
  createDisasterSchema,
  assignDisasterToTeamSchema,
  emergencyNotificationSchema,
  validateCityName
};
