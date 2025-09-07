#!/bin/bash

# Finance Flow Free Tier Deployment Script
# This script helps deploy to free services (Vercel + Railway + Supabase)

set -e

echo "💰 Finance Flow Free Tier Deployment"
echo "===================================="

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
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    print_status "All dependencies are ready ✓"
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_step "Deploying Frontend to Vercel..."
    
    # Build frontend
    print_status "Building frontend..."
    npm run build:prod
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod --yes
    
    print_status "Frontend deployed! ✓"
    print_warning "Don't forget to set VITE_API_URL in Vercel dashboard"
}

# Deploy backend to Railway
deploy_backend() {
    print_step "Deploying Backend to Railway..."
    
    cd backend
    
    # Initialize Railway project
    print_status "Initializing Railway project..."
    railway init --yes
    
    # Deploy
    print_status "Deploying to Railway..."
    railway up --detach
    
    print_status "Backend deployed! ✓"
    print_warning "Don't forget to set environment variables in Railway dashboard"
    
    cd ..
}

# Setup database
setup_database() {
    print_step "Setting up Database..."
    
    print_status "Please follow these steps:"
    echo "1. Go to https://supabase.com"
    echo "2. Create a new project"
    echo "3. Get the connection string from Settings → Database"
    echo "4. Update DATABASE_URL in Railway dashboard"
    echo "5. Run: cd backend && npx prisma db push && npx prisma db seed"
    
    read -p "Press Enter when you've completed the database setup..."
}

# Main deployment function
main() {
    echo
    print_status "Starting free tier deployment..."
    
    check_dependencies
    
    echo
    echo "What would you like to deploy?"
    echo "1) Frontend only (Vercel)"
    echo "2) Backend only (Railway)"
    echo "3) Both (Frontend + Backend)"
    echo "4) Setup database only"
    echo "5) Exit"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_frontend
            ;;
        2)
            deploy_backend
            ;;
        3)
            deploy_frontend
            deploy_backend
            setup_database
            ;;
        4)
            setup_database
            ;;
        5)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_warning "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo
    print_status "Deployment completed! 🎉"
    print_status "Next steps:"
    print_status "1. Set up your database (Supabase)"
    print_status "2. Configure environment variables"
    print_status "3. Test your application"
    print_status "4. Set up custom domain (optional)"
}

# Run main function
main
