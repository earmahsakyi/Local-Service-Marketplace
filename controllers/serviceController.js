const { validationResult } = require('express-validator');
const Service = require('../models/Service');
const { recordActivity } = require('../utils/activityHelper'); // Correct path

// CREATE SERVICE (should be as previously implemented and correct)
exports.createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, price, category, isActive } = req.body; // isActive added
  try {
    const providerId = req.user.id;
    const newService = new Service({
      providerId,
      name,
      description,
      price,
      category,
      isActive // Include isActive if provided, otherwise it defaults
    });
    const service = await newService.save();
    await recordActivity(
      req.user.id,
      'SERVICE_CREATED',
      `New service '${service.name}' was created.`,
      service._id,
      'Service'
    );
    res.status(201).json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// GET PROVIDER SERVICES (should be as previously implemented and correct)
exports.getProviderServices = async (req, res) => {
  try {
    const providerId = req.user.id;
    const services = await Service.find({ providerId }).sort({ createdAt: -1 });
    res.json(services); // No 404 for empty array, client handles empty list
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// GET SERVICE BY ID (should be as previously implemented and correct)
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized to access this service' });
    }
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};

// UPDATE SERVICE (ensure actual DB operation and correct activity recording)
exports.updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, price, category, isActive } = req.body;
  const serviceFields = {};
  if (name !== undefined) serviceFields.name = name;
  if (description !== undefined) serviceFields.description = description;
  if (price !== undefined) serviceFields.price = price;
  if (category !== undefined) serviceFields.category = category;
  if (isActive !== undefined) serviceFields.isActive = isActive;

  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized to update this service' });
    }

    // Perform the actual update
    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: serviceFields },
      { new: true, runValidators: true }
    );

    await recordActivity(
      req.user.id,
      'SERVICE_UPDATED',
      `Service '${service.name}' was updated.`, // service.name here is the new name
      service._id,
      'Service'
    );
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};

// DELETE SERVICE (ensure actual DB operation and correct activity recording)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized to delete this service' });
    }

    const serviceName = service.name;
    const serviceId = service._id;

    // Perform the actual delete
    await Service.findByIdAndDelete(req.params.id); // Or service.remove() if you prefer the instance method

    await recordActivity(
      req.user.id,
      'SERVICE_DELETED',
      `Service '${serviceName}' was deleted.`,
      serviceId,
      'Service'
    );
    res.json({ msg: 'Service removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};
