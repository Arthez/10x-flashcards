import type { APIRoute } from "astro";
import { StatsService } from "../../lib/services/stats.service";
import { StatsResponseSchema } from "../../lib/schemas/stats.schema";
import { ValidationError, createAPIError } from "../../lib/errors/api.errors";
import { SUPABASE_DEFAULT_USER_ID } from "../../db/supabase.client.ts";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  // TODO: Add proper authentication validation here
  // For now, using a valid UUID format for testing RLS
  const userId = SUPABASE_DEFAULT_USER_ID;

  try {
    const { supabase } = locals;

    const statsService = new StatsService(supabase);
    const stats = await statsService.getUserStats(userId);

    // Validate response data
    const validationResult = StatsResponseSchema.safeParse(stats);
    if (!validationResult.success) {
      const error = new ValidationError("Invalid stats data", validationResult.error.errors);
      console.error("Stats validation failed:", error);
      return new Response(JSON.stringify(error.toJSON()), {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(validationResult.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const apiError = createAPIError(error);
    console.error("Error fetching user stats:", {
      error: apiError,
      userId: userId,
    });

    return new Response(JSON.stringify(apiError.toJSON()), {
      status: apiError.status,
      headers: { "Content-Type": "application/json" },
    });
  }
};
