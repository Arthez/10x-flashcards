import type { APIRoute } from "astro";
import { FlashcardService } from "../../../lib/services/flashcard.service";
import { updateFlashcardSchema } from "../../../lib/schemas/flashcard.schema";

export const prerender = false;

/**
 * GET /api/flashcards/:id - Get a single flashcard by ID
 */
export const GET: APIRoute = async ({ params, locals }) => {
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
    const flashcard = await flashcardService.getFlashcard(params.id || "", locals.user.id);

    return new Response(JSON.stringify(flashcard), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching flashcard:", error);

    if (error instanceof Error && error.message === "Flashcard not found") {
      return new Response(
        JSON.stringify({
          error: {
            message: "Flashcard not found",
            code: "NOT_FOUND",
          },
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      }),
      { status: 500 }
    );
  }
};

/**
 * PUT /api/flashcards/:id - Update a flashcard
 */
export const PUT: APIRoute = async ({ request, params, locals }) => {
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
    const validationResult = updateFlashcardSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid request body",
            code: "VALIDATION_ERROR",
            details: validationResult.error.format(),
          },
        }),
        { status: 400 }
      );
    }

    const flashcardService = new FlashcardService(locals.supabase);
    const flashcard = await flashcardService.updateFlashcard(params.id || "", validationResult.data, locals.user.id);

    return new Response(JSON.stringify(flashcard), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating flashcard:", error);

    if (error instanceof Error && error.message === "Flashcard not found") {
      return new Response(
        JSON.stringify({
          error: {
            message: "Flashcard not found",
            code: "NOT_FOUND",
          },
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      }),
      { status: 500 }
    );
  }
};

/**
 * DELETE /api/flashcards/:id - Delete a flashcard
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
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
    await flashcardService.deleteFlashcard(params.id || "", locals.user.id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting flashcard:", error);

    if (error instanceof Error && error.message === "Flashcard not found") {
      return new Response(
        JSON.stringify({
          error: {
            message: "Flashcard not found",
            code: "NOT_FOUND",
          },
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      }),
      { status: 500 }
    );
  }
};
