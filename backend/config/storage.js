const { v4: uuidv4 } = require('uuid');

// R2 Storage helper functions
const r2Helpers = {
  // Upload image to R2
  async uploadImage(r2Bucket, file, folder = 'tours') {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

      await r2Bucket.put(fileName, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000', // 1 year
        },
      });

      // Return the public URL (you'll need to configure a custom domain for R2)
      return `https://your-r2-domain.com/${fileName}`;
    } catch (error) {
      console.error('R2 upload error:', error);
      throw error;
    }
  },

  // Delete image from R2
  async deleteImage(r2Bucket, imageUrl) {
    try {
      // Extract the key from the URL
      const urlParts = imageUrl.split('/');
      const key = urlParts.slice(-2).join('/'); // folder/filename

      await r2Bucket.delete(key);
      return true;
    } catch (error) {
      console.error('R2 delete error:', error);
      throw error;
    }
  },

  // Upload multiple images
  async uploadMultipleImages(r2Bucket, files, folder = 'tours') {
    try {
      const uploadPromises = files.map(file => this.uploadImage(r2Bucket, file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('R2 multiple upload error:', error);
      throw error;
    }
  },

  // Get signed URL for private access (if needed)
  async getSignedUrl(r2Bucket, key, expiresIn = 3600) {
    try {
      // Note: R2 doesn't have built-in signed URLs like S3
      // You might need to implement this using Cloudflare's API
      // For now, we'll return the public URL
      return `https://your-r2-domain.com/${key}`;
    } catch (error) {
      console.error('R2 signed URL error:', error);
      throw error;
    }
  },

  // Validate image file
  validateImage(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    return true;
  }
};

module.exports = { r2Helpers };
