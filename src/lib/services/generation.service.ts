import type { SupabaseClient } from "../../db/supabase.client.ts";
import type { GenerateFlashcardsCommand, GenerationResponseDTO } from "../../types";
import { OpenRouterService } from "./openrouter.service";
import { logger } from "../../lib/logger";

export class GenerationService {
  private readonly openRouter: OpenRouterService;

  constructor(private readonly supabase: SupabaseClient) {
    this.openRouter = new OpenRouterService();
  }

  /**
   * Generates flashcards from input text using AI
   */
  async generateFlashcards(userId: string, input: GenerateFlashcardsCommand): Promise<GenerationResponseDTO> {
    const startTime = Date.now();

    try {
      logger.debug('Starting flashcard generation', {
        context: 'GenerationService',
        data: {
          textLength: input.input_text.length,
          model: this.openRouter.modelName
        }
      });

      // Generate flashcards using OpenRouter
      const proposals = await this.openRouter.generateFlashcards(
        input.input_text,
        input.number_of_cards || 5
      );

      const generationTime = Date.now() - startTime;

      // Create generation record with results
      const { data, error } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          total_generated: proposals.length,
          generation_time_ms: generationTime,
          ai_model: this.openRouter.modelName,
          error: null,
        })
        .select("id")
        .single();

      if (error) {
        logger.error('Database error while saving generation', error, {
          context: 'GenerationService',
          data: { userId }
        });
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Failed to create generation record");
      }

      logger.info('Successfully generated flashcards', {
        context: 'GenerationService',
        data: {
          generationId: data.id,
          totalGenerated: proposals.length,
          generationTime
        }
      });

      return {
        generation_id: data.id,
        proposals,
        ai_model: this.openRouter.modelName,
        generation_time_ms: generationTime,
        total_generated: proposals.length,
      };
    } catch (error) {
      // Log the error and create a generation record with error
      logger.error('Error generating flashcards', error, {
        context: 'GenerationService',
        data: { userId }
      });

      // Try to create an error record
      try {
        await this.supabase
          .from("generations")
          .insert({
            user_id: userId,
            total_generated: 0,
            generation_time_ms: Date.now() - startTime,
            ai_model: this.openRouter.modelName,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
      } catch (dbError) {
        logger.error('Failed to save generation error', dbError, {
          context: 'GenerationService'
        });
      }

      throw error; // Re-throw the error to be handled by the API layer
    }
  }
}
