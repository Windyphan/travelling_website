const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  createVNPayPayment,
  handleWebhook
} = require('../controllers/paymentController');

// @route   POST /api/payments/create-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-intent', requireAuth, createPaymentIntent);

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', requireAuth, confirmPayment);

// @route   POST /api/payments/vnpay
// @desc    Create VNPay payment
// @access  Private
router.post('/vnpay', requireAuth, createVNPayPayment);

// @route   POST /api/payments/webhook
// @desc    Handle payment webhooks
// @access  Public
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router;
