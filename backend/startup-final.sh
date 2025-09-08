#!/bin/bash

echo "🚀 Starting Finance Flow Backend (Final Version)..."

# Start the server directly - tables already exist
echo "🌐 Starting server..."
echo "📋 Environment variables:"
echo "  - PORT: ${PORT:-'not set'}"
echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
echo "  - DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "  - JWT_SECRET: ${JWT_SECRET:+'set'}"

# Start the server
node index.mjs
