// Cloudflare Workers compatible server
import { getDB, executeQuery, getRecord, getRecords } from './config/database.js';
import authRoutes from './routes/auth.js';
import tourRoutes from './routes/tours.js';
import serviceRoutes from './routes/services.js';
import blogRoutes from './routes/blogs.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import contentRoutes from './routes/content.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';

// Helper function to create response
const createResponse = (data, status = 200, headers = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
    },
  });
};

// Main request handler
export default {
  async fetch(request, env) {
    try {
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return createResponse({}, 200);
      }

      const url = new URL(request.url);
      const path = url.pathname;

      // Health check
      if (path === '/health') {
        return createResponse({ status: 'OK', message: 'Server is running' });
      }

      // Route handling
      if (path.startsWith('/api/auth')) {
        return authRoutes.handle(request, env);
      } else if (path.startsWith('/api/tours')) {
        return tourRoutes.handle(request, env);
      } else if (path.startsWith('/api/services')) {
        return serviceRoutes.handle(request, env);
      } else if (path.startsWith('/api/blogs')) {
        return blogRoutes.handle(request, env);
      } else if (path.startsWith('/api/bookings')) {
        return bookingRoutes.handle(request, env);
      } else if (path.startsWith('/api/reviews')) {
        return reviewRoutes.handle(request, env);
      } else if (path.startsWith('/api/content')) {
        return contentRoutes.handle(request, env);
      } else if (path.startsWith('/api/payments')) {
        return paymentRoutes.handle(request, env);
      } else if (path.startsWith('/api/admin')) {
        return adminRoutes.handle(request, env);
      }

      // 404 for unmatched routes
      return createResponse({ message: 'Route not found' }, 404);

    } catch (error) {
      console.error('Request handling error:', error);
      return createResponse({
        message: 'Internal server error',
        error: error.message
      }, 500);
    }
  },
};
