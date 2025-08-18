import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon, Icons } from '../common/Icons';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { state, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Handle scroll to change header background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const headerClasses = isScrolled
    ? 'bg-white/95 dark:bg-dark-800/95 backdrop-blur-md shadow-lg'
    : 'bg-transparent';

  const logoTextClasses = isScrolled
    ? 'text-gray-900 dark:text-white'
    : 'text-white drop-shadow-lg';

  const navLinkClasses = isScrolled
    ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
    : 'text-white hover:text-primary-200 drop-shadow-md';

  const buttonClasses = isScrolled
    ? 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm';

  const userTextClasses = isScrolled
    ? 'text-gray-700 dark:text-gray-300'
    : 'text-white drop-shadow-md';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <span className={`ml-3 text-2xl font-bold transition-colors duration-300 ${logoTextClasses}`}>
                TravelCo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Left Side */}
          <nav className="hidden md:flex space-x-8 absolute left-0">
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${navLinkClasses}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Navigation - Right Side */}
          <nav className="hidden md:flex space-x-8 absolute right-16">
            {navigation.slice(2).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${navLinkClasses}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - Right Side */}
          <div className="hidden md:flex items-center space-x-4 absolute right-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${buttonClasses}`}
              aria-label="Toggle theme"
            >
              <Icon icon={isDarkMode ? Icons.FiSun : Icons.FiMoon} className="w-5 h-5" />
            </button>

            {state.user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'hover:bg-gray-100 dark:hover:bg-dark-700'
                      : 'hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-medium">
                      {state.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`font-medium transition-colors duration-300 ${userTextClasses}`}>
                    {state.user.name}
                  </span>
                  <Icon
                    icon={Icons.FiChevronDown}
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isScrolled
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-white/80'
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-xl py-1 border dark:border-dark-600 backdrop-blur-md">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    {state.user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200 dark:border-dark-600" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 absolute right-0">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${buttonClasses}`}
            >
              <Icon icon={isDarkMode ? Icons.FiSun : Icons.FiMoon} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${buttonClasses}`}
            >
              <Icon icon={isMenuOpen ? Icons.FiX : Icons.FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-dark-800/95 backdrop-blur-md border-t dark:border-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
