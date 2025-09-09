#!/bin/bash

echo "🧹 Cleaning previous build..."
rm -rf dist

echo "🔨 Building project..."
npm run build

echo "📁 Copying _redirects file..."
cp public/_redirects dist/_redirects

echo "✅ Build complete!"
echo "📦 Files in dist:"
ls -la dist/

echo ""
echo "🚀 Ready to deploy!"
echo "The _redirects file is now in dist/ for proper SPA routing"
