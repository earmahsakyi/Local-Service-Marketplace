const Provider = require('../models/Provider');
const User = require('../models/User')
const fs = require('fs');
const path = require('path');
const Service = require('../models/Service');
const Activity = require('../models/Activity');

// @desc    Create or update provider profile
// @route   POST /api/provider
// @access  Private
exports.createOrUpdateProviderProfile = async (req, res) => {
  try {
    

    let { fullName, title, description, location, phone, services } = req.body;

    // Parse location if needed
    try { 
      location = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (err) {
      console.error('Error parsing location:', err);
      location = {};
    }

    // Validate required fields
    const requiredFields = { fullName, title, description, phone, services };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up uploaded file due to validation failure');
      }
      return res.status(400).json({
        success: false,
        msg: 'Missing required fields',
        missingFields
      });
    }

    // Build profile data
    const profileData = {
      user: req.user.id,
      fullName,
      title,
      description,
      phone,
      services,
      location
    };

    // Handle photo
    if (req.file) {
      console.log('Processing file upload:', {
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      });

      // Use relative path
      const photoName = path.basename(req.file.path);
      profileData.photo = `uploads/${photoName}`;
     

      // Delete old photo if exists
      const existingProvider = await Provider.findOne({ user: req.user.id });
      if (existingProvider?.photo) {
        const oldPath = path.join(path.join(__dirname, '..'), existingProvider.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log('Deleted old profile photo:', oldPath);
        }
      }
    }

    // Update or create profile
    const provider = await Provider.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );
    await User.findByIdAndUpdate(req.user.id, { profileUpdated: true });
    

    // Sanitize the response if needed
    const providerObj = provider.toObject();
    if (providerObj.photo) {
      providerObj.photo = providerObj.photo.replace(/\\/g, '/'); // Normalize for client
    }

    res.status(200).json({
      success: true,
      data: providerObj
    });


  } catch (err) {
    console.error('Controller error:', err);

    if (req?.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up uploaded file due to error');
      } catch (cleanupErr) {
        console.error('File cleanup failed:', cleanupErr);
      }
    }

    res.status(500).json({
      success: false,
      msg: process.env.NODE_ENV === 'development'
        ? err.message
        : 'Server Error'
    });
  }
};
// @desc    Get current provider profile
// @route   GET /api/provider/profile
// @access  Private
exports.getMyProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });

    if (!provider) {
      return res.status(404).json({ msg: 'Provider profile not found' });
    }

    
    res.status(200).json({
      success: true,
      data: provider
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get recent activities for the logged-in provider
// @route   GET /api/provider/activity (This route will be defined later)
// @access  Private
exports.getProviderActivity = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming auth middleware sets req.user
    const limit = parseInt(req.query.limit) || 1; // Allow client to specify limit, default to 20

    // Fetch recent activities for this provider
    const activities = await Activity.find({ userId: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit);           // Limit the number of results

    res.json(activities);
  } catch (err) {
    console.error('Error in getProviderActivity:', err.message);
    res.status(500).send('Server Error');
  }
};



// @desc    Get all providers
// @route   GET /api/providers
// @access  Public
exports.getAllProviders = async (req, res) => {
  try {
    // Add pagination, filtering, and sorting as needed
    const providers = await Provider.find()
      .populate('user', ['email']) // Include basic user info if needed
      .select('-__v'); // Exclude version key

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server Error'
    });
  }
};

// @desc    Get provider by ID
// @route   GET /api/providers/:id
// @access  Public
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('user', ['email']);

    if (!provider) {
      return res.status(404).json({
        success: false,
        msg: 'Provider not found'
      });
    }

    res.status(200).json({
      success: true,
      data: provider
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        msg: 'Provider not found'
      });
    }
    res.status(500).json({ 
      success: false,
      msg: 'Server Error'
    });
  }
};

// @desc    Delete provider profile
// @route   DELETE /api/provider
// @access  Private
exports.deleteProviderProfile = async (req, res) => {
  try {
    // Remove provider profile
    await Provider.findByIdAndDelete({ user: req.user.id });

    // You might also want to remove the user account here
    //await User.findByIdAndRemove(req.user.id);

    res.status(200).json({
      success: true,
      msg: 'Provider profile deleted'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server Error'
    });
  }
};

// @desc    Search providers by service and location
// @route   GET /api/providers/search
// @access  Public
exports.searchProviders = async (req, res) => {
  try {
    const { services, city, region, town } = req.query;

    const query = {};

    if (services) {
      query.services = { $regex: `\\b${services}\\b`, $options: 'i' }; // case-insensitive match
    }
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    if (region) {
      query['location.region'] = { $regex: region, $options: 'i' };
    }
    if (town) {
      query['location.town'] = { $regex: town, $options: 'i' };
    }

    const providers = await Provider.find(query).select('-__v');

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Get provider statistics (e.g., service count)
// @route   GET /api/provider/stats (This route will be defined later)
// @access  Private
exports.getProviderStats = async (req, res) => {
  try {
    const providerId = req.user.id; // Assuming auth middleware sets req.user

    // Get count of services for this provider
    const servicesCount = await Service.countDocuments({ providerId: providerId });

    // Prepare stats object - extend this later with bookings, reviews, etc.
    const stats = {
      servicesCount: servicesCount,
      bookingsCount: 0, // Placeholder - implement when bookings are ready
      reviewsCount: 0   // Placeholder - implement when reviews are ready
    };

    res.json(stats);
  } catch (err) {
    console.error('Error in getProviderStats:', err.message);
    res.status(500).send('Server Error');
  }
};