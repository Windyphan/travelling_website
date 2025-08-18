import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toursAPI } from '../utils/api';
import { FiStar, FiMapPin, FiClock, FiUsers, FiCheck, FiPlay, FiArrowRight } from '../components/common/Icons';
import { Tour } from '../types';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured tours
  const { data: featuredTours, isLoading: toursLoading } = useQuery({
    queryKey: ['featuredTours'],
    queryFn: () => toursAPI.getFeaturedTours(),
  });

  // Hero slides data
  const heroSlides = [
    {
      image: '/images/hero-1.jpg',
      title: 'Discover Amazing Vietnam',
      subtitle: 'Unforgettable Adventures Await',
      description: 'Experience the beauty of Vietnam with our expert-guided tours and personalized travel experiences.',
    },
    {
      image: '/images/hero-2.jpg',
      title: 'Luxury Travel Redefined',
      subtitle: 'Premium Experiences',
      description: 'Indulge in world-class accommodations and exclusive access to hidden gems.',
    },
    {
      image: '/images/hero-3.jpg',
      title: 'Cultural Immersion',
      subtitle: 'Authentic Local Experiences',
      description: 'Connect with local cultures and traditions through our immersive travel programs.',
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const whyChooseUs = [
    {
      icon: FiUsers,
      title: 'Local Experts',
      description: 'Our experienced local guides provide authentic insights and unforgettable experiences.',
    },
    {
      icon: FiCheck,
      title: 'Bespoke Journeys',
      description: 'Customized travel experiences tailored to your preferences and interests.',
    },
    {
      icon: FiStar,
      title: 'Safety First',
      description: '24/7 support and comprehensive safety measures for worry-free travel.',
    },
    {
      icon: FiMapPin,
      title: 'Unique Destinations',
      description: 'Access to exclusive locations and hidden gems off the beaten path.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'United States',
      rating: 5,
      text: 'Absolutely incredible experience! The tour was perfectly organized and our guide was amazing.',
      avatar: '/images/avatar-1.jpg',
    },
    {
      name: 'Michael Chen',
      location: 'Canada',
      rating: 5,
      text: 'Best vacation ever! Every detail was taken care of. Highly recommend TravelCo.',
      avatar: '/images/avatar-2.jpg',
    },
    {
      name: 'Emma Wilson',
      location: 'Australia',
      rating: 5,
      text: 'Professional service, beautiful destinations, and unforgettable memories.',
      avatar: '/images/avatar-3.jpg',
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`;
                }}
              />
              <div className="absolute inset-0 hero-gradient"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-blue-100">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-50">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/tours"
                  className="btn-primary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200"
                >
                  Explore Tours
                </Link>
                <button className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200 flex items-center justify-center">
                  <FiPlay className="w-5 h-5 mr-2" />
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Tours</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked collection of extraordinary tours and experiences
            </p>
          </div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-dark-700 rounded-xl shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-dark-600 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours?.data?.tours?.slice(0, 3).map((tour: Tour) => (
                <div key={tour._id} className="bg-white dark:bg-dark-700 rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border dark:border-dark-600">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.images?.[0]?.url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white dark:bg-dark-800 rounded-full px-3 py-1 text-sm font-medium text-primary-600 dark:text-primary-400">
                      ${tour.pricing?.basePrice || 'N/A'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {tour.destination}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="w-4 h-4 mr-1" />
                        {tour.duration} days
                      </div>
                      <div className="flex items-center text-sm text-yellow-500">
                        <FiStar className="w-4 h-4 mr-1 fill-current" />
                        {tour.rating || '4.8'}
                      </div>
                    </div>
                    <Link
                      to={`/tours/${tour.slug}`}
                      className="mt-4 block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/tours"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              View All Tours
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the most sought-after destinations around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Bali, Indonesia',
                image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                tours: '12 Tours',
                price: 'From $899'
              },
              {
                name: 'Tokyo, Japan',
                image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                tours: '8 Tours',
                price: 'From $1,299'
              },
              {
                name: 'Paris, France',
                image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                tours: '15 Tours',
                price: 'From $1,099'
              },
              {
                name: 'Santorini, Greece',
                image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                tours: '6 Tours',
                price: 'From $1,499'
              }
            ].map((destination, index) => (
              <div key={index} className="relative bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 border dark:border-dark-600">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.tours}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white dark:bg-dark-800 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-medium">
                    {destination.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our recommendations are based on years of experience and thousands of satisfied travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiUsers,
                title: 'Expert Local Guides',
                description: 'Our experienced local guides provide authentic insights and unforgettable experiences that you won\'t find anywhere else.',
                color: 'blue'
              },
              {
                icon: FiCheck,
                title: 'Carefully Curated',
                description: 'Every tour is meticulously planned and tested to ensure the highest quality experience for our travelers.',
                color: 'green'
              },
              {
                icon: FiStar,
                title: '24/7 Support',
                description: 'Our dedicated support team is available around the clock to assist you before, during, and after your trip.',
                color: 'purple'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-${feature.color}-100 dark:bg-${feature.color}-900/20 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered amazing destinations with us. Start planning your perfect trip today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Tours
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
