import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toursAPI, bookingsAPI } from '../utils/api';
import { BookingForm } from '../types';
import { Icon, Icons } from '../components/common/Icons';
import toast from 'react-hot-toast';

const schema = yup.object({
  startDate: yup.string().required('Start date is required'),
  numberOfTravelers: yup.object({
    adults: yup.number().min(1, 'At least 1 adult required').required(),
    children: yup.number().min(0).required(),
    infants: yup.number().min(0).required(),
  }),
  travelers: yup.array().of(
    yup.object({
      name: yup.string().required('Name is required'),
      age: yup.number().positive('Age must be positive').optional(),
      type: yup.string().oneOf(['adult', 'child', 'infant']).required(),
    })
  ).required('Travelers information is required'),
  specialRequests: yup.string().notRequired(),
  emergencyContact: yup.object({
    name: yup.string().required('Emergency contact name is required'),
    phone: yup.string().required('Emergency contact phone is required'),
    relationship: yup.string().required('Relationship is required'),
  }).notRequired(),
});

const Booking: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [pricing, setPricing] = useState<any>(null);

  const { data: tourData, isLoading: tourLoading } = useQuery({
    queryKey: ['tour-booking', tourId],
    queryFn: () => toursAPI.getTourBySlug(tourId!),
    enabled: !!tourId,
  });

  const createBookingMutation = useMutation({
    mutationFn: bookingsAPI.createBooking,
    onSuccess: (data) => {
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Booking failed');
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      numberOfTravelers: { adults: 1, children: 0, infants: 0 },
      travelers: [{ name: '', type: 'adult', age: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travelers',
  });

  const watchedValues = watch();
  const tour = tourData?.data.tour;

  // Update travelers array when number of travelers changes
  useEffect(() => {
    const { adults, children, infants } = watchedValues.numberOfTravelers;
    const totalTravelers = adults + children + infants;
    const currentTravelers = fields.length;

    if (totalTravelers > currentTravelers) {
      // Add travelers
      for (let i = currentTravelers; i < totalTravelers; i++) {
        if (i < adults) {
          append({ name: '', type: 'adult', age: undefined });
        } else if (i < adults + children) {
          append({ name: '', type: 'child', age: undefined });
        } else {
          append({ name: '', type: 'infant', age: undefined });
        }
      }
    } else if (totalTravelers < currentTravelers) {
      // Remove travelers
      for (let i = currentTravelers - 1; i >= totalTravelers; i--) {
        remove(i);
      }
    }
  }, [watchedValues.numberOfTravelers, fields.length, append, remove]);

  // Calculate pricing when form changes
  useEffect(() => {
    if (tour && watchedValues.startDate && watchedValues.numberOfTravelers) {
      const totalTravelers = watchedValues.numberOfTravelers.adults +
                           watchedValues.numberOfTravelers.children +
                           watchedValues.numberOfTravelers.infants;

      // Simulate pricing calculation
      const basePrice = tour.pricing.basePrice;
      const subtotal = basePrice * totalTravelers;
      const taxes = subtotal * 0.1;
      const total = subtotal + taxes;

      setPricing({
        basePrice,
        subtotal,
        taxes,
        total,
        totalTravelers,
      });
    }
  }, [tour, watchedValues.startDate, watchedValues.numberOfTravelers]);

  const onSubmit = (data: BookingForm) => {
    if (!tour) return;

    const bookingData = {
      ...data,
      tourId: tour._id,
    };

    createBookingMutation.mutate(bookingData);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (tourLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
          <p className="text-gray-600">The tour you're trying to book doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Tour Configuration' :
                  currentStep === 2 ? 'Traveler Information' :
                  'Payment & Confirmation'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit as any)}>
              {/* Step 1: Tour Configuration */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Configuration</h2>

                  {/* Start Date */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Icon icon={Icons.FiCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('startDate')}
                        type="date"
                        className={`input-field pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>

                  {/* Number of Travelers */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Number of Travelers
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Adults (18+)</label>
                        <input
                          {...register('numberOfTravelers.adults')}
                          type="number"
                          min="1"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Children (2-17)</label>
                        <input
                          {...register('numberOfTravelers.children')}
                          type="number"
                          min="0"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Infants (0-2)</label>
                        <input
                          {...register('numberOfTravelers.infants')}
                          type="number"
                          min="0"
                          className="input-field"
                        />
                      </div>
                    </div>
                    {errors.numberOfTravelers?.adults && (
                      <p className="mt-1 text-sm text-red-600">{errors.numberOfTravelers.adults.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                      disabled={!watchedValues.startDate || !pricing}
                    >
                      Next: Traveler Information
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Traveler Information */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Traveler Information</h2>

                  {/* Travelers */}
                  <div className="space-y-6 mb-8">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Traveler {index + 1} ({field.type})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              {...register(`travelers.${index}.name`)}
                              type="text"
                              className="input-field"
                              placeholder="Enter full name"
                            />
                            {errors.travelers?.[index]?.name && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.travelers[index]?.name?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Age
                            </label>
                            <input
                              {...register(`travelers.${index}.age`)}
                              type="number"
                              className="input-field"
                              placeholder="Age"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Emergency Contact */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          {...register('emergencyContact.name')}
                          type="text"
                          className="input-field"
                          placeholder="Contact name"
                        />
                        {errors.emergencyContact?.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.emergencyContact.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          {...register('emergencyContact.phone')}
                          type="tel"
                          className="input-field"
                          placeholder="Phone number"
                        />
                        {errors.emergencyContact?.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.emergencyContact.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship
                        </label>
                        <select
                          {...register('emergencyContact.relationship')}
                          className="input-field"
                        >
                          <option value="">Select relationship</option>
                          <option value="spouse">Spouse</option>
                          <option value="parent">Parent</option>
                          <option value="child">Child</option>
                          <option value="sibling">Sibling</option>
                          <option value="friend">Friend</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.emergencyContact?.relationship && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.emergencyContact.relationship.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      {...register('specialRequests')}
                      rows={3}
                      className="input-field"
                      placeholder="Any dietary requirements, accessibility needs, or special requests..."
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Next: Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Confirmation</h2>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="paymentMethod" value="credit_card" className="mr-3" defaultChecked />
                        <Icon icon={Icons.FiCreditCard} className="w-5 h-5 mr-2" />
                        <span>Credit Card (Stripe)</span>
                      </label>
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="paymentMethod" value="vnpay" className="mr-3" />
                        <span>VNPay (Vietnamese QR Code)</span>
                      </label>
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="paymentMethod" value="bank_transfer" className="mr-3" />
                        <span>Bank Transfer</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

                {tour && (
                  <>
                    <div className="mb-4">
                      <img
                        src={tour.images[0]?.url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                        alt={tour.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">{tour.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{tour.destination}</p>

                    {watchedValues.startDate && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span>{new Date(watchedValues.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{tour.duration.days}D/{tour.duration.nights}N</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {pricing && (
                  <div className="border-t pt-4 mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Price x {pricing.totalTravelers}:</span>
                        <span>${pricing.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & Fees:</span>
                        <span>${pricing.taxes.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 font-bold">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>${pricing.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

