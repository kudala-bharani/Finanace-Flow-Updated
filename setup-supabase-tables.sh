#!/bin/bash

echo "🚀 Setting up Supabase tables..."

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ No .env file found in backend directory"
    echo "Please create backend/.env with your Supabase DATABASE_URL"
    exit 1
fi

echo "📊 Creating tables in Supabase database..."
cd backend
node create-tables-supabase.js

if [ $? -eq 0 ]; then
    echo "✅ Tables created successfully!"
    echo "🧪 You can now test signup functionality"
else
    echo "❌ Failed to create tables"
    exit 1
fi
