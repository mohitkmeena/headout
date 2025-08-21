#!/bin/bash

echo "🗄️ Setting up MySQL for IIIT-Una Feed"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Installing MySQL..."
    sudo apt update
    sudo apt install mysql-server -y
    echo "✅ MySQL installed!"
else
    echo "✅ MySQL is already installed"
fi

# Start MySQL service
echo "🚀 Starting MySQL service..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Check MySQL status
if sudo systemctl is-active --quiet mysql; then
    echo "✅ MySQL is running"
else
    echo "❌ Failed to start MySQL"
    exit 1
fi

# Create database and user
echo "📊 Setting up database..."
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS iiituna_feed;
CREATE USER IF NOT EXISTS 'feeduser'@'localhost' IDENTIFIED BY 'feedpassword';
GRANT ALL PRIVILEGES ON iiituna_feed.* TO 'feeduser'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EOF

echo ""
echo "✅ MySQL setup complete!"
echo ""
echo "📋 Database Details:"
echo "   Database: iiituna_feed"
echo "   User: feeduser"
echo "   Password: feedpassword"
echo "   Host: localhost"
echo "   Port: 3306"
echo ""
echo "🔧 Update backend/src/main/resources/application.properties:"
echo "   spring.datasource.username=feeduser"
echo "   spring.datasource.password=feedpassword"

