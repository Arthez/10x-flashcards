import { z } from "zod";

export const StatsResponseSchema = z.object({
  manual_count: z.number().int().min(0),
  ai_full_count: z.number().int().min(0),
  ai_edited_count: z.number().int().min(0),
  total_generated: z.number().int().min(0),
});
