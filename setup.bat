@echo off
echo 🏏 Setting up Cricket Player Platform...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v16 or higher first.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js is installed: 
node --version

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [SUCCESS] npm is installed:
npm --version

:: Install root dependencies
echo [INFO] Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Root dependencies installed

:: Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed
cd ..

:: Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed
cd ..

:: Create .env file for backend if it doesn't exist
if not exist "backend\.env" (
    echo [INFO] Creating backend .env file...
    (
        echo # Database Configuration
        echo DB_HOST=localhost
        echo DB_PORT=3306
        echo DB_USERNAME=root
        echo DB_PASSWORD=your_password
        echo DB_DATABASE=cricket_app
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo JWT_EXPIRES_IN=7d
        echo.
        echo # App Configuration
        echo NODE_ENV=development
        echo PORT=3001
    ) > backend\.env
    echo [SUCCESS] Backend .env file created
    echo [WARNING] Please update the database credentials in backend\.env
) else (
    echo [SUCCESS] Backend .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo   1. Make sure MySQL is installed and running
echo   2. Create a database named 'cricket_app'
echo   3. Update database credentials in backend\.env
echo   4. Run 'npm run dev' to start both backend and frontend
echo.
echo 🚀 Quick start commands:
echo   npm run dev          # Start both backend and frontend
echo   npm run dev:backend  # Start only backend
echo   npm run dev:frontend # Start only frontend
echo.
echo 📖 Access points:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:3001
echo   API Docs: http://localhost:3001/api
echo.
echo Happy coding! 🏏
pause