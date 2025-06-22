const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth'); // Assuming your auth middleware is at middleware/auth.js
const serviceController = require('../controllers/serviceController');

// @route   POST api/provider/services
// @desc    Create a new service
// @access  Private
router.post(
  '/',
  [
    auth, // Apply authentication middleware
    [ // Validation rules
      check('name', 'Service name is required').not().isEmpty(),
      check('price', 'Service price is required').not().isEmpty(),
      // Add other checks as necessary, e.g., for category, description length
      check('description', 'Description should be a string if provided').optional().isString(),
      check('category', 'Category should be a string if provided').optional().isString(),
      check('isActive', 'isActive status should be a boolean if provided').optional().isBoolean()
    ]
  ],
  serviceController.createService
);

// @route   GET api/provider/services
// @desc    Get all services for the logged-in provider
// @access  Private
router.get('/', auth, serviceController.getProviderServices);

// @route   GET api/provider/services/:id
// @desc    Get a specific service by ID
// @access  Private
router.get('/:id', auth, serviceController.getServiceById);

// @route   PUT api/provider/services/:id
// @desc    Update a service
// @access  Private
router.put(
  '/:id',
  [
    auth, // Apply authentication middleware
    [ // Optional validation rules for update (fields are optional in controller)
      check('name', 'Service name must be a non-empty string if provided').optional().not().isEmpty(),
      check('price', 'Service price must be a non-empty string if provided').optional().not().isEmpty(),
      check('description', 'Description should be a string if provided').optional().isString(),
      check('category', 'Category should be a string if provided').optional().isString(),
      check('isActive', 'isActive status should be a boolean if provided').optional().isBoolean()
    ]
  ],
  serviceController.updateService
);

// @route   DELETE api/provider/services/:id
// @desc    Delete a service
// @access  Private
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;
