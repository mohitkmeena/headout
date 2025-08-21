# 🔌 IIIT-Una Feed API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
- Uses device-based identification (no login required)
- Pass `userId` as query parameter for user-specific operations

---

## 📝 **Events API**

### Get All Events
```http
GET /api/events?userId={deviceId}
```
**Response:**
```json
[
  {
    "id": 1,
    "title": "AI Workshop",
    "description": "Learn about machine learning basics",
    "location": "CSE Lab",
    "eventDate": "2024-08-22T17:00:00",
    "imageUrl": "http://example.com/image.jpg",
    "createdBy": "device_123",
    "createdAt": "2024-08-21T10:30:00",
    "goingCount": 15,
    "interestedCount": 8,
    "notGoingCount": 2,
    "userResponse": "GOING"
  }
]
```

### Create Event
```http
POST /api/events?userId={deviceId}
Content-Type: application/json

{
  "title": "AI Workshop",
  "description": "Learn about machine learning basics",
  "location": "CSE Lab",
  "eventDate": "2024-08-22T17:00:00",
  "imageUrl": "http://example.com/image.jpg"
}
```

### Get Event by ID
```http
GET /api/events/{id}?userId={deviceId}
```

### Update Event
```http
PUT /api/events/{id}?userId={deviceId}
Content-Type: application/json

{
  "title": "Updated AI Workshop",
  "description": "Advanced machine learning session",
  "location": "Main Auditorium",
  "eventDate": "2024-08-23T17:00:00"
}
```

### Respond to Event
```http
POST /api/events/{id}/response?userId={deviceId}&response={GOING|INTERESTED|NOT_GOING}
```

### Get Upcoming Events
```http
GET /api/events/upcoming?userId={deviceId}
```

### Search Events
```http
GET /api/events/search?keyword={searchTerm}&userId={deviceId}
```

---

## 🔍 **Lost & Found API**

### Get All Items
```http
GET /api/lost-found
```
**Response:**
```json
[
  {
    "id": 1,
    "itemName": "Black Wallet",
    "description": "Leather wallet with ID cards",
    "type": "LOST",
    "location": "Library",
    "incidentDate": "2024-08-21T14:30:00",
    "imageUrl": "http://example.com/wallet.jpg",
    "contactInfo": "9876543210",
    "createdBy": "device_456",
    "createdAt": "2024-08-21T15:00:00",
    "isResolved": false,
    "resolvedAt": null,
    "resolvedBy": null
  }
]
```

### Create Lost/Found Item
```http
POST /api/lost-found?userId={deviceId}
Content-Type: application/json

{
  "itemName": "iPhone 15",
  "description": "Black iPhone with cracked screen",
  "type": "LOST",
  "location": "Cafeteria",
  "contactInfo": "student@iiituna.edu"
}
```

### Mark as Resolved
```http
POST /api/lost-found/{id}/resolve?userId={deviceId}
```

### Get by Type
```http
GET /api/lost-found/type/{LOST|FOUND}
```

### Get Unresolved Items
```http
GET /api/lost-found/unresolved
```

### Search Items
```http
GET /api/lost-found/search?keyword={searchTerm}
```

---

## 💬 **Comments API**

### Get Comments for Post
```http
GET /api/comments/{postType}/{postId}
```
**Post Types:** `event`, `lost-found`

**Response:**
```json
[
  {
    "id": 1,
    "content": "Great event! Looking forward to it.",
    "createdBy": "device_789",
    "createdAt": "2024-08-21T16:00:00",
    "parentId": null,
    "isToxic": false,
    "toxicityScore": 0.1,
    "replies": [
      {
        "id": 2,
        "content": "Same here!",
        "createdBy": "device_101",
        "createdAt": "2024-08-21T16:05:00",
        "parentId": 1
      }
    ]
  }
]
```

### Add Comment
```http
POST /api/comments/{postType}/{postId}?userId={deviceId}
Content-Type: application/json

{
  "content": "This looks interesting!"
}
```

### Add Reply
```http
POST /api/comments/{commentId}/reply?userId={deviceId}
Content-Type: application/json

{
  "content": "I agree!"
}
```

### Update Comment
```http
PUT /api/comments/{commentId}?userId={deviceId}
Content-Type: application/json

{
  "content": "Updated comment text"
}
```

### Delete Comment
```http
DELETE /api/comments/{commentId}?userId={deviceId}
```

### Get Comment Count
```http
GET /api/comments/{postType}/{postId}/count
```

---

## 😊 **Reactions API**

### Add/Update Reaction to Post
```http
POST /api/reactions/{postType}/{postId}?userId={deviceId}&reactionType={emoji}
```
**Reaction Types:** `👍`, `❤️`, `😂`, `😢`, `😠`

### Add/Update Reaction to Comment
```http
POST /api/reactions/{postType}/{postId}/comment/{commentId}?userId={deviceId}&reactionType={emoji}
```

### Get Post Reactions
```http
GET /api/reactions/{postType}/{postId}?userId={deviceId}
```
**Response:**
```json
{
  "reactions": {
    "👍": 15,
    "❤️": 8,
    "😂": 3
  },
  "userReaction": "👍"
}
```

### Get Comment Reactions
```http
GET /api/reactions/{postType}/{postId}/comment/{commentId}?userId={deviceId}
```

---

## 🤖 **AI API**

### Classify Post (Optional)
```http
POST /api/ai/classify
Content-Type: application/json

{
  "prompt": "Lost my black wallet near the library"
}
```
**Response:**
```json
{
  "type": "lost",
  "confidence": 0.95,
  "title": "Black Wallet",
  "description": "Lost my black wallet near the library",
  "location": "library",
  "itemName": "Black Wallet"
}
```

### Check Toxicity
```http
POST /api/ai/check-toxicity
Content-Type: application/json

{
  "content": "This is a test comment"
}
```
**Response:**
```json
{
  "toxic": false,
  "toxicityScore": 0.1,
  "suggestion": null
}
```

### Generate Meme (Bonus)
```http
POST /api/ai/generate-meme
Content-Type: application/json

{
  "prompt": "When you find your lost phone"
}
```

---

## 📊 **Error Responses**

### Standard Error Format
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "timestamp": "2024-08-21T10:30:00",
  "status": 400
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 **Testing with cURL**

### Create Event Example
```bash
curl -X POST "http://localhost:8080/api/events?userId=device_test123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Workshop",
    "description": "Testing the API",
    "location": "Test Lab",
    "eventDate": "2024-08-25T15:00:00"
  }'
```

### Create Lost Item Example
```bash
curl -X POST "http://localhost:8080/api/lost-found?userId=device_test123" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Test Phone",
    "description": "Testing lost item creation",
    "type": "LOST",
    "location": "Test Location",
    "contactInfo": "test@example.com"
  }'
```

### Add Comment Example
```bash
curl -X POST "http://localhost:8080/api/comments/event/1?userId=device_test123" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great event!"
  }'
```

