import type { APIRoute } from "astro";
import { FlashcardService } from "../../../lib/services/flashcard.service";
import { flashcardIdSchema, updateFlashcardSchema } from "../../../lib/schemas/flashcard.schema";
import { SUPABASE_DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

/**
 * GET /api/flashcards/:id - Get a single flashcard
 */
export const GET: APIRoute = async ({ params, locals }) => {
  try {
    // TODO: Add proper authentication validation here
    // For now, using a valid UUID format for testing RLS
    const userId = SUPABASE_DEFAULT_USER_ID;

    const validationResult = flashcardIdSchema.safeParse(params.id);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid flashcard ID",
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
    const flashcard = await flashcardService.getFlashcard(params.id as string, userId);

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
        {
          status: 404,
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

/**
 * PUT /api/flashcards/:id - Update a flashcard
 */
export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    // TODO: Add proper authentication validation here
    // For now, using a valid UUID format for testing RLS
    const userId = SUPABASE_DEFAULT_USER_ID;

    const idValidation = flashcardIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid flashcard ID",
            code: "VALIDATION_ERROR",
            details: idValidation.error.format(),
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const flashcardService = new FlashcardService(locals.supabase);
    const flashcard = await flashcardService.updateFlashcard(params.id as string, validationResult.data, userId);

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
        {
          status: 404,
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

/**
 * DELETE /api/flashcards/:id - Delete a flashcard
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    // TODO: Add proper authentication validation here
    // For now, using a valid UUID format for testing RLS
    const userId = SUPABASE_DEFAULT_USER_ID;

    const validationResult = flashcardIdSchema.safeParse(params.id);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid flashcard ID",
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
    await flashcardService.deleteFlashcard(params.id as string, userId);

    return new Response(JSON.stringify({ message: "Flashcard deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
        {
          status: 404,
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
