import type { APIRoute } from "astro";
import { FlashcardService } from "../../../lib/services/flashcard.service";
import { createFlashcardSchema } from "../../../lib/schemas/flashcard.schema";
import type { FlashcardsResponseDTO } from "../../../types";

export const prerender = false;

/**
 * GET /api/flashcards - List all flashcards for the authenticated user
 */
export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user?.id) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Unauthorized",
            code: "UNAUTHORIZED",
          },
        }),
        { status: 401 }
      );
    }

    const flashcardService = new FlashcardService(locals.supabase);
    const flashcards = await flashcardService.listFlashcards(locals.user.id);

    const response: FlashcardsResponseDTO = { flashcards };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return new Response(
      JSON.stringify({
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * POST /api/flashcards - Create a new flashcard
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user?.id) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Unauthorized",
            code: "UNAUTHORIZED",
          },
        }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = createFlashcardSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid request body",
            code: "VALIDATION_ERROR",
            details: validationResult.error.format(),
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const flashcardService = new FlashcardService(locals.supabase);
    const flashcard = await flashcardService.createFlashcard(validationResult.data, locals.user.id);

    return new Response(JSON.stringify(flashcard), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating flashcard:", error);

    if (error instanceof Error && error.message === "Invalid or unauthorized generation ID") {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
            code: "INVALID_GENERATION",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
