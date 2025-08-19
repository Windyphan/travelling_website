const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { dbHelpers } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.email = data.email?.toLowerCase();
    this.password = data.password;
    this.phone = data.phone;
    this.role = data.role || 'admin'; // Only admin users now
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Save admin user to database
  async save(db) {
    await this.hashPassword();
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };

    const result = await dbHelpers.insert(db, 'users', userData);
    if (result && result.meta && result.meta.last_row_id) {
      this.id = result.meta.last_row_id;
    }
    return result;
  }

  // Find user by email (admin only)
  static async findByEmail(db, email) {
    const users = await dbHelpers.query(db, 'SELECT * FROM users WHERE email = ? AND role = ?', [email.toLowerCase(), 'admin']);
    return users.length > 0 ? new User(users[0]) : null;
  }

  // Find user by ID (admin only)
  static async findById(db, id) {
    const users = await dbHelpers.query(db, 'SELECT * FROM users WHERE id = ? AND role = ?', [id, 'admin']);
    return users.length > 0 ? new User(users[0]) : null;
  }

  // Get all admin users
  static async findAll(db, options = {}) {
    const { limit = 50, offset = 0 } = options;
    const sql = 'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const users = await dbHelpers.query(db, sql, ['admin', limit, offset]);
    return users.map(user => new User(user));
  }

  // Update admin user
  async update(db, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }
    updateData.updated_at = new Date().toISOString();
    return await dbHelpers.update(db, 'users', updateData, 'id = ?', [this.id]);
  }

  // Delete admin user
  async delete(db) {
    return await dbHelpers.delete(db, 'users', 'id = ?', [this.id]);
  }

  // Convert to JSON (without password)
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
