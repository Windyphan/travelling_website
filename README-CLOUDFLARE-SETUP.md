# Cloudflare D1 + R2 Migration Guide

## Overview
This guide will help you migrate your travelling website from MongoDB to Cloudflare D1 (database) and integrate R2 (object storage) for image management in your admin system.

## Prerequisites
- Cloudflare account with Workers and R2 enabled
- Wrangler CLI installed (`npm install -g wrangler`)
- Authenticated with Cloudflare (`wrangler auth login`)

## Step 1: Set Up Cloudflare D1 Database

1. **Create D1 Database:**
   ```bash
   wrangler d1 create travelling-website-db
   ```

2. **Copy the database ID** from the output and update your `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "travelling-website-db"
   database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
   ```

3. **Create database schema:**
   ```bash
   wrangler d1 execute travelling-website-db --file=./schema.sql
   ```

## Step 2: Set Up Cloudflare R2 Storage

1. **Create R2 Bucket:**
   ```bash
   wrangler r2 bucket create travelling-website-images
   ```

2. **Update `wrangler.toml` with R2 configuration** (already done in your file)

3. **Optional: Set up custom domain for R2**
   - Go to Cloudflare Dashboard > R2 > Your bucket
   - Add a custom domain for public access to images
   - Update the `r2Helpers.uploadImage` function with your domain

## Step 3: Environment Variables

Set up these environment variables in your Cloudflare Workers dashboard:

```
JWT_SECRET=your-jwt-secret-here
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## Step 4: Update R2 Domain Configuration

In `backend/config/storage.js`, update the domain URL:

```javascript
// Change this line:
return `https://your-r2-domain.com/${fileName}`;

// To your actual R2 domain:
return `https://your-actual-domain.com/${fileName}`;
```

## Step 5: Install Dependencies

```bash
cd backend
npm install
```

## Step 6: Deploy

```bash
# From project root
wrangler deploy
```

## Step 7: Test the Setup

1. **Test database connection:**
   ```bash
   wrangler d1 execute travelling-website-db --command="SELECT COUNT(*) FROM users;"
   ```

2. **Test API endpoints:**
   - POST `/api/auth/register` - Create a test user
   - POST `/api/admin/upload-image` - Test image upload to R2
   - GET `/api/tours` - Test tour fetching

## Admin Image Management Features

Your admin system now supports:

### Tour Image Management
- **Upload multiple images** for tours
- **Replace existing images** automatically
- **Delete old images** when updating
- **Primary image** selection (first uploaded becomes primary)

### Content Management System
- **Upload images** for CMS content
- **Update images** with automatic cleanup
- **Delete content** with associated images

### API Endpoints for Image Management

```javascript
// Upload image
POST /api/admin/upload-image
Content-Type: multipart/form-data
Body: { file: [image file], folder: "tours" }

// Delete image
DELETE /api/admin/delete-image
Body: { imageUrl: "https://your-domain.com/path/to/image.jpg" }

// Create tour with images
POST /api/tours
Content-Type: multipart/form-data
Body: { title, description, price, ..., files: [image files] }

// Update tour images
PUT /api/tours/:id
Content-Type: multipart/form-data
Body: { files: [new image files] }
```

## Database Migration (If You Have Existing Data)

If you need to migrate existing data from MongoDB:

1. **Export your MongoDB data:**
   ```bash
   mongoexport --db=travelling-website --collection=users --out=users.json
   mongoexport --db=travelling-website --collection=tours --out=tours.json
   # ... repeat for other collections
   ```

2. **Create migration script** to convert and import data to D1

3. **Update image URLs** to point to R2 storage

## Local Development

For local development, you can:

1. **Use Wrangler dev mode:**
   ```bash
   wrangler dev
   ```

2. **Set up local D1 database:**
   ```bash
   wrangler d1 execute travelling-website-db --local --file=./schema.sql
   ```

## Troubleshooting

### Common Issues:

1. **Database ID not found:**
   - Ensure you've updated `wrangler.toml` with the correct database ID

2. **R2 upload errors:**
   - Check your R2 bucket permissions
   - Verify the bucket name in `wrangler.toml`

3. **Image URLs not working:**
   - Set up a custom domain for your R2 bucket
   - Update the domain in `storage.js`

### Production Considerations:

1. **Image optimization:** Consider adding image resizing/optimization
2. **CDN:** Use Cloudflare's CDN for better image delivery
3. **Backup:** Set up regular database backups
4. **Monitoring:** Enable Cloudflare Analytics for your Workers

## Benefits of This Migration

✅ **Serverless architecture** - No server management needed
✅ **Global edge network** - Fast worldwide performance  
✅ **Integrated storage** - R2 works seamlessly with D1
✅ **Cost-effective** - Pay only for what you use
✅ **Scalable** - Handles traffic spikes automatically
✅ **Admin image management** - Easy picture updates for tours/services
