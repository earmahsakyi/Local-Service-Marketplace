const express  = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

const auth = require('../middleware/auth');

// Protected Routes
router.get('/profile', auth, customerController.getMyCustomerProfile);
router.post('/', auth, customerController.createOrUpdateCustomerProfile);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);

module.exports = router;
