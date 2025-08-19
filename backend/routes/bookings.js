const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const {
  createDirectBooking,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

// @route   POST /api/bookings
// @desc    Create new direct booking (no user authentication required)
// @access  Public
router.post('/', createDirectBooking);

// @route   GET /api/bookings
// @desc    Get all bookings (admin only)
// @access  Private (Admin)
router.get('/', adminAuth, getAllBookings);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (admin only)
// @access  Private (Admin)
router.put('/:id/status', adminAuth, updateBookingStatus);

module.exports = router;
