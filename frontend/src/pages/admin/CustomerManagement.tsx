import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Icons } from '../../components/common/Icons';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  bookings: Array<{
    _id: string;
    bookingNumber: string;
    service: string;
    status: string;
    amount: number;
    createdAt: string;
  }>;
}

const CustomerManagement: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const getApiUrl = () => {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  };

  // Fetch customers data from bookings
  const { data: customersData, isLoading, error } = useQuery({
    queryKey: ['admin-customers', searchTerm, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(`${getApiUrl()}/admin/customers?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
  });

  const customers: Customer[] = customersData?.data || [];

  const getCustomerStatusColor = (totalBookings: number) => {
    if (totalBookings >= 5) {
      return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300';
    } else if (totalBookings >= 2) {
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
    }
    return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
  };

  const getCustomerStatusLabel = (totalBookings: number) => {
    if (totalBookings >= 5) return 'VIP Customer';
    if (totalBookings >= 2) return 'Regular Customer';
    return 'New Customer';
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Icon icon={Icons.FiAlertCircle} className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Error loading customers</h3>
        <p className="text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage customer information from bookings</p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-600 dark:text-gray-400">
          Total Customers: {customers.length}
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Icon icon={Icons.FiUserPlus} className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.filter(c => c.totalBookings === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Icon icon={Icons.FiRepeat} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Repeat Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.filter(c => c.totalBookings >= 2).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 border dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Icon icon={Icons.FiStar} className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.filter(c => c.totalBookings >= 5).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border dark:border-dark-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Customers
            </label>
            <div className="relative">
              <Icon icon={Icons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white"
            >
              <option value="name">Name (A-Z)</option>
              <option value="totalBookings">Total Bookings</option>
              <option value="totalSpent">Total Spent</option>
              <option value="lastBookingDate">Last Booking Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border dark:border-dark-700">
        {isLoading ? (
          <div className="p-8 text-center">
            <Icon icon={Icons.FiLoader} className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center">
            <Icon icon={Icons.FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No customers found</h3>
            <p className="text-gray-600 dark:text-gray-400">Customer data will appear here when bookings are made</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Booking
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-600">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          {customer.gender && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.gender}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{customer.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerStatusColor(customer.totalBookings)}`}>
                        {getCustomerStatusLabel(customer.totalBookings)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {customer.totalBookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(customer.lastBookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Icon icon={Icons.FiEye} className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={() => setSelectedCustomer(null)}
            ></div>

            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-850 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b dark:border-dark-700">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Customer Details - {selectedCustomer.name}
                </h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icon icon={Icons.FiX} className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                        <p className="text-gray-900 dark:text-white">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="text-gray-900 dark:text-white">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                        <p className="text-gray-900 dark:text-white">{selectedCustomer.phone}</p>
                      </div>
                      {selectedCustomer.gender && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
                          <p className="text-gray-900 dark:text-white">{selectedCustomer.gender}</p>
                        </div>
                      )}
                      {selectedCustomer.dateOfBirth && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                          <p className="text-gray-900 dark:text-white">{new Date(selectedCustomer.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedCustomer.address && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                          <p className="text-gray-900 dark:text-white">{selectedCustomer.address}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Statistics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Bookings</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{selectedCustomer.totalBookings}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Spent</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-300">${selectedCustomer.totalSpent}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCustomerStatusColor(selectedCustomer.totalBookings)}`}>
                        {getCustomerStatusLabel(selectedCustomer.totalBookings)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking History */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking History</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedCustomer.bookings.map((booking) => (
                      <div key={booking._id} className="border dark:border-dark-600 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">#{booking.bookingNumber}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">${booking.amount}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                              booking.status === 'confirmed' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                              'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
