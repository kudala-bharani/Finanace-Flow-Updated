#!/bin/bash

echo "🚀 Starting Finance Flow Backend with Minimal Server Test..."

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "❌ Database migration failed"
  exit 1
fi

echo "✅ Database migrations completed successfully"

# Test with minimal server first
echo "🧪 Testing with minimal server..."
echo "📋 Environment variables:"
echo "  - PORT: ${PORT:-'not set'}"
echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
echo "  - DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "  - JWT_SECRET: ${JWT_SECRET:+'set'}"

# Start the minimal server
node minimal-server.js
