import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const parsedData = loginSchema.safeParse(data);

    if (!parsedData.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          issues: parsedData.error.issues,
        }),
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedData.data.email,
      password: parsedData.data.password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    // Get returnUrl from query params or use default
    const url = new URL(request.url);
    const returnUrl = url.searchParams.get("returnUrl") || "/learn";

    return new Response(JSON.stringify({ redirect: returnUrl }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
