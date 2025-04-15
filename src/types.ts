import type { Database } from "./db/database.types";

// DTO types

/**
 * Basic flashcard DTO representation that maps directly to database entity
 */
export type FlashcardDTO = Pick<
  Database["public"]["Tables"]["flashcards"]["Row"],
  "id" | "front_content" | "back_content" | "creation_method" | "created_at" | "updated_at"
>;

/**
 * Creation method enum
 */
export type CreationMethod = Database["public"]["Enums"]["creation_method_enum"];

/**
 * Response format for flashcards list endpoint
 */
export interface FlashcardsResponseDTO {
  flashcards: FlashcardDTO[];
}

/**
 * Command model for creating a new flashcard
 */
export interface CreateManualFlashcardCommand {
  front_content: string; // 2-200 characters
  back_content: string; // 2-200 characters
  creation_method: Extract<CreationMethod, "manual">;
}

/**
 * Command model specifically for accepting AI generated flashcards
 */
export interface AcceptAIFlashcardCommand {
  front_content: string; // 2-200 characters
  back_content: string; // 2-200 characters
  creation_method: Extract<CreationMethod, "ai_full" | "ai_edited">;
  generation_id: string; // Required for AI generated flashcards
}

/**
 * Command model for updating an existing flashcard
 */
export interface UpdateFlashcardCommand {
  front_content: string; // 2-200 characters
  back_content: string; // 2-200 characters
}

/**
 * Response for flashcard deletion operation
 */
export interface DeleteFlashcardResponseDTO {
  message: string;
}

/**
 * Flashcard proposal structure used in generation responses
 */
export interface FlashcardProposalDTO {
  front_content: string; // 2-200 characters
  back_content: string; // 2-200 characters
}

/**
 * Command model for generating AI flashcards
 */
export interface GenerateFlashcardsCommand {
  input_text: string; // 1000-10000 characters
}

/**
 * Response structure for flashcard generation endpoint
 */
export interface GenerationResponseDTO {
  generation_id: string;
  proposals: FlashcardProposalDTO[];
  ai_model: string;
  generation_time_ms: number;
  total_generated: number;
}

/**
 * Statistics response format
 */
export interface StatsResponseDTO {
  manual_count: number;
  ai_full_count: number;
  ai_edited_count: number;
  total_generated: number;
}
