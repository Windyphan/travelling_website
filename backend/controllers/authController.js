import { getDB, executeQuery, getRecord, getRecords } from '../config/database.js';

// Simple hash function for passwords (in production, use a proper crypto library)
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Generate JWT Token
const generateToken = async (userId) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
  };

  const encoder = new TextEncoder();
  const headerEncoded = btoa(JSON.stringify(header));
  const payloadEncoded = btoa(JSON.stringify(payload));

  const data = encoder.encode(`${headerEncoded}.${payloadEncoded}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(process.env.JWT_SECRET || 'fallback_secret'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureEncoded = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
};

// @desc    Register user
const register = async (request, env) => {
  try {
    const { name, email, password } = await request.json();
    const db = getDB(env);

    // Check if user exists
    const existingUser = await getRecord(db,
      'SELECT id FROM users WHERE email = ?', [email]
    );

    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await executeQuery(db,
      'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, new Date().toISOString(), new Date().toISOString()]
    );

    const token = await generateToken(result.meta.last_row_id);

    return new Response(JSON.stringify({
      id: result.meta.last_row_id,
      name,
      email,
      token,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// @desc    Authenticate user & get token
const login = async (request, env) => {
  try {
    const { email, password } = await request.json();
    const db = getDB(env);

    // Check for user
    const user = await getRecord(db,
      'SELECT * FROM users WHERE email = ?', [email]
    );

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify password
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== user.password) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = await generateToken(user.id);

    return new Response(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      token,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// @desc    Get user profile
const getProfile = async (request, env) => {
  try {
    const userId = request.userId; // Set by auth middleware
    const db = getDB(env);

    const user = await getRecord(db,
      'SELECT id, name, email, phone, address, date_of_birth, gender, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// @desc    Update user profile
const updateProfile = async (request, env) => {
  try {
    const userId = request.userId; // Set by auth middleware
    const { name, email, phone, address, dateOfBirth, gender } = await request.json();
    const db = getDB(env);

    await executeQuery(db,
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, date_of_birth = ?, gender = ?, updated_at = ? WHERE id = ?',
      [name, email, phone, address, dateOfBirth, gender, new Date().toISOString(), userId]
    );

    const updatedUser = await getRecord(db,
      'SELECT id, name, email, phone, address, date_of_birth, gender, role FROM users WHERE id = ?',
      [userId]
    );

    return new Response(JSON.stringify(updatedUser), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// @desc    Change password
const changePassword = async (request, env) => {
  try {
    const userId = request.userId; // Set by auth middleware
    const { currentPassword, newPassword } = await request.json();
    const db = getDB(env);

    // Get current user
    const user = await getRecord(db,
      'SELECT password FROM users WHERE id = ?', [userId]
    );

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify current password
    const hashedCurrentPassword = await hashPassword(currentPassword);
    if (hashedCurrentPassword !== user.password) {
      return new Response(JSON.stringify({ message: 'Current password is incorrect' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash new password and update
    const hashedNewPassword = await hashPassword(newPassword);
    await executeQuery(db,
      'UPDATE users SET password = ?, updated_at = ? WHERE id = ?',
      [hashedNewPassword, new Date().toISOString(), userId]
    );

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
