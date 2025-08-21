import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Icon, Icons } from './Icons';
import { TourBookingForm, CarRentalBookingForm, OtherServiceBookingForm } from '../../types';
import toast from 'react-hot-toast';

// Create a union type for all booking forms
type ServiceBookingFormData = TourBookingForm | CarRentalBookingForm | OtherServiceBookingForm;

// Create schemas for different service types without strict typing
const tourBookingSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  gender: yup.mixed<'male' | 'female' | 'other'>().oneOf(['male', 'female', 'other'], 'Please select a gender').required('Gender is required'),
  dateOfBirth: yup.string().optional(),
  address: yup.string().optional(),
  serviceId: yup.string().required('Service ID is required'),
  serviceType: yup.mixed<'tours'>().oneOf(['tours']).required(),
  passengers: yup.object({
    adults: yup.number().required('Adults is required').min(1, 'At least 1 adult is required'),
    children: yup.number().required('Children is required').min(0),
  }).required(),
  departureDate: yup.string().required('Departure date is required'),
});

const carRentalBookingSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  gender: yup.mixed<'male' | 'female' | 'other'>().oneOf(['male', 'female', 'other'], 'Please select a gender').required('Gender is required'),
  dateOfBirth: yup.string().optional(),
  address: yup.string().optional(),
  serviceId: yup.string().required('Service ID is required'),
  serviceType: yup.mixed<'car-rental'>().oneOf(['car-rental']).required(),
  passengers: yup.object({
    adults: yup.number().required('Adults is required').min(1, 'At least 1 adult is required'),
    children: yup.number().required('Children is required').min(0),
  }).required(),
  departureDate: yup.string().required('Departure date is required'),
  from: yup.string().required('Pickup location is required'),
  to: yup.string().required('Drop-off location is required'),
  returnTrip: yup.boolean().required(),
  returnDate: yup.string().when('returnTrip', {
    is: true,
    then: (schema) => schema.required('Return date is required for round trips'),
    otherwise: (schema) => schema.optional(),
  }),
  tripDetails: yup.string().required('Trip details are required'),
});

const otherServiceBookingSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  gender: yup.mixed<'male' | 'female' | 'other'>().oneOf(['male', 'female', 'other'], 'Please select a gender').required('Gender is required'),
  dateOfBirth: yup.string().optional(),
  address: yup.string().optional(),
  serviceId: yup.string().required('Service ID is required'),
  serviceType: yup.mixed<'other-services'>().oneOf(['other-services']).required(),
  passengers: yup.object({
    adults: yup.number().required('Adults is required').min(1, 'At least 1 adult is required'),
    children: yup.number().required('Children is required').min(0),
  }).required(),
  departureDate: yup.string().optional(),
  requestDetails: yup.string().required('Request details are required'),
});

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    price: number;
    type: 'tour' | 'service';
  } | null;
}

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ isOpen, onClose, item }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceType, setServiceType] = useState<'tours' | 'car-rental' | 'other-services'>('tours');

  // Determine service type based on item
  useEffect(() => {
    if (item) {
      if (item.type === 'tour') {
        setServiceType('tours');
      } else if (item.id.includes('car') || item.id.includes('rental')) {
        setServiceType('car-rental');
      } else {
        setServiceType('other-services');
      }
    }
  }, [item]);

  // Select the appropriate schema based on service type
  const getSchema = () => {
    switch (serviceType) {
      case 'tours':
        return tourBookingSchema;
      case 'car-rental':
        return carRentalBookingSchema;
      case 'other-services':
        return otherServiceBookingSchema;
      default:
        return tourBookingSchema;
    }
  };

  // Get default values based on service type
  const getDefaultValues = useCallback((): any => {
    const baseDefaults = {
      name: '',
      email: '',
      phone: '',
      gender: 'male' as const,
      dateOfBirth: '',
      address: '',
      serviceId: item?.id || '',
      passengers: {
        adults: 1,
        children: 0,
      },
    };

    switch (serviceType) {
      case 'tours':
        return {
          ...baseDefaults,
          serviceType: 'tours' as const,
          departureDate: '',
        };
      case 'car-rental':
        return {
          ...baseDefaults,
          serviceType: 'car-rental' as const,
          departureDate: '',
          from: '',
          to: '',
          returnTrip: false,
          returnDate: '',
          tripDetails: '',
        };
      case 'other-services':
        return {
          ...baseDefaults,
          serviceType: 'other-services' as const,
          departureDate: '',
          requestDetails: '',
        };
      default:
        return baseDefaults;
    }
  }, [serviceType, item?.id]);

  const form = useForm<ServiceBookingFormData>({
    resolver: yupResolver(getSchema() as any),
    defaultValues: getDefaultValues(),
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = form;

  // Update serviceId when item changes
  useEffect(() => {
    if (item?.id) {
      setValue('serviceId', item.id);
    }
  }, [item?.id, setValue]);

  // Reset form when service type changes
  useEffect(() => {
    reset(getDefaultValues());
  }, [serviceType, reset, getDefaultValues]);

  const watchedPassengers = watch('passengers');
  const watchedReturnTrip = watch('returnTrip');
  const totalPassengers = (watchedPassengers?.adults || 1) + (watchedPassengers?.children || 0);

  const handleFormSubmit: SubmitHandler<ServiceBookingFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Booking data:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Booking request submitted successfully! We\'ll contact you soon to confirm.');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !item) return null;

  const totalPrice = item.price * totalPassengers;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-850 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-dark-700">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Book {serviceType === 'tours' ? 'Tour' : serviceType === 'car-rental' ? 'Car Rental' : 'Service'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Icon icon={Icons.FiX} className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
            {/* Hidden fields */}
            <input type="hidden" {...register('serviceId')} />
            <input type="hidden" {...register('serviceType')} />

            {/* Service Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="tours"
                    checked={serviceType === 'tours'}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Tour Package</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="car-rental"
                    checked={serviceType === 'car-rental'}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Car Rental</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="other-services"
                    checked={serviceType === 'other-services'}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Other Services</span>
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.name.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.email.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                    placeholder="+84 123 456 789"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.phone.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    {...register('gender')}
                    id="gender"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.gender.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    id="dateOfBirth"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    id="address"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                    placeholder="Your address"
                  />
                </div>
              </div>
            </div>

            {/* Service-Specific Fields */}
            {serviceType === 'car-rental' && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trip Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pickup Location *
                    </label>
                    <input
                      {...register('from' as any)}
                      type="text"
                      id="from"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                      placeholder="Pickup location"
                    />
                    {(errors as any).from && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String((errors as any).from.message)}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Drop-off Location *
                    </label>
                    <input
                      {...register('to' as any)}
                      type="text"
                      id="to"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                      placeholder="Drop-off location"
                    />
                    {(errors as any).to && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String((errors as any).to.message)}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        {...register('returnTrip' as any)}
                        type="checkbox"
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Round Trip</span>
                    </label>
                  </div>

                  {watchedReturnTrip && (
                    <div>
                      <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Return Date *
                      </label>
                      <input
                        {...register('returnDate' as any)}
                        type="date"
                        id="returnDate"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                      />
                      {(errors as any).returnDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String((errors as any).returnDate.message)}</p>
                      )}
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label htmlFor="tripDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trip Details *
                    </label>
                    <textarea
                      {...register('tripDetails' as any)}
                      id="tripDetails"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                      placeholder="Please describe your trip requirements"
                    />
                    {(errors as any).tripDetails && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String((errors as any).tripDetails.message)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {serviceType === 'other-services' && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Details</h4>
                <div>
                  <label htmlFor="requestDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Request Details *
                  </label>
                  <textarea
                    {...register('requestDetails' as any)}
                    id="requestDetails"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                    placeholder="Please describe your service requirements"
                  />
                  {(errors as any).requestDetails && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String((errors as any).requestDetails.message)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="adults" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adults *
                  </label>
                  <input
                    {...register('passengers.adults')}
                    type="number"
                    id="adults"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                  />
                  {errors.passengers?.adults && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.passengers.adults.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Children
                  </label>
                  <input
                    {...register('passengers.children')}
                    type="number"
                    id="children"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                  />
                </div>

                {(serviceType === 'tours' || serviceType === 'car-rental') && (
                  <div>
                    <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {serviceType === 'car-rental' ? 'Pickup Date' : 'Departure Date'} *
                    </label>
                    <input
                      {...register('departureDate')}
                      type="date"
                      id="departureDate"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                    />
                    {errors.departureDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.departureDate.message)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Base Price (${item.price} × {totalPassengers} {serviceType === 'car-rental' ? 'passengers' : 'people'})
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  ${item.price * totalPassengers}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-dark-600">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Total Price:
                </span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ${totalPrice}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Final price may vary based on your requirements
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Icon icon={Icons.FiLoader} className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Icon icon={Icons.FiCalendar} className="w-5 h-5" />
                    <span>Submit Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingModal;
