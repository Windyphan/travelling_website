const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const Review = require('../models/Review');
const Content = require('../models/Content');

// Dashboard analytics
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total counts
    const totalBookings = await Booking.countDocuments();
    const totalTours = await Tour.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalRevenue = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    // Recent stats
    const weeklyBookings = await Booking.countDocuments({
      createdAt: { $gte: lastWeek }
    });
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          'payment.status': 'paid',
          'payment.paymentDate': { $gte: lastMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('tour', 'title')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Popular tours
    const popularTours = await Tour.aggregate([
      { $match: { status: 'published' } },
      { $sort: { 'ratings.average': -1, 'ratings.count': -1 } },
      { $limit: 5 },
      { $project: { title: 1, 'ratings.average': 1, 'ratings.count': 1 } }
    ]);

    res.json({
      stats: {
        totalBookings,
        totalTours,
        totalCustomers,
        totalRevenue: totalRevenue[0]?.total || 0,
        weeklyBookings,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      },
      recentBookings,
      popularTours
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// Get all bookings for admin
const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate,
      search
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter['payment.status'] = paymentStatus;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (search) {
      filter.$or = [
        { bookingNumber: new RegExp(search, 'i') },
        { 'customer.name': new RegExp(search, 'i') },
        { 'customer.email': new RegExp(search, 'i') }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('tour', 'title destination duration')
      .populate('customer', 'name email phone')
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
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    if (notes) {
      booking.notes.push({
        content: notes,
        author: req.user.id
      });
    }

    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('bookingHistory', 'bookingNumber status pricing.totalAmount')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get all tours for admin
const getAllToursAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { destination: new RegExp(search, 'i') }
      ];
    }

    const tours = await Tour.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tour.countDocuments(filter);

    res.json({
      tours,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalTours: total
      }
    });
  } catch (error) {
    console.error('Get all tours admin error:', error);
    res.status(500).json({ message: 'Server error fetching tours' });
  }
};

// Get all reviews for admin
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, rating } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (rating) filter.rating = Number(rating);

    const reviews = await Review.find(filter)
      .populate('tour', 'title')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// Update review status
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, featured } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { status, featured },
      { new: true }
    ).populate('tour', 'title').populate('customer', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ message: 'Server error updating review' });
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  getAllToursAdmin,
  getAllReviews,
  updateReviewStatus
};
