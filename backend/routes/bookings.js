const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking
} = require('../controllers/bookingController');

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', auth, createBooking);

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, getUserBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, getBooking);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, cancelBooking);

module.exports = router;
