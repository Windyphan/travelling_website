const Tour = require('../models/Tour');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tours');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all tours with filtering and pagination
const getTours = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      destination,
      category,
      minPrice,
      maxPrice,
      duration,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'published' };

    if (destination) filter.destination = new RegExp(destination, 'i');
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter['pricing.basePrice'] = {};
      if (minPrice) filter['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.basePrice'].$lte = Number(maxPrice);
    }
    if (duration) {
      filter['duration.days'] = Number(duration);
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { destination: new RegExp(search, 'i') }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tours = await Tour.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Tour.countDocuments(filter);

    res.json({
      tours,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalTours: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ message: 'Server error fetching tours' });
  }
};

// Get featured tours
const getFeaturedTours = async (req, res) => {
  try {
    const tours = await Tour.find({
      status: 'published',
      featured: true
    })
    .sort({ 'ratings.average': -1 })
    .limit(4)
    .select('title shortDescription images pricing duration destination ratings');

    res.json({ tours });
  } catch (error) {
    console.error('Get featured tours error:', error);
    res.status(500).json({ message: 'Server error fetching featured tours' });
  }
};

// Get single tour by slug
const getTourBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const tour = await Tour.findOne({ slug, status: 'published' });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({ tour });
  } catch (error) {
    console.error('Get tour by slug error:', error);
    res.status(500).json({ message: 'Server error fetching tour' });
  }
};

// Create new tour (Admin only)
const createTour = async (req, res) => {
  try {
    const tourData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Parse JSON fields if they come as strings
    if (typeof tourData.itinerary === 'string') {
      tourData.itinerary = JSON.parse(tourData.itinerary);
    }
    if (typeof tourData.pricing === 'string') {
      tourData.pricing = JSON.parse(tourData.pricing);
    }

    const tour = new Tour(tourData);
    await tour.save();

    res.status(201).json({
      message: 'Tour created successfully',
      tour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ message: 'Server error creating tour' });
  }
};

// Update tour (Admin only)
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({
      message: 'Tour updated successfully',
      tour
    });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({ message: 'Server error updating tour' });
  }
};

// Delete tour (Admin only)
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({ message: 'Server error deleting tour' });
  }
};

// Check tour availability
const checkAvailability = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { startDate, groupSize = 1 } = req.query;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const isAvailable = tour.checkAvailability(new Date(startDate), Number(groupSize));
    const price = tour.calculatePrice(new Date(startDate), Number(groupSize));

    res.json({
      available: isAvailable,
      price,
      currency: tour.pricing.currency
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Server error checking availability' });
  }
};

module.exports = {
  getTours,
  getFeaturedTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
  checkAvailability,
  upload
};
