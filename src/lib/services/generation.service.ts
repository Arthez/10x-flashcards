import type { SupabaseClient } from "../../db/supabase.client.ts";
import type { GenerateFlashcardsCommand, GenerationResponseDTO } from "../../types";

export class GenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Generates flashcards from input text using AI
   */
  async generateFlashcards(userId: string, input: GenerateFlashcardsCommand): Promise<GenerationResponseDTO> {
    const startTime = Date.now();

    try {
      // TODO: Replace with actual AI service call
      const defaultAiModel = "o3-mini";
      const defaultNumberOfCards = 5;
      const mockProposals = new Array(defaultNumberOfCards).fill(null).map((_, i) => ({
        front_content: `What is concept ${i + 1}?`,
        back_content: `This is the explanation for concept ${i + 1} - ${input.input_text.substring(0, 10)}.`,
      }));

      const generationTime = Date.now() - startTime;

      // Create generation record with results
      const { data, error } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          total_generated: mockProposals.length,
          generation_time_ms: generationTime,
          ai_model: defaultAiModel,
          error: null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Failed to create generation record");
      }

      return {
        generation_id: data.id,
        proposals: mockProposals,
        ai_model: defaultAiModel,
        generation_time_ms: generationTime,
        total_generated: mockProposals.length,
      };
    } catch (error) {
      console.error("Error generating flashcards:", error);
      throw error; // Re-throw the error to be handled by the API layer
    }
  }
}
