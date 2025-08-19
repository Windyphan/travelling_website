const { v4: uuidv4 } = require('uuid');
const { dbHelpers } = require('../config/database');

class Review {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.user_id = data.user_id;
    this.tour_id = data.tour_id;
    this.rating = data.rating;
    this.comment = data.comment;
    this.created_at = data.created_at;
  }

  // Save review to database
  async save(db) {
    const reviewData = {
      id: this.id,
      user_id: this.user_id,
      tour_id: this.tour_id,
      rating: this.rating,
      comment: this.comment
    };

    return await dbHelpers.insert(db, 'reviews', reviewData);
  }

  // Find review by ID
  static async findById(db, id) {
    const reviews = await dbHelpers.query(db, 'SELECT * FROM reviews WHERE id = ?', [id]);
    return reviews.length > 0 ? new Review(reviews[0]) : null;
  }

  // Find reviews by tour ID
  static async findByTourId(db, tourId, limit = 10, offset = 0) {
    const reviews = await dbHelpers.query(
      db,
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.tour_id = ? 
       ORDER BY r.created_at DESC 
       LIMIT ? OFFSET ?`,
      [tourId, limit, offset]
    );
    return reviews.map(review => new Review(review));
  }

  // Find reviews by user ID
  static async findByUserId(db, userId) {
    const reviews = await dbHelpers.query(
      db,
      `SELECT r.*, t.title as tour_title 
       FROM reviews r 
       JOIN tours t ON r.tour_id = t.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return reviews.map(review => new Review(review));
  }

  // Get all reviews with pagination
  static async findAll(db, limit = 50, offset = 0) {
    const reviews = await dbHelpers.query(
      db,
      `SELECT r.*, u.name as user_name, t.title as tour_title 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       JOIN tours t ON r.tour_id = t.id 
       ORDER BY r.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return reviews.map(review => new Review(review));
  }

  // Get average rating for a tour
  static async getAverageRating(db, tourId) {
    const result = await dbHelpers.query(
      db,
      'SELECT AVG(rating) as average, COUNT(*) as count FROM reviews WHERE tour_id = ?',
      [tourId]
    );
    return {
      average: result[0].average || 0,
      count: result[0].count || 0
    };
  }

  // Update review
  async update(db, updateData) {
    return await dbHelpers.update(db, 'reviews', updateData, 'id = ?', [this.id]);
  }

  // Delete review
  async delete(db) {
    return await dbHelpers.delete(db, 'reviews', 'id = ?', [this.id]);
  }
}

module.exports = Review;
