# REST API Plan

## 1. Resources

- **Users**: Represents users in the system. (Database table: `users`)
- **Flashcards**: Represents flashcards created manually or accepted from AI generation. (Database table: `flashcards`)
- **Generations**: Represents AI generation sessions that record flashcard proposals and statistics. (Database table: `generations`)

## 2. Endpoints

### 2.1 Authentication Endpoints

1. **POST /api/auth/register**
   - **Description**: Register a new user.
   - **Request JSON**:
     ```json
     {
       "email": "string",
       "password": "string",
       "passwordConfirmation": "string"
     }
     ```
   - **Response JSON**:
     ```json
     {
       "userId": "uuid",
       "email": "string",
       "createdAt": "ISO8601 timestamp"
     }
     ```
   - **Success**: 201 Created
   - **Errors**: 400 Bad Request (validation errors), 409 Conflict (email already exists)

2. **POST /api/auth/login**
   - **Description**: Log in a user.
   - **Request JSON**:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - **Response JSON**:
     ```json
     {
       "token": "JWT token",
       "user": {
         "userId": "uuid",
         "email": "string"
       }
     }
     ```
   - **Success**: 200 OK
   - **Errors**: 401 Unauthorized (invalid credentials)

3. **POST /api/auth/logout**
   - **Description**: Log out the current user.
   - **Request**: No payload required; token must be provided in the header.
   - **Response**: 200 OK with a message "Logged out successfully"
   - **Errors**: 401 Unauthorized (if token is missing or invalid)

### 2.2 Flashcards Endpoints

1. **GET /api/flashcards**
   - **Description**: Retrieve a paginated list of flashcards created by the authenticated user.
   - **Query Parameters**:
     - `page` (number, optional): Page number.
     - `limit` (number, optional): Number of flashcards per page.
     - `filter` (string, optional): Filter by creation method (e.g., all, AI_full, AI_edited, manual).
     - `sort` (string, optional): Sort by creation date (`asc` or `desc`).
   - **Response JSON**:
     ```json
     {
       "flashcards": [
         {
           "id": "uuid",
           "front_content": "string",
           "back_content": "string",
           "creation_method": "AI_full | AI_edited | manual",
           "created_at": "ISO8601 timestamp",
           "updated_at": "ISO8601 timestamp"
         }
       ],
       "pagination": {
         "page": number,
         "limit": number,
         "total": number
       }
     }
     ```
   - **Success**: 200 OK
   - **Errors**: 401 Unauthorized, 400 Bad Request for invalid query parameters

2. **GET /api/flashcards/{id}**
   - **Description**: Retrieve details of a single flashcard.
   - **Response JSON**: A flashcard object with the same fields as above.
   - **Success**: 200 OK
   - **Errors**: 401 Unauthorized, 404 Not Found

3. **POST /api/flashcards**
   - **Description**: Create a new flashcard manually or accept an AI generated one.
   - **Request JSON**:
     ```json
     {
       "front_content": "string (2-200 characters)",
       "back_content": "string (2-200 characters)",
       "creation_method": "manual | AI_full | AI_edited",
       "generation_id": "uuid (optional, if accepted from AI generation)"
     }
     ```
   - **Response JSON**: The created flashcard object.
   - **Success**: 201 Created
   - **Errors**: 400 Bad Request (validation errors), 401 Unauthorized

4. **PUT /api/flashcards/{id}**
   - **Description**: Update an existing flashcard's content.
   - **Request JSON**:
     ```json
     {
       "front_content": "string (2-200 characters)",
       "back_content": "string (2-200 characters)"
     }
     ```
   - **Response JSON**: The updated flashcard object.
   - **Success**: 200 OK
   - **Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found

5. **DELETE /api/flashcards/{id}**
   - **Description**: Delete a flashcard.
   - **Response**: Success message.
   - **Success**: 200 OK
   - **Errors**: 401 Unauthorized, 404 Not Found

6. **GET /api/flashcards/learn/random**
   - **Description**: Retrieve a random flashcard for learning purposes.
   - **Response JSON**:
     ```json
     {
       "flashcard": {
         "id": "uuid",
         "front_content": "string",
         "back_content": "string"
       }
     }
     ```
   - **Success**: 200 OK
   - **Errors**: 401 Unauthorized, 404 Not Found (if no flashcards are available)

### 2.3 Generation Endpoints

1. **POST /api/generations/generate**
   - **Description**: Initiate an AI generation session to produce flashcard proposals.
   - **Request JSON**:
     ```json
     {
       "input_text": "string (minimum 1000 and maximum 10000 characters)"
     }
     ```
   - **Response JSON**:
     ```json
     {
       "generation_id": "uuid",
       "proposals": [
         {
           "front_content": "string (2-200 characters)",
           "back_content": "string (2-200 characters)"
         }
         // ... additional proposals
       ],
       "ai_model": "string",
       "generation_time_ms": number,
       "total_generated": number
     }
     ```
   - **Success**: 200 OK
   - **Errors**: 400 Bad Request (if input does not meet length requirements), 401 Unauthorized

2. **POST /api/generations/{id}/finalize**
   - **Description**: Finalize a generation session by recording accepted proposals and updating counters.
   - **Request JSON**:
     ```json
     {
       "accepted": [
         {
           "front_content": "string (2-200 characters)",
           "back_content": "string (2-200 characters)",
           "creation_method": "AI_full | AI_edited"
         }
       ]
     }
     ```
   - **Response JSON**:
     ```json
     {
       "generation_id": "uuid",
       "accepted_full": number,
       "accepted_edited": number,
       "total_generated": number
     }
     ```
   - **Success**: 200 OK
   - **Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found

### 2.4 Statistics Endpoint

1. **GET /api/stats**
   - **Description**: Retrieve user flashcard statistics including counts and percentages.
   - **Response JSON**:
     ```json
     {
       "manual_count": number,
       "ai_full_count": number,
       "ai_edited_count": number,
       "rejected_count": number,  // Calculated as total_generated - (ai_full_count + ai_edited_count)
       "percentages": {
         "manual": "string",
         "ai_full": "string",
         "ai_edited": "string",
         "rejected": "string"
       }
     }
     ```
   - **Success**: 200 OK
   - **Errors**: 401 Unauthorized

## 3. Authentication and Authorization

- The API will use JWT-based authentication integrated with Supabase Auth.
- Endpoints (except for registration and login) require a valid token in the `Authorization` header.
- Authorization checks ensure that users only access their own resources (such as flashcards and generation sessions).
- Database Row Level Security (RLS) further enforces access control at the data layer.

## 4. Validation and Business Logic

- **Input Validation**:
  - Flashcard content (`front_content` and `back_content`) must be between 2 and 200 characters.
  - AI generation `input_text` must be between 1000 and 10000 characters.
  - Email must include an '@' and a '.'; password must have at least 4 characters containing both letters and numbers.

- **Business Logic**:
  - For manual flashcard creation, the API ensures that valid content is saved and that the UI is notified for field reset.
  - In AI flashcard generation, the API records a generation session with details such as total proposals, generation time, and chosen AI model.
  - The finalize generation endpoint updates counters for accepted proposals according to whether they are accepted without edits (AI_full) or with modifications (AI_edited).
  - Listing endpoints support filtering, sorting, and pagination to efficiently manage large datasets.
  - The learning endpoint retrieves a random flashcard for practice without altering stored data.

- **Performance and Security**:
  - Database indexes on `user_id`, `created_at`, and `creation_method` improve query performance.
  - Rate limiting and input sanitization are employed to protect against abuse and injection attacks.
  - All endpoints are secured to ensure that users can only access resources associated with their account. 
