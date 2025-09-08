#!/bin/bash

echo "🚀 Starting Finance Flow Backend (Simple Approach)..."

# Start the server directly - no migrations
echo "🌐 Starting server..."
echo "📋 Environment variables:"
echo "  - PORT: ${PORT:-'not set'}"
echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
echo "  - DATABASE_URL: ${DATABASE_URL:+'set'}"
echo "  - JWT_SECRET: ${JWT_SECRET:+'set'}"

# Start the server - let Prisma handle schema sync
node index.mjs
