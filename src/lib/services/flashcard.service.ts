import type { SupabaseClient } from "../../db/supabase.client.ts";
import type {
  FlashcardDTO,
  CreateManualFlashcardCommand,
  AcceptAIFlashcardCommand,
  UpdateFlashcardCommand,
} from "../../types";

export class FlashcardService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Retrieves all flashcards for a given user
   */
  async listFlashcards(userId: string): Promise<FlashcardDTO[]> {
    const { data, error } = await this.supabase
      .from("flashcards")
      .select("id, front_content, back_content, creation_method, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch flashcards: ${error.message}`);
    return data;
  }

  /**
   * Retrieves a single flashcard by ID for a given user
   */
  async getFlashcard(id: string, userId: string): Promise<FlashcardDTO> {
    const { data, error } = await this.supabase
      .from("flashcards")
      .select("id, front_content, back_content, creation_method, created_at, updated_at")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Flashcard not found");
      }
      throw new Error(`Failed to fetch flashcard: ${error.message}`);
    }

    return data;
  }

  /**
   * Creates a new flashcard for a user
   */
  async createFlashcard(
    data: CreateManualFlashcardCommand | AcceptAIFlashcardCommand,
    userId: string
  ): Promise<FlashcardDTO> {
    // Pre-check AI-generated flashcard limits
    let acceptedFull = 0;
    let acceptedEdited = 0;
    if ("generation_id" in data) {
      // Fetch current counters and total
      const { data: gen, error: fetchErr } = await this.supabase
        .from("generations")
        .select("accepted_full, accepted_edited, total_generated")
        .eq("id", data.generation_id)
        .eq("user_id", userId)
        .single();
      if (fetchErr) {
        throw new Error("Invalid or unauthorized generation ID");
      }
      acceptedFull = gen.accepted_full ?? 0;
      acceptedEdited = gen.accepted_edited ?? 0;
      const total = gen.total_generated;
      if (acceptedFull + acceptedEdited + 1 > total) {
        throw new Error("Cannot accept more flashcards than generated");
      }
    }

    const { data: newFlashcard, error } = await this.supabase
      .from("flashcards")
      .insert({
        ...data,
        user_id: userId,
        generation_id: undefined,
      })
      .select("id, front_content, back_content, creation_method, created_at, updated_at")
      .single();

    if (error) throw new Error(`Failed to create flashcard: ${error.message}`);

    // update generation counters for AI-generated flashcards
    if ("generation_id" in data) {
      if (data.creation_method === "ai_full") {
        const { error: updateErr } = await this.supabase
          .from("generations")
          .update({ accepted_full: acceptedFull + 1 })
          .eq("id", data.generation_id);
        if (updateErr) throw new Error(`Failed to update generation accepted_full: ${updateErr.message}`);
      } else if (data.creation_method === "ai_edited") {
        const { error: updateErr } = await this.supabase
          .from("generations")
          .update({ accepted_edited: acceptedEdited + 1 })
          .eq("id", data.generation_id);
        if (updateErr) throw new Error(`Failed to update generation accepted_edited: ${updateErr.message}`);
      }
    }

    return newFlashcard;
  }

  /**
   * Updates an existing flashcard
   */
  async updateFlashcard(id: string, data: UpdateFlashcardCommand, userId: string): Promise<FlashcardDTO> {
    const { data: updatedFlashcard, error } = await this.supabase
      .from("flashcards")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, front_content, back_content, creation_method, created_at, updated_at")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Flashcard not found");
      }
      throw new Error(`Failed to update flashcard: ${error.message}`);
    }

    return updatedFlashcard;
  }

  /**
   * Deletes a flashcard
   */
  async deleteFlashcard(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase.from("flashcards").delete().eq("id", id).eq("user_id", userId);

    if (error) throw new Error(`Failed to delete flashcard: ${error.message}`);
  }
}
