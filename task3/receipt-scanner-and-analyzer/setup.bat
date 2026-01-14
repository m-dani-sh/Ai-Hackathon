@echo off
echo Setting up Receipt Scanner and Analyzer...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python 3 is required but not installed. Please install Python 3 first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is required but not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r backend\requirements.txt

REM Install Node.js dependencies
echo Installing Node.js dependencies...
cd backend
npm install
cd ..

REM Create uploads directory if it doesn't exist
if not exist uploads mkdir uploads

echo Setup complete!
echo.
echo To start the application:
echo 1. Start the backend server: cd backend && node server.js
echo 2. Open your browser and go to: http://localhost:3000
echo.
echo Note: Make sure you have Tesseract OCR installed on your system for image processing.
echo Install Tesseract OCR from: https://github.com/UB-Mannheim/tesseract/wiki
pause
