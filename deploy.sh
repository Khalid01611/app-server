#!/bin/bash

# Deployment script for Ubuntu VPS with PM2

echo "🚀 Starting deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p uploads/chat
mkdir -p uploads/site
mkdir -p uploads/avatars

# Set proper permissions for uploads directory
chmod -R 755 uploads/

# Stop existing PM2 processes
echo "🛑 Stopping existing PM2 processes..."
pm2 stop eastwest-app 2>/dev/null || true
pm2 delete eastwest-app 2>/dev/null || true

# Start the application with PM2
echo "▶️ Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (run once)
# pm2 startup

echo "✅ Deployment completed!"
echo "📊 PM2 Status:"
pm2 status

echo "📋 Recent logs:"
pm2 logs eastwest-app --lines 10