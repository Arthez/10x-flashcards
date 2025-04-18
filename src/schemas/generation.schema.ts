import { z } from "zod";

/**
 * Schema for validating flashcard generation requests
 */
export const generateFlashcardsSchema = z.object({
  input_text: z
    .string()
    .min(1000, "Input text must be at least 1000 characters")
    .max(10000, "Input text must not exceed 10000 characters")
    .transform((val) => val.trim()), // Remove leading/trailing whitespace
  number_of_cards: z
    .number()
    .int("Number of cards must be an integer")
    .min(1, "At least 1 card must be generated")
    .max(20, "Maximum 20 cards can be generated at once")
    .default(5), // Default to 5 cards if not specified
});

export type GenerateFlashcardsInput = z.infer<typeof generateFlashcardsSchema>;
