// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role: 'customer' | 'admin' | 'editor';
  avatar?: string;
  isVerified: boolean;
  preferences: {
    language: 'en' | 'vi';
    currency: string;
    newsletter: boolean;
  };
  bookingHistory: string[];
  createdAt: string;
  updatedAt: string;
}

// Tour types
export interface Tour {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  destination: string;
  duration: {
    days: number;
    nights: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    priceType: 'per_person' | 'per_group';
    seasonalPricing: SeasonalPricing[];
    groupDiscounts: GroupDiscount[];
  };
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  images: TourImage[];
  videos: TourVideo[];
  category: 'adventure' | 'luxury' | 'family' | 'cultural' | 'beach' | 'city' | 'nature';
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  maxGroupSize: number;
  minAge: number;
  availability: TourAvailability[];
  location: {
    coordinates: [number, number];
    address: string;
    city: string;
    country: string;
  };
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface SeasonalPricing {
  season: string;
  startDate: string;
  endDate: string;
  multiplier: number;
}

export interface GroupDiscount {
  minPeople: number;
  discount: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

export interface TourImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface TourVideo {
  url: string;
  title: string;
}

export interface TourAvailability {
  startDate: string;
  endDate: string;
  availableSpots: number;
  bookedSpots: number;
}

// Booking types
export interface Booking {
  _id: string;
  bookingNumber: string;
  tour: Tour;
  customer: User;
  travelers: Traveler[];
  bookingDetails: {
    startDate: string;
    endDate: string;
    numberOfTravelers: {
      adults: number;
      children: number;
      infants: number;
    };
    totalTravelers: number;
  };
  pricing: {
    basePrice: number;
    seasonalMultiplier?: number;
    groupDiscount?: number;
    addOns: AddOn[];
    subtotal: number;
    taxes: number;
    totalAmount: number;
    currency: string;
  };
  payment: {
    status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
    method?: 'credit_card' | 'bank_transfer' | 'vnpay' | 'momo';
    transactionId?: string;
    paidAmount: number;
    paymentDate?: string;
    refundAmount: number;
    refundDate?: string;
  };
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  specialRequests?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: BookingDocument[];
  notifications: {
    confirmationSent: boolean;
    reminderSent: boolean;
    followUpSent: boolean;
  };
  createdBy?: string;
  notes: BookingNote[];
  createdAt: string;
  updatedAt: string;
}

export interface Traveler {
  name: string;
  age?: number;
  type: 'adult' | 'child' | 'infant';
  passportNumber?: string;
  nationality?: string;
  dietaryRequirements?: string;
}

export interface AddOn {
  name: string;
  price: number;
  quantity: number;
}

export interface BookingDocument {
  type: string;
  url: string;
  uploadDate: string;
}

export interface BookingNote {
  content: string;
  author: string;
  createdAt: string;
}

// Review types
export interface Review {
  _id: string;
  tour: string | Tour;
  customer: string | User;
  booking: string | Booking;
  rating: number;
  title: string;
  content: string;
  aspects: {
    guide?: number;
    accommodation?: number;
    transport?: number;
    value?: number;
  };
  photos: string[];
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

// Content types
export interface Content {
  _id: string;
  type: 'page' | 'blog' | 'destination' | 'faq';
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  gallery: string[];
  author: string | User;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  categories: string[];
  tags: string[];
  language: 'en' | 'vi';
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message: string;
  success: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    totalTours?: number;
    totalBookings?: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

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

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  country?: string;
}

export interface BookingForm {
  tourId: string;
  startDate: string;
  numberOfTravelers: {
    adults: number;
    children: number;
    infants: number;
  };
  travelers: Traveler[];
  specialRequests?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Filter types
export interface TourFilters {
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}
