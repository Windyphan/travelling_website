import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toursAPI, contentAPI } from '../utils/api';
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
    <div className="min-h-screen">
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

      {/* Featured Experiences */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Experiences</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of extraordinary tours and experiences
            </p>
          </div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredTours?.data.tours.map((tour: Tour) => (
                <div key={tour._id} className="card overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.images[0]?.url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-primary-600">
                      ${tour.pricing.basePrice}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {tour.destination}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tour.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {tour.duration.days}D/{tour.duration.nights}N
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {tour.ratings.average.toFixed(1)} ({tour.ratings.count})
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/tours/${tour.slug}`}
                      className="block w-full mt-4 text-center btn-primary"
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
              className="inline-flex items-center btn-secondary text-lg px-8 py-4"
            >
              View All Tours
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to creating extraordinary travel experiences that exceed your expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                  <item.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read reviews from our satisfied customers who have experienced unforgettable journeys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=3b82f6&color=fff`;
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay in the Loop</h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter for exclusive travel tips, deals, and destination guides
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-l-lg sm:rounded-r-none rounded-r-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-r-lg sm:rounded-l-none rounded-l-lg hover:bg-gray-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
