#!/bin/bash

# IIIT-Una Feed - Environment Setup Script
echo "🚀 Setting up IIIT-Una Feed Environment"

# Create .env file for backend
echo "📝 Creating environment configuration..."

cat > backend/.env << EOL
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=iiituna_feed
DB_USERNAME=root
DB_PASSWORD=password

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Application Configuration
SERVER_PORT=8080
FRONTEND_URL=http://localhost:3000
EOL

# Create .env.local for frontend  
cat > frontend/.env.local << EOL
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# OpenAI Configuration (if needed on frontend)
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here
EOL

echo "✅ Environment files created!"
echo ""
echo "📋 Next Steps:"
echo "1. Add your OpenAI API key to backend/.env"
echo "2. Update database credentials in backend/.env if needed"
echo "3. Start MySQL server"
echo "4. Run backend: cd backend && ./mvnw spring-boot:run"
echo "5. Run frontend: cd frontend && npm run dev"
echo ""
echo "🔑 To get OpenAI API Key:"
echo "   Visit: https://platform.openai.com/api-keys"
echo ""
echo "🗄️  MySQL Setup:"
echo "   CREATE DATABASE iiituna_feed;"
echo "   (Tables will be auto-created by Spring Boot)"

# Make script executable
chmod +x backend/mvnw
