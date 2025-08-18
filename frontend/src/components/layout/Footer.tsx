import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Icons } from '../common/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="ml-2 text-2xl font-bold">TravelCo</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted travel partner for unforgettable adventures. We create personalized
              experiences that connect you with the world's most beautiful destinations.
            </p>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Icon icon={Icons.FiMapPin} className="w-4 h-4 mr-2" />
                <span>123 Travel Street, Ho Chi Minh City, Vietnam</span>
              </div>
              <div className="flex items-center">
                <Icon icon={Icons.FiPhone} className="w-4 h-4 mr-2" />
                <span>+84-123-456-789</span>
              </div>
              <div className="flex items-center">
                <Icon icon={Icons.FiMail} className="w-4 h-4 mr-2" />
                <span>info@travelco.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tours" className="text-gray-300 hover:text-white transition-colors">
                  All Tours
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-300 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Travel Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/booking-policy" className="text-gray-300 hover:text-white transition-colors">
                  Booking Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">Subscribe to our newsletter for travel tips and exclusive offers.</p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 lg:mb-0">
            <button type="button" className="text-gray-300 hover:text-white transition-colors">
              <Icon icon={Icons.FiFacebook} className="w-5 h-5" />
            </button>
            <button type="button" className="text-gray-300 hover:text-white transition-colors">
              <Icon icon={Icons.FiInstagram} className="w-5 h-5" />
            </button>
            <button type="button" className="text-gray-300 hover:text-white transition-colors">
              <Icon icon={Icons.FiTwitter} className="w-5 h-5" />
            </button>
          </div>
          <div className="text-gray-300 text-sm">
            <p>&copy; 2025 TravelCo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
