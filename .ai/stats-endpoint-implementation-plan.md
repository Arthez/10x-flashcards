# API Endpoint Implementation Plan: GET /api/stats

## 1. Endpoint Overview
This endpoint provides user-specific flashcard statistics, including counts of manually created, AI-generated (full and edited), and total generated flashcards. It serves as a dashboard metrics endpoint for user analytics.

## 2. Request Details
- HTTP Method: GET
- URL Pattern: `/api/stats`
- Parameters: None
- Headers:
  - Required: Authorization (Supabase JWT token)
- Request Body: None

## 3. Types and Models
### Response DTO
```typescript
interface StatsResponseDTO {
  manual_count: number;
  ai_full_count: number;
  ai_edited_count: number;
  total_generated: number;
}
```

## 4. Data Flow
1. Request Handling:
   - Astro middleware validates Supabase JWT token
   - User context extracted from token
   
2. Database Queries:
   ```sql
   -- Query 1: Get flashcard counts by creation method
   SELECT 
     creation_method,
     COUNT(*) as count
   FROM flashcards
   WHERE user_id = :user_id
   GROUP BY creation_method;

   -- Query 2: Get total generated flashcards from generations
   SELECT 
     COALESCE(SUM(total_generated), 0) as total_generated
   FROM generations
   WHERE user_id = :user_id;
   ```

3. Service Layer:
   - StatsService aggregates query results
   - Calculates statistics according to US-005 requirements:
     * manual_count: count of flashcards with creation_method = 'manual'
     * ai_full_count: count of flashcards with creation_method = 'AI_full'
     * ai_edited_count: count of flashcards with creation_method = 'AI_edited'
     * total_generated: sum of total_generated from generations table
   - Transforms database response to StatsResponseDTO
   - Handles edge cases (no flashcards or no generations)

## 5. Security Considerations
1. Authentication:
   - Leverage existing Supabase authentication
   - Ensure user context is properly propagated
   
2. Authorization:
   - Utilize Supabase Row Level Security (RLS)
   - Verify user can only access their own statistics
   
3. Data Validation:
   - Validate Supabase context exists
   - Sanitize any dynamic SQL parameters

## 6. Error Handling
1. Authentication Errors (401):
   ```typescript
   if (!user) {
     return new Response(JSON.stringify({ 
       error: 'Unauthorized access' 
     }), { status: 401 });
   }
   ```

2. Server Errors (500):
   - Database query failures
   - Unexpected service errors
   - Return appropriate error messages without exposing internals

## 7. Performance Considerations
1. Query Optimization:
   - Use appropriate indexes (already defined on user_id and creation_method)
   - Consider caching for frequently accessed stats
   
2. Response Size:
   - Small, fixed-size response
   - No pagination needed

## 8. Implementation Steps

1. Create Service Layer (src/lib/services/stats.service.ts):
   ```typescript
   export class StatsService {
     constructor(private supabase: SupabaseClient) {}
     
     async getUserStats(userId: string): Promise<StatsResponseDTO>;
   }
   ```

2. Create API Route (src/pages/api/stats.ts):
   ```typescript
   export const prerender = false;
   
   export async function GET({ locals }) {
     // Implementation
   }
   ```

3. Add Error Handling:
   - Implement try-catch blocks
   - Add error logging
   - Return appropriate status codes

4. Add Type Safety:
   - Use Zod for response validation
   - Add TypeScript types for internal functions

