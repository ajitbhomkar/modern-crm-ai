#!/bin/bash

# CI/CD Setup Helper Script
# This script helps you set up the CI/CD pipeline

echo "🚀 CI/CD Pipeline Setup Helper"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Step 1: Vercel Login"
echo "-----------------------"
echo "This will open Vercel login in your browser..."
npx vercel login

echo ""
echo "📋 Step 2: Link Project to Vercel"
echo "----------------------------------"
npx vercel link

echo ""
echo "📋 Step 3: Getting Your Project IDs"
echo "------------------------------------"

if [ -f ".vercel/project.json" ]; then
    echo "✅ Project linked successfully!"
    echo ""
    echo "📝 Copy these values to GitHub Secrets:"
    echo "========================================"
    echo ""
    
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*' | cut -d'"' -f4)
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
    
    echo "Secret Name: VERCEL_ORG_ID"
    echo "Value: $ORG_ID"
    echo ""
    echo "Secret Name: VERCEL_PROJECT_ID"
    echo "Value: $PROJECT_ID"
    echo ""
    echo "Secret Name: NEXT_PUBLIC_GROQ_API_KEY"
    echo "Value: (copy from your .env.local file)"
    echo ""
    echo "Secret Name: VERCEL_TOKEN"
    echo "Value: (get from https://vercel.com/account/tokens)"
    echo ""
    echo "========================================"
    echo ""
    echo "📌 Next Steps:"
    echo "1. Go to: https://github.com/ajitbhomkar/modern-crm-ai/settings/secrets/actions"
    echo "2. Click 'New repository secret'"
    echo "3. Add all 4 secrets shown above"
    echo "4. Push a commit to test: git push"
    echo ""
    echo "✅ Setup complete! Your CI/CD pipeline is ready!"
else
    echo "❌ Error: Could not find project info"
    echo "Please run: npx vercel link"
fi
