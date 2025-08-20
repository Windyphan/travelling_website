const { v4: uuidv4 } = require('uuid');
const { query, get, all, run } = require('../config/database');
const { r2Helpers } = require('../config/storage');

class Tour {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.duration = data.duration;
    this.location = data.location;
    this.max_participants = data.max_participants;
    this.difficulty_level = data.difficulty_level;
    this.image_url = data.image_url;
    this.images = data.images ? (typeof data.images === 'string' ? JSON.parse(data.images) : data.images) : [];
    this.itinerary = data.itinerary ? (typeof data.itinerary === 'string' ? JSON.parse(data.itinerary) : data.itinerary) : {};
    this.included = data.included ? (typeof data.included === 'string' ? JSON.parse(data.included) : data.included) : [];
    this.excluded = data.excluded ? (typeof data.excluded === 'string' ? JSON.parse(data.excluded) : data.excluded) : [];
    this.status = data.status || 'active';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Save tour to database
  async save(db) {
    const tourData = {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      duration: this.duration,
      location: this.location,
      max_participants: this.max_participants,
      difficulty_level: this.difficulty_level,
      image_url: this.image_url,
      images: JSON.stringify(this.images),
      itinerary: JSON.stringify(this.itinerary),
      included: JSON.stringify(this.included),
      excluded: JSON.stringify(this.excluded),
      status: this.status
    };

    const sql = `
      INSERT INTO tours (id, title, description, price, duration, location, max_participants, difficulty_level, image_url, images, itinerary, included, excluded, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const params = [
      tourData.id, tourData.title, tourData.description, tourData.price,
      tourData.duration, tourData.location, tourData.max_participants,
      tourData.difficulty_level, tourData.image_url, tourData.images,
      tourData.itinerary, tourData.included, tourData.excluded, tourData.status
    ];

    return await run(sql, params);
  }

  // Update tour images using R2
  async updateImages(r2Bucket, newImageFiles, oldImages = []) {
    try {
      // Delete old images from R2 if they exist
      if (oldImages.length > 0) {
        for (const imageUrl of oldImages) {
          await r2Helpers.deleteImage(r2Bucket, imageUrl);
        }
      }

      // Upload new images to R2
      const uploadedImageUrls = [];
      if (newImageFiles && newImageFiles.length > 0) {
        for (const file of newImageFiles) {
          r2Helpers.validateImage(file);
          const imageUrl = await r2Helpers.uploadImage(r2Bucket, file, 'tours');
          uploadedImageUrls.push(imageUrl);
        }
      }

      this.images = uploadedImageUrls;
      if (uploadedImageUrls.length > 0) {
        this.image_url = uploadedImageUrls[0]; // Set first image as primary
      }

      return uploadedImageUrls;
    } catch (error) {
      console.error('Error updating tour images:', error);
      throw error;
    }
  }

  // Find tour by ID
  static async findById(id) {
    const tour = await get('SELECT * FROM tours WHERE id = ?', [id]);
    return tour ? new Tour(tour) : null;
  }

  // Get all tours with pagination
  static async findAll(options = {}) {
    const { limit = 20, offset = 0, status = 'active', location, difficulty_level } = options;

    let sql = 'SELECT * FROM tours WHERE status = ?';
    const params = [status];

    if (location) {
      sql += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (difficulty_level) {
      sql += ' AND difficulty_level = ?';
      params.push(difficulty_level);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const tours = await all(sql, params);
    return tours.map(tour => new Tour(tour));
  }

  // Search tours
  static async search(searchTerm) {
    const sql = `
      SELECT * FROM tours 
      WHERE status = 'active' 
      AND (title LIKE ? OR description LIKE ? OR location LIKE ?)
      ORDER BY created_at DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    const tours = await all(sql, [searchPattern, searchPattern, searchPattern]);
    return tours.map(tour => new Tour(tour));
  }

  // Update tour
  async update(db, updateData) {
    // Handle JSON fields
    if (updateData.images) {
      updateData.images = JSON.stringify(updateData.images);
    }
    if (updateData.itinerary) {
      updateData.itinerary = JSON.stringify(updateData.itinerary);
    }
    if (updateData.included) {
      updateData.included = JSON.stringify(updateData.included);
    }
    if (updateData.excluded) {
      updateData.excluded = JSON.stringify(updateData.excluded);
    }

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    const sql = `UPDATE tours SET ${fields}, updated_at = datetime('now') WHERE id = ?`;

    return await run(sql, [...values, this.id]);
  }

  // Delete tour
  async delete(db, r2Bucket) {
    // Delete images from R2 storage
    if (this.images && this.images.length > 0) {
      for (const imageUrl of this.images) {
        await r2Helpers.deleteImage(r2Bucket, imageUrl);
      }
    }

    return await run('DELETE FROM tours WHERE id = ?', [this.id]);
  }

  // Get tour stats
  static async getStats(db) {
    const totalTours = await get('SELECT COUNT(*) as count FROM tours WHERE status = ?', ['active']);
    const toursByLocation = await all('SELECT location, COUNT(*) as count FROM tours WHERE status = ? GROUP BY location', ['active']);
    const toursByDifficulty = await all('SELECT difficulty_level, COUNT(*) as count FROM tours WHERE status = ? GROUP BY difficulty_level', ['active']);

    return {
      total: totalTours.count,
      byLocation: toursByLocation,
      byDifficulty: toursByDifficulty
    };
  }

  // Convert to JSON
  toJSON() {
    return {
      ...this,
      images: typeof this.images === 'string' ? JSON.parse(this.images) : this.images,
      itinerary: typeof this.itinerary === 'string' ? JSON.parse(this.itinerary) : this.itinerary,
      included: typeof this.included === 'string' ? JSON.parse(this.included) : this.included,
      excluded: typeof this.excluded === 'string' ? JSON.parse(this.excluded) : this.excluded
    };
  }
}

module.exports = Tour;
