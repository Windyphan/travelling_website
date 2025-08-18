const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  destination: {
    type: String,
    required: true
  },
  duration: {
    days: {
      type: Number,
      required: true
    },
    nights: {
      type: Number,
      required: true
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    priceType: {
      type: String,
      enum: ['per_person', 'per_group'],
      default: 'per_person'
    },
    seasonalPricing: [{
      season: String,
      startDate: Date,
      endDate: Date,
      multiplier: Number
    }],
    groupDiscounts: [{
      minPeople: Number,
      discount: Number
    }]
  },
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  inclusions: [String],
  exclusions: [String],
  highlights: [String],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  videos: [{
    url: String,
    title: String
  }],
  category: {
    type: String,
    enum: ['adventure', 'luxury', 'family', 'cultural', 'beach', 'city', 'nature'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme'],
    default: 'moderate'
  },
  maxGroupSize: {
    type: Number,
    default: 20
  },
  minAge: {
    type: Number,
    default: 0
  },
  availability: [{
    startDate: Date,
    endDate: Date,
    availableSpots: Number,
    bookedSpots: { type: Number, default: 0 }
  }],
  location: {
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: String,
    city: String,
    country: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Generate slug from title
tourSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Calculate current price based on season and group size
tourSchema.methods.calculatePrice = function(date, groupSize = 1) {
  let price = this.pricing.basePrice;

  // Apply seasonal pricing
  const seasonalPrice = this.pricing.seasonalPricing.find(season => {
    return date >= season.startDate && date <= season.endDate;
  });

  if (seasonalPrice) {
    price *= seasonalPrice.multiplier;
  }

  // Apply group discounts
  const groupDiscount = this.pricing.groupDiscounts
    .filter(discount => groupSize >= discount.minPeople)
    .sort((a, b) => b.minPeople - a.minPeople)[0];

  if (groupDiscount) {
    price *= (1 - groupDiscount.discount / 100);
  }

  return Math.round(price * 100) / 100;
};

// Check availability for a specific date
tourSchema.methods.checkAvailability = function(startDate, groupSize) {
  const availability = this.availability.find(slot => {
    return startDate >= slot.startDate && startDate <= slot.endDate;
  });

  if (!availability) return false;

  return (availability.availableSpots - availability.bookedSpots) >= groupSize;
};

module.exports = mongoose.model('Tour', tourSchema);
