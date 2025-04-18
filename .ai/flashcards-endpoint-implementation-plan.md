# API Endpoints Implementation Plan: Flashcards CRUD API

## 1. Overview
Implementation plan for the flashcards CRUD API endpoints that allow users to manage their flashcards. The API supports creating, reading, updating, and deleting flashcards with proper authentication and validation.

## 2. Request Details

### GET /api/flashcards
- Method: GET
- Headers: 
  - Authorization: Bearer token
- Query Parameters: None
- Response: FlashcardsResponseDTO

### GET /api/flashcards/{id}
- Method: GET
- Headers:
  - Authorization: Bearer token
- URL Parameters:
  - id: UUID of the flashcard
- Response: FlashcardDTO

### POST /api/flashcards
- Method: POST
- Headers:
  - Authorization: Bearer token
  - Content-Type: application/json
- Request Body:
  - front_content (required): string (2-200 chars)
  - back_content (required): string (2-200 chars)
  - creation_method (required): CreationMethod enum
  - generation_id (optional): UUID
- Response: FlashcardDTO

### PUT /api/flashcards/{id}
- Method: PUT
- Headers:
  - Authorization: Bearer token
  - Content-Type: application/json
- URL Parameters:
  - id: UUID of the flashcard
- Request Body:
  - front_content (required): string (2-200 chars)
  - back_content (required): string (2-200 chars)
- Response: FlashcardDTO

### DELETE /api/flashcards/{id}
- Method: DELETE
- Headers:
  - Authorization: Bearer token
- URL Parameters:
  - id: UUID of the flashcard
- Response: DeleteFlashcardResponseDTO

## 3. Types Used

### DTOs
```typescript
// From types.ts
import {
  FlashcardDTO,
  FlashcardsResponseDTO,
  CreateManualFlashcardCommand,
  AcceptAIFlashcardCommand,
  UpdateFlashcardCommand,
  DeleteFlashcardResponseDTO,
  CreationMethod
} from '../types';
```

### Zod Schemas
```typescript
// To be implemented in src/lib/schemas/flashcard.schema.ts
import { z } from 'zod';

export const flashcardContentSchema = z.string().min(2).max(200);

export const createFlashcardSchema = z.object({
  front_content: flashcardContentSchema,
  back_content: flashcardContentSchema,
  creation_method: z.enum(['manual', 'AI_full', 'AI_edited']),
  generation_id: z.string().uuid().optional()
});

export const updateFlashcardSchema = z.object({
  front_content: flashcardContentSchema,
  back_content: flashcardContentSchema
});
```

## 4. Data Flow

### Service Layer
1. Create `src/lib/services/flashcard.service.ts`:
```typescript
export class FlashcardService {
  constructor(private supabase: SupabaseClient) {}
  
  async listFlashcards(userId: string): Promise<FlashcardDTO[]>;
  async getFlashcard(id: string, userId: string): Promise<FlashcardDTO>;
  async createFlashcard(data: CreateManualFlashcardCommand | AcceptAIFlashcardCommand, userId: string): Promise<FlashcardDTO>;
  async updateFlashcard(id: string, data: UpdateFlashcardCommand, userId: string): Promise<FlashcardDTO>;
  async deleteFlashcard(id: string, userId: string): Promise<void>;
}
```

### API Routes
1. Create route handlers in `src/pages/api/flashcards/`:
   - `index.ts` (GET, POST)
   - `[id].ts` (GET, PUT, DELETE)

2. Flow:
   - Request → Middleware (Auth) → Route Handler → Service → Database → Response

## 5. Security Considerations

### Authentication
- Use Supabase Auth middleware
- Verify JWT tokens
- Extract user ID from token

### Authorization
- Leverage Supabase RLS policies
- Verify user ownership of resources
- Validate generation_id ownership for AI cards

### Input Validation
- Use Zod schemas for request validation
- Sanitize input data
- Validate UUIDs
- Check content length limits

## 6. Error Handling

### HTTP Status Codes
- 200: Successful operation
- 201: Successful creation
- 400: Invalid input
- 401: Unauthorized
- 404: Resource not found
- 500: Server error

### Error Responses
```typescript
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  }
}
```

### Error Cases
- Invalid content length
- Invalid creation_method
- Invalid/missing generation_id
- Unauthorized access
- Resource not found
- Database errors
- Rate limit exceeded

## 7. Performance Considerations

### Database
- Use proper indexes (already created)
- Leverage RLS for filtering
- Minimize number of queries

## 8. Implementation Steps

1. Setup
   - Create service directory structure
   - Setup Zod schemas
   - Configure middleware

2. Service Layer
   - Implement FlashcardService
   - Add error handling

3. API Routes
   - Implement route handlers
   - Add input validation
   - Add error responses

4. Security
   - Implement authentication middleware
   - Add security headers

## Directory Structure
```
src/
├── pages/
│   └── api/
│       └── flashcards/
│           ├── index.ts
│           └── [id].ts
├── lib/
│   ├── services/
│   │   └── flashcard.service.ts
│   └── schemas/
│       └── flashcard.schema.ts
└── middleware/
    └── auth.ts
``` 
