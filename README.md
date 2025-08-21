# IIIT-Una Feed Platform

A comprehensive campus feed platform built with Spring Boot backend and Next.js frontend, featuring events, lost & found items, comments, reactions, and AI-powered content moderation.

## 🚀 Features

### Backend Features
- **Events Management**: Create, update, delete, and respond to campus events
- **Lost & Found System**: Post and manage lost/found items with resolution tracking
- **Comment System**: Nested comments with AI-powered toxicity detection
- **Reaction System**: Like, love, laugh, wow, sad, and angry reactions
- **AI Services**: Content classification, toxicity detection, and meme generation
- **Database**: MySQL support with H2 fallback for development
- **RESTful API**: Comprehensive API endpoints with proper error handling

### Frontend Features
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Real-time Updates**: Live feed updates with optimistic UI
- **Responsive Design**: Mobile-first approach with beautiful animations
- **API Integration**: Centralized API service layer
- **User Management**: Device-based user identification

## 🏗️ Architecture

```
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # Next.js Frontend
│   ├── src/app/           # App router pages
│   ├── src/components/    # React components
│   ├── src/services/      # API services
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: MySQL 8.0 / H2 (development)
- **ORM**: Spring Data JPA with Hibernate
- **Build Tool**: Maven
- **API**: RESTful with CORS support

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher (for production)
- Maven 3.6 or higher

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd headout
```

### 2. Backend Setup

#### MySQL Database (Recommended)
```bash
cd backend
# Start MySQL using Docker (easiest method)
chmod +x start-mysql.sh
./start-mysql.sh

# Or start MySQL manually and update credentials in application.properties
mvn spring-boot:run
```

#### Alternative: H2 Database (Development only)
```bash
cd backend
# Temporarily switch to H2 by commenting out MySQL profile
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console (if using H2)

## 📚 API Documentation

Comprehensive API documentation is available in `backend/API_DOCUMENTATION.md`

### Key Endpoints
- **Events**: `/api/events`
- **Lost & Found**: `/api/lost-found`
- **Comments**: `/api/comments`
- **Reactions**: `/api/reactions`
- **AI Services**: `/api/ai`

## 🔧 Configuration

### Backend Configuration
- **Database**: Configure in `src/main/resources/application.properties`
- **Profiles**: Use `dev`, `prod`, or `mysql` profiles
- **CORS**: Configured for development (allows all origins)

### Frontend Configuration
- **API Base URL**: Configure in `src/services/api.ts`
- **Environment Variables**: Use `.env.local` for environment-specific config

## 🗄️ Database Schema

### Events Table
- `id`, `title`, `description`, `location`, `event_date`
- `image_url`, `created_by`, `created_at`
- `going_count`, `interested_count`, `not_going_count`

### Lost & Found Table
- `id`, `item_name`, `description`, `type`, `location`
- `incident_date`, `image_url`, `contact_info`
- `created_by`, `created_at`, `is_resolved`

### Comments Table
- `id`, `content`, `post_id`, `post_type`, `parent_id`
- `created_by`, `created_at`, `is_toxic`, `toxicity_score`

### Reactions Table
- `id`, `reaction_type`, `post_id`, `post_type`, `target_type`
- `target_id`, `created_by`, `created_at`

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/feed-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Image upload and management
- [ ] User authentication and authorization
- [ ] Mobile app development
- [ ] Analytics and reporting
- [ ] Multi-language support

## 📊 Project Status

- ✅ Backend API complete
- ✅ Frontend basic structure
- ✅ Database integration
- ✅ AI services integration
- 🔄 Frontend components (in progress)
- ⏳ Testing and documentation
- ⏳ Deployment configuration
