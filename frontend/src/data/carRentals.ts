// Car rental services data - shared between Home and Services pages
export interface CarRental {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  priceUnit: string;
  duration: string;
  features: string[];
  included: string[];
  excluded: string[];
  category: 'car-rental';
  serviceType: 'car-rental';
  status: 'active';
}

export const carRentals: CarRental[] = [
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    title: 'Luxury Sedan',
    subtitle: 'Premium Comfort for Business Trips',
    description: 'Premium comfort for business trips and city tours with top-of-the-line amenities.',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    price: 89,
    priceUnit: '/day',
    duration: 'Per day',
    features: ['GPS', 'AC', 'Bluetooth'],
    included: ['GPS Navigation', 'AC', 'Bluetooth', 'Insurance', '24/7 Support'],
    excluded: ['Fuel', 'Driver (optional)', 'Parking fees'],
    category: 'car-rental',
    serviceType: 'car-rental',
    status: 'active'
  },
  {
    id: 'suv-premium',
    name: 'SUV Premium',
    title: 'SUV Premium',
    subtitle: 'Perfect for Family Adventures',
    description: 'Perfect for family adventures and mountain trips with spacious interior and 4WD capability.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    price: 129,
    priceUnit: '/day',
    duration: 'Per day',
    features: ['4WD', 'GPS', 'Premium Audio'],
    included: ['4WD', 'GPS Navigation', 'Premium Audio', 'Insurance', '24/7 Support'],
    excluded: ['Fuel', 'Driver (optional)', 'Parking fees'],
    category: 'car-rental',
    serviceType: 'car-rental',
    status: 'active'
  },
  {
    id: 'convertible',
    name: 'Convertible',
    title: 'Convertible',
    subtitle: 'Experience the Open Road in Style',
    description: 'Experience the open road in style with our premium convertible vehicles.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    price: 159,
    priceUnit: '/day',
    duration: 'Per day',
    features: ['Convertible', 'Sport Mode', 'Premium'],
    included: ['Convertible Top', 'Sport Mode', 'Premium Sound', 'Insurance', '24/7 Support'],
    excluded: ['Fuel', 'Driver (optional)', 'Parking fees'],
    category: 'car-rental',
    serviceType: 'car-rental',
    status: 'active'
  },
  {
    id: 'electric-car',
    name: 'Electric Car',
    title: 'Electric Car',
    subtitle: 'Eco-Friendly Travel Option',
    description: 'Eco-friendly option for conscious travelers with zero emissions and quiet operation.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    price: 99,
    priceUnit: '/day',
    duration: 'Per day',
    features: ['Electric', 'Eco-Friendly', 'Silent'],
    included: ['Electric Charging', 'Eco-Friendly', 'Silent Operation', 'Insurance', '24/7 Support'],
    excluded: ['Charging costs', 'Driver (optional)', 'Parking fees'],
    category: 'car-rental',
    serviceType: 'car-rental',
    status: 'active'
  },
  {
    id: 'sports-car',
    name: 'Sports Car',
    title: 'Sports Car',
    subtitle: 'Ultimate Driving Experience',
    description: 'Ultimate driving experience for enthusiasts with high performance and luxury features.',
    image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1541443131876-44b03de101c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    price: 299,
    priceUnit: '/day',
    duration: 'Per day',
    features: ['High Performance', 'Luxury', 'Manual'],
    included: ['High Performance Engine', 'Luxury Interior', 'Manual Transmission', 'Insurance', '24/7 Support'],
    excluded: ['Fuel', 'Driver (optional)', 'Parking fees'],
    category: 'car-rental',
    serviceType: 'car-rental',
    status: 'active'
  },
  {
    id: 'family-van',
    name: 'Family Van',
    title: 'Family Van',
    subtitle: 'Spacious Travel for Large Groups',
    description: 'Spacious and comfortable transportation for large families and groups.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    price: 119,
    priceUnit: '/day',
    duration: 'Per day',
    features: ['8 Seats', 'Large Storage', 'Safety'],
    included: ['8 Passenger Seating', 'Large Storage', 'Safety Features', 'Insurance', '24/7 Support'],
    excluded: ['Fuel', 'Driver (optional)', 'Parking fees'],
    category: 'car-rental',
    serviceType: 'car-rental',
    status: 'active'
  }
];
