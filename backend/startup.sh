#!/bin/bash

echo "🚀 Starting Finance Flow Backend Startup Script..."

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "❌ Database migration failed"
  exit 1
fi

echo "✅ Database migrations completed successfully"

# Start the server
echo "🌐 Starting server..."
echo "📋 Environment variables:"
echo "  - PORT: ${PORT:-'not set'}"
echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
echo "  - DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "  - JWT_SECRET: ${JWT_SECRET:+'set'}"

# Start the server with explicit error handling
node index.mjs
