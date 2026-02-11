#!/bin/bash

echo "🚀 Setting up Genix Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✓ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your credentials:"
    echo "   - Supabase URL and keys"
    echo "   - GitHub OAuth credentials"
    echo "   - Stripe API keys"
    echo ""
else
    echo "✓ .env.local already exists"
    echo ""
fi

# Create public directories if they don't exist
mkdir -p public/images
mkdir -p public/templates

echo "✓ Public directories created"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Read README.md for detailed setup instructions"
echo ""
