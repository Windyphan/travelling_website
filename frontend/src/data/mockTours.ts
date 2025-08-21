export const mockTours = [
  {
    id: '1',
    title: 'Ha Long Bay Discovery',
    description: 'Experience the breathtaking beauty of Ha Long Bay with limestone karsts and emerald waters.',
    price: 299,
    duration: '3 days 2 nights',
    location: 'Ha Long Bay, Vietnam',
    max_participants: 12,
    difficulty_level: 'Easy',
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    itinerary: {
      day1: 'Arrival and cruise boarding',
      day2: 'Cave exploration and kayaking',
      day3: 'Sunrise viewing and departure'
    },
    included: ['Accommodation', 'All meals', 'Transportation', 'English guide'],
    excluded: ['Personal expenses', 'Travel insurance', 'Tips'],
    status: 'active',
    featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Sapa Trekking Adventure',
    description: 'Trek through rice terraces and experience the culture of ethnic minorities in Sapa.',
    price: 199,
    duration: '2 days 1 night',
    location: 'Sapa, Vietnam',
    max_participants: 8,
    difficulty_level: 'Moderate',
    image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539650116574-75c0c6d3b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    itinerary: {
      day1: 'Arrival and village visit',
      day2: 'Trekking and cultural experience'
    },
    included: ['Homestay accommodation', 'Local meals', 'Trekking guide', 'Transportation'],
    excluded: ['Personal expenses', 'Travel insurance', 'Alcoholic beverages'],
    status: 'active',
    featured: true,
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    title: 'Mekong Delta Explorer',
    description: 'Explore the floating markets and waterways of the Mekong Delta.',
    price: 149,
    duration: '1 day',
    location: 'Mekong Delta, Vietnam',
    max_participants: 15,
    difficulty_level: 'Easy',
    image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    itinerary: {
      day1: 'Boat tour and market visit'
    },
    included: ['Boat transportation', 'Local lunch', 'English guide', 'Entrance fees'],
    excluded: ['Personal expenses', 'Tips', 'Beverages'],
    status: 'active',
    featured: false,
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    title: 'Hoi An Cultural Journey',
    description: 'Discover the ancient charm of Hoi An with its lantern-lit streets and traditional architecture.',
    price: 89,
    duration: '1 day',
    location: 'Hoi An, Vietnam',
    max_participants: 10,
    difficulty_level: 'Easy',
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    itinerary: {
      day1: 'Walking tour and cultural sites'
    },
    included: ['Walking tour', 'Local lunch', 'Entrance fees', 'Local guide'],
    excluded: ['Personal shopping', 'Tips', 'Transportation'],
    status: 'active',
    featured: true,
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    title: 'Phong Nha Cave Expedition',
    description: 'Explore the magnificent underground world of Phong Nha-Ke Bang National Park.',
    price: 179,
    duration: '2 days 1 night',
    location: 'Phong Nha, Vietnam',
    max_participants: 6,
    difficulty_level: 'Challenging',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    itinerary: {
      day1: 'Cave exploration and boat tour',
      day2: 'Adventure activities and departure'
    },
    included: ['Accommodation', 'All meals', 'Cave entry fees', 'Expert guide', 'Equipment'],
    excluded: ['Personal expenses', 'Travel insurance', 'Optional activities'],
    status: 'active',
    featured: false,
    created_at: '2024-01-19T10:00:00Z',
    updated_at: '2024-01-19T10:00:00Z'
  }
];

export const getFeaturedTours = () => {
  return mockTours.filter(tour => tour.featured && tour.status === 'active');
};

export const getAllTours = () => {
  return mockTours.filter(tour => tour.status === 'active');
};
