const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const propertySchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(20).max(2000).required(),
  price: Joi.number().positive().required(),
  type: Joi.string().valid('sale', 'rent').required(),
  category: Joi.string().valid('apartment', 'house', 'villa', 'office', 'land', 'commercial').required(),
  status: Joi.string().valid('available', 'sold', 'rented').optional(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().optional(),
    pincode: Joi.string().optional(),
    coordinates: Joi.object({
      lat: Joi.number().optional(),
      lng: Joi.number().optional(),
    }).optional(),
  }).required(),
  features: Joi.object({
    bedrooms: Joi.number().min(0).optional(),
    bathrooms: Joi.number().min(0).optional(),
    area: Joi.number().positive().required(),
    parking: Joi.boolean().optional(),
    furnished: Joi.string().valid('unfurnished', 'semi-furnished', 'fully-furnished').optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
  }).required(),
  featured: Joi.boolean().optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map((d) => d.message).join(', ');
    return next(new ExpressError(msg, 400));
  }
  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateProperty: validate(propertySchema),
};
