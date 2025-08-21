import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Icons } from '../components/common/Icons';
import ServiceBookingModal from '../components/common/ServiceBookingModal';
import { getFeaturedTours } from '../data/mockTours';
import { carRentals } from '../data/carRentals';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    item: { id: string; title: string; price: number; type: 'tour' | 'service' } | null;
  }>({ isOpen: false, item: null });
  const carRentalsRef = useRef<HTMLDivElement>(null);
  const coreServicesRef = useRef<HTMLDivElement>(null);

  // Scroll functions
  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Use mock data for featured tours
  const featuredTours = getFeaturedTours();
  const toursLoading = false;

  // Handle booking modal
  const handleBooking = (tour: any) => {
    setBookingModal({
      isOpen: true,
      item: {
        id: tour.id,
        title: tour.title,
        price: tour.price,
        type: 'tour',
      },
    });
  };

  // Handle car rental booking
  const handleCarRentalBooking = (car: any) => {
    setBookingModal({
      isOpen: true,
      item: {
        id: car.id,
        title: car.name,
        price: car.price,
        type: 'service',
      },
    });
  };


  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, item: null });
  };

  // Hero slides data with video support
  const heroSlides = [
    {
      image: '/images/hero-1.jpg',
      video: '/videos/city.mp4',
      title: 'Discover Amazing Vietnam',
      subtitle: '',
      description: '',
    },
    {
      image: '/images/hero-2.jpg',
      video: '/videos/drive.mp4',
      title: 'Travel with TrangThanh',
      subtitle: '',
      description: '',
    },
    {
      image: '/images/hero-3.jpg',
      video: '/videos/venice.mp4',
      title: 'Cultural Immersion',
      subtitle: '',
      description: '',
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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

      {/* About Us Section */}
      <section className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Company Quote with Nature Background */}
            <div className="relative">
              <div
                className="relative h-96 rounded-2xl overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://static.wixstatic.com/media/8fa70e_ca95c635557f41c7b98ac645bb27d085~mv2.jpg/v1/fill/w_675,h_312,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/This%20was%20indeed%20one-of-a-kind%20experience.jpg%201x,%20https://static.wixstatic.com/media/8fa70e_ca95c635557f41c7b98ac645bb27d085~mv2.jpg/v1/fill/w_1350,h_624,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/This%20was%20indeed%20one-of-a-kind%20experience.jpg%202x')`,
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 h-full flex items-center justify-center p-8">
                  <div className="text-center text-white">
                    <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-6">
                      "For over 15 years, Trang Thanh Travel has been a trusted companion, helping customers have smooth and memorable trips. From organizing tours, events, to renting private cars, making visas, or booking airline tickets, cruises, trains, hotels, we can take care of everything so that you have the most perfect experience."
                    </blockquote>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-px bg-white/60 mr-4"></div>
                      <p className="text-lg font-medium">Travel Beyond Boundaries</p>
                      <div className="w-12 h-px bg-white/60 ml-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - YouTube Video */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Our Journey</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Discover how we create extraordinary travel experiences that connect you with the world's most beautiful destinations and cultures.
                </p>
              </div>

              {/* YouTube Video Embed */}
              <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/8VJpaYXrPPQ?controls=1&modestbranding=1&rel=0"
                  title="About Our Travel Company"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Travelers</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Destinations</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">10+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Core Services</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive travel solutions to make your journey seamless and memorable
            </p>
          </div>

          {/* Scrollable Services List */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide" ref={coreServicesRef}>
              <div className="flex space-x-6 pb-4">
                {[
                  {
                    title: 'Domestic Tours',
                    icon: Icons.FiMapPin,
                    description: 'Explore the beauty of your homeland with our curated domestic tour packages',
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    features: ['Local Guides', 'Cultural Immersion', 'Hidden Gems'],
                  },
                  {
                    title: 'Outbound Tours',
                    icon: Icons.FiGlobe,
                    description: 'Discover international destinations with our expertly planned outbound tours',
                    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    features: ['Visa Assistance', 'International Guides', 'Multi-Country Tours'],
                  },
                  {
                    title: 'Car Rental',
                    icon: Icons.FiTruck,
                    description: 'Premium fleet of vehicles for comfortable and convenient travel',
                    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    features: ['Premium Fleet', 'GPS Navigation', '24/7 Support'],
                  },
                  {
                    title: 'Hotel Booking',
                    icon: Icons.FiHome,
                    description: 'Luxury accommodations and budget-friendly stays worldwide',
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    features: ['Best Rates', 'Instant Confirmation', 'Quality Assured'],
                  },
                  {
                    title: 'Train Booking',
                    icon: Icons.FiNavigation,
                    description: 'Comfortable train travel with convenient booking and seating options',
                    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    features: ['Multiple Classes', 'Meal Options', 'Easy Booking'],
                  },
                  {
                    title: 'Cruise/Ship',
                    icon: Icons.FiAnchor,
                    description: 'Luxury cruise experiences with world-class amenities and destinations',
                    image: 'https://images.unsplash.com/photo-1561292793-c0dd892e295d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    features: ['Luxury Amenities', 'Multiple Destinations', 'All-Inclusive'],
                  },
                  {
                    title: 'Visa Service',
                    icon: Icons.FiFileText,
                    description: 'Hassle-free visa processing and documentation assistance',
                    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    features: ['Fast Processing', 'Documentation Help', 'Success Guarantee'],
                  },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex-none w-80 bg-white dark:bg-dark-700 rounded-xl shadow-lg overflow-hidden border dark:border-dark-600 group hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-primary-600 text-white p-2 rounded-lg">
                        <Icon icon={service.icon} className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll buttons */}
            <button
              onClick={() => scrollLeft(coreServicesRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 z-10"
            >
              <Icon icon={Icons.FiChevronLeft} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => scrollRight(coreServicesRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 z-10"
            >
              <Icon icon={Icons.FiChevronRight} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
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
              {featuredTours?.slice(0, 3).map((tour) => (
                <div key={tour.id} className="bg-white dark:bg-dark-850 rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border dark:border-dark-600">
                  <Link to={`/tour/${tour.id}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={tour.image_url || tour.images?.[0] || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white dark:bg-dark-800 rounded-full px-3 py-1 text-sm font-medium text-primary-600 dark:text-primary-400">
                        ${tour.price}
                      </div>
                      {tour.featured && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Icon icon={Icons.FiMapPin} className="w-4 h-4 mr-1" />
                        <span>{tour.location}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {tour.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Icon icon={Icons.FiClock} className="w-4 h-4 mr-1" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Icon icon={Icons.FiUsers} className="w-4 h-4 mr-1" />
                          <span>Max {tour.max_participants}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 pb-6">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleBooking(tour);
                      }}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Book Now
                    </button>
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
            <div className="overflow-x-auto scrollbar-hide" ref={carRentalsRef}>
              <div className="flex space-x-6 pb-4">
                {carRentals.map((car, index) => (
                  <div key={index} className="flex-none w-80 bg-white dark:bg-dark-700 rounded-xl shadow-lg overflow-hidden border dark:border-dark-600">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white dark:bg-dark-800 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${car.price}{car.priceUnit}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{car.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{car.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {car.features.map((feature, featureIndex) => (
                          <span key={featureIndex} className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleCarRentalBooking(car)}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll buttons */}
            <button
              onClick={() => scrollLeft(carRentalsRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200"
            >
              <Icon icon={Icons.FiChevronLeft} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => scrollRight(carRentalsRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-700 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200"
            >
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

      {/* Booking Modal */}
      <ServiceBookingModal
        isOpen={bookingModal.isOpen}
        onClose={closeBookingModal}
        item={bookingModal.item}
      />
    </div>
  );
};

export default Home;
