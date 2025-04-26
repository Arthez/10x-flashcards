import * as z from "zod";

export const flashcardSchema = z.object({
  front_content: z.string().min(2, "Must be at least 2 characters").max(200, "Must be no more than 200 characters"),
  back_content: z.string().min(2, "Must be at least 2 characters").max(200, "Must be no more than 200 characters"),
});

export type FlashcardFormData = z.infer<typeof flashcardSchema>;
