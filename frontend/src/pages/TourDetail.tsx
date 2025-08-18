import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toursAPI } from '../utils/api';
import { FiStar, FiMapPin, FiClock, FiUsers, FiCheck, FiX, FiCalendar, FiCamera } from '../components/common/Icons';

const TourDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: tourData, isLoading, error } = useQuery({
    queryKey: ['tour', slug],
    queryFn: () => toursAPI.getTourBySlug(slug!),
    enabled: !!slug,
  });

  const tour = tourData?.data.tour;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-8">The tour you're looking for doesn't exist or has been removed.</p>
          <Link to="/tours" className="btn-primary">
            Browse All Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={tour.images[selectedImage]?.url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Image Navigation */}
        {tour.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {tour.images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === selectedImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
            {tour.images.length > 5 && (
              <button className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                <FiCamera className="w-4 h-4 inline mr-1" />
                +{tour.images.length - 5}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tour Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FiMapPin className="w-4 h-4 mr-1" />
                {tour.destination}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {tour.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-1" />
                  {tour.duration.days} Days / {tour.duration.nights} Nights
                </div>
                <div className="flex items-center">
                  <FiUsers className="w-4 h-4 mr-1" />
                  Max {tour.maxGroupSize} People
                </div>
                <div className="flex items-center">
                  <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                  {tour.ratings.average.toFixed(1)} ({tour.ratings.count} reviews)
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tour.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  tour.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  tour.difficulty === 'challenging' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
              <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: tour.description }} />
            </div>

            {/* Highlights */}
            {tour.highlights.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Day by Day Itinerary</h2>
              <div className="space-y-6">
                {tour.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-primary-200 pl-6">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {day.day}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{day.description}</p>
                    {day.activities.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Activities: </span>
                        <span className="text-sm text-gray-600">{day.activities.join(', ')}</span>
                      </div>
                    )}
                    {day.meals.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Meals: </span>
                        <span className="text-sm text-gray-600">{day.meals.join(', ')}</span>
                      </div>
                    )}
                    {day.accommodation && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Accommodation: </span>
                        <span className="text-sm text-gray-600">{day.accommodation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                    <FiCheck className="w-5 h-5 mr-2" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.inclusions.map((inclusion, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                    <FiX className="w-5 h-5 mr-2" />
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.exclusions.map((exclusion, index) => (
                      <li key={index} className="flex items-start">
                        <FiX className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Map */}
            {tour.location.coordinates && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Interactive map would be embedded here</p>
                  {/* In a real implementation, you would embed Google Maps or another map service */}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <FiMapPin className="w-4 h-4 inline mr-1" />
                  {tour.location.address}, {tour.location.city}, {tour.location.country}
                </div>
              </div>
            )}
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600">
                    ${tour.pricing.basePrice}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tour.pricing.priceType === 'per_person' ? 'per person' : 'per group'}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{tour.duration.days}D/{tour.duration.nights}N</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Group Size:</span>
                    <span className="font-medium">Max {tour.maxGroupSize}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Minimum Age:</span>
                    <span className="font-medium">{tour.minAge}+ years</span>
                  </div>
                </div>

                <Link
                  to={`/booking/${tour._id}`}
                  className="w-full btn-primary mb-4 flex items-center justify-center"
                >
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Book Now
                </Link>

                <button className="w-full btn-secondary">
                  Check Availability
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <FiCheck className="w-4 h-4 mr-1 text-green-500" />
                    Free cancellation up to 24 hours before
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

export default TourDetail;
