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
node index.mjs
