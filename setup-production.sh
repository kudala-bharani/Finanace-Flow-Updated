#!/bin/bash

# Finance Flow Production Setup Script
# This script helps set up the production environment

set -e

echo "🔧 Finance Flow Production Setup"
echo "==============================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if .env exists
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp env.example .env
    print_warning "Please edit .env file with your production values!"
else
    print_status ".env file already exists"
fi

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Generate Prisma client
print_status "Generating Prisma client..."
cd backend
npx prisma generate
cd ..

# Build frontend
print_status "Building frontend for production..."
npm run build:prod

print_status "Setup completed! 🎉"
echo
print_status "Next steps:"
print_status "1. Edit .env file with your production values"
print_status "2. Set up your database"
print_status "3. Run: ./deploy.sh"
echo
