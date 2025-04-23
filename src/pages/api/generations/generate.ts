import type { APIRoute } from "astro";
import { GenerationService } from "@/lib/services/generation.service";
import { generateFlashcardsSchema } from "../../../schemas/generation.schema";

export const prerender = false;

/**
 * POST /api/generations/generate
 * Generates flashcard proposals using AI based on input text
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
    const validationResult = generateFlashcardsSchema.safeParse(body);

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

    const generationService = new GenerationService(locals.supabase);
    const generation = await generationService.generateFlashcards(locals.user.id, validationResult.data);

    return new Response(JSON.stringify(generation), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
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
