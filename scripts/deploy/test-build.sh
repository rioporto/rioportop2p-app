#!/bin/bash

echo "Testing production build..."
echo "=========================="

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next

# Install dependencies
echo "Installing dependencies..."
npm install

# Run build
echo "Running production build..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "Build output details:"
    du -sh .next
    echo ""
    echo "You can now test the production build locally with:"
    echo "npm start"
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi