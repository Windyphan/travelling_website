import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Icons } from '../components/common/Icons';
import { carRentals } from '../data/carRentals';

// Types for services
interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  itinerary?: string[];
  images: string[];
  videos?: string[];
  price: number;
  duration?: string;
  included: string[];
  excluded?: string[];
  category: 'domestic' | 'international' | 'car-rental' | 'other-services';
  serviceType: 'tours' | 'car-rental' | 'other-services';
  featured?: boolean;
  status: 'active' | 'inactive';
}

const Services: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Categories for services
  const categories = [
    { id: 'all', name: 'All Services', icon: Icons.FiGrid },
    { id: 'domestic', name: 'Domestic Tours', icon: Icons.FiMapPin },
    { id: 'international', name: 'International Tours', icon: Icons.FiGlobe },
    { id: 'car-rental', name: 'Private Car Rental', icon: Icons.FiTruck },
    { id: 'other-services', name: 'Other Travel Services', icon: Icons.FiSettings }
  ];

  // Convert car rentals to ServiceItem format and combine with other services
  const carRentalServices: ServiceItem[] = carRentals.map(car => ({
    id: car.id,
    title: car.title,
    subtitle: car.subtitle,
    description: car.description,
    images: car.images,
    price: car.price,
    duration: car.duration,
    included: car.included,
    excluded: car.excluded,
    category: car.category,
    serviceType: car.serviceType,
    status: car.status
  }));

  // Mock services data (in real app, this would come from your API)
  const mockServices: ServiceItem[] = [
    // Domestic Tours
    {
      id: '1',
      title: 'Vietnam Heritage Discovery',
      subtitle: 'Explore Ancient Temples & Traditional Villages',
      description: 'Immerse yourself in Vietnam\'s rich cultural heritage with visits to ancient temples, traditional craft villages, and UNESCO World Heritage sites.',
      itinerary: [
        'Day 1: Arrival in Hanoi - Old Quarter walking tour',
        'Day 2: Temple of Literature & Vietnam Museum of Ethnology',
        'Day 3: Bat Trang Ceramic Village & Traditional water puppet show',
        'Day 4: Ha Long Bay day cruise with cave exploration',
        'Day 5: Return to Hanoi - Departure'
      ],
      images: [
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d3b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      price: 450,
      duration: '5 days 4 nights',
      included: ['Accommodation', 'Local guide', 'All meals', 'Transportation', 'Entrance fees'],
      excluded: ['International flights', 'Personal expenses', 'Travel insurance'],
      category: 'domestic',
      serviceType: 'tours',
      featured: true,
      status: 'active'
    },
    {
      id: '2',
      title: 'Mekong Delta Adventure',
      subtitle: 'Floating Markets & River Life Experience',
      description: 'Discover the vibrant Mekong Delta with its floating markets, traditional villages, and lush waterways.',
      itinerary: [
        'Day 1: Ho Chi Minh City to Can Tho',
        'Day 2: Cai Rang Floating Market & local homestay',
        'Day 3: Coconut candy workshop & boat cruise',
        'Day 4: Return to Ho Chi Minh City'
      ],
      images: [
        'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      price: 320,
      duration: '4 days 3 nights',
      included: ['Accommodation', 'Boat trips', 'Local guide', 'All meals'],
      excluded: ['Flights to Ho Chi Minh City', 'Personal expenses'],
      category: 'domestic',
      serviceType: 'tours',
      status: 'active'
    },
    // International Tours
    {
      id: '3',
      title: 'Japan Cultural Immersion',
      subtitle: 'Tokyo to Kyoto: Modern Meets Traditional',
      description: 'Experience the perfect blend of modern innovation and ancient traditions across Japan\'s most iconic cities.',
      itinerary: [
        'Day 1-3: Tokyo - Modern city exploration, Shibuya, Harajuku',
        'Day 4-5: Mount Fuji region - Traditional ryokan stay',
        'Day 6-8: Kyoto - Ancient temples, Geisha districts',
        'Day 9-10: Osaka - Street food culture & departure'
      ],
      images: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      price: 2800,
      duration: '10 days 9 nights',
      included: ['Accommodation', 'JR Pass', 'English guide', 'Some meals', 'Cultural activities'],
      excluded: ['International flights', 'All meals', 'Personal shopping', 'Travel insurance'],
      category: 'international',
      serviceType: 'tours',
      featured: true,
      status: 'active'
    },
    // Car Rental Services - now using shared data
    ...carRentalServices,
    // Other Services
    {
      id: '10',
      title: 'Visa Processing Service',
      subtitle: 'Hassle-free Visa Applications',
      description: 'Complete visa processing service for all destinations with expert guidance and fast processing.',
      images: [
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      price: 50,
      duration: '5-10 business days',
      included: ['Document review', 'Application submission', 'Status tracking', 'Expert consultation'],
      excluded: ['Government fees', 'Travel to embassy (if required)', 'Additional documents'],
      category: 'other-services',
      serviceType: 'other-services',
      status: 'active'
    },
    {
      id: '11',
      title: 'Hotel Booking Service',
      subtitle: 'Best Accommodation Worldwide',
      description: 'Book the best hotels worldwide with our exclusive rates and personalized recommendations.',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      price: 0,
      duration: 'Commission-based',
      included: ['Best rate guarantee', 'Free cancellation', '24/7 support', 'Instant confirmation'],
      excluded: ['Hotel charges', 'City taxes', 'Extras not included in booking'],
      category: 'other-services',
      serviceType: 'other-services',
      status: 'active'
    }
  ];

  // Filter services based on category and search
  const filteredServices = mockServices.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && service.status === 'active';
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Comprehensive travel solutions tailored to your needs
            </p>
            <p className="text-lg text-primary-50 max-w-2xl">
              From domestic adventures to international journeys, car rentals to visa services -
              we provide everything you need for the perfect travel experience.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="sticky top-0 z-40 bg-white dark:bg-dark-800 shadow-md border-b dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  <Icon icon={category.icon} className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search and View Mode */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Icon icon={Icons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon icon={Icons.FiGrid} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon icon={Icons.FiList} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filters and results count */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
              </span>
              {activeCategory !== 'all' && (
                <span className="flex items-center">
                  <span className="mr-2">Category:</span>
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full text-xs">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <Icon icon={Icons.FiSearch} className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No services found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search terms or category filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
            }>
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Service Card Component
interface ServiceCardProps {
  service: ServiceItem;
  viewMode: 'grid' | 'list';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, viewMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg border dark:border-dark-600 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="md:flex">
          {/* Image Section */}
          <div className="relative md:w-1/3 h-64 md:h-auto">
            <img
              src={service.images[currentImageIndex]}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            {service.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Icon icon={Icons.FiChevronLeft} className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Icon icon={Icons.FiChevronRight} className="w-4 h-4" />
                </button>
              </>
            )}
            <div className="absolute top-4 left-4">
              {service.featured && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>
            <div className="absolute top-4 right-4 bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
              ${service.price}{service.duration?.includes('day') ? '/day' : ''}
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {service.subtitle}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {service.description}
            </p>

            {service.duration && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Icon icon={Icons.FiClock} className="w-4 h-4 mr-2" />
                <span>{service.duration}</span>
              </div>
            )}

            {/* Included Items */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Included:</h4>
              <div className="flex flex-wrap gap-2">
                {service.included.slice(0, 3).map((item, index) => (
                  <span key={index} className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                    {item}
                  </span>
                ))}
                {service.included.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{service.included.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ${service.price}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                  {service.duration?.includes('day') ? '/day' :
                   service.category === 'other-services' && service.price === 0 ? 'Free booking' : ''}
                </span>
              </div>
              <Link to={`/services/${service.id}`} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg border dark:border-dark-600 overflow-hidden group hover:shadow-2xl transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={service.images[currentImageIndex]}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {service.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Icon icon={Icons.FiChevronLeft} className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Icon icon={Icons.FiChevronRight} className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {service.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 left-4">
          {service.featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
          ${service.price}{service.duration?.includes('day') ? '/day' : ''}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {service.title}
        </h3>
        <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
          {service.subtitle}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {service.description}
        </p>

        {service.duration && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Icon icon={Icons.FiClock} className="w-4 h-4 mr-2" />
            <span>{service.duration}</span>
          </div>
        )}

        {/* Included Items */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {service.included.slice(0, 2).map((item, index) => (
              <span key={index} className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                {item}
              </span>
            ))}
            {service.included.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{service.included.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
            ${service.price}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
              {service.duration?.includes('day') ? '/day' :
               service.category === 'other-services' && service.price === 0 ? 'Free' : ''}
            </span>
          </div>
          <Link to={`/services/${service.id}`} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
