import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Icon, Icons } from '../components/common/Icons';
import { FaPlane, FaTrain } from "react-icons/fa";
import { Service } from '../types';

// Mock API function (replace with actual API call)
const getServiceById = async (serviceId: string): Promise<{ data: { service: Service } }> => {
  // This would be replaced with actual API call
  const mockService: Service = {
    _id: serviceId,
    title: 'Vietnam Heritage Discovery',
    subtitle: 'Explore Ancient Temples & Traditional Villages',
    description: 'Immerse yourself in Vietnam\'s rich cultural heritage with visits to ancient temples, traditional craft villages, and UNESCO World Heritage sites.',
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    price: 299,
    duration: '5 days / 4 nights',
    included: [
      'Professional English-speaking guide',
      'All entrance fees to temples and museums',
      'Traditional Vietnamese lunch',
      'Transportation by air-conditioned vehicle',
      'Hotel pickup and drop-off'
    ],
    excluded: [
      'Personal expenses',
      'Travel insurance',
      'Tips for guide and driver'
    ],
    category: 'tours',
    serviceType: 'tours',
    status: 'active',
    itinerary: [
      'Day 1: Arrival in Hanoi - Old Quarter walking tour',
      'Day 2: Temple of Literature & Vietnam Museum of Ethnology',
      'Day 3: Bat Trang Ceramic Village & Traditional water puppet show',
      'Day 4: Ha Long Bay day cruise with cave exploration',
      'Day 5: Return to Hanoi - Departure'
    ],
    location: {
      address: 'Hanoi, Vietnam',
      city: 'Hanoi',
      country: 'Vietnam'
    }
  };

  return { data: { service: mockService } };
};

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: serviceData, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => getServiceById(serviceId!),
    enabled: !!serviceId,
  });

  const service = serviceData?.data.service;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300 dark:bg-dark-700"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 dark:bg-dark-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-96 bg-gray-300 dark:bg-dark-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <Link to="/services" className="btn-primary">
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'tours': return 'Tour Package';
      case 'car-rental': return 'Car Rental Service';
      case 'other-services': return 'Travel Service';
      default: return 'Service';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tours': return Icons.FiMapPin;
      case 'car-rental': return Icons.FiTruck;
      case 'hotel': return Icons.FiHome;
      case 'cruise': return Icons.FiAnchor;
      case 'flights': return FaPlane;
      case 'train': return FaTrain;
      case 'visa': return Icons.FiFileText;
      default: return Icons.FiSettings;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Hero Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={service.images[selectedImage] || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Image Navigation */}
        {service.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {service.images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === selectedImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
            {service.images.length > 5 && (
              <button className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                <Icon icon={Icons.FiCamera} className="w-4 h-4 inline mr-1" />
                +{service.images.length - 5}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Icon icon={getCategoryIcon(service.category)} className="w-4 h-4 mr-1" />
                {getServiceTypeLabel(service.serviceType)}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {service.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {service.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                {service.duration && (
                  <div className="flex items-center">
                    <Icon icon={Icons.FiClock} className="w-4 h-4 mr-1" />
                    {service.duration}
                  </div>
                )}
                {service.location && (
                  <div className="flex items-center">
                    <Icon icon={Icons.FiMapPin} className="w-4 h-4 mr-1" />
                    {service.location.city}, {service.location.country}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Service</h2>
              <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                <p>{service.description}</p>
              </div>
            </div>

            {/* Itinerary (for tours) */}
            {service.itinerary && service.itinerary.length > 0 && (
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {service.itinerary.map((item, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-6">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                    <Icon icon={Icons.FiCheck} className="w-5 h-5 mr-2" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {service.included.map((inclusion, index) => (
                      <li key={index} className="flex items-start">
                        <Icon icon={Icons.FiCheck} className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {service.excluded && service.excluded.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                      <Icon icon={Icons.FiX} className="w-5 h-5 mr-2" />
                      Not Included
                    </h3>
                    <ul className="space-y-2">
                      {service.excluded.map((exclusion, index) => (
                        <li key={index} className="flex items-start">
                          <Icon icon={Icons.FiX} className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{exclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600">
                    ${service.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {service.serviceType === 'tours' ? 'per person' :
                     service.serviceType === 'car-rental' ? 'per day' : 'starting from'}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {service.duration && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{service.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{service.category.replace('-', ' ')}</span>
                  </div>
                </div>

                <Link
                  to={`/service-booking/${service._id}`}
                  className="w-full btn-primary mb-4 flex items-center justify-center"
                >
                  <Icon icon={Icons.FiCalendar} className="w-4 h-4 mr-2" />
                  Book Now
                </Link>

                <button className="w-full btn-secondary">
                  Contact Us for Details
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
                  <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    <Icon icon={Icons.FiCheck} className="w-4 h-4 mr-1 text-green-500" />
                    Free consultation and quote
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
