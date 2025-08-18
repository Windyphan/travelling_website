import axios, { AxiosResponse } from 'axios';
import {
  User,
  Tour,
  Booking,
  Review,
  Content,
  LoginForm,
  RegisterForm,
  BookingForm,
  TourFilters,
  ApiResponse,
  PaginationResponse
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginForm): Promise<AxiosResponse<{ token: string; user: User }>> => {
    return api.post('/auth/login', data);
  },

  register: async (data: RegisterForm): Promise<AxiosResponse<{ token: string; user: User }>> => {
    return api.post('/auth/register', data);
  },

  getProfile: async (): Promise<AxiosResponse<{ user: User }>> => {
    return api.get('/auth/profile');
  },

  updateProfile: async (data: Partial<User>): Promise<AxiosResponse<{ user: User }>> => {
    return api.put('/auth/profile', data);
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.put('/auth/change-password', data);
  },
};

// Tours API
export const toursAPI = {
  getTours: async (filters?: TourFilters): Promise<AxiosResponse<PaginationResponse<Tour>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/tours?${params.toString()}`);
  },

  getFeaturedTours: async (): Promise<AxiosResponse<{ tours: Tour[] }>> => {
    return api.get('/tours/featured');
  },

  getTourBySlug: async (slug: string): Promise<AxiosResponse<{ tour: Tour }>> => {
    return api.get(`/tours/${slug}`);
  },

  checkAvailability: async (tourId: string, startDate: string, groupSize: number): Promise<AxiosResponse<{ available: boolean; price: number; currency: string }>> => {
    return api.get(`/tours/${tourId}/availability?startDate=${startDate}&groupSize=${groupSize}`);
  },

  createTour: async (data: FormData): Promise<AxiosResponse<{ tour: Tour }>> => {
    return api.post('/tours', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateTour: async (id: string, data: Partial<Tour>): Promise<AxiosResponse<{ tour: Tour }>> => {
    return api.put(`/tours/${id}`, data);
  },

  deleteTour: async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.delete(`/tours/${id}`);
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (data: BookingForm): Promise<AxiosResponse<{ booking: Booking }>> => {
    return api.post('/bookings', data);
  },

  getUserBookings: async (page = 1, status?: string): Promise<AxiosResponse<PaginationResponse<Booking>>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (status) params.append('status', status);
    return api.get(`/bookings?${params.toString()}`);
  },

  getBooking: async (id: string): Promise<AxiosResponse<{ booking: Booking }>> => {
    return api.get(`/bookings/${id}`);
  },

  cancelBooking: async (id: string, reason: string): Promise<AxiosResponse<{ booking: Booking }>> => {
    return api.put(`/bookings/${id}/cancel`, { reason });
  },
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: async (bookingId: string): Promise<AxiosResponse<{ clientSecret: string; amount: number; currency: string }>> => {
    return api.post('/payments/create-intent', { bookingId });
  },

  confirmPayment: async (data: { bookingId: string; paymentIntentId: string; paymentMethod: string }): Promise<AxiosResponse<{ booking: Booking }>> => {
    return api.post('/payments/confirm', data);
  },

  createVNPayPayment: async (bookingId: string): Promise<AxiosResponse<{ paymentUrl: string; vnpayData: any }>> => {
    return api.post('/payments/vnpay', { bookingId });
  },
};

// Reviews API
export const reviewsAPI = {
  getReviews: async (tourId?: string, page = 1): Promise<AxiosResponse<PaginationResponse<Review>>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (tourId) params.append('tourId', tourId);
    return api.get(`/reviews?${params.toString()}`);
  },

  createReview: async (data: Partial<Review>): Promise<AxiosResponse<{ review: Review }>> => {
    return api.post('/reviews', data);
  },

  updateReview: async (id: string, data: Partial<Review>): Promise<AxiosResponse<{ review: Review }>> => {
    return api.put(`/reviews/${id}`, data);
  },

  deleteReview: async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.delete(`/reviews/${id}`);
  },
};

// Content API
export const contentAPI = {
  getContent: async (type?: string, page = 1): Promise<AxiosResponse<PaginationResponse<Content>>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (type) params.append('type', type);
    return api.get(`/content?${params.toString()}`);
  },

  getContentBySlug: async (slug: string): Promise<AxiosResponse<{ content: Content }>> => {
    return api.get(`/content/${slug}`);
  },

  createContent: async (data: Partial<Content>): Promise<AxiosResponse<{ content: Content }>> => {
    return api.post('/content', data);
  },

  updateContent: async (id: string, data: Partial<Content>): Promise<AxiosResponse<{ content: Content }>> => {
    return api.put(`/content/${id}`, data);
  },

  deleteContent: async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.delete(`/content/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (): Promise<AxiosResponse<any>> => {
    return api.get('/admin/dashboard');
  },

  getAllBookings: async (page = 1, filters?: any): Promise<AxiosResponse<PaginationResponse<Booking>>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/admin/bookings?${params.toString()}`);
  },

  updateBookingStatus: async (id: string, status: string, notes?: string): Promise<AxiosResponse<{ booking: Booking }>> => {
    return api.put(`/admin/bookings/${id}/status`, { status, notes });
  },

  getAllUsers: async (page = 1, filters?: any): Promise<AxiosResponse<PaginationResponse<User>>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/admin/users?${params.toString()}`);
  },

  getAllToursAdmin: async (page = 1, filters?: any): Promise<AxiosResponse<PaginationResponse<Tour>>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/admin/tours?${params.toString()}`);
  },

  getAllReviews: async (page = 1, filters?: any): Promise<AxiosResponse<PaginationResponse<Review>>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/admin/reviews?${params.toString()}`);
  },

  updateReviewStatus: async (id: string, status: string, featured?: boolean): Promise<AxiosResponse<{ review: Review }>> => {
    return api.put(`/admin/reviews/${id}`, { status, featured });
  },
};

// Fixed API response for tours specifically
export interface ToursResponse {
  tours: Tour[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTours: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default api;
