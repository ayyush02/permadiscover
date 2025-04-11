#!/bin/bash

# Deploy script for PermaDiscover to Netlify

echo "🚀 Deploying PermaDiscover to Netlify..."

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix the errors and try again."
  exit 1
fi

echo "✅ Build successful!"

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
npx netlify deploy --prod

echo "🎉 Deployment complete!"
echo "🔗 Your site is live at: https://beamish-meringue-e63fe3.netlify.app" 