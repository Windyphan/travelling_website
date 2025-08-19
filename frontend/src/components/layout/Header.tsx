import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon, Icons } from '../common/Icons';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    };

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Tours', href: '/tours' },
        { name: 'Services', href: '/services' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contact' },
    ];

    const logoTextClasses = isScrolled
        ? `transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`
        : `transition-colors duration-300 ${isDarkMode ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow-lg'}`;

    const navLinkClasses = isScrolled
        ? `px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-primary-400' : 'text-gray-700 hover:text-primary-600'}`
        : `px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${isDarkMode ? 'text-white hover:text-primary-200 drop-shadow-md' : 'text-gray-900 hover:text-primary-600 drop-shadow-md'}`;

    const buttonClasses = isScrolled
        ? `p-2 rounded-lg transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-dark-700 text-gray-300 hover:bg-dark-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
        : `p-2 rounded-lg transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' : 'bg-black/20 text-gray-900 hover:bg-black/30 backdrop-blur-sm'}`;

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled 
                ? `${isDarkMode ? 'bg-dark-900/95 backdrop-blur-md border-dark-700' : 'bg-white/95 backdrop-blur-md border-gray-200'} border-b shadow-lg`
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <Icon icon={Icons.FiMapPin} className={`h-8 w-8 ${logoTextClasses}`} />
                            <span className={`text-xl font-bold ${logoTextClasses}`}>
                                TravelWorld
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={navLinkClasses}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={buttonClasses}
                            aria-label="Toggle theme"
                        >
                            <Icon
                                icon={isDarkMode ? Icons.FiSun : Icons.FiMoon}
                                className="h-5 w-5"
                            />
                        </button>

                        {/* Admin Section */}
                        {state.isAuthenticated && state.admin ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/admin/dashboard"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Admin Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-500"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="text-sm font-medium text-gray-600 hover:text-gray-500"
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={buttonClasses}
                            aria-label="Toggle menu"
                        >
                            <Icon
                                icon={isMenuOpen ? Icons.FiX : Icons.FiMenu}
                                className="h-6 w-6"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className={`md:hidden ${isDarkMode ? 'bg-dark-900' : 'bg-white'} border-t ${isDarkMode ? 'border-dark-700' : 'border-gray-200'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`block px-3 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Mobile Admin Section */}
                        <div className="border-t pt-3 mt-3">
                            {state.isAuthenticated && state.admin ? (
                                <>
                                    <Link
                                        to="/admin/dashboard"
                                        className="block px-3 py-2 text-base font-medium text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/admin/login"
                                    className="block px-3 py-2 text-base font-medium text-gray-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Admin Login
                                </Link>
                            )}

                            <button
                                onClick={toggleTheme}
                                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600"
                            >
                                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;