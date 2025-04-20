import type { SupabaseClient } from "../../db/supabase.client.ts";
import type { StatsResponseDTO } from "../../types";

export class StatsService {
  constructor(private supabase: SupabaseClient) {}

  async getUserStats(userId: string): Promise<StatsResponseDTO> {
    // Get flashcard counts by creation method
    const { count: manualCount, error: manualError } = await this.supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("creation_method", "manual");

    const { count: aiFullCount, error: aiFullError } = await this.supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("creation_method", "ai_full");

    const { count: aiEditedCount, error: aiEditedError } = await this.supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("creation_method", "ai_edited");

    if (manualError || aiFullError || aiEditedError) {
      throw new Error("Failed to fetch flashcard stats");
    }

    // Get total generated flashcards
    const { data: generationStats, error: generationError } = await this.supabase
      .from("generations")
      .select("total_generated")
      .eq("user_id", userId);

    if (generationError) {
      throw new Error(`Failed to fetch generation stats: ${generationError.message}`);
    }

    const totalGenerated = generationStats?.reduce((sum, stat) => sum + (stat.total_generated || 0), 0) ?? 0;

    // Return stats
    return {
      manual_count: manualCount ?? 0,
      ai_full_count: aiFullCount ?? 0,
      ai_edited_count: aiEditedCount ?? 0,
      total_generated: totalGenerated,
    };
  }
}
