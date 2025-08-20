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
    console.log('🔍 Admin login attempt:', {
      body: req.body,
      email: req.body?.email,
      passwordLength: req.body?.password?.length
    });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log('🔍 Looking for admin user with email:', email);

    // Check if admin user exists
    const admin = await User.findByEmail(email);

    console.log('🔍 Admin user found:', {
      found: !!admin,
      adminId: admin?.id,
      adminRole: admin?.role,
      adminEmail: admin?.email,
      hasPassword: !!admin?.password
    });

    if (!admin || admin.role !== 'admin') {
      console.log('❌ Admin user not found or invalid role');
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    console.log('🔍 Comparing passwords...');
    console.log('Input password length:', password.length);
    console.log('Stored password hash length:', admin.password?.length);
    console.log('Stored hash starts with:', admin.password?.substring(0, 10));

    // Verify password
    const isValidPassword = await admin.comparePassword(password);
    console.log('🔍 Password comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Password validation failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    console.log('✅ Authentication successful');

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
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

module.exports = {
  adminLogin
};
