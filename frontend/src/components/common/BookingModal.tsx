import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Icon, Icons } from '../common/Icons';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  participants: yup.number().min(1, 'At least 1 participant').required('Number of participants is required'),
  preferredDate: yup.string().required('Preferred date is required'),
  specialRequests: yup.string(),
});

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  participants: number;
  preferredDate: string;
  specialRequests?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    price: number;
    type: 'tour' | 'service';
  } | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, item }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the booking data to your backend
      // For now, we'll just simulate a successful booking
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

  const totalPrice = item.price * (1); // You can multiply by participants if needed

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-850 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-dark-700">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Book {item.type === 'tour' ? 'Tour' : 'Service'}
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
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Participants *
                </label>
                <input
                  {...register('participants')}
                  type="number"
                  id="participants"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                  placeholder="1"
                />
                {errors.participants && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.participants.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Date *
                </label>
                <input
                  {...register('preferredDate')}
                  type="date"
                  id="preferredDate"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white transition-colors duration-200"
                />
                {errors.preferredDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredDate.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests
                </label>
                <textarea
                  {...register('specialRequests')}
                  id="specialRequests"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white resize-none transition-colors duration-200"
                  placeholder="Any special requirements or requests..."
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <div className="flex justify-between items-center">
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

export default BookingModal;
