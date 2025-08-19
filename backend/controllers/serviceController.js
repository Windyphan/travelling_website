const { getDB, generateId, generateBookingNumber } = require('../config/database');

// Get all services with filtering
const getServices = async (req, res) => {
  try {
    const db = getDB(req);
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const {
      category,
      serviceType,
      status = 'active',
      featured,
      search,
      page = 1,
      limit = 12,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    let query = 'SELECT * FROM services';
    const conditions = [];
    const params = [];

    // Only show active services for non-admin users
    if (req.user?.role !== 'admin') {
      conditions.push('status = ?');
      params.push('active');
    } else if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (serviceType) {
      conditions.push('service_type = ?');
      params.push(serviceType);
    }

    if (featured !== undefined) {
      conditions.push('featured = ?');
      params.push(featured === 'true' ? 1 : 0);
    }

    if (search) {
      conditions.push('(title LIKE ? OR subtitle LIKE ? OR description LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting
    const validSortColumns = ['created_at', 'title', 'price', 'updated_at'];
    const validSortOrders = ['asc', 'desc'];

    if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const result = await db.prepare(query).bind(...params).all();

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM services';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    const countResult = await db.prepare(countQuery).bind(...params.slice(0, -2)).first();
    const total = countResult?.total || 0;

    // Process results
    const services = result.results?.map(service => ({
      ...service,
      images: service.images ? JSON.parse(service.images) : [],
      videos: service.videos ? JSON.parse(service.videos) : [],
      included: service.included ? JSON.parse(service.included) : [],
      excluded: service.excluded ? JSON.parse(service.excluded) : [],
      itinerary: service.itinerary ? JSON.parse(service.itinerary) : [],
      location: service.location ? JSON.parse(service.location) : null,
      featured: Boolean(service.featured)
    })) || [];

    res.json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get single service by ID
const getServiceById = async (req, res) => {
  try {
    const db = getDB(req);
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const { id } = req.params;

    const result = await db.prepare('SELECT * FROM services WHERE id = ? AND (status = "active" OR ? = "admin")')
      .bind(id, req.user?.role || '').first();

    if (!result) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const service = {
      ...result,
      images: result.images ? JSON.parse(result.images) : [],
      videos: result.videos ? JSON.parse(result.videos) : [],
      included: result.included ? JSON.parse(result.included) : [],
      excluded: result.excluded ? JSON.parse(result.excluded) : [],
      itinerary: result.itinerary ? JSON.parse(result.itinerary) : [],
      location: result.location ? JSON.parse(result.location) : null,
      featured: Boolean(result.featured)
    };

    res.json({ success: true, data: { service } });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Create service booking
const createServiceBooking = async (req, res) => {
  try {
    const db = getDB(req);
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const {
      serviceId,
      serviceType,
      name,
      email,
      gender,
      dateOfBirth,
      phone,
      address,
      passengers,
      departureDate,
      from,
      to,
      returnTrip,
      returnDate,
      tripDetails,
      requestDetails
    } = req.body;

    // Validate required fields
    if (!serviceId || !name || !email || !phone || !passengers) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if service exists
    const service = await db.prepare('SELECT * FROM services WHERE id = ? AND status = "active"')
      .bind(serviceId).first();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Validate service type specific fields
    if (serviceType === 'tours' && !departureDate) {
      return res.status(400).json({ success: false, message: 'Departure date is required for tours' });
    }

    if (serviceType === 'car-rental' && (!departureDate || !from || !to || !tripDetails)) {
      return res.status(400).json({
        success: false,
        message: 'Departure date, from, to, and trip details are required for car rental'
      });
    }

    if (serviceType === 'other-services' && !requestDetails) {
      return res.status(400).json({ success: false, message: 'Request details are required for other services' });
    }

    const bookingId = generateId();
    const bookingNumber = generateBookingNumber();

    // Prepare booking form data
    const bookingForm = {
      serviceId,
      serviceType,
      name,
      email,
      gender,
      dateOfBirth,
      phone,
      address,
      passengers,
      ...(departureDate && { departureDate }),
      ...(from && { from }),
      ...(to && { to }),
      ...(returnTrip !== undefined && { returnTrip }),
      ...(returnDate && { returnDate }),
      ...(tripDetails && { tripDetails }),
      ...(requestDetails && { requestDetails })
    };

    const query = `
      INSERT INTO service_bookings (
        id, booking_number, service_id, customer_id, booking_form, status
      ) VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    await db.prepare(query).bind(
      bookingId,
      bookingNumber,
      serviceId,
      req.user.id,
      JSON.stringify(bookingForm)
    ).run();

    res.status(201).json({
      success: true,
      message: 'Service booking created successfully',
      data: { bookingNumber }
    });
  } catch (error) {
    console.error('Error creating service booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get user's service bookings
const getUserServiceBookings = async (req, res) => {
  try {
    const db = getDB(req);
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const query = `
      SELECT sb.*, s.title as service_title, s.subtitle as service_subtitle, s.images as service_images
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE sb.customer_id = ?
      ORDER BY sb.created_at DESC
    `;

    const result = await db.prepare(query).bind(req.user.id).all();

    const bookings = result.results?.map(booking => ({
      ...booking,
      booking_form: booking.booking_form ? JSON.parse(booking.booking_form) : {},
      notes: booking.notes ? JSON.parse(booking.notes) : [],
      service: {
        title: booking.service_title,
        subtitle: booking.service_subtitle,
        images: booking.service_images ? JSON.parse(booking.service_images) : []
      }
    })) || [];

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching user service bookings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin: Get all service bookings
const getAllServiceBookings = async (req, res) => {
  try {
    const db = getDB(req);
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const {
      status,
      serviceType,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    let query = `
      SELECT sb.*, s.title as service_title, s.service_type, u.name as customer_name, u.email as customer_email
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      JOIN users u ON sb.customer_id = u.id
    `;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('sb.status = ?');
      params.push(status);
    }

    if (serviceType) {
      conditions.push('s.service_type = ?');
      params.push(serviceType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting
    const validSortColumns = ['created_at', 'updated_at', 'booking_number'];
    const validSortOrders = ['asc', 'desc'];

    if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      query += ` ORDER BY sb.${sortBy} ${sortOrder.toUpperCase()}`;
    }

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const result = await db.prepare(query).bind(...params).all();

    const bookings = result.results?.map(booking => ({
      ...booking,
      booking_form: booking.booking_form ? JSON.parse(booking.booking_form) : {},
      notes: booking.notes ? JSON.parse(booking.notes) : []
    })) || [];

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching service bookings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin: Update service booking status
const updateServiceBookingStatus = async (req, res) => {
  try {
    const db = getDB(req);
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const { id } = req.params;
    const { status, note } = req.body;

    if (!['pending', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Check if booking exists
    const booking = await db.prepare('SELECT * FROM service_bookings WHERE id = ?').bind(id).first();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update status and timestamps
    let updateFields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    let params = [status];

    if (status === 'contacted') {
      updateFields.push('contacted_at = CURRENT_TIMESTAMP');
    } else if (status === 'confirmed') {
      updateFields.push('confirmed_at = CURRENT_TIMESTAMP');
    }

    // Add note if provided
    if (note) {
      const existingNotes = booking.notes ? JSON.parse(booking.notes) : [];
      const newNote = {
        content: note,
        author: req.user.name,
        createdAt: new Date().toISOString()
      };
      updateFields.push('notes = ?');
      params.push(JSON.stringify([...existingNotes, newNote]));
    }

    const query = `UPDATE service_bookings SET ${updateFields.join(', ')} WHERE id = ?`;
    params.push(id);

    await db.prepare(query).bind(...params).run();

    res.json({ success: true, message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating service booking status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createServiceBooking,
  getUserServiceBookings,
  getAllServiceBookings,
  updateServiceBookingStatus
};
