const bcrypt = require('bcryptjs');
const { query, get, all, run } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id; // Use database auto-increment ID
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
  async save() {
    await this.hashPassword();
    const sql = `
      INSERT INTO users (name, email, password, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      this.name, this.email, this.password,
      this.phone, this.role, this.created_at, this.updated_at
    ];

    const result = await run(sql, params);
    this.id = result.meta.last_row_id; // Set the auto-generated ID
    return result;
  }

  // Find user by email (admin only)
  static async findByEmail(email) {
    try {
      console.log('🔍 Database query - Finding user by email:', email.toLowerCase());
      const user = await get('SELECT * FROM users WHERE email = ? AND role = ?', [email.toLowerCase(), 'admin']);
      console.log('🔍 Database result:', {
        found: !!user,
        userEmail: user?.email,
        userRole: user?.role,
        userId: user?.id,
        passwordHashExists: !!user?.password,
        passwordHashLength: user?.password?.length
      });
      return user ? new User(user) : null;
    } catch (error) {
      console.error('❌ Database error in findByEmail:', error);
      return null;
    }
  }

  // Find user by ID (admin only)
  static async findById(id) {
    const user = await get('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'admin']);
    return user ? new User(user) : null;
  }

  // Get all admin users
  static async findAll(options = {}) {
    const { limit = 50, offset = 0 } = options;
    const sql = 'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const users = await all(sql, ['admin', limit, offset]);
    return users.map(user => new User(user));
  }

  // Update admin user
  async update(updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }
    updateData.updated_at = new Date().toISOString();

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    const sql = `UPDATE users SET ${fields} WHERE id = ?`;

    return await run(sql, [...values, this.id]);
  }

  // Delete admin user
  async delete() {
    return await run('DELETE FROM users WHERE id = ?', [this.id]);
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
