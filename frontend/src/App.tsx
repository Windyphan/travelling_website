import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Booking from './pages/Booking';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import ServiceBooking from './pages/ServiceBooking';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/Dashboard';
import BlogManagement from './pages/admin/BlogManagement';
import BlogEditor from './pages/admin/BlogEditor';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col transition-colors duration-200">
              <Header />
              <main className="flex-1 bg-gray-50 dark:bg-dark-900">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/tours" element={<Tours />} />
                  <Route path="/tours/:slug" element={<TourDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:serviceId" element={<ServiceDetail />} />
                  <Route path="/blog" element={<Blogs />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-bookings" element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  } />
                  <Route path="/booking/:tourId" element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  } />
                  <Route path="/service-booking/:serviceId" element={
                    <ProtectedRoute>
                      <ServiceBooking />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blogs" element={
                    <ProtectedRoute requiredRole="admin">
                      <BlogManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blogs/new" element={
                    <ProtectedRoute requiredRole="admin">
                      <BlogEditor />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/blogs/edit/:blogId" element={
                    <ProtectedRoute requiredRole="admin">
                      <BlogEditor />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
