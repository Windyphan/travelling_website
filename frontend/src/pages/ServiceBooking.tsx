import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Icon, Icons } from '../components/common/Icons';
import { Service, ServiceBookingForm } from '../types';
import toast from 'react-hot-toast';

// Validation schemas for different service types
const baseSchema = {
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  dateOfBirth: yup.string().optional(),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().optional(),
  passengers: yup.object({
    adults: yup.number().min(1, 'At least 1 adult required').required(),
    children: yup.number().min(0).required(),
  }).required(),
};

const tourSchema = yup.object({
  ...baseSchema,
  serviceType: yup.string().equals(['tours']).required(),
  departureDate: yup.string().required('Departure date is required'),
});

const carRentalSchema = yup.object({
  ...baseSchema,
  serviceType: yup.string().equals(['car-rental']).required(),
  departureDate: yup.string().required('Departure date is required'),
  from: yup.string().required('Departure location is required'),
  to: yup.string().required('Destination is required'),
  returnTrip: yup.boolean().required(),
  returnDate: yup.string().when('returnTrip', {
    is: true,
    then: (schema) => schema.required('Return date is required'),
    otherwise: (schema) => schema.optional(),
  }),
  tripDetails: yup.string().required('Trip details are required'),
});

const otherServiceSchema = yup.object({
  ...baseSchema,
  serviceType: yup.string().equals(['other-services']).required(),
  departureDate: yup.string().optional(),
  requestDetails: yup.string().required('Request details are required'),
});

// Mock API functions (replace with actual API calls)
const getServiceById = async (serviceId: string): Promise<{ data: { service: Service } }> => {
  const mockService: Service = {
    _id: serviceId,
    title: 'Vietnam Heritage Discovery',
    subtitle: 'Explore Ancient Temples & Traditional Villages',
    description: 'Immerse yourself in Vietnam\'s rich cultural heritage',
    images: ['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b'],
    price: 299,
    duration: '5 days / 4 nights',
    included: ['Professional guide', 'All entrance fees'],
    excluded: ['Personal expenses'],
    category: 'tours',
    serviceType: 'tours',
    status: 'active',
  };
  return { data: { service: mockService } };
};

const createServiceBooking = async (bookingData: ServiceBookingForm) => {
  // Mock API call - replace with actual implementation
  console.log('Creating booking:', bookingData);
  return { data: { bookingNumber: 'BK' + Date.now() } };
};

const ServiceBooking: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ['service-booking', serviceId],
    queryFn: () => getServiceById(serviceId!),
    enabled: !!serviceId,
  });

  const service = serviceData?.data.service;

  // Determine which schema to use based on service type
  const getSchema = () => {
    if (!service) return tourSchema;
    switch (service.serviceType) {
      case 'tours': return tourSchema;
      case 'car-rental': return carRentalSchema;
      case 'other-services': return otherServiceSchema;
      default: return tourSchema;
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ServiceBookingForm>({
    resolver: yupResolver(getSchema()) as any,
    defaultValues: {
      serviceId: serviceId || '',
      serviceType: service?.serviceType || 'tours',
      passengers: { adults: 1, children: 0 },
      returnTrip: false,
    }
  });

  const watchReturnTrip = watch('returnTrip');

  const createBookingMutation = useMutation({
    mutationFn: createServiceBooking,
    onSuccess: () => {
      toast.success('Booking request submitted successfully! Our team will contact you shortly.');
      navigate('/my-bookings');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to submit booking request');
    },
  });

  const onSubmit = (data: ServiceBookingForm) => {
    createBookingMutation.mutate(data);
  };

  if (serviceLoading || !service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderServiceSummary = () => (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Service Summary</h2>
      <div className="flex items-start space-x-4">
        <img
          src={service.images[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'}
          alt={service.title}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{service.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{service.subtitle}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {service.duration && (
              <span className="flex items-center">
                <Icon icon={Icons.FiClock} className="w-4 h-4 mr-1" />
                {service.duration}
              </span>
            )}
            <span className="font-semibold text-primary-600">${service.price}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactInformation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
          placeholder="Enter your full name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
          placeholder="Enter your email address"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          {...register('gender')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          {...register('dateOfBirth')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
          placeholder="Enter your phone number"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address (Optional)
        </label>
        <textarea
          {...register('address')}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
          placeholder="Enter your address"
        />
      </div>

      {/* Number of Passengers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Passengers <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Adults</label>
            <input
              type="number"
              min="1"
              {...register('passengers.adults', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
            {errors.passengers?.adults && <p className="mt-1 text-xs text-red-600">{errors.passengers.adults.message}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Children</label>
            <input
              type="number"
              min="0"
              {...register('passengers.children', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
            {errors.passengers?.children && <p className="mt-1 text-xs text-red-600">{errors.passengers.children.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTourSpecificFields = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tour Details</h3>

      {/* Departure Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Intended Departure Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register('departureDate')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
        />
        {errors.departureDate && <p className="mt-1 text-sm text-red-600">{errors.departureDate.message}</p>}
      </div>
    </div>
  );

  const renderCarRentalSpecificFields = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Car Rental Details</h3>

      {/* Departure Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Intended Departure Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register('departureDate')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
        />
        {errors.departureDate && <p className="mt-1 text-sm text-red-600">{errors.departureDate.message}</p>}
      </div>

      {/* From & To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('from')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            placeholder="Departure location"
          />
          {(errors as any).from && <p className="mt-1 text-sm text-red-600">{(errors as any).from.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('to')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            placeholder="Destination"
          />
          {(errors as any).to && <p className="mt-1 text-sm text-red-600">{(errors as any).to.message}</p>}
        </div>
      </div>

      {/* Return Trip */}
      <div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('returnTrip')}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Return Trip Required
          </label>
        </div>
      </div>

      {/* Return Date */}
      {watchReturnTrip && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Return Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('returnDate')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
          />
          {(errors as any).returnDate && <p className="mt-1 text-sm text-red-600">{(errors as any).returnDate.message}</p>}
        </div>
      )}

      {/* Trip Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Trip Details <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('tripDetails')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
          placeholder="Please let us know the details of your trip, including any specific requirements or preferences..."
        />
        {(errors as any).tripDetails && <p className="mt-1 text-sm text-red-600">{(errors as any).tripDetails.message}</p>}
      </div>
    </div>
  );

  const renderOtherServiceSpecificFields = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Request Details</h3>

      {/* Request Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tell us more about your request <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('requestDetails')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
          placeholder="Please provide detailed information about your travel service requirements, including dates, preferences, special needs, etc..."
        />
        {(errors as any).requestDetails && <p className="mt-1 text-sm text-red-600">{(errors as any).requestDetails.message}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Book Your Service</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete the form below and our team will contact you to confirm your booking
          </p>
        </div>

        {/* Service Summary */}
        {renderServiceSummary()}

        {/* Booking Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            {/* Contact Information - Common for all services */}
            {renderContactInformation()}

            {/* Service-specific fields */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600">
              {service.serviceType === 'tours' && renderTourSpecificFields()}
              {service.serviceType === 'car-rental' && renderCarRentalSpecificFields()}
              {service.serviceType === 'other-services' && renderOtherServiceSpecificFields()}
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBookingMutation.isPending}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBookingMutation.isPending ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </div>
          </div>
        </form>

        {/* Information Notice */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <Icon icon={Icons.FiInfo} className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You will receive a confirmation email with your booking details</li>
                <li>Our team will contact you within 24 hours to confirm your booking</li>
                <li>We'll provide detailed information about your service and next steps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;
