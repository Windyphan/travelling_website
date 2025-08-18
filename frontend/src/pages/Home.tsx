import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toursAPI } from '../utils/api';
import { Icon, Icons } from '../components/common/Icons';
import { Tour } from '../types';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured tours
  const { data: featuredTours, isLoading: toursLoading } = useQuery({
    queryKey: ['featuredTours'],
    queryFn: () => toursAPI.getFeaturedTours(),
  });

  // Hero slides data with video support
  const heroSlides = [
    {
      image: '/images/hero-1.jpg',
      video: '/videos/city.mp4',
      title: 'Discover Amazing Vietnam',
      subtitle: 'Unforgettable Adventures Await',
      description: 'Experience the beauty of Vietnam with our expert-guided tours and personalized travel experiences.',
    },
    {
      image: '/images/hero-2.jpg',
      video: '/videos/drive.mp4',
      title: 'Luxury Travel Redefined',
      subtitle: 'Premium Experiences',
      description: 'Indulge in world-class accommodations and exclusive access to hidden gems.',
    },
    {
      image: '/images/hero-3.jpg',
      video: '/videos/venice.mp4',
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
      icon: Icons.FiUsers,
      title: 'Local Experts',
      description: 'Our experienced local guides provide authentic insights and unforgettable experiences.',
    },
    {
      icon: Icons.FiCheck,
      title: 'Bespoke Journeys',
      description: 'Customized travel experiences tailored to your preferences and interests.',
    },
    {
      icon: Icons.FiStar,
      title: 'Safety First',
      description: '24/7 support and comprehensive safety measures for worry-free travel.',
    },
    {
      icon: Icons.FiMapPin,
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
              {slide.video ? (
                <video
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`;
                  }}
                />
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`;
                  }}
                />
              )}
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
                  <Icon icon={Icons.FiPlay} className="w-5 h-5 mr-2" />
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
                      <Icon icon={Icons.FiMapPin} className="w-4 h-4 mr-1" />
                      <span>{tour.destination}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Icon icon={Icons.FiClock} className="w-4 h-4 mr-1" />
                        <span>{tour.duration.days}D/{tour.duration.nights}N</span>
                      </div>
                      <div className="flex items-center text-sm text-yellow-500">
                        <Icon icon={Icons.FiStar} className="w-4 h-4 mr-1 fill-current" />
                        <span>{tour.ratings.average.toFixed(1)} ({tour.ratings.count})</span>
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
              <Icon icon={Icons.FiArrowRight} className="w-5 h-5 ml-2" />
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

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Complete travel solutions for your perfect getaway
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Luxury Hotels',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Premium accommodations'
              },
              {
                title: 'Flight Booking',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Best flight deals'
              },
              {
                title: 'Travel Insurance',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Comprehensive coverage'
              },
              {
                title: 'Tour Guides',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Expert local guides'
              }
            ].map((service, index) => (
              <div key={index} className="bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 border dark:border-dark-600">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                    <p className="text-sm opacity-90">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Rentals Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Car Rentals</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our premium fleet
            </p>
          </div>

          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-6 pb-4">
                {[
                  {
                    name: 'Luxury Sedan',
                    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    price: '$89/day',
                    features: ['GPS', 'AC', 'Bluetooth']
                  },
                  {
                    name: 'SUV Premium',
                    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    price: '$129/day',
                    features: ['4WD', 'GPS', 'Premium Audio']
                  },
                  {
                    name: 'Convertible',
                    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    price: '$159/day',
                    features: ['Convertible', 'Sport Mode', 'Premium']
                  },
                  {
                    name: 'Electric Car',
                    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    price: '$99/day',
                    features: ['Electric', 'Eco-Friendly', 'Silent']
                  },
                  {
                    name: 'Sports Car',
                    image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    price: '$299/day',
                    features: ['High Performance', 'Luxury', 'Manual']
                  },
                  {
                    name: 'Family Van',
                    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    price: '$109/day',
                    features: ['8 Seats', 'Family Friendly', 'Spacious']
                  }
                ].map((car, index) => (
                  <div key={index} className="flex-none w-80 bg-white dark:bg-dark-700 rounded-xl shadow-lg overflow-hidden border dark:border-dark-600">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white dark:bg-dark-800 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-medium">
                        {car.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{car.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {car.features.map((feature, featureIndex) => (
                          <span key={featureIndex} className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll buttons */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200">
              <Icon icon={Icons.FiChevronLeft} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200">
              <Icon icon={Icons.FiChevronRight} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Destinations</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover amazing places around the world
            </p>
          </div>

          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-6 pb-4">
                {[
                  {
                    name: 'Tropical Paradise',
                    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    location: 'Maldives'
                  },
                  {
                    name: 'Mountain Adventure',
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    location: 'Swiss Alps'
                  },
                  {
                    name: 'City Lights',
                    image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    location: 'New York'
                  },
                  {
                    name: 'Desert Safari',
                    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    location: 'Dubai'
                  },
                  {
                    name: 'Ancient Wonders',
                    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d3b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    location: 'Egypt'
                  },
                  {
                    name: 'Forest Retreat',
                    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    location: 'Amazon'
                  },
                  {
                    name: 'Coastal Beauty',
                    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    location: 'Greece'
                  }
                ].map((destination, index) => (
                  <div key={index} className="flex-none w-72 group cursor-pointer">
                    <div className="relative h-80 overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                        <p className="text-lg opacity-90 flex items-center">
                          <Icon icon={Icons.FiMapPin} className="w-4 h-4 mr-2" />
                          {destination.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll buttons */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 z-10">
              <Icon icon={Icons.FiChevronLeft} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 z-10">
              <Icon icon={Icons.FiChevronRight} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
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
