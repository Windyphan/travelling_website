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
    this.address = data.address;
    this.role = data.role || 'user';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
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

  // Save user to database
  async save(db) {
    await this.hashPassword();
    const userData = {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
      role: this.role
    };

    return await dbHelpers.insert(db, 'users', userData);
  }

  // Find user by email
  static async findByEmail(db, email) {
    const users = await dbHelpers.query(db, 'SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    return users.length > 0 ? new User(users[0]) : null;
  }

  // Find user by ID
  static async findById(db, id) {
    const users = await dbHelpers.query(db, 'SELECT * FROM users WHERE id = ?', [id]);
    return users.length > 0 ? new User(users[0]) : null;
  }

  // Get all users (admin only)
  static async findAll(db, limit = 50, offset = 0) {
    const users = await dbHelpers.query(
      db,
      'SELECT id, name, email, phone, address, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return users.map(user => new User(user));
  }

  // Update user
  async update(db, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    return await dbHelpers.update(db, 'users', updateData, 'id = ?', [this.id]);
  }

  // Delete user
  async delete(db) {
    return await dbHelpers.delete(db, 'users', 'id = ?', [this.id]);
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
