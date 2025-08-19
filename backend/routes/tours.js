const express = require('express');
const router = express.Router();
const { requireAuth, adminAuth } = require('../middleware/auth');
const {
  getTours,
  getFeaturedTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
  checkAvailability,
  upload
} = require('../controllers/tourController');

// @route   GET /api/tours
// @desc    Get all tours with filtering and pagination
// @access  Public
router.get('/', getTours);

// @route   GET /api/tours/featured
// @desc    Get featured tours
// @access  Public
router.get('/featured', getFeaturedTours);

// @route   GET /api/tours/:slug
// @desc    Get single tour by slug
// @access  Public
router.get('/:slug', getTourBySlug);

// @route   GET /api/tours/:tourId/availability
// @desc    Check tour availability and pricing
// @access  Public
router.get('/:tourId/availability', checkAvailability);

// @route   POST /api/tours
// @desc    Create new tour
// @access  Private (Admin only)
router.post('/', adminAuth, upload.array('images', 10), createTour);

// @route   PUT /api/tours/:id
// @desc    Update tour
// @access  Private (Admin only)
router.put('/:id', adminAuth, updateTour);

// @route   DELETE /api/tours/:id
// @desc    Delete tour
// @access  Private (Admin only)
router.delete('/:id', adminAuth, deleteTour);

module.exports = router;
