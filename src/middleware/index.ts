import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "@/db/supabase.client";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/reset-password/request",
  "/auth/reset-password/reset",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password/request",
  "/api/auth/reset-password/reset",
];

export const onRequest = defineMiddleware(async ({ cookies, request, redirect, url, locals }, next) => {
  // Create Supabase instance for this request
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });
  locals.supabase = supabase;

  // Skip auth check for public paths
  if (PUBLIC_PATHS.some((path) => url.pathname.startsWith(path))) {
    return next();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Store the current URL as returnUrl for post-login redirect
    const returnUrl = encodeURIComponent(url.pathname + url.search);
    return redirect(`/auth/login?returnUrl=${returnUrl}`);
  }

  // Add user to locals for use in routes
  locals.user = {
    id: user.id,
    email: user.email ?? null,
  };

  return next();
});
