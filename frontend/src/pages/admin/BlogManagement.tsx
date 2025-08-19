import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Icon, Icons } from '../../components/common/Icons';
import { Blog, BlogFilters } from '../../types';
import toast from 'react-hot-toast';

// Mock API functions (replace with actual API calls)
const getBlogs = async (filters: BlogFilters = {}): Promise<{ data: Blog[]; pagination: any }> => {
  // Mock data including drafts for admin view
  const mockBlogs: Blog[] = [
    {
      _id: '1',
      type: 'blog',
      title: 'Hidden Gems of Northern Vietnam',
      slug: 'hidden-gems-northern-vietnam',
      content: 'Full content here...',
      excerpt: 'Explore remote villages, pristine lakes, and mountain passes.',
      featuredImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
      gallery: [],
      author: '60f7b3b3b3b3b3b3b3b3b3b3',
      authorProfile: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b547' },
      status: 'published',
      featured: true,
      categories: ['Travel Tips', 'Vietnam'],
      tags: ['northern vietnam', 'hidden gems'],
      language: 'en',
      seoData: { metaTitle: '', metaDescription: '', keywords: [] },
      views: 1250,
      readingTime: 8,
      publishedAt: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      type: 'blog',
      title: 'Draft Article About Tokyo',
      slug: 'draft-tokyo-article',
      content: 'Draft content...',
      excerpt: 'This is a draft article.',
      featuredImage: '',
      gallery: [],
      author: '60f7b3b3b3b3b3b3b3b3b3b3',
      authorProfile: { name: 'Sarah Johnson' },
      status: 'draft',
      featured: false,
      categories: ['Japan'],
      tags: ['tokyo', 'draft'],
      language: 'en',
      seoData: { metaTitle: '', metaDescription: '', keywords: [] },
      views: 0,
      readingTime: 5,
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    }
  ];

  let filteredBlogs = mockBlogs;

  if (filters.status) {
    filteredBlogs = filteredBlogs.filter(blog => blog.status === filters.status);
  }

  if (filters.search) {
    filteredBlogs = filteredBlogs.filter(blog =>
      blog.title.toLowerCase().includes(filters.search!.toLowerCase())
    );
  }

  return {
    data: filteredBlogs,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: filteredBlogs.length,
      hasNext: false,
      hasPrev: false
    }
  };
};

const deleteBlog = async (blogId: string): Promise<void> => {
  // Mock API call
  console.log('Deleting blog:', blogId);
  return Promise.resolve();
};

const toggleBlogStatus = async ({ blogId, status }: { blogId: string; status: 'draft' | 'published' | 'archived' }): Promise<void> => {
  // Mock API call
  console.log('Updating blog status:', blogId, status);
  return Promise.resolve();
};

const BlogManagement: React.FC = () => {
  const [filters, setFilters] = useState<BlogFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['admin-blogs', filters],
    queryFn: () => getBlogs(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success('Blog deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setSelectedBlogs([]);
    },
    onError: () => {
      toast.error('Failed to delete blog');
    },
  });

  const statusMutation = useMutation({
    mutationFn: toggleBlogStatus,
    onSuccess: () => {
      toast.success('Blog status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    },
    onError: () => {
      toast.error('Failed to update blog status');
    },
  });

  const blogs = blogsData?.data || [];

  const handleStatusChange = (blogId: string, status: 'draft' | 'published' | 'archived') => {
    statusMutation.mutate({ blogId, status });
  };

  const handleDelete = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      deleteMutation.mutate(blogId);
    }
  };

  const handleBulkDelete = () => {
    if (selectedBlogs.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedBlogs.length} blog(s)? This action cannot be undone.`)) {
      selectedBlogs.forEach(blogId => {
        deleteMutation.mutate(blogId);
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map(blog => blog._id));
    }
  };

  const toggleSelectBlog = (blogId: string) => {
    setSelectedBlogs(prev =>
      prev.includes(blogId)
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your blog posts and articles</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/blogs/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Icon icon={Icons.FiPlus} className="w-4 h-4 mr-2" />
            New Blog Post
          </Link>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="createdAt">Created Date</option>
                <option value="publishedAt">Published Date</option>
                <option value="views">Views</option>
                <option value="title">Title</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <div className="relative">
                <Icon icon={Icons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value || undefined }))}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBlogs.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedBlogs.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-8 text-center">
            <Icon icon={Icons.FiFileText} className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No blogs found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first blog post.
            </p>
            <Link
              to="/admin/blogs/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Icon icon={Icons.FiPlus} className="w-4 h-4 mr-2" />
              Create Blog Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Blog Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBlogs.includes(blog._id)}
                        onChange={() => toggleSelectBlog(blog._id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {blog.featuredImage && (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-16 h-12 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {blog.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center mt-1">
                            {blog.featured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 mr-2">
                                Featured
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {blog.readingTime} min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={blog.status}
                        onChange={(e) => handleStatusChange(blog._id, e.target.value as any)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-primary-500 ${getStatusColor(blog.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        {blog.authorProfile?.avatar && (
                          <img
                            src={blog.authorProfile.avatar}
                            alt={blog.authorProfile.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        )}
                        {blog.authorProfile?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {blog.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/blogs/edit/${blog._id}`}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <Icon icon={Icons.FiEdit2} className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/blog/${blog.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Icon icon={Icons.FiExternalLink} className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Icon icon={Icons.FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
