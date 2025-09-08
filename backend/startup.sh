#!/bin/bash

echo "🚀 Starting Finance Flow Backend Startup Script..."

# Start the server directly - let Prisma handle migrations on first connection
echo "🌐 Starting server..."
echo "📋 Environment variables:"
echo "  - PORT: ${PORT:-'not set'}"
echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
echo "  - DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "  - JWT_SECRET: ${JWT_SECRET:+'set'}"

# Start the server - Prisma will handle migrations automatically
node index.mjs
