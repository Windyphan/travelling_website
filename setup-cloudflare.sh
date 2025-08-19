#!/bin/bash

# Cloudflare D1 and R2 Setup Script for Travelling Website

echo "🚀 Setting up Cloudflare D1 Database and R2 Storage..."

# Step 1: Create D1 Database
echo "📊 Creating D1 Database..."
wrangler d1 create travelling-website-db

echo "📝 Please copy the database ID from above and update wrangler.toml"
echo "Update the database_id in wrangler.toml with the ID shown above"

# Step 2: Create R2 Bucket
echo "🗂️ Creating R2 Bucket..."
wrangler r2 bucket create travelling-website-images

# Step 3: Execute Database Schema
echo "🏗️ Setting up database schema..."
wrangler d1 execute travelling-website-db --file=./schema.sql

# Step 4: Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Step 5: Build and deploy
echo "🏗️ Building and deploying..."
cd ..
wrangler deploy

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your wrangler.toml with the D1 database ID"
echo "2. Configure your R2 custom domain (optional)"
echo "3. Set up environment variables in Cloudflare Workers dashboard"
echo "4. Test your deployment"
