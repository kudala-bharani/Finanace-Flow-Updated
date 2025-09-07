#!/bin/bash

# Finance Flow Digital Ocean Deployment Script
# This script helps deploy the Finance Flow application to Digital Ocean

set -e

echo "🚀 Finance Flow Digital Ocean Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v doctl &> /dev/null; then
        print_error "Digital Ocean CLI (doctl) is not installed."
        print_status "Please install it from: https://docs.digitalocean.com/reference/doctl/how-to/install/"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed."
        print_status "Please install Docker from: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    print_status "All dependencies are installed ✓"
}

# Authenticate with Digital Ocean
authenticate() {
    print_status "Authenticating with Digital Ocean..."
    
    if ! doctl auth list &> /dev/null; then
        print_warning "Not authenticated with Digital Ocean."
        print_status "Please run: doctl auth init"
        exit 1
    fi
    
    print_status "Authenticated with Digital Ocean ✓"
}

# Build and push Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build backend image
    print_status "Building backend image..."
    docker build -f Dockerfile.backend -t finance-flow-backend .
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -f Dockerfile.frontend -t finance-flow-frontend .
    
    print_status "Docker images built successfully ✓"
}

# Deploy to Digital Ocean App Platform
deploy_app() {
    print_status "Deploying to Digital Ocean App Platform..."
    
    if [ ! -f ".do/app-simple.yaml" ]; then
        print_error "App configuration file not found!"
        exit 1
    fi
    
    print_status "Creating/updating app on Digital Ocean..."
    doctl apps create --spec .do/app-simple.yaml || doctl apps update $(doctl apps list --format ID --no-header | head -1) --spec .do/app-simple.yaml
    
    print_status "Deployment initiated ✓"
    print_status "Check the Digital Ocean dashboard for deployment status."
}

# Main deployment function
main() {
    echo
    print_status "Starting deployment process..."
    
    check_dependencies
    authenticate
    
    # Ask user what they want to do
    echo
    echo "What would you like to do?"
    echo "1) Build Docker images locally"
    echo "2) Deploy to Digital Ocean App Platform"
    echo "3) Both (build and deploy)"
    echo "4) Exit"
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            build_images
            ;;
        2)
            deploy_app
            ;;
        3)
            build_images
            deploy_app
            ;;
        4)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo
    print_status "Deployment process completed!"
    print_status "Next steps:"
    print_status "1. Set up your database on Digital Ocean"
    print_status "2. Configure environment variables in the Digital Ocean dashboard"
    print_status "3. Run database migrations"
    print_status "4. Test your application"
}

# Run main function
main
