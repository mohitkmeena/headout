# IIIT-Una Feed - AI Hackathon Project

## Team Structure
- **Backend Developer**: Spring Boot APIs, Database, Core Logic
- **Frontend Developer**: Next.js UI, Components, User Experience
- **Full Stack Developer**: Git Management, AI Integration, Comments/Reactions

## Architecture
- **Backend**: Java Spring Boot with H2 Database
- **Frontend**: Next.js with Tailwind CSS
- **AI**: OpenAI API for post classification and toxicity detection

## Quick Start

### Backend (Port 8080)
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

## Git Workflow
- `main` - Production ready code
- `backend/feature-name` - Backend features
- `frontend/feature-name` - Frontend features
- `integration/feature-name` - Full stack features

## Features
1. **Smart Post Creation**: Single textbox → AI classification → Editable preview
2. **Post Types**: Events, Lost & Found, Announcements
3. **AI Features**: Toxicity detection, Meme generation
4. **Interactions**: Comments, Reactions, Threading

## API Endpoints
- `POST /api/posts/classify` - AI post classification
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create new post
- `POST /api/comments` - Add comment
- `POST /api/reactions` - Add reaction
