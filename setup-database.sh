#!/bin/bash

# Database Setup Script for Finance Flow
# This script helps set up the database after deployment

set -e

echo "🗄️ Finance Flow Database Setup"
echo "=============================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    print_warning "Please run this script from the project root directory"
    exit 1
fi

print_step "Setting up database..."

# Install dependencies
print_status "Installing backend dependencies..."
cd backend
npm install

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push database schema
print_status "Pushing database schema..."
npx prisma db push

# Seed database
print_status "Seeding database with sample data..."
npx prisma db seed

print_status "Database setup completed! 🎉"
print_status "Your Finance Flow application is now ready!"

cd ..

print_status "Next steps:"
print_status "1. Test your backend API"
print_status "2. Test your frontend application"
print_status "3. Set up custom domain (optional)"
