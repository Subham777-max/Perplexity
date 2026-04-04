# Perplexity Backend

Node.js and Express.js based backend server providing AI-powered chat functionality with real-time WebSocket communication, MongoDB persistence, and integration with multiple AI providers.

## Overview

The backend handles:
- User authentication and authorization
- Real-time chat server via Socket.IO
- AI response generation with LangChain
- Internet search integration
- Chat history management
- Message persistence

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.IO 4
- **AI Integration**: LangChain with:
  - Google Generative AI (Gemini)
  - Mistral AI
- **Web Search**: Tavily API
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Input Validation**: express-validator and Zod
- **Email**: Nodemailer
- **Logging**: Morgan

## Project Structure

```
Backend/
├── src/
│   ├── app.js                          (Express app configuration)
│   │
│   ├── config/
│   │   └── db.js                       (MongoDB connection setup)
│   │
│   ├── controllers/
│   │   ├── auth.controller.js          (Authentication logic)
│   │   └── chat.controller.js          (Chat operations)
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js          (JWT verification)
│   │   ├── errorHandler.middleware.js  (Global error handling)
│   │   └── validate.middleware.js      (Input validation)
│   │
│   ├── models/
│   │   ├── user.model.js               (User schema)
│   │   ├── chat.model.js               (Chat thread schema)
│   │   └── message.model.js            (Message schema)
│   │
│   ├── routes/
│   │   ├── auth.routes.js              (Auth endpoints)
│   │   └── chat.routes.js              (Chat endpoints)
│   │
│   ├── services/
│   │   ├── ai.service.js               (AI model integration)
│   │   ├── internet.service.js         (Tavily search service)
│   │   └── mail.service.js             (Email sending)
│   │
│   ├── sockets/
│   │   └── server.socket.js            (Socket.IO handlers)
│   │
│   └── validator/
│       └── auth.validator.js           (Input validation schemas)
│
├── server.js                            (Entry point)
├── package.json
├── .env.example
└── README.md
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  title: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  chatId: ObjectId (reference to Chat),
  userId: ObjectId (reference to User),
  content: String,
  role: String ('user' or 'ai'),
  isStreaming: Boolean,
  createdAt: Date
}
```

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt_token",
  "user": { id, username, email }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer jwt_token

Response: 200 OK
{
  "success": true,
  "user": { id, username, email }
}
```

### Chat Routes

#### Get All Chats
```
GET /api/chat/chats
Authorization: Bearer jwt_token

Response: 200 OK
{
  "success": true,
  "chats": [
    {
      "_id": "chat_id",
      "title": "Chat Title",
      "createdAt": "2024-04-04T...",
      "updatedAt": "2024-04-04T..."
    }
  ]
}
```

#### Get Chat Messages
```
GET /api/chat/:chatId/messages
Authorization: Bearer jwt_token

Response: 200 OK
{
  "success": true,
  "messages": [
    {
      "_id": "message_id",
      "content": "Message content",
      "role": "user|ai",
      "createdAt": "2024-04-04T..."
    }
  ]
}
```

#### Delete Chat
```
DELETE /api/chat/:chatId
Authorization: Bearer jwt_token

Response: 200 OK
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

## WebSocket Events

### Client to Server

#### Send Message
```javascript
socket.emit('message:send', {
  chatId: "optional_existing_chat_id",
  message: "User message text"
})
```

### Server to Client

#### Message Added
```javascript
socket.on('message:user-added', {
  messageId: "message_id",
  chatId: "chat_id",
  content: "User message",
  role: "user",
  createdAt: "timestamp"
})
```

#### AI Streaming Response
```javascript
socket.on('ai:streaming', {
  messageId: "message_id",
  chatId: "chat_id",
  content: "Partial AI response chunk",
  isStreaming: true
})
```

#### Message Complete
```javascript
socket.on('ai:message-complete', {
  messageId: "message_id",
  chatId: "chat_id",
  content: "Complete AI response",
  chatTitle: "Auto-generated chat title",
  isStreaming: false
})
```

## Request/Response Flow

```mermaid
graph LR
    Client["Client"]
    Socket["WebSocket"]
    BackendSocket["Backend Socket Handler"]
    Validate["Validate User"]
    CreateChat["Check/Create Chat"]
    SaveUserMsg["Save User Message"]
    Emit1["Emit: message:user-added"]
    AIService["Call AI Service"]
    Search{Search Needed?}
    InternetAPI["Tavily Search API"]
    LLMChain["Create LLM Chain"]
    AIModel["Call AI Model"]
    Stream["Stream Response Chunks"]
    Emit2["Emit: ai:streaming"]
    UpdateDB["Save AI Message"]
    UpdateTitle["Update Chat Title"]
    Emit3["Emit: ai:message-complete"]

    Client -->|message:send| Socket
    Socket --> BackendSocket
    BackendSocket --> Validate
    Validate --> CreateChat
    CreateChat --> SaveUserMsg
    SaveUserMsg --> Emit1
    Emit1 -->|socket| Client
    SaveUserMsg --> AIService
    AIService --> Search
    Search -->|Yes| InternetAPI
    InternetAPI -->|Results| LLMChain
    Search -->|No| LLMChain
    LLMChain --> AIModel
    AIModel --> Stream
    Stream --> Emit2
    Emit2 -->|socket| Client
    Stream --> UpdateDB
    UpdateDB --> UpdateTitle
    UpdateTitle --> Emit3
    Emit3 -->|socket| Client
```

## Environment Configuration

Create a `.env` file in the Backend directory:

```
# Database
MONGODB_URI=mongodb://localhost:27017/perplexity
# or use MongoDB Atlas: mongodb+srv://user:password@cluster.mongodb.net/perplexity

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# AI Services
GOOGLE_API_KEY=your_google_gemini_api_key
MISTRAL_API_KEY=your_mistral_ai_api_key

# Search Service
TAVILY_API_KEY=your_tavily_search_api_key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Server
PORT=3000
NODE_ENV=development
```

## Installation & Setup

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas)
- API keys from Google, Mistral, and Tavily

### Steps

1. **Install Dependencies**
```bash
cd Backend
npm install
```

2. **Configure Environment**
```bash
# Copy example and configure
cp .env.example .env
# Edit .env with your API keys and database URL
```

3. **Start Development Server**
```bash
npm run dev
```

Server will start at `http://localhost:3000`

4. **Start Production Server** (if applicable)
```bash
npm start
```

## Authentication Flow

```mermaid
graph TD
    A["User Registration"] --> B["Validate Input Format"]
    B --> C{User Already Exists?}
    C -->|Yes| D["Return Error 400"]
    C -->|No| E["Hash Password with bcryptjs"]
    E --> F["Create User in MongoDB"]
    F --> G["Generate JWT Token"]
    G --> H["Return Token to Client"]
    
    I["User Login"] --> J["Find User by Email"]
    J --> K{User Found?}
    K -->|No| D
    K -->|Yes| L["Compare Password with Hash"]
    L --> M{Password Match?}
    M -->|No| D
    M -->|Yes| N["Generate JWT Token"]
    N --> O["Return Token and User Info"]
    O --> P["Client Stores Token"]
    P --> Q["Set Authorization Header"]
    Q --> R["Frontend Redirects to Dashboard"]
```

## AI Service Integration

```mermaid
graph TD
    A["User Message"] --> B["Extract Intent & Context"]
    B --> C["Determine if Internet Search Needed"]
    C --> D{Search Required?}
    D -->|Yes| E["Query Tavily API"]
    E --> F["Format Search Results"]
    D -->|No| G["Skip Search"]
    F --> H["Create LLM Chain with Context"]
    G --> H
    H --> I["Select AI Model"]
    I --> J{Model Selection}
    J -->|Google Gemini| K["Call Google Gemini API"]
    J -->|Mistral AI| L["Call Mistral AI API"]
    K --> M["Stream Response Chunks"]
    L --> M
    M --> N["Send Chunks to Client via Socket.IO"]
    N --> O["Store Complete Response"]
    O --> P["Generate Chat Title"]
    P --> Q["Save to Database"]
    Q --> R["Send Completion Event"]
```

## Middleware Architecture

```mermaid
graph TD
    A["Incoming HTTP Request"]
    A --> B["CORS Middleware"]
    B --> C["Body Parser Middleware"]
    C --> D["Morgan Logging Middleware"]
    D --> E{Protected Route?}
    E -->|Yes| F["JWT Auth Middleware"]
    E -->|No| G["Route Handler"]
    F --> H{JWT Valid?}
    H -->|No| I["Return 401 Unauthorized"]
    H -->|Yes| J["Input Validation Middleware"]
    J --> K{Input Valid?}
    K -->|No| L["Return 400 Bad Request"]
    K -->|Yes| G["Route Handler - Controller"]
    G --> M{Success?}
    M -->|Yes| N["Send Response"]
    M -->|No| O["Catch Error"]
    O --> P["Error Handler Middleware"]
    P --> Q["Format Error Response"]
    Q --> R["Send Error Response"]
    N --> S["Response Complete"]
    R --> S
    I --> S
    L --> S
```

## Error Handling

The backend implements comprehensive error handling:

- **Validation Errors** (400) - Invalid input format
- **Authentication Errors** (401) - Missing or invalid JWT
- **Authorization Errors** (403) - User doesn't have permission
- **Not Found Errors** (404) - Resource doesn't exist
- **Server Errors** (500) - Unexpected errors

All errors return structured response:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Development Tips

### Testing with Postman

1. Create a collection for API endpoints
2. Set environment variable: `{{token}}` from login response
3. Use JWT in Authorization header by default
4. Test each endpoint in order of dependency

### Debugging WebSocket

1. Open browser DevTools
2. Go to Console
3. Watch socket emit/receive events:
```javascript
socket.onAny((eventName, ...args) => {
  console.log("Event:", eventName, args);
});
```

### Database Monitoring

Use MongoDB Compass or Atlas Dashboard to:
- View collections and documents
- Monitor query performance
- Analyze database size

## Performance Optimization

- **Indexing**: Database indexes on frequently queried fields (userId, chatId)
- **Caching**: Implement Redis for session caching (future enhancement)
- **Streaming**: Stream AI responses instead of waiting for complete response
- **Pagination**: Implement pagination for large chat histories

## Security Best Practices

- Change JWT_SECRET in production
- Use HTTPS in production
- Set secure CORS origins
- Implement rate limiting on auth endpoints
- Validate all user inputs
- Sanitize error messages in production
- Keep dependencies updated

## Common Issues & Solutions

### MongoDB Connection Failed
- Verify MongoDB is running
- Check connection string format
- Ensure database user has correct permissions
- Check IP whitelist in MongoDB Atlas (if using)

### Socket.IO Connection Issues
- Verify CORS settings allow frontend URL
- Check Socket.IO client version matches server
- Ensure WebSocket protocol is supported

### AI Service Errors
- Verify all API keys are correct
- Check API key permissions
- Monitor API rate limits
- Verify request format matches API specification

## Deployment

For production deployment:

1. Use environment variables from hosting platform
2. Enable CORS only for your frontend domain
3. Use secure MongoDB connection (Atlas)
4. Set NODE_ENV=production
5. Implement rate limiting
6. Set up error logging service
7. Use reverse proxy (Nginx) if needed

## Scripts

```bash
npm run dev     # Start development server with hot reload
npm start       # Start production server
npm test        # Run tests (to be implemented)
```

## Future Enhancements

- Implement unit and integration tests
- Add request rate limiting
- Implement caching layer with Redis
- Add email verification
- Implement password reset functionality
- Add user analytics
- Support multiple AI models selection
- Implement conversation branching
- Add file upload support

## Contributing

When adding new features:

1. Create feature branch
2. Add new route in `/routes`
3. Create controller in `/controllers`
4. Add business logic in `/services`
5. Update database models if needed
6. Test with all variations
7. Update API documentation

## Support & Documentation

For more information:
- Check main README.md in root directory
- Review Frontend README.md for front-end integration
- Check individual files for detailed comments
