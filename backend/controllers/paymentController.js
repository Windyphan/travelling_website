const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// Create Stripe payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.id
    }).populate('tour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.payment.status === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.pricing.totalAmount * 100), // Convert to cents
      currency: booking.pricing.currency.toLowerCase(),
      metadata: {
        bookingId: booking._id.toString(),
        tourTitle: booking.tour.title,
        customerEmail: req.user.email
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.pricing.totalAmount,
      currency: booking.pricing.currency
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// Confirm payment
const confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId, paymentMethod } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      booking.payment.status = 'paid';
      booking.payment.method = paymentMethod;
      booking.payment.transactionId = paymentIntentId;
      booking.payment.paidAmount = booking.pricing.totalAmount;
      booking.payment.paymentDate = new Date();
      booking.status = 'confirmed';

      await booking.save();

      res.json({
        message: 'Payment confirmed successfully',
        booking
      });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
};

// Handle VNPay payment (Vietnamese payment gateway)
const createVNPayPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // VNPay integration would go here
    // This is a simplified version - you'll need to implement the actual VNPay API
    const vnpayData = {
      vnp_Amount: booking.pricing.totalAmount * 100,
      vnp_Command: 'pay',
      vnp_CreateDate: new Date().toISOString().replace(/[-T:\.Z]/g, ''),
      vnp_CurrCode: 'VND',
      vnp_IpAddr: req.ip,
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Payment for booking ${booking.bookingNumber}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: `${process.env.CLIENT_URL}/payment/vnpay/return`,
      vnp_TmnCode: process.env.VNPAY_TMN_CODE,
      vnp_TxnRef: booking.bookingNumber,
      vnp_Version: '2.1.0'
    };

    // Generate VNPay URL (simplified)
    const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`;

    res.json({
      paymentUrl: vnpayUrl,
      vnpayData
    });
  } catch (error) {
    console.error('VNPay payment error:', error);
    res.status(500).json({ message: 'Error creating VNPay payment' });
  }
};

// Handle payment webhook (for automatic payment confirmation)
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;

      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.payment.status = 'paid';
        booking.payment.transactionId = paymentIntent.id;
        booking.payment.paidAmount = paymentIntent.amount / 100;
        booking.payment.paymentDate = new Date();
        booking.status = 'confirmed';
        await booking.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook error' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createVNPayPayment,
  handleWebhook
};
