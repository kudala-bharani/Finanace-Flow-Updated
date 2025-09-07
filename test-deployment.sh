#!/bin/bash

# Test Deployment Script for Finance Flow
# This script tests your deployed application

set -e

echo "🧪 Finance Flow Deployment Test"
echo "=============================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Get backend URL from user
read -p "Enter your backend URL (e.g., https://finance-flow-backend.onrender.com): " BACKEND_URL
read -p "Enter your frontend URL (e.g., https://finance-flow-frontend.onrender.com): " FRONTEND_URL

echo
echo "Testing backend API..."

# Test backend health
if curl -s "$BACKEND_URL/" | grep -q "API is running"; then
    print_success "Backend API is running!"
else
    print_error "Backend API is not responding"
    exit 1
fi

# Test backend endpoints
echo "Testing backend endpoints..."

# Test signup endpoint
echo "Testing signup endpoint..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BACKEND_URL/signup" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","password":"password123"}')

if echo "$SIGNUP_RESPONSE" | grep -q "token"; then
    print_success "Signup endpoint working!"
else
    print_warning "Signup endpoint may have issues (user might already exist)"
fi

echo
echo "Testing frontend..."

# Test frontend
if curl -s "$FRONTEND_URL/" | grep -q "Finance Flow"; then
    print_success "Frontend is loading!"
else
    print_error "Frontend is not loading properly"
fi

echo
print_success "Deployment test completed! 🎉"
echo
echo "Your Finance Flow application is live at:"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo
echo "Test credentials:"
echo "Email: tony@stark.com"
echo "Password: password123"
