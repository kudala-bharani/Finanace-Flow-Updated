#!/bin/bash

# Finance Flow Render Deployment Script
# This script helps deploy to Render (free tier)

set -e

echo "🚀 Finance Flow Render Deployment"
echo "================================="

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git not found. Please install Git first."
        exit 1
    fi
    
    print_status "All dependencies are ready ✓"
}

# Deploy to Render
deploy_to_render() {
    print_step "Deploying to Render..."
    
    print_status "Please follow these steps:"
    echo
    echo "1. Go to https://render.com"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New +' → 'Web Service'"
    echo "4. Connect your GitHub repository"
    echo "5. Select 'Finanace-Flow-Updated' repository"
    echo "6. Configure the backend service:"
    echo "   - Name: finance-flow-backend"
    echo "   - Root Directory: backend"
    echo "   - Build Command: npm ci && npx prisma generate"
    echo "   - Start Command: node index.mjs"
    echo "   - Plan: Free"
    echo
    echo "7. Add environment variables:"
    echo "   - NODE_ENV: production"
    echo "   - JWT_SECRET: your_secret_key_here"
    echo "   - CONTACT_EMAIL_USER: your_email@gmail.com"
    echo "   - CONTACT_EMAIL_PASS: your_app_password"
    echo "   - DATABASE_URL: your_supabase_connection_string"
    echo
    echo "8. Click 'Create Web Service'"
    echo
    echo "9. For frontend, create another service:"
    echo "   - Click 'New +' → 'Static Site'"
    echo "   - Connect same repository"
    echo "   - Root Directory: (leave empty)"
    echo "   - Build Command: npm ci && npm run build"
    echo "   - Publish Directory: dist"
    echo "   - Plan: Free"
    echo
    echo "10. Add environment variable:"
    echo "    - VITE_API_URL: https://finance-flow-backend.onrender.com"
    echo
    echo "11. Click 'Create Static Site'"
    
    read -p "Press Enter when you've completed the Render setup..."
}

# Main deployment function
main() {
    echo
    print_status "Starting Render deployment..."
    
    check_dependencies
    deploy_to_render
    
    echo
    print_status "Deployment completed! 🎉"
    print_status "Next steps:"
    print_status "1. Set up your database (Supabase)"
    print_status "2. Update DATABASE_URL in Render dashboard"
    print_status "3. Test your application"
    print_status "4. Set up custom domain (optional)"
}

# Run main function
main
