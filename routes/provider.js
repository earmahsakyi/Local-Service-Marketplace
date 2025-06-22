const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads'); 
const providerController = require('../controllers/providerController');
const auth = require('../middleware/auth');
const { validateProviderProfile, validateSearch } = require('../validators/providerValidators');

// Protected Routes
router.get('/profile', auth, providerController.getMyProviderProfile);

// @route   GET /api/provider/stats
// @desc    Get statistics for the logged-in provider
// @access  Private
router.get('/stats', auth, providerController.getProviderStats);

// @route   GET /api/provider/activity
// @desc    Get recent activity for the logged-in provider
// @access  Private
router.get('/activity', auth, providerController.getProviderActivity);


// Updated route with proper middleware order
router.post('/',  
  auth,                       // 1. Authenticate first
  upload.single('photo'),                     // 2. Then handle file upload
  validateProviderProfile,    // 3. Then validate 
  providerController.createOrUpdateProviderProfile
);

// Public Search & Browse
router.get('/search',auth, validateSearch, providerController.searchProviders);
router.get('/', providerController.getAllProviders);
router.get('/:id', providerController.getProviderById);

module.exports = router;