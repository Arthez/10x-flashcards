import { useState } from "react";
import type { GenerateFlashcardsCommand, GenerationResponseDTO } from "../types";

interface GenerationViewModel {
  isGenerating: boolean;
  error: string | null;
  result: GenerationResponseDTO | null;
}

export function useGeneration() {
  const [state, setState] = useState<GenerationViewModel>({
    isGenerating: false,
    error: null,
    result: null,
  });

  async function generateFlashcards(input: GenerateFlashcardsCommand) {
    setState((prev) => ({ ...prev, isGenerating: true, error: null }));
    try {
      const response = await fetch("/api/generations/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        let errorMessage = "An error occurred during generation.";
        switch (response.status) {
          case 400:
            errorMessage = "Invalid input data. Make sure the text has the correct length.";
            break;
          case 401:
            errorMessage = "Session expired. Please log in again.";
            break;
          case 429:
            errorMessage = "Request limit exceeded. Please try again later.";
            break;
          case 503:
            errorMessage = "The generation service is currently unavailable.";
            break;
        }
        throw new Error(errorMessage);
      }

      const result = (await response.json()) as GenerationResponseDTO;
      setState({ isGenerating: false, error: null, result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setState({ isGenerating: false, error: errorMessage, result: null });
      throw error;
    }
  }

  function resetGeneration() {
    setState({ isGenerating: false, error: null, result: null });
  }

  return {
    ...state,
    generateFlashcards,
    resetGeneration,
  };
}
