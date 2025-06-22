const { body, query, validationResult } = require('express-validator');

exports.validateSearch = [
  query('service')
    .optional()
    .isString()
    .trim()
    .withMessage('Service must be a string'),
    
  query('city')
    .optional()
    .isString()
    .trim()
    .withMessage('City must be a string'),

  query('region')
    .optional()
    .isString()
    .trim()
    .withMessage('Region must be a string'),

  query('town')
    .optional()
    .isString()
    .trim()
    .withMessage('Town must be a string'),
    
  // Custom middleware to return validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validate provider create/update
exports.validateProviderProfile = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isString()
    .withMessage('Full name must be a string'),

  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Invalid phone number'),

  body('services')
    .notEmpty()
    .withMessage('Services are required')
    .isString()
    .withMessage('Services must be a string'),

  body('location.city')
    .optional()
    .isString()
    .withMessage('City must be a string'),

  body('location.region')
    .optional()
    .isString()
    .withMessage('Region must be a string'),

  body('location.town')
    .optional()
    .isString()
    .withMessage('Town must be a string'),

  // Custom middleware to handle errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];