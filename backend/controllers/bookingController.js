const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Create email transporter
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send booking confirmation email
const sendConfirmationEmail = async (booking, customer, tour) => {
  try {
    const transporter = createEmailTransporter();
    
    const emailTemplate = `
      <h2>Booking Confirmation - ${tour.title}</h2>
      <p>Dear ${customer.name},</p>
      <p>Thank you for booking with us! Your booking has been confirmed.</p>
      
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Booking Number:</strong> ${booking.bookingNumber}</li>
        <li><strong>Tour:</strong> ${tour.title}</li>
        <li><strong>Start Date:</strong> ${booking.bookingDetails.startDate.toDateString()}</li>
        <li><strong>Duration:</strong> ${tour.duration.days} days / ${tour.duration.nights} nights</li>
        <li><strong>Travelers:</strong> ${booking.bookingDetails.totalTravelers}</li>
        <li><strong>Total Amount:</strong> ${booking.pricing.currency} ${booking.pricing.totalAmount}</li>
      </ul>
      
      <p>We will contact you soon with more details about your trip.</p>
      <p>Best regards,<br>${process.env.COMPANY_NAME}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Booking Confirmation - ${booking.bookingNumber}`,
      html: emailTemplate
    });
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const {
      tourId,
      startDate,
      numberOfTravelers,
      travelers,
      specialRequests,
      emergencyContact
    } = req.body;

    // Validate tour exists and is available
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const totalTravelers = numberOfTravelers.adults + numberOfTravelers.children + numberOfTravelers.infants;
    
    // Check availability
    if (!tour.checkAvailability(new Date(startDate), totalTravelers)) {
      return res.status(400).json({ message: 'Tour not available for selected date and group size' });
    }

    // Calculate pricing
    const basePrice = tour.calculatePrice(new Date(startDate), totalTravelers);
    const subtotal = basePrice * totalTravelers;
    const taxes = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + taxes;

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + tour.duration.days - 1);

    // Create booking
    const booking = new Booking({
      tour: tourId,
      customer: req.user.id,
      travelers,
      bookingDetails: {
        startDate: new Date(startDate),
        endDate,
        numberOfTravelers,
        totalTravelers
      },
      pricing: {
        basePrice,
        subtotal,
        taxes,
        totalAmount,
        currency: tour.pricing.currency
      },
      specialRequests,
      emergencyContact
    });

    await booking.save();

    // Update tour availability
    const availability = tour.availability.find(slot => {
      const bookingDate = new Date(startDate);
      return bookingDate >= slot.startDate && bookingDate <= slot.endDate;
    });
    
    if (availability) {
      availability.bookedSpots += totalTravelers;
      await tour.save();
    }

    // Add booking to user's history
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookingHistory: booking._id } }
    );

    // Populate booking for response
    await booking.populate(['tour', 'customer']);

    // Send confirmation email
    sendConfirmationEmail(booking, req.user, tour);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { customer: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('tour', 'title images duration destination')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Get single booking
const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findOne({
      _id: id,
      customer: req.user.id
    }).populate(['tour', 'customer']);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: id,
      customer: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Check if cancellation is allowed (e.g., at least 24 hours before start date)
    const now = new Date();
    const startDate = new Date(booking.bookingDetails.startDate);
    const hoursDifference = (startDate - now) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return res.status(400).json({ 
        message: 'Cancellation not allowed less than 24 hours before start date' 
      });
    }

    booking.status = 'cancelled';
    booking.notes.push({
      content: `Booking cancelled by customer. Reason: ${reason}`,
      author: req.user.id
    });

    await booking.save();

    // Update tour availability
    const tour = await Tour.findById(booking.tour);
    const availability = tour.availability.find(slot => {
      const bookingDate = booking.bookingDetails.startDate;
      return bookingDate >= slot.startDate && bookingDate <= slot.endDate;
    });
    
    if (availability) {
      availability.bookedSpots -= booking.bookingDetails.totalTravelers;
      await tour.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking
};
