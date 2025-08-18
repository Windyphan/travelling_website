import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toursAPI } from '../utils/api';
import { Tour, TourFilters, ToursResponse } from '../types';
import { Icon, Icons } from '../components/common/Icons';

const Tours: React.FC = () => {
  const [filters, setFilters] = useState<TourFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { data: toursData, isLoading, error } = useQuery({
    queryKey: ['tours', filters],
    queryFn: () => toursAPI.getTours(filters),
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'family', label: 'Family' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'beach', label: 'Beach' },
    { value: 'city', label: 'City' },
    { value: 'nature', label: 'Nature' },
  ];

  const durations = [
    { value: '', label: 'Any Duration' },
    { value: '1', label: '1 Day' },
    { value: '2', label: '2-3 Days' },
    { value: '4', label: '4-7 Days' },
    { value: '8', label: '8+ Days' },
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'pricing.basePrice-asc', label: 'Price: Low to High' },
    { value: 'pricing.basePrice-desc', label: 'Price: High to Low' },
    { value: 'ratings.average-desc', label: 'Highest Rated' },
    { value: 'duration.days-asc', label: 'Duration: Short to Long' },
  ];

  const handleFilterChange = (key: keyof TourFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split('-');
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const pagination = toursData?.data.pagination;
  const tours = toursData?.data.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Tours</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore our curated collection of unforgettable travel experiences around the world
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Tours
                </label>
                <div className="relative">
                  <Icon icon={Icons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search destinations, tours..."
                    className="input-field pl-10"
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="input-field"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (USD)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-field"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input-field"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  className="input-field"
                  value={filters.duration || ''}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                >
                  {durations.map(duration => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary flex items-center"
                >
                  <Icon icon={Icons.FiFilter} className="w-4 h-4 mr-2" />
                  Filters
                </button>
                {pagination && (
                  <p className="text-gray-600">
                    Showing {((pagination.currentPage - 1) * 12) + 1}-{Math.min(pagination.currentPage * 12, pagination.totalTours || pagination.totalItems)} of {pagination.totalTours || pagination.totalItems} tours
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  className="input-field min-w-48"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-400'}`}
                  >
                    <Icon icon={Icons.FiGrid} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400'}`}
                  >
                    <Icon icon={Icons.FiList} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tours Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
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
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Error loading tours. Please try again.</p>
              </div>
            ) : !tours.length ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tours found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {tours.map((tour: Tour) => (
                    <TourCard key={tour._id} tour={tour} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              page === pagination.currentPage
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tour Card Component
interface TourCardProps {
  tour: Tour;
  viewMode: 'grid' | 'list';
}

const TourCard: React.FC<TourCardProps> = ({ tour, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img
              src={tour.images[0]?.url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
              alt={tour.title}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Icon icon={Icons.FiMapPin} className="w-4 h-4 mr-1" />
                  {tour.destination}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tour.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {tour.shortDescription}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Icon icon={Icons.FiClock} className="w-4 h-4 mr-1" />
                    {tour.duration.days}D/{tour.duration.nights}N
                  </div>
                  <div className="flex items-center">
                    <Icon icon={Icons.FiUsers} className="w-4 h-4 mr-1" />
                    Max {tour.maxGroupSize}
                  </div>
                  <div className="flex items-center">
                    <Icon icon={Icons.FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                    {tour.ratings.average.toFixed(1)} ({tour.ratings.count})
                  </div>
                </div>
              </div>
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-primary-600">
                  ${tour.pricing.basePrice}
                </div>
                <div className="text-sm text-gray-500 mb-4">per person</div>
                <Link
                  to={`/tours/${tour.slug}`}
                  className="btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden group">
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
          <Icon icon={Icons.FiMapPin} className="w-4 h-4 mr-1" />
          {tour.destination}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {tour.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.shortDescription}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon icon={Icons.FiClock} className="w-4 h-4 mr-1 text-gray-400" />
            <span className="text-sm text-gray-500">
              {tour.duration.days}D/{tour.duration.nights}N
            </span>
          </div>
          <div className="flex items-center">
            <Icon icon={Icons.FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-500">
              {tour.ratings.average.toFixed(1)} ({tour.ratings.count})
            </span>
          </div>
        </div>
        <Link
          to={`/tours/${tour.slug}`}
          className="block w-full text-center btn-primary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Tours;
