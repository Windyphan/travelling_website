-- Database schema for Travelling Website using Cloudflare D1

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    date_of_birth TEXT,
    gender TEXT CHECK(gender IN ('male', 'female', 'other')),
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    duration TEXT,
    max_participants INTEGER,
    included TEXT, -- JSON array as text
    excluded TEXT, -- JSON array as text
    itinerary TEXT, -- JSON array as text
    images TEXT, -- JSON array as text
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'draft')),
    featured BOOLEAN DEFAULT FALSE,
    category TEXT,
    location TEXT,
    difficulty TEXT CHECK(difficulty IN ('easy', 'moderate', 'hard')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    price REAL NOT NULL,
    duration TEXT,
    images TEXT, -- JSON array as text
    included TEXT, -- JSON array as text
    excluded TEXT, -- JSON array as text
    category TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK(service_type IN ('tours', 'car-rental', 'other-services')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_number TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    service_id INTEGER,
    tour_id INTEGER,
    service_type TEXT NOT NULL CHECK(service_type IN ('tours', 'car-rental', 'other-services')),
    booking_form TEXT NOT NULL, -- JSON as text
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'contacted', 'completed', 'cancelled')),
    contacted_at TEXT,
    confirmed_at TEXT,
    total_amount REAL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

-- Booking notes table
CREATE TABLE IF NOT EXISTS booking_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_id INTEGER,
    tour_id INTEGER,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT DEFAULT 'blog',
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    gallery TEXT, -- JSON array as text
    author INTEGER NOT NULL,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    categories TEXT, -- JSON array as text
    tags TEXT, -- JSON array as text
    language TEXT DEFAULT 'en',
    seo_meta_title TEXT,
    seo_meta_description TEXT,
    seo_keywords TEXT, -- JSON array as text
    views INTEGER DEFAULT 0,
    reading_time INTEGER,
    published_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (author) REFERENCES users(id)
);

-- Content management table
CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    type TEXT CHECK(type IN ('page', 'section', 'setting')),
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON blogs(author);
CREATE INDEX IF NOT EXISTS idx_content_key ON content(key);
