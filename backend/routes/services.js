const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// Protected routes for customers
router.post('/bookings', requireAuth, serviceController.createServiceBooking);
router.get('/bookings/my', requireAuth, serviceController.getUserServiceBookings);

// Admin routes
router.get('/admin/bookings', requireAuth, requireRole('admin'), serviceController.getAllServiceBookings);
router.patch('/admin/bookings/:id/status', requireAuth, requireRole('admin'), serviceController.updateServiceBookingStatus);

module.exports = router;
