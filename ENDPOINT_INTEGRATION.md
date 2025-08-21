# API Endpoint Integration Guide

## Overview
This document outlines the specific API endpoints implemented for the IIIT-Una Feed application and their frontend integration.

## Backend Endpoints (Spring Boot)

### Events API (`/api/events`)

#### Core Operations
- `GET /api/events` - Get all events with optional userId parameter
- `GET /api/events/{id}` - Get specific event by ID
- `POST /api/events` - Create new event (requires userId param)
- `PUT /api/events/{id}` - Update event (requires userId param)
- `DELETE /api/events/{id}` - Delete event (requires userId param)
- `POST /api/events/{id}/response` - Add user response (Going/Interested/Not Going)

#### Specific Endpoints
- `GET /api/events/health` - Health check endpoint
- `GET /api/events/upcoming` - Get upcoming events ordered by date
- `GET /api/events/search?keyword=<term>` - Search events by title/description
- `GET /api/events/location/{location}` - Get events by location
- `GET /api/events/user/{userId}` - Get events created by specific user
- `GET /api/events/today` - Get events scheduled for today
- `GET /api/events/stats` - Get event statistics (total, upcoming, past)

### Lost & Found API (`/api/lost-found`)

#### Core Operations
- `GET /api/lost-found` - Get all lost & found items
- `GET /api/lost-found/{id}` - Get specific item by ID
- `POST /api/lost-found` - Create new item (requires userId param)
- `PUT /api/lost-found/{id}` - Update item (requires userId param)
- `DELETE /api/lost-found/{id}` - Delete item (requires userId param)
- `POST /api/lost-found/{id}/resolve` - Mark item as resolved

#### Specific Endpoints
- `GET /api/lost-found/health` - Health check endpoint
- `GET /api/lost-found/type/{type}` - Get items by type (LOST/FOUND)
- `GET /api/lost-found/unresolved` - Get unresolved items only
- `GET /api/lost-found/search?keyword=<term>` - Search items by name/description
- `GET /api/lost-found/stats` - Get statistics (total, lost, found, resolved, unresolved)
- `GET /api/lost-found/user/{userId}` - Get items created by specific user
- `GET /api/lost-found/recent` - Get items from last 7 days

### Comments API (`/api/comments`)
- `GET /api/comments/{postType}/{postId}` - Get comments for a post
- `POST /api/comments/{postType}/{postId}` - Add comment to post
- `POST /api/comments/{commentId}/reply` - Reply to comment
- `PUT /api/comments/{commentId}` - Update comment
- `DELETE /api/comments/{commentId}` - Delete comment
- `GET /api/comments/{postType}/{postId}/count` - Get comment count

### Reactions API (`/api/reactions`)
- `POST /api/reactions/{postType}/{postId}` - Add reaction to post
- `POST /api/reactions/{postType}/{postId}/comment/{commentId}` - Add reaction to comment
- `GET /api/reactions/{postType}/{postId}` - Get post reactions
- `GET /api/reactions/{postType}/{postId}/comment/{commentId}` - Get comment reactions

### AI Services API (`/api/ai`)
- `POST /api/ai/classify` - Classify post type from prompt
- `POST /api/ai/check-toxicity` - Check content for toxicity
- `POST /api/ai/generate-meme` - Generate meme from prompt

## Frontend Integration (Next.js)

### API Service Layer (`/src/services/api.ts`)

The frontend includes a comprehensive API service layer that provides typed interfaces for all backend endpoints:

```typescript
// Events API usage examples
import { api } from '@/services/api';

// Get all events
const events = await api.events.getAll(userId);

// Search events
const searchResults = await api.events.search('workshop', userId);

// Get user's events
const userEvents = await api.events.getUserEvents(userId);

// Get today's events
const todayEvents = await api.events.getTodayEvents(userId);

// Get statistics
const stats = await api.events.getStatistics();
```

### New Frontend Components

#### 1. Dashboard Component (`/src/components/dashboard/Dashboard.tsx`)
- Displays real-time statistics from both APIs
- Shows today's events and recent lost & found items
- Includes health status indicators for backend services
- Provides quick refresh functionality

**Features:**
- Event statistics (total, upcoming, past)
- Lost & Found statistics (total, lost, found, resolved, unresolved)
- Today's events overview
- Recent lost & found items
- API health monitoring

#### 2. Advanced Search Component (`/src/components/search/AdvancedSearch.tsx`)
- Unified search interface for events and lost & found items
- Location-based filtering for events
- Quick action buttons for common searches
- Tabbed results view

**Features:**
- Text search across events and lost & found
- Location-based event filtering
- User-specific content searches
- Quick filters (upcoming events, unresolved items, today's events)
- Results categorization and display

#### 3. API Test Suite (`/src/components/integration/ApiTestSuite.tsx`)
- Comprehensive testing interface for all API endpoints
- Real-time endpoint health monitoring
- Performance testing with response times
- Categorized testing (health, events, lost & found)

**Features:**
- Automated endpoint testing
- Response time measurement
- Success/failure tracking
- Detailed response inspection
- Error reporting and debugging

## Database Repository Methods

### EventRepository
```java
// Standard JPA methods
List<Event> findAllByOrderByCreatedAtDesc();
List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDateTime currentDate);
List<Event> findByCreatedByOrderByCreatedAtDesc(String createdBy);

// Custom query methods
List<Event> findByLocationContainingIgnoreCase(String location);
List<Event> findByTitleOrDescriptionContainingIgnoreCase(String keyword);
List<Event> findByEventDateBetweenOrderByEventDateAsc(LocalDateTime start, LocalDateTime end);

// Count methods
long countByCreatedBy(String createdBy);
long countByEventDateAfter(LocalDateTime currentDate);
```

### LostFoundRepository
```java
// Standard JPA methods
List<LostFound> findAllByOrderByCreatedAtDesc();
List<LostFound> findByTypeOrderByCreatedAtDesc(LostFoundType type);
List<LostFound> findByIsResolvedOrderByCreatedAtDesc(Boolean isResolved);
List<LostFound> findByCreatedByOrderByCreatedAtDesc(String createdBy);

// Custom query methods
List<LostFound> findByLocationContainingIgnoreCase(String location);
List<LostFound> findByItemNameOrDescriptionContainingIgnoreCase(String keyword);
List<LostFound> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);

// Count methods
long countByType(LostFoundType type);
long countByIsResolved(Boolean isResolved);
long countByTypeAndCreatedBy(LostFoundType type, String createdBy);
```

## Error Handling

### Backend
- All endpoints include try-catch blocks with proper HTTP status codes
- Health check endpoints for monitoring API availability
- Validation using `@Valid` annotations
- Custom error responses with meaningful messages

### Frontend
- Comprehensive error handling in API service layer
- Loading states and error displays in components
- Retry mechanisms for failed requests
- User-friendly error messages

## Testing Strategy

### API Testing
Use the integrated API Test Suite component to:
1. Verify all endpoints are responsive
2. Test search and filtering functionality
3. Validate error handling
4. Monitor response times
5. Check data consistency

### Integration Testing
1. Create test data using POST endpoints
2. Verify retrieval using GET endpoints
3. Test search and filtering with known data
4. Validate statistics calculations
5. Test user-specific data isolation

## Performance Considerations

### Backend Optimizations
- Indexed database queries for common search patterns
- Pagination support for large datasets
- Efficient JPA query methods
- Connection pooling and caching

### Frontend Optimizations
- Lazy loading of components
- API response caching
- Debounced search inputs
- Optimistic updates for better UX

## Security Features

### Authentication
- User identification via device ID (no-login policy)
- User-specific data access controls
- Creator-only edit/delete permissions

### Data Validation
- Input sanitization on backend
- Type safety with TypeScript on frontend
- Validation annotations in DTOs
- SQL injection prevention through JPA

## Deployment

### Backend Setup
1. Ensure MySQL database is running
2. Update `application.properties` with correct database credentials
3. Run `mvn spring-boot:run` from backend directory

### Frontend Setup
1. Install dependencies: `npm install`
2. Update API base URL in `api.ts` if needed
3. Run development server: `npm run dev`

### Environment Variables
```bash
# Backend
OPENAI_API_KEY=your-openai-api-key

# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=iiituna_feed
MYSQL_USER=root
MYSQL_PASSWORD=root
```

## API Response Examples

### Event Statistics
```json
{
  "total": 25,
  "upcoming": 12,
  "past": 13
}
```

### Lost & Found Statistics
```json
{
  "total": 18,
  "lost": 10,
  "found": 8,
  "resolved": 6,
  "unresolved": 12
}
```

### Event Search Results
```json
[
  {
    "id": 1,
    "title": "Docker Workshop",
    "description": "Learn containerization basics",
    "location": "CSE Lab",
    "eventDate": "2024-08-22T17:00:00",
    "createdBy": "device_123",
    "goingCount": 15,
    "interestedCount": 8,
    "notGoingCount": 2,
    "userResponse": "GOING"
  }
]
```

This comprehensive integration ensures all API endpoints are properly connected, tested, and documented for the hackathon project.
