import type { APIRoute } from "astro";
import { StatsService } from "../../lib/services/stats.service";

export const prerender = false;

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

    const statsService = new StatsService(locals.supabase);
    const stats = await statsService.getUserStats(locals.user.id);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
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
