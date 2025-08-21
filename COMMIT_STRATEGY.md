# Git Commit Strategy for Three User Profiles

## Overview
This project needs to be committed to three different branches using three different git profiles:
1. **Frontend Profile** - for frontend-related commits
2. **Backend Profile** - for backend-related commits  
3. **Full-stack Profile** - for integration commits

## Branch Structure
- `main` - Main branch (current)
- `frontend` - Frontend development branch
- `backend` - Backend development branch
- `fullstack` - Integration and full-stack features branch

## Commit Strategy

### 1. Frontend Branch (Frontend Profile)
**Files to commit:**
- `frontend/src/services/api.ts` - API service layer
- `frontend/src/app/page.tsx` - Updated main page
- `frontend/README.md` - Frontend documentation

**Git Profile:**
```bash
git config user.name "Frontend Developer"
git config user.email "frontend@example.com"
```

**Commands:**
```bash
git checkout -b frontend
git add frontend/
git commit -m "feat: Implement comprehensive API service layer and update main page

- Add centralized API service for all backend endpoints
- Update main page to use new API service
- Improve code organization and maintainability
- Add TypeScript interfaces for API calls"
git push origin frontend
```

### 2. Backend Branch (Backend Profile)
**Files to commit:**
- `backend/src/main/resources/application.properties` - MySQL database configuration
- `backend/src/main/resources/application-mysql.properties` - MySQL profile configuration
- `backend/pom.xml` - MySQL dependencies
- `backend/API_DOCUMENTATION.md` - API documentation
- `backend/docker-compose.yml` - MySQL Docker setup
- `backend/init.sql` - MySQL initialization script
- `backend/start-mysql.sh` - MySQL start script
- `backend/README-MYSQL.md` - MySQL setup guide
- All controller files (EventController, LostFoundController, etc.)

**Git Profile:**
```bash
git config user.name "Backend Developer"
git config user.email "backend@example.com"
```

**Commands:**
```bash
git checkout -b backend
git add backend/
git commit -m "feat: Implement comprehensive backend API with MySQL support

- Add complete API endpoints for Events, Lost & Found, Comments, Reactions
- Implement AI services integration (classification, toxicity detection)
- Add comprehensive API documentation
- Configure MySQL database with H2 fallback
- Add proper error handling and validation"
git push origin backend
```

### 3. Full-stack Branch (Full-stack Profile)
**Files to commit:**
- `README.md` - Project overview
- Integration files
- Cross-cutting concerns

**Git Profile:**
```bash
git config user.name "Full Stack Developer"
git config user.email "fullstack@example.com"
```

**Commands:**
```bash
git checkout -b fullstack
git add README.md
git add .gitignore
git commit -m "feat: Complete project integration and documentation

- Add comprehensive project README
- Document architecture and setup instructions
- Integrate frontend and backend components
- Add deployment and contribution guidelines"
git push origin fullstack
```

## Alternative: Single Repository with Multiple Commits

If you prefer to keep everything in one repository, you can commit with different profiles in sequence:

### Step 1: Frontend Commits
```bash
git config user.name "Frontend Developer"
git config user.email "frontend@example.com"
git add frontend/
git commit -m "feat: Implement comprehensive API service layer and update main page"
```

### Step 2: Backend Commits
```bash
git config user.name "Backend Developer"
git config user.email "backend@example.com"
git add backend/
git commit -m "feat: Implement comprehensive backend API with MySQL support"
```

### Step 3: Full-stack Commits
```bash
git config user.name "Full Stack Developer"
git config user.email "fullstack@example.com"
git add README.md
git commit -m "feat: Complete project integration and documentation"
```

## Required Information

To proceed with the commits, please provide:

1. **Frontend Profile:**
   - Username: [Your frontend username]
   - Email: [Your frontend email]

2. **Backend Profile:**
   - Username: [Your backend username]
   - Email: [Your backend email]

3. **Full-stack Profile:**
   - Username: [Your full-stack username]
   - Email: [Your full-stack email]

## Next Steps

Once you provide the git profiles, I will:
1. Create the three branches
2. Configure each branch with the respective git profile
3. Commit the appropriate files to each branch
4. Push all branches to the repository
5. Provide you with the commit hashes and branch information
