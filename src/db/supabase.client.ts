import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const SUPABASE_DEFAULT_USER_ID = "2a8bc1b5-8558-4fd6-a3b1-5be0a6f98e85";

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
