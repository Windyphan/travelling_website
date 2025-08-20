import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Icons } from '../../components/common/Icons';
import TourManagement from './TourManagement';
import BlogManagement from './BlogManagement';

// Add interfaces for dashboard data
interface DashboardStats {
  totalBookings: number;
  totalTours: number;
  totalUsers: number;
  totalRevenue: number;
  recentBookings: any[];
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Icons.FiBarChart },
    { id: 'tours', name: 'Tours', icon: Icons.FiMapPin },
    { id: 'services', name: 'Services', icon: Icons.FiSettings },
    { id: 'bookings', name: 'Bookings', icon: Icons.FiCalendar },
    { id: 'users', name: 'Users', icon: Icons.FiUsers },
    { id: 'content', name: 'Content', icon: Icons.FiEdit3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'tours':
        return <TourManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'users':
        return <UserManagement />;
      case 'content':
        return <BlogManagement />;
      case 'dashboard':
      default:
        return <DashboardOverview onQuickAction={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your travel business</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-dark-600">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-dark-500'
                  }`}
                >
                  <Icon icon={tab.icon} className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

// Dashboard Overview Component with live data
interface DashboardOverviewProps {
  onQuickAction: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onQuickAction }) => {
  // Get the correct API base URL for your setup
  const getApiUrl = () => {
    return process.env.REACT_APP_API_URL || 'https://your-backend-domain.vercel.app/api';
  };

  // Fetch dashboard stats
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch(`${getApiUrl()}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats: DashboardStats = statsData?.data || {
    totalBookings: 0,
    totalTours: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: []
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Icon icon={Icons.FiCalendar} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : stats.totalBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Icon icon={Icons.FiDollarSign} className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : `$${stats.totalRevenue?.toLocaleString() || 0}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Icon icon={Icons.FiMapPin} className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : stats.totalTours}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Icon icon={Icons.FiUsers} className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : stats.totalUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onQuickAction('tours')}
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <Icon icon={Icons.FiPlus} className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <span className="text-blue-900 dark:text-blue-300 font-medium">Create Tour</span>
          </button>

          <button
            onClick={() => onQuickAction('bookings')}
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
          >
            <Icon icon={Icons.FiCalendar} className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-green-900 dark:text-green-300 font-medium">View Bookings</span>
          </button>

          <button
            onClick={() => onQuickAction('users')}
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
          >
            <Icon icon={Icons.FiUsers} className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <span className="text-purple-900 dark:text-purple-300 font-medium">Manage Users</span>
          </button>

          <button
            onClick={() => onQuickAction('content')}
            className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200"
          >
            <Icon icon={Icons.FiBarChart} className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
            <span className="text-orange-900 dark:text-orange-300 font-medium">Manage Content</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : stats.recentBookings?.length > 0 ? (
            stats.recentBookings.slice(0, 5).map((booking: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-3 border-b dark:border-dark-600 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                    <Icon icon={Icons.FiCheck} className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New booking confirmed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {booking.tour_title} - {booking.participants} participants
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(booking.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder components for missing tabs
const ServiceManagement: React.FC = () => (
  <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border dark:border-dark-700 p-8 text-center">
    <Icon icon={Icons.FiSettings} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Service Management</h3>
    <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
  </div>
);

const BookingManagement: React.FC = () => (
  <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border dark:border-dark-700 p-8 text-center">
    <Icon icon={Icons.FiCalendar} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Booking Management</h3>
    <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
  </div>
);

const UserManagement: React.FC = () => (
  <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border dark:border-dark-700 p-8 text-center">
    <Icon icon={Icons.FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Management</h3>
    <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
  </div>
);

export default AdminDashboard;
