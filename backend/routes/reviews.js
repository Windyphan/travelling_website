const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Review = require('../models/Review');
const Tour = require('../models/Tour');

// Get reviews for a tour
const getReviews = async (req, res) => {
  try {
    const { tourId } = req.query;
    const { page = 1, limit = 10 } = req.query;

    const filter = { status: 'approved' };
    if (tourId) filter.tour = tourId;

    const reviews = await Review.find(filter)
      .populate('customer', 'name')
      .populate('tour', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.json({
      data: reviews,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// Create new review
const createReview = async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      customer: req.user.id
    };

    const review = new Review(reviewData);
    await review.save();

    // Update tour rating
    const tour = await Tour.findById(reviewData.tour);
    if (tour) {
      const reviews = await Review.find({ tour: reviewData.tour, status: 'approved' });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      tour.ratings.average = avgRating;
      tour.ratings.count = reviews.length;
      await tour.save();
    }

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
};

// @route   GET /api/reviews
// @desc    Get reviews
// @access  Public
router.get('/', getReviews);

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', requireAuth, createReview);

module.exports = router;
