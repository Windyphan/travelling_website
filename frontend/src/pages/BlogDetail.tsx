import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Icon, Icons } from '../components/common/Icons';
import { Blog } from '../types';

// Mock API function (replace with actual API call)
const getBlogBySlug = async (slug: string): Promise<{ data: { blog: Blog } }> => {
  // Mock data - replace with actual API call
  const mockBlog: Blog = {
    _id: '1',
    type: 'blog',
    title: 'Hidden Gems of Northern Vietnam',
    slug: 'hidden-gems-northern-vietnam',
    content: `
      <h2>Discover the Untouched Beauty</h2>
      <p>Northern Vietnam is a land of breathtaking landscapes, where emerald rice terraces cascade down mountainsides and ancient traditions thrive in remote villages. While places like Ha Long Bay and Sapa draw millions of visitors, there's a whole world of hidden gems waiting to be explored by adventurous travelers.</p>
      
      <h3>1. Ban Gioc Falls - The Majestic Border Cascade</h3>
      <p>Located on the border between Vietnam and China, Ban Gioc Falls is one of the largest waterfalls in Vietnam. The multi-tiered cascade creates a stunning natural amphitheater, especially beautiful during the rainy season from May to September.</p>
      
      <h3>2. Ha Giang Loop - The Ultimate Motorcycle Adventure</h3>
      <p>The Ha Giang Loop offers some of the most spectacular mountain scenery in Southeast Asia. This challenging route takes you through ethnic minority villages, dramatic mountain passes, and landscapes that seem untouched by time.</p>
      
      <h3>3. Dong Van Karst Plateau Geopark</h3>
      <p>A UNESCO Global Geopark, this region showcases unique geological formations and is home to several ethnic minorities. The landscape here is otherworldly, with limestone towers jutting from deep valleys.</p>
      
      <h2>Planning Your Visit</h2>
      <p>The best time to visit Northern Vietnam is during the dry season from October to March. During this period, the weather is cooler and more comfortable for trekking and exploring.</p>
      
      <h3>What to Pack</h3>
      <ul>
        <li>Warm clothing for mountain areas</li>
        <li>Good hiking boots</li>
        <li>Rain gear (even in dry season)</li>
        <li>Camera with extra batteries</li>
        <li>First aid kit</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Northern Vietnam's hidden gems offer experiences that will stay with you long after you return home. From the thundering waters of Ban Gioc Falls to the spiritual serenity of mountain temples, this region provides adventures for every type of traveler.</p>
    `,
    excerpt: 'Explore remote villages, pristine lakes, and mountain passes that few tourists ever see in this comprehensive guide.',
    featuredImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d3b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    author: '60f7b3b3b3b3b3b3b3b3b3b3',
    authorProfile: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b547?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      bio: 'Travel writer and photographer with 10+ years exploring Southeast Asia. Sarah has visited over 30 countries and specializes in off-the-beaten-path destinations.'
    },
    status: 'published',
    featured: true,
    categories: ['Travel Tips', 'Vietnam'],
    tags: ['northern vietnam', 'hidden gems', 'adventure', 'culture', 'motorcycle travel'],
    language: 'en',
    seoData: {
      metaTitle: 'Hidden Gems of Northern Vietnam - Off the Beaten Path',
      metaDescription: 'Discover secret destinations in Northern Vietnam',
      keywords: ['vietnam travel', 'hidden gems', 'northern vietnam', 'adventure travel']
    },
    views: 1250,
    readingTime: 8,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };

  return { data: { blog: mockBlog } };
};

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogBySlug(slug!),
    enabled: !!slug,
  });

  const blog = blogData?.data.blog;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-pulse max-w-4xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-300 dark:bg-dark-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-300 dark:bg-dark-700 rounded mb-8"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Breadcrumb */}
      <nav className="bg-white dark:bg-dark-800 border-b dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </Link>
            <Icon icon={Icons.FiChevronRight} className="w-4 h-4 text-gray-400" />
            <Link to="/blogs" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Blog
            </Link>
            <Icon icon={Icons.FiChevronRight} className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium truncate">
              {blog.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.categories.map((category) => (
              <span
                key={category}
                className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Author and Meta Info */}
          <div className="flex items-center justify-between border-b dark:border-dark-700 pb-6">
            <div className="flex items-center">
              <img
                src={blog.authorProfile?.avatar}
                alt={blog.authorProfile?.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {blog.authorProfile?.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(blog.publishedAt!)} • {blog.readingTime} min read
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Icon icon={Icons.FiEye} className="w-4 h-4 mr-1" />
                <span className="text-sm">{blog.views.toLocaleString()}</span>
              </div>
              <button className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Icon icon={Icons.FiShare2} className="w-4 h-4 mr-1" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mb-8">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12
                       prose-headings:text-gray-900 dark:prose-headings:text-white
                       prose-p:text-gray-700 dark:prose-p:text-gray-300
                       prose-li:text-gray-700 dark:prose-li:text-gray-300
                       prose-strong:text-gray-900 dark:prose-strong:text-white
                       prose-a:text-primary-600 dark:prose-a:text-primary-400
                       prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                       prose-blockquote:border-primary-500 dark:prose-blockquote:border-primary-400
                       prose-code:text-gray-800 dark:prose-code:text-gray-200
                       prose-pre:bg-gray-100 dark:prose-pre:bg-dark-800
                       prose-th:text-gray-900 dark:prose-th:text-white
                       prose-td:text-gray-700 dark:prose-td:text-gray-300">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Gallery */}
        {blog.gallery && blog.gallery.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blog.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery view ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        {blog.authorProfile?.bio && (
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 mb-12 shadow-lg">
            <div className="flex items-start">
              <img
                src={blog.authorProfile.avatar}
                alt={blog.authorProfile.name}
                className="w-16 h-16 rounded-full mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  About {blog.authorProfile.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {blog.authorProfile.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Articles CTA */}
        <div className="text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Icon icon={Icons.FiArrowLeft} className="w-4 h-4 mr-2" />
            More Articles
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
