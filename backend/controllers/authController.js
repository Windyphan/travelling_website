const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token for admin
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );
};

// @desc    Admin login only
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin user exists
    const admin = await User.findByEmail(req.db, email);

    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Verify password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate token
    const token = generateToken(admin.id, admin.role);

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

module.exports = {
  adminLogin
};
