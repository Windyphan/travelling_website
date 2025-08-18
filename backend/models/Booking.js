const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  travelers: [{
    name: {
      type: String,
      required: true
    },
    age: Number,
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
      default: 'adult'
    },
    passportNumber: String,
    nationality: String,
    dietaryRequirements: String
  }],
  bookingDetails: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    numberOfTravelers: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 }
    },
    totalTravelers: {
      type: Number,
      required: true
    }
  },
  pricing: {
    basePrice: Number,
    seasonalMultiplier: Number,
    groupDiscount: Number,
    addOns: [{
      name: String,
      price: Number,
      quantity: Number
    }],
    subtotal: Number,
    taxes: Number,
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'partially_paid', 'refunded', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'vnpay', 'momo']
    },
    transactionId: String,
    paidAmount: {
      type: Number,
      default: 0
    },
    paymentDate: Date,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  specialRequests: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  documents: [{
    type: String,
    url: String,
    uploadDate: Date
  }],
  notifications: {
    confirmationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    followUpSent: { type: Boolean, default: false }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate booking number
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const prefix = 'TRV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingNumber = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Calculate total travelers
bookingSchema.pre('save', function(next) {
  if (this.isModified('bookingDetails.numberOfTravelers')) {
    const { adults, children, infants } = this.bookingDetails.numberOfTravelers;
    this.bookingDetails.totalTravelers = adults + children + infants;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
