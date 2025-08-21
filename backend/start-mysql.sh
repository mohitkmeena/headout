#!/bin/bash

# Quick Start Script for IIIT-Una Feed Backend with MySQL

echo "🚀 Starting IIIT-Una Feed Backend with MySQL..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Starting MySQL database..."
docker-compose up -d mysql

echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo "🔍 Starting phpMyAdmin..."
docker-compose up -d mysql-admin

echo "✅ Services started successfully!"
echo ""
echo "📊 MySQL Database:"
echo "   Host: localhost"
echo "   Port: 3306"
echo "   Database: iiituna_feed"
echo "   Username: root"
echo "   Password: password"
echo ""
echo "🌐 phpMyAdmin: http://localhost:8081"
echo "   Username: root"
echo "   Password: password"
echo ""
echo "🚀 To start the Spring Boot application:"
echo "   mvn spring-boot:run -Dspring.profiles.active=dev"
echo ""
echo "🛑 To stop services: docker-compose down"
echo "📝 To view logs: docker-compose logs -f"
