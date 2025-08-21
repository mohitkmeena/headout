# IIIT-Una Feed Backend API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints require a `userId` parameter for user identification. This can be a device ID, user ID, or any unique identifier.

## API Endpoints

### 1. Events API (`/api/events`)

#### Get All Events
```http
GET /api/events?userId={userId}
```
**Query Parameters:**
- `userId` (optional): User ID to get personalized responses

**Response:** List of events with user responses if userId provided

#### Get Event by ID
```http
GET /api/events/{id}?userId={userId}
```
**Path Parameters:**
- `id`: Event ID

**Query Parameters:**
- `userId` (optional): User ID to get personalized response

#### Create Event
```http
POST /api/events?userId={userId}
```
**Query Parameters:**
- `userId`: User ID of the creator

**Request Body:**
```json
{
  "title": "Event Title",
  "description": "Event Description",
  "location": "Event Location",
  "eventDate": "2024-01-15T10:00:00",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Event
```http
PUT /api/events/{id}?userId={userId}
```
**Path Parameters:**
- `id`: Event ID

**Query Parameters:**
- `userId`: User ID of the creator

**Request Body:** Same as create event

#### Delete Event
```http
DELETE /api/events/{id}?userId={userId}
```
**Path Parameters:**
- `id`: Event ID

**Query Parameters:**
- `userId`: User ID of the creator

#### Add Event Response
```http
POST /api/events/{id}/response?userId={userId}&response={response}
```
**Path Parameters:**
- `id`: Event ID

**Query Parameters:**
- `userId`: User ID
- `response`: "GOING", "INTERESTED", or "NOT_GOING"

#### Get Upcoming Events
```http
GET /api/events/upcoming?userId={userId}
```
**Query Parameters:**
- `userId` (optional): User ID to get personalized responses

#### Search Events
```http
GET /api/events/search?keyword={keyword}&userId={userId}
```
**Query Parameters:**
- `keyword`: Search term
- `userId` (optional): User ID to get personalized responses

### 2. Lost & Found API (`/api/lost-found`)

#### Get All Items
```http
GET /api/lost-found
```
**Response:** List of all lost and found items

#### Get Item by ID
```http
GET /api/lost-found/{id}
```
**Path Parameters:**
- `id`: Item ID

#### Create Item
```http
POST /api/lost-found?userId={userId}
```
**Query Parameters:**
- `userId`: User ID of the creator

**Request Body:**
```json
{
  "itemName": "Item Name",
  "description": "Item Description",
  "type": "LOST" or "FOUND",
  "location": "Location",
  "imageUrl": "https://example.com/image.jpg",
  "contactInfo": "contact@example.com"
}
```

#### Update Item
```http
PUT /api/lost-found/{id}?userId={userId}
```
**Path Parameters:**
- `id`: Item ID

**Query Parameters:**
- `userId`: User ID of the creator

#### Delete Item
```http
DELETE /api/lost-found/{id}?userId={userId}
```
**Path Parameters:**
- `id`: Item ID

**Query Parameters:**
- `userId`: User ID of the creator

#### Mark Item as Resolved
```http
POST /api/lost-found/{id}/resolve?userId={userId}
```
**Path Parameters:**
- `id`: Item ID

**Query Parameters:**
- `userId`: User ID resolving the item

#### Get Items by Type
```http
GET /api/lost-found/type/{type}
```
**Path Parameters:**
- `type`: "LOST" or "FOUND"

#### Get Unresolved Items
```http
GET /api/lost-found/unresolved
```
**Response:** List of unresolved items

#### Search Items
```http
GET /api/lost-found/search?keyword={keyword}
```
**Query Parameters:**
- `keyword`: Search term

### 3. Comments API (`/api/comments`)

#### Get Comments for a Post
```http
GET /api/comments/{postType}/{postId}
```
**Path Parameters:**
- `postType`: "events" or "lost-found"
- `postId`: Post ID

#### Add Comment
```http
POST /api/comments/{postType}/{postId}?userId={userId}
```
**Path Parameters:**
- `postType`: "events" or "lost-found"
- `postId`: Post ID

**Query Parameters:**
- `userId`: User ID

**Request Body:**
```json
{
  "content": "Comment content",
  "parentId": "123" // Optional, for replies
}
```

#### Add Reply to Comment
```http
POST /api/comments/{commentId}/reply?userId={userId}
```
**Path Parameters:**
- `commentId`: Parent comment ID

**Query Parameters:**
- `userId`: User ID

**Request Body:**
```json
{
  "content": "Reply content"
}
```

#### Update Comment
```http
PUT /api/comments/{commentId}?userId={userId}
```
**Path Parameters:**
- `commentId`: Comment ID

**Query Parameters:**
- `userId`: User ID of the comment creator

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

#### Delete Comment
```http
DELETE /api/comments/{commentId}?userId={userId}
```
**Path Parameters:**
- `commentId`: Comment ID

**Query Parameters:**
- `userId`: User ID of the comment creator

#### Get Comment Count
```http
GET /api/comments/{postType}/{postId}/count
```
**Path Parameters:**
- `postType`: "events" or "lost-found"
- `postId`: Post ID

### 4. Reactions API (`/api/reactions`)

#### Add/Update Post Reaction
```http
POST /api/reactions/{postType}/{postId}?userId={userId}&reactionType={reactionType}
```
**Path Parameters:**
- `postType`: "events" or "lost-found"
- `postId`: Post ID

**Query Parameters:**
- `userId`: User ID
- `reactionType`: "LIKE", "LOVE", "LAUGH", "WOW", "SAD", "ANGRY"

#### Add/Update Comment Reaction
```http
POST /api/reactions/{postType}/{postId}/comment/{commentId}?userId={userId}&reactionType={reactionType}
```
**Path Parameters:**
- `postType`: "events" or "lost-found"
- `postId`: Post ID
- `commentId`: Comment ID

**Query Parameters:**
- `userId`: User ID
- `reactionType`: "LIKE", "LOVE", "LAUGH", "WOW", "SAD", "ANGRY"

#### Get Post Reactions
```http
GET /api/reactions/{postType}/{postId}?userId={userId}
```
**Path Parameters:**
- `postType`: "events" or "lost-found"
- `postId`: Post ID

**Query Parameters:**
- `userId` (optional): User ID to get user's reaction

#### Get Comment Reactions
```http
GET /api/reactions/{postType}/{postId}/comment/{commentId}?userId={userId}
```
**Path Parameters:**
- `postType`: "events" or "lost-found"
- `postId`: Post ID
- `commentId`: Comment ID

**Query Parameters:**
- `userId` (optional): User ID to get user's reaction

### 5. AI Services API (`/api/ai`)

#### Classify Post
```http
POST /api/ai/classify
```
**Request Body:**
```json
{
  "prompt": "Post content to classify"
}
```

#### Check Toxicity
```http
POST /api/ai/check-toxicity
```
**Request Body:**
```json
{
  "content": "Content to check for toxicity"
}
```

#### Generate Meme
```http
POST /api/ai/generate-meme
```
**Request Body:**
```json
{
  "prompt": "Meme description"
}
```

## Response Formats

### Success Response
```json
{
  "id": 1,
  "title": "Example",
  "description": "Description",
  "createdAt": "2024-01-15T10:00:00",
  "createdBy": "user123"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-15T10:00:00"
}
```

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently no rate limiting implemented. Consider implementing for production use.

## CORS

All endpoints support CORS with the following configuration:
- Allowed origins: `*` (for development)
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Allowed headers: `*`
