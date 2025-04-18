import { z } from "zod";
import type { CreationMethod } from "../../types";

// Base content validation schema
export const flashcardContentSchema = z
  .string()
  .min(2, "Content must be at least 2 characters long")
  .max(200, "Content must not exceed 200 characters");

// Schema for creating a flashcard manually
export const createManualFlashcardSchema = z.object({
  front_content: flashcardContentSchema,
  back_content: flashcardContentSchema,
  creation_method: z.literal("manual"),
});

// Schema for creating/accepting AI generated flashcard
export const acceptAIFlashcardSchema = z.object({
  front_content: flashcardContentSchema,
  back_content: flashcardContentSchema,
  creation_method: z.enum(["ai_full", "ai_edited"]),
  generation_id: z.string().uuid("Invalid generation ID format"),
});

// Combined schema for creating any type of flashcard
export const createFlashcardSchema = z.discriminatedUnion("creation_method", [
  createManualFlashcardSchema,
  acceptAIFlashcardSchema,
]);

// Schema for updating a flashcard
export const updateFlashcardSchema = z.object({
  front_content: flashcardContentSchema,
  back_content: flashcardContentSchema,
});

// Schema for flashcard ID parameter
export const flashcardIdSchema = z.string().uuid("Invalid flashcard ID format");
