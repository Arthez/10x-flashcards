import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email } = await request.json();
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/auth/reset-password/reset`,
    });

    if (error) {
      return new Response(JSON.stringify({ error: "Could not reset password. Try again." }), { status: 400 });
    }

    return new Response(null, { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Could not reset password. Try again." }), { status: 400 });
  }
};
