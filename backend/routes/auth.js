import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

// Route handler for auth endpoints
const handle = async (request, env) => {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');
  const method = request.method;

  try {
    // Public routes
    if (path === '/register' && method === 'POST') {
      return await register(request, env);
    }

    if (path === '/login' && method === 'POST') {
      return await login(request, env);
    }

    // Protected routes - require authentication
    const authResult = await auth(request);
    if (authResult) {
      return authResult; // Return error response from auth middleware
    }

    if (path === '/profile' && method === 'GET') {
      return await getProfile(request, env);
    }

    if (path === '/profile' && method === 'PUT') {
      return await updateProfile(request, env);
    }

    if (path === '/change-password' && method === 'PUT') {
      return await changePassword(request, env);
    }

    // 404 for unmatched auth routes
    return new Response(JSON.stringify({ message: 'Auth route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      message: 'Auth request failed',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default { handle };
