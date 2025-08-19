const { v4: uuidv4 } = require('uuid');
const { dbHelpers } = require('../config/database');

class Booking {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.user_id = data.user_id;
    this.tour_id = data.tour_id;
    this.booking_date = data.booking_date;
    this.participants = data.participants;
    this.total_amount = data.total_amount;
    this.status = data.status || 'pending';
    this.payment_status = data.payment_status || 'pending';
    this.payment_intent_id = data.payment_intent_id;
    this.special_requests = data.special_requests;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Save booking to database
  async save(db) {
    const bookingData = {
      id: this.id,
      user_id: this.user_id,
      tour_id: this.tour_id,
      booking_date: this.booking_date,
      participants: this.participants,
      total_amount: this.total_amount,
      status: this.status,
      payment_status: this.payment_status,
      payment_intent_id: this.payment_intent_id,
      special_requests: this.special_requests
    };

    return await dbHelpers.insert(db, 'bookings', bookingData);
  }

  // Find booking by ID
  static async findById(db, id) {
    const bookings = await dbHelpers.query(db, 'SELECT * FROM bookings WHERE id = ?', [id]);
    return bookings.length > 0 ? new Booking(bookings[0]) : null;
  }

  // Find bookings by user ID
  static async findByUserId(db, userId) {
    const bookings = await dbHelpers.query(
      db,
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return bookings.map(booking => new Booking(booking));
  }

  // Get all bookings with pagination
  static async findAll(db, options = {}) {
    const { limit = 50, offset = 0, status, payment_status } = options;

    let sql = 'SELECT * FROM bookings';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (payment_status) {
      conditions.push('payment_status = ?');
      params.push(payment_status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const bookings = await dbHelpers.query(db, sql, params);
    return bookings.map(booking => new Booking(booking));
  }

  // Update booking
  async update(db, updateData) {
    return await dbHelpers.update(db, 'bookings', updateData, 'id = ?', [this.id]);
  }

  // Delete booking
  async delete(db) {
    return await dbHelpers.delete(db, 'bookings', 'id = ?', [this.id]);
  }

  // Get booking statistics
  static async getStats(db) {
    const totalBookings = await dbHelpers.query(db, 'SELECT COUNT(*) as count FROM bookings');
    const bookingsByStatus = await dbHelpers.query(db, 'SELECT status, COUNT(*) as count FROM bookings GROUP BY status');
    const totalRevenue = await dbHelpers.query(db, 'SELECT SUM(total_amount) as total FROM bookings WHERE payment_status = ?', ['completed']);

    return {
      total: totalBookings[0].count,
      byStatus: bookingsByStatus,
      totalRevenue: totalRevenue[0].total || 0
    };
  }
}

module.exports = Booking;
