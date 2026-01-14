#!/bin/bash

echo "Setting up Receipt Scanner and Analyzer..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd backend
npm install
cd ..

# Create uploads directory if it doesn't exist
mkdir -p uploads

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend server: cd backend && node server.js"
echo "2. Open your browser and go to: http://localhost:3000"
echo ""
echo "Note: Make sure you have Tesseract OCR installed on your system for image processing."
echo "Install Tesseract OCR:"
echo "- Ubuntu/Debian: sudo apt-get install tesseract-ocr"
echo "- macOS: brew install tesseract"
echo "- Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki"
