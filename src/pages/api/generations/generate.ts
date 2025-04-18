import type { APIRoute } from "astro";
import { GenerationService } from "../../../lib/services/generation.service";
import { generateFlashcardsSchema } from "../../../schemas/generation.schema";
import { SUPABASE_DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

// Helper function for JSON responses
const json = (data: unknown, init?: ResponseInit) => {
  return new Response(JSON.stringify(data), {
    status: init?.status || 200,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
};

/**
 * POST /api/generations/generate
 * Generates flashcard proposals using AI based on input text
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // TODO: Add proper authentication validation here
    // For now, using a valid UUID format for testing RLS
    const userId = SUPABASE_DEFAULT_USER_ID;

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const result = generateFlashcardsSchema.safeParse(body);

    if (!result.success) {
      return json({ error: "Invalid input", details: result.error.issues }, { status: 400 });
    }

    // Initialize service and generate flashcards
    const generationService = new GenerationService(locals.supabase);
    try {
      const response = await generationService.generateFlashcards(userId, result.data);
      return json(response);
    } catch (error) {
      console.error("Service error:", error);
      if (error instanceof Error) {
        return json({ error: error.message }, { status: 500 });
      }
      return json({ error: "Internal server error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Request error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
