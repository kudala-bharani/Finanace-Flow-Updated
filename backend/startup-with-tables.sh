#!/bin/bash

echo "🚀 Starting Finance Flow Backend with Table Creation..."

# Create tables first
echo "📊 Creating database tables..."
node create-tables.js

if [ $? -ne 0 ]; then
  echo "⚠️  Table creation had issues, but continuing..."
fi

echo "✅ Table creation completed"

# Start the server
echo "🌐 Starting server..."
echo "📋 Environment variables:"
echo "  - PORT: ${PORT:-'not set'}"
echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
echo "  - DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "  - JWT_SECRET: ${JWT_SECRET:+'set'}"

# Start the server
node index.mjs
