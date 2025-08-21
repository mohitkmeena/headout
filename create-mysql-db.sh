#!/bin/bash

echo "🗄️ Setting up MySQL database for IIIT-Una Feed"

# Try to create database with different authentication methods
echo "Attempting to create database..."

# Method 1: Try with no password (socket authentication)
sudo mysql -u root << 'EOF' 2>/dev/null
CREATE DATABASE IF NOT EXISTS iiituna_feed;
GRANT ALL PRIVILEGES ON iiituna_feed.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES LIKE 'iiituna_feed';
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully using socket authentication!"
    exit 0
fi

# Method 2: Try with password 'root'
mysql -u root -proot << 'EOF' 2>/dev/null
CREATE DATABASE IF NOT EXISTS iiituna_feed;
SHOW DATABASES LIKE 'iiituna_feed';
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database exists/created successfully with password!"
    exit 0
fi

# Method 3: Try with empty password
mysql -u root << 'EOF' 2>/dev/null
CREATE DATABASE IF NOT EXISTS iiituna_feed;
SHOW DATABASES LIKE 'iiituna_feed';
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database exists/created successfully without password!"
    exit 0
fi

echo "❌ Could not connect to MySQL. Please ensure MySQL is running and accessible."
echo ""
echo "To install MySQL:"
echo "  sudo apt update && sudo apt install mysql-server"
echo ""
echo "To start MySQL:"
echo "  sudo systemctl start mysql"
echo ""
echo "To set root password:"
echo "  sudo mysql -u root -e \"ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';\""
