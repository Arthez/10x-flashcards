import type { AstroCookies } from "astro";
import { getSecret } from "astro:env/server";
import type { SupabaseClient as SupabaseClientType } from "@supabase/supabase-js";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { Database } from "./database.types";

export type SupabaseClient = SupabaseClientType<Database>;

export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

export const createSupabaseServerInstance = (context: { headers: Headers; cookies: AstroCookies }) => {
  const supabaseUrl: string = getSecret("SUPABASE_URL") as string;
  const supabaseKey: string = getSecret("SUPABASE_KEY") as string;
  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions,
    cookies: {
      getAll() {
        return parseCookieHeader(context.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => context.cookies.set(name, value, options));
      },
    },
  });

  return supabase;
};

// Client-side Supabase instance (for components)
import { createBrowserClient } from "@supabase/ssr";

export const createSupabaseBrowserClient = () => {
  const supabaseUrl: string = getSecret("SUPABASE_URL") as string;
  const supabaseKey: string = getSecret("SUPABASE_KEY") as string;
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};
