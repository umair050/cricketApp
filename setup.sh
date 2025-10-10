#!/bin/bash

echo "🏏 Setting up Cricket Player Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm -v) is installed"

# Install root dependencies
print_status "Installing root dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    print_status "Creating backend .env file..."
    cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env << EOL
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=cricket_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# App Configuration
NODE_ENV=development
PORT=3001
EOL
    print_success "Backend .env file created"
    print_warning "Please update the database credentials in backend/.env"
else
    print_success "Backend .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Make sure MySQL is installed and running"
echo "  2. Create a database named 'cricket_app'"
echo "  3. Update database credentials in backend/.env"
echo "  4. Run 'npm run dev' to start both backend and frontend"
echo ""
echo "🚀 Quick start commands:"
echo "  npm run dev          # Start both backend and frontend"
echo "  npm run dev:backend  # Start only backend"
echo "  npm run dev:frontend # Start only frontend"
echo ""
echo "📖 Access points:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3001"
echo "  API Docs: http://localhost:3001/api"
echo ""
echo "Happy coding! 🏏"