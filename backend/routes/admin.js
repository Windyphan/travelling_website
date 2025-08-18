const express = require('express');
const router = express.Router();
const { adminAuth, editorAuth } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  getAllToursAdmin,
  getAllReviews,
  updateReviewStatus
} = require('../controllers/adminController');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', adminAuth, getDashboardStats);

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Private (Admin only)
router.get('/bookings', adminAuth, getAllBookings);

// @route   PUT /api/admin/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin only)
router.put('/bookings/:id/status', adminAuth, updateBookingStatus);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminAuth, getAllUsers);

// @route   GET /api/admin/tours
// @desc    Get all tours for admin
// @access  Private (Editor or Admin)
router.get('/tours', editorAuth, getAllToursAdmin);

// @route   GET /api/admin/reviews
// @desc    Get all reviews
// @access  Private (Editor or Admin)
router.get('/reviews', editorAuth, getAllReviews);

// @route   PUT /api/admin/reviews/:id
// @desc    Update review status
// @access  Private (Editor or Admin)
router.put('/reviews/:id', editorAuth, updateReviewStatus);

module.exports = router;
