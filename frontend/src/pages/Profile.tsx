import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import { User } from '../types';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSettings, FiLock, FiSave, FiEdit3 } from '../components/common/Icons';
import toast from 'react-hot-toast';

const profileSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().optional(),
  country: yup.string().optional(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { state, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: authAPI.getProfile,
    enabled: !!state.user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (data) => {
      updateProfile(data.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
      resetPassword();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isUpdatingProfile },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      name: profileData?.data.user.name || '',
      email: profileData?.data.user.email || '',
      phone: profileData?.data.user.phone || '',
      country: profileData?.data.user.country || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  React.useEffect(() => {
    if (profileData?.data.user) {
      resetProfile({
        name: profileData.data.user.name,
        email: profileData.data.user.email,
        phone: profileData.data.user.phone || '',
        country: profileData.data.user.country || '',
      });
    }
  }, [profileData, resetProfile]);

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const user = profileData?.data.user;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: FiUser },
    { id: 'security', name: 'Security', icon: FiLock },
    { id: 'preferences', name: 'Preferences', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mr-6">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <FiUser className="w-10 h-10 text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {user.isVerified && (
                  <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-secondary flex items-center"
                  >
                    <FiEdit3 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          {...registerProfile('name')}
                          type="text"
                          disabled={!isEditing}
                          className={`input-field pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                            profileErrors.name ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {profileErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          {...registerProfile('email')}
                          type="email"
                          disabled={!isEditing}
                          className={`input-field pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                            profileErrors.email ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          {...registerProfile('phone')}
                          type="tel"
                          disabled={!isEditing}
                          className={`input-field pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          {...registerProfile('country')}
                          disabled={!isEditing}
                          className={`input-field pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="">Select country</option>
                          <option value="Vietnam">Vietnam</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Japan">Japan</option>
                          <option value="South Korea">South Korea</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="btn-primary disabled:opacity-50 flex items-center"
                      >
                        <FiSave className="w-4 h-4 mr-2" />
                        {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        {...registerPassword('currentPassword')}
                        type="password"
                        className={`input-field ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                        placeholder="Enter current password"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        {...registerPassword('newPassword')}
                        type="password"
                        className={`input-field ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                        placeholder="Enter new password"
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        {...registerPassword('confirmPassword')}
                        type="password"
                        className={`input-field ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm new password"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="btn-primary disabled:opacity-50 flex items-center"
                      >
                        <FiLock className="w-4 h-4 mr-2" />
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select className="input-field" defaultValue={user.preferences.language}>
                      <option value="en">English</option>
                      <option value="vi">Tiếng Việt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select className="input-field" defaultValue={user.preferences.currency}>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="VND">Vietnamese Dong (VND)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      defaultChecked={user.preferences.newsletter}
                    />
                    <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                      Subscribe to newsletter and promotional emails
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn-primary">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

