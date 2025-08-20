const { v4: uuidv4 } = require('uuid');
const { dbHelpers } = require('../config/database');
const { r2Helpers } = require('../config/storage');

class Content {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.type = data.type;
    this.title = data.title;
    this.content = data.content;
    this.image_url = data.image_url;
    this.status = data.status || 'published';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Save content to database
  async save(db) {
    const contentData = {
      id: this.id,
      type: this.type,
      title: this.title,
      content: this.content,
      image_url: this.image_url,
      status: this.status
    };
    
    return await dbHelpers.insert(db, 'content', contentData);
  }

  // Update content image using R2
  async updateImage(r2Bucket, newImageFile, oldImageUrl = null) {
    try {
      // Delete old image from R2 if it exists
      if (oldImageUrl) {
        await r2Helpers.deleteImage(r2Bucket, oldImageUrl);
      }

      // Upload new image to R2
      if (newImageFile) {
        r2Helpers.validateImage(newImageFile);
        const imageUrl = await r2Helpers.uploadImage(r2Bucket, newImageFile, 'content');
        this.image_url = imageUrl;
        return imageUrl;
      }

      return null;
    } catch (error) {
      console.error('Error updating content image:', error);
      throw error;
    }
  }

  // Find content by ID
  static async findById(db, id) {
    const content = await dbHelpers.query(db, 'SELECT * FROM content WHERE id = ?', [id]);
    return content.length > 0 ? new Content(content[0]) : null;
  }

  // Find content by type
  static async findByType(db, type, status = 'published') {
    const content = await dbHelpers.query(
      db, 
      'SELECT * FROM content WHERE type = ? AND status = ? ORDER BY created_at DESC', 
      [type, status]
    );
    return content.map(item => new Content(item));
  }

  // Get all content with pagination
  static async findAll(db, options = {}) {
    const { limit = 20, offset = 0, status, type } = options;
    
    let sql = 'SELECT * FROM content';
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const content = await dbHelpers.query(db, sql, params);
    return content.map(item => new Content(item));
  }

  // Update content
  async update(db, updateData) {
    return await dbHelpers.update(db, 'content', updateData, 'id = ?', [this.id]);
  }

  // Delete content
  async delete(db, r2Bucket) {
    // Delete image from R2 storage if it exists
    if (this.image_url) {
      await r2Helpers.deleteImage(r2Bucket, this.image_url);
    }
    
    return await dbHelpers.delete(db, 'content', 'id = ?', [this.id]);
  }
}

module.exports = Content;
