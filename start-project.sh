#!/bin/bash

echo "🚀 Starting IIIT-Una Feed Project"
echo ""

# Check if MySQL is running
echo "📊 Checking MySQL connection..."
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL not found. Please install MySQL and create database:"
    echo "   CREATE DATABASE iiituna_feed;"
    exit 1
fi

# Start backend in background
echo "🔧 Starting Backend (Spring Boot)..."
cd backend
gnome-terminal --tab --title="Backend" -- bash -c "./mvnw spring-boot:run; exec bash" &
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend (Next.js)..."
cd frontend
gnome-terminal --tab --title="Frontend" -- bash -c "npm install && npm run dev; exec bash" &
cd ..

echo ""
echo "✅ Project started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo ""
echo "📋 To stop the project:"
echo "   Press Ctrl+C in both terminal tabs"
echo ""
echo "🗄️  Database Setup (if needed):"
echo "   mysql -u root -p"
echo "   CREATE DATABASE iiituna_feed;"
echo ""
echo "Happy coding! 🎉"
