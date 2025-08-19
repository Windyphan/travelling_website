const Tour = require('../models/Tour');
const { r2Helpers } = require('../config/storage');

// Get all tours with filtering and pagination
const getTours = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      location,
      difficulty_level,
      minPrice,
      maxPrice,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      location,
      difficulty_level
    };

    let tours;
    if (search) {
      tours = await Tour.search(req.db, search);
    } else {
      tours = await Tour.findAll(req.db, options);
    }

    // Filter by price if specified
    if (minPrice || maxPrice) {
      tours = tours.filter(tour => {
        const price = tour.price;
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: tours.map(tour => tour.toJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(tours.length / limit),
        hasNext: page * limit < tours.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tours'
    });
  }
};

// Get single tour by ID
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.db, req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour.toJSON()
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tour'
    });
  }
};

// Create new tour (admin only)
const createTour = async (req, res) => {
  try {
    const tourData = req.body;
    const tour = new Tour(tourData);

    // Handle image uploads if provided
    if (req.files && req.files.length > 0) {
      const imageUrls = await tour.updateImages(req.r2, req.files);
      tour.images = imageUrls;
      if (imageUrls.length > 0) {
        tour.image_url = imageUrls[0];
      }
    }

    await tour.save(req.db);

    res.status(201).json({
      success: true,
      data: tour.toJSON(),
      message: 'Tour created successfully'
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating tour'
    });
  }
};

// Update tour (admin only)
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.db, req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    const updateData = req.body;

    // Handle image uploads if provided
    if (req.files && req.files.length > 0) {
      const oldImages = tour.images || [];
      const imageUrls = await tour.updateImages(req.r2, req.files, oldImages);
      updateData.images = imageUrls;
      if (imageUrls.length > 0) {
        updateData.image_url = imageUrls[0];
      }
    }

    await tour.update(req.db, updateData);

    res.json({
      success: true,
      message: 'Tour updated successfully'
    });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tour'
    });
  }
};

// Delete tour (admin only)
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.db, req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    await tour.delete(req.db, req.r2);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tour'
    });
  }
};

// Get tour statistics (admin only)
const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.getStats(req.db);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get tour stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tour statistics'
    });
  }
};

module.exports = {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats
};
