import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../utils/api';
import { Booking } from '../types';
import { Icon, Icons } from '../components/common/Icons';
import { format } from 'date-fns';

const MyBookings: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: bookingsData, isLoading, error } = useQuery({
    queryKey: ['user-bookings', currentPage, statusFilter],
    queryFn: () => bookingsAPI.getUserBookings(currentPage, statusFilter || undefined),
  });

  const bookings = bookingsData?.data.data || [];
  const pagination = bookingsData?.data.pagination;

  const statusOptions = [
    { value: '', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600">Manage and view all your travel bookings in one place</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Icon icon={Icons.FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field min-w-48"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {pagination && (
              <p className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * 10) + 1}-{Math.min(pagination.currentPage * 10, pagination.totalBookings || pagination.totalItems)} of {pagination.totalBookings || pagination.totalItems} bookings
              </p>
            )}
          </div>
        </div>

        {/* Bookings List */}
        {error ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500">Error loading bookings. Please try again.</p>
          </div>
        ) : !bookings.length ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Icon icon={Icons.FiCalendar} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter
                ? `No ${statusFilter} bookings found. Try adjusting your filters.`
                : "You haven't made any bookings yet. Start exploring our amazing tours!"
              }
            </p>
            <Link to="/tours" className="btn-primary">
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: Booking) => (
              <BookingCard key={booking._id} booking={booking} getStatusColor={getStatusColor} getPaymentStatusColor={getPaymentStatusColor} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      page === pagination.currentPage
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
  getStatusColor: (status: string) => string;
  getPaymentStatusColor: (status: string) => string;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, getStatusColor, getPaymentStatusColor }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {booking.tour.images?.[0]?.url ? (
                <img
                  src={booking.tour.images[0].url}
                  alt={booking.tour.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <Icons name="mapPin" className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {booking.tour.title}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Icons name="mapPin" className="w-4 h-4 mr-1" />
                {booking.tour.destination}
              </p>
              <p className="text-sm text-gray-500">
                Booking #{booking.bookingNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                {booking.payment.status.charAt(0).toUpperCase() + booking.payment.status.slice(1)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">
                ${booking.pricing.totalAmount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {booking.pricing.currency}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Icons name="calendar" className="w-4 h-4 mr-2" />
            <div>
              <div className="font-medium">Start Date</div>
              <div>{format(new Date(booking.bookingDetails.startDate), 'MMM dd, yyyy')}</div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Icons name="clock" className="w-4 h-4 mr-2" />
            <div>
              <div className="font-medium">Duration</div>
              <div>{booking.tour.duration.days}D/{booking.tour.duration.nights}N</div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Icons name="users" className="w-4 h-4 mr-2" />
            <div>
              <div className="font-medium">Travelers</div>
              <div>{booking.bookingDetails.totalTravelers} people</div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Icons name="creditCard" className="w-4 h-4 mr-2" />
            <div>
              <div className="font-medium">Payment</div>
              <div>{booking.payment.method || 'Not specified'}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-secondary text-sm flex items-center"
          >
            <Icons name={showDetails ? "eyeOff" : "eye"} className="w-4 h-4 mr-1" />
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>

          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button className="text-sm px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center">
              <Icons name="x" className="w-4 h-4 mr-1" />
              Cancel Booking
            </button>
          )}

          <button className="text-sm px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Icons name="download" className="w-4 h-4 mr-1" />
            Download Invoice
          </button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Travelers */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Travelers</h4>
                <div className="space-y-2">
                  {booking.travelers.map((traveler, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{traveler.name}</span>
                      <span className="text-gray-500 capitalize">
                        {traveler.type} {traveler.age && `(${traveler.age}y)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              {booking.emergencyContact && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Name:</span> {booking.emergencyContact.name}</div>
                    <div><span className="font-medium">Phone:</span> {booking.emergencyContact.phone}</div>
                    <div><span className="font-medium">Relationship:</span> {booking.emergencyContact.relationship}</div>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Special Requests</h4>
                  <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                </div>
              )}

              {/* Payment Details */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${booking.pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees:</span>
                      <span>${booking.pricing.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>${booking.pricing.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Amount:</span>
                      <span>${booking.payment.paidAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  {booking.payment.transactionId && (
                    <div className="mt-2 text-xs text-gray-500">
                      Transaction ID: {booking.payment.transactionId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
