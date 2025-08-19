import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Icon, Icons } from '../../components/common/Icons';
import { Blog, BlogForm } from '../../types';
import toast from 'react-hot-toast';

// Validation schema
const blogSchema = yup.object({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: yup.string().required('Excerpt is required').min(20, 'Excerpt must be at least 20 characters'),
  content: yup.string().required('Content is required').min(100, 'Content must be at least 100 characters'),
  featuredImage: yup.string().optional().nullable(),
  gallery: yup.array().of(yup.string().required()).default([]),
  categories: yup.array().of(yup.string().required()).min(1, 'At least one category is required').default([]),
  tags: yup.array().of(yup.string().required()).min(1, 'At least one tag is required').default([]),
  status: yup.string().oneOf(['draft', 'published', 'archived'] as const).required(),
  featured: yup.boolean().required(),
  language: yup.string().oneOf(['en', 'vi'] as const).required(),
  seoData: yup.object({
    metaTitle: yup.string().optional().nullable(),
    metaDescription: yup.string().optional().nullable(),
    keywords: yup.array().of(yup.string().required()).default([]),
  }).required(),
});

// Mock API functions
const getBlogById = async (blogId: string): Promise<{ data: { blog: Blog } }> => {
  // Mock data
  const mockBlog: Blog = {
    _id: blogId,
    type: 'blog',
    title: 'Hidden Gems of Northern Vietnam',
    slug: 'hidden-gems-northern-vietnam',
    content: '<h2>Discover the Untouched Beauty</h2><p>Northern Vietnam is a land of breathtaking landscapes...</p>',
    excerpt: 'Explore remote villages, pristine lakes, and mountain passes that few tourists ever see.',
    featuredImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
    gallery: [],
    author: '60f7b3b3b3b3b3b3b3b3b3b3',
    authorProfile: { name: 'Sarah Johnson' },
    status: 'published',
    featured: true,
    categories: ['Travel Tips', 'Vietnam'],
    tags: ['northern vietnam', 'hidden gems', 'adventure'],
    language: 'en',
    seoData: {
      metaTitle: 'Hidden Gems of Northern Vietnam',
      metaDescription: 'Discover secret destinations in Northern Vietnam',
      keywords: ['vietnam travel', 'hidden gems']
    },
    views: 1250,
    readingTime: 8,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };
  return { data: { blog: mockBlog } };
};

const createBlog = async (blogData: BlogForm): Promise<{ data: { blog: Blog } }> => {
  console.log('Creating blog:', blogData);
  // Mock response
  return { data: { blog: { _id: 'new-blog-id', ...blogData } as Blog } };
};

const updateBlog = async ({ blogId, blogData }: { blogId: string; blogData: BlogForm }): Promise<{ data: { blog: Blog } }> => {
  console.log('Updating blog:', blogId, blogData);
  // Mock response
  return { data: { blog: { _id: blogId, ...blogData } as Blog } };
};

const BlogEditor: React.FC = () => {
  const { blogId } = useParams<{ blogId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = blogId && blogId !== 'new';

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [previewMode, setPreviewMode] = useState(false);

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlogById(blogId!),
    enabled: !!isEditing,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<BlogForm>({
    resolver: yupResolver(blogSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      gallery: [],
      categories: [],
      tags: [],
      status: 'draft',
      featured: false,
      language: 'en',
      seoData: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
    },
  });

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success('Blog created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      navigate('/admin/blogs');
    },
    onError: () => {
      toast.error('Failed to create blog');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      toast.success('Blog updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
    },
    onError: () => {
      toast.error('Failed to update blog');
    },
  });

  // Auto-generate slug from title
  const watchTitle = watch('title');
  useEffect(() => {
    if (watchTitle && !isEditing) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchTitle, setValue, isEditing]);

  // Load blog data for editing
  useEffect(() => {
    if (blogData?.data.blog) {
      const blog = blogData.data.blog;
      reset({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt || '',
        featuredImage: blog.featuredImage || '',
        gallery: blog.gallery || [],
        categories: blog.categories,
        tags: blog.tags,
        status: blog.status,
        featured: blog.featured,
        language: blog.language,
        seoData: blog.seoData,
      });
    }
  }, [blogData, reset]);

  const onSubmit = (data: BlogForm) => {
    if (isEditing) {
      updateMutation.mutate({ blogId: blogId!, blogData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSaveAsDraft = () => {
    setValue('status', 'draft');
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    handleSubmit(onSubmit)();
  };

  const availableCategories = ['Travel Tips', 'Vietnam', 'Japan', 'Budget Travel', 'Seasonal Travel', 'Adventure', 'Culture', 'Food & Drink'];
  const watchCategories = watch('categories');
  const watchTags = watch('tags');

  const addCategory = (category: string) => {
    if (!watchCategories.includes(category)) {
      setValue('categories', [...watchCategories, category], { shouldDirty: true });
    }
  };

  const removeCategory = (category: string) => {
    setValue('categories', watchCategories.filter(c => c !== category), { shouldDirty: true });
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !watchTags.includes(tag.trim())) {
      setValue('tags', [...watchTags, tag.trim()], { shouldDirty: true });
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', watchTags.filter(t => t !== tag), { shouldDirty: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Update your blog post content and settings' : 'Create a new blog post for your audience'}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
            >
              <Icon icon={previewMode ? Icons.FiEdit : Icons.FiEye} className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-dark-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'content', label: 'Content', icon: Icons.FiEdit },
                    { id: 'seo', label: 'SEO', icon: Icons.FiSearch },
                    { id: 'settings', label: 'Settings', icon: Icons.FiSettings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon icon={tab.icon} className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('title')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                        placeholder="Enter your blog title..."
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('slug')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                        placeholder="url-friendly-slug"
                      />
                      {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Excerpt <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register('excerpt')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                        placeholder="Brief description of your blog post..."
                      />
                      {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
                    </div>

                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        {...register('featuredImage')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register('content')}
                        rows={20}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white font-mono text-sm"
                        placeholder="Write your blog content in HTML format..."
                      />
                      {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        You can use HTML tags for formatting. In a production app, you'd integrate a rich text editor here.
                      </p>
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        {...register('seoData.metaTitle')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                        placeholder="SEO-optimized title..."
                      />
                      {errors.seoData?.metaTitle && <p className="mt-1 text-sm text-red-600">{errors.seoData.metaTitle.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        {...register('seoData.metaDescription')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                        placeholder="SEO meta description..."
                      />
                      {errors.seoData?.metaDescription && <p className="mt-1 text-sm text-red-600">{errors.seoData.metaDescription.message}</p>}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('featured')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured Post
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        {...register('language')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="vi">Vietnamese</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={watchCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          addCategory(category);
                        } else {
                          removeCategory(category);
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
              {errors.categories && <p className="mt-2 text-sm text-red-600">{errors.categories.message}</p>}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tags</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {watchTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                      >
                        <Icon icon={Icons.FiX} className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {errors.tags && <p className="mt-2 text-sm text-red-600">{errors.tags.message}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;

