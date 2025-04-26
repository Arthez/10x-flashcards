import type { CreateManualFlashcardCommand, FlashcardDTO } from "@/types";

class FlashcardService {
  async create(data: CreateManualFlashcardCommand): Promise<FlashcardDTO> {
    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorCode = responseData.error?.code || "UNKNOWN_ERROR";
        const errorMessage = responseData.error?.message || "An unknown error occurred";

        switch (errorCode) {
          case "VALIDATION_ERROR":
            throw new Error(
              JSON.stringify({
                code: errorCode,
                message: errorMessage,
                details: responseData.error?.details,
              })
            );
          case "INTERNAL_ERROR":
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(errorMessage);
        }
      }

      return responseData as FlashcardDTO;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }
}

export const flashcardService = new FlashcardService();
