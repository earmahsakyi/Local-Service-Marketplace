const Customer = require('../models/Customer');
const User = require('../models/User')

exports.createOrUpdateCustomerProfile = async (req, res) => {
  try {
    let { fullName, phone,  location } = req.body;

    try { 
      location = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (err) {
      console.error('Error parsing location:', err);
      location = {};
    }

    const requiredFields = { fullName, phone,location };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
          return res.status(400).json({
            success: false,
            msg: 'Missing required fields',
            missingFields
          });
        }

    const profileData = {
      fullName,
      phone,
      location,
      user: req.user.id
    };

    let customer = await Customer.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      { new: true, upsert: true }
    );
    await User.findByIdAndUpdate(req.user.id, { profileUpdated: true });

    res.status(200).json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user.id });
    if (!customer) {
      return res.status(404).json({ msg: 'Customer profile not found' });
    }

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get customer profile by ID
// @route   GET /api/customers/:id
// @access  Private (typically only the customer or admin should access)
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('user', ['email']);

    if (!customer) {
      return res.status(404).json({
        success: false,
        msg: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        msg: 'Customer not found'
      });
    }
    res.status(500).json({ 
      success: false,
      msg: 'Server Error'
    });
  }
};

// @desc    Delete customer profile
// @route   DELETE /api/customer
// @access  Private
exports.deleteCustomerProfile = async (req, res) => {
  try {
    await Customer.findByIdAndDelete({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      msg: 'Customer profile deleted'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server Error'
    });
  }
};
// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
exports.getAllCustomers = async (req, res) => {
  try {
    // Add pagination, filtering, and sorting as needed
    const customers = await Customer.find()
      .populate('user', ['email']) // Include basic user info if needed
      .select('-__v'); // Exclude version key

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server Error'
    });
  }
};

