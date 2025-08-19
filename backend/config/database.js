// Database configuration for Cloudflare D1
const initializeDatabase = async (env) => {
  const db = env?.DB;
  if (!db) {
    console.log('No database binding found');
    return;
  }

  try {
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        country TEXT,
        role TEXT DEFAULT 'customer',
        avatar TEXT,
        is_verified INTEGER DEFAULT 0,
        preferences TEXT,
        booking_history TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tours (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        destination TEXT,
        duration TEXT,
        pricing TEXT,
        itinerary TEXT,
        inclusions TEXT,
        exclusions TEXT,
        highlights TEXT,
        images TEXT,
        videos TEXT,
        category TEXT,
        difficulty TEXT,
        max_group_size INTEGER,
        min_age INTEGER,
        availability TEXT,
        location TEXT,
        status TEXT DEFAULT 'draft',
        featured INTEGER DEFAULT 0,
        ratings TEXT,
        tags TEXT,
        seo_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        images TEXT,
        videos TEXT,
        price REAL,
        duration TEXT,
        included TEXT,
        excluded TEXT,
        category TEXT,
        service_type TEXT,
        featured INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        itinerary TEXT,
        location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT,
        excerpt TEXT,
        featured_image TEXT,
        gallery TEXT,
        author_id TEXT,
        status TEXT DEFAULT 'draft',
        featured INTEGER DEFAULT 0,
        categories TEXT,
        tags TEXT,
        language TEXT DEFAULT 'en',
        seo_data TEXT,
        views INTEGER DEFAULT 0,
        reading_time INTEGER,
        published_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        booking_number TEXT UNIQUE NOT NULL,
        tour_id TEXT,
        service_id TEXT,
        customer_id TEXT NOT NULL,
        booking_details TEXT,
        pricing TEXT,
        payment TEXT,
        status TEXT DEFAULT 'pending',
        special_requests TEXT,
        emergency_contact TEXT,
        documents TEXT,
        notifications TEXT,
        created_by TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id),
        FOREIGN KEY (service_id) REFERENCES services(id),
        FOREIGN KEY (customer_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS service_bookings (
        id TEXT PRIMARY KEY,
        booking_number TEXT UNIQUE NOT NULL,
        service_id TEXT NOT NULL,
        customer_id TEXT NOT NULL,
        booking_form TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        contacted_at DATETIME,
        confirmed_at DATETIME,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id),
        FOREIGN KEY (customer_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        tour_id TEXT,
        customer_id TEXT NOT NULL,
        booking_id TEXT,
        rating INTEGER NOT NULL,
        title TEXT,
        content TEXT,
        aspects TEXT,
        photos TEXT,
        status TEXT DEFAULT 'pending',
        featured INTEGER DEFAULT 0,
        helpful INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id),
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      );

      CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
      CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
      CREATE INDEX IF NOT EXISTS idx_blogs_author ON blogs(author_id);
      CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
      CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
      CREATE INDEX IF NOT EXISTS idx_service_bookings_customer ON service_bookings(customer_id);
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Helper function to get database connection
const getDatabase = (req) => {
  return req.db || req.env?.DB;
};

// Helper function to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to generate booking numbers
const generateBookingNumber = () => {
  return 'BK' + Date.now().toString().slice(-8);
};

module.exports = {
  initializeDatabase,
  getDatabase,
  generateId,
  generateBookingNumber
};
