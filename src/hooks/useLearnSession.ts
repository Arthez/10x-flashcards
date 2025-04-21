import { useState, useCallback, useEffect } from "react";
import type { FlashcardDTO, FlashcardsResponseDTO } from "../types";

interface LearnSessionState {
  flashcards: FlashcardDTO[];
  currentFlashcard: FlashcardDTO | null;
  isFlipped: boolean;
  availableFlashcards: FlashcardDTO[];
  sessionEnded: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseLearnSessionReturn {
  state: LearnSessionState;
  drawFlashcard: () => void;
  flipCard: () => void;
  resetSession: () => void;
}

const initialState: LearnSessionState = {
  flashcards: [],
  currentFlashcard: null,
  isFlipped: false,
  availableFlashcards: [],
  sessionEnded: false,
  isLoading: true,
  error: null,
};

export function useLearnSession(): UseLearnSessionReturn {
  const [state, setState] = useState<LearnSessionState>(initialState);

  const fetchFlashcards = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch("/api/flashcards");
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }
      const data: FlashcardsResponseDTO = await response.json();
      setState((prev) => ({
        ...prev,
        flashcards: data.flashcards,
        availableFlashcards: data.flashcards,
        isLoading: false,
        sessionEnded: data.flashcards.length === 0,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  };

  const drawFlashcard = useCallback(() => {
    setState((prev) => {
      if (prev.availableFlashcards.length === 0) {
        return { ...prev, sessionEnded: true };
      }

      const randomIndex = Math.floor(Math.random() * prev.availableFlashcards.length);
      const drawnFlashcard = prev.availableFlashcards[randomIndex];
      const remainingFlashcards = prev.availableFlashcards.filter((_, index) => index !== randomIndex);

      return {
        ...prev,
        currentFlashcard: drawnFlashcard,
        availableFlashcards: remainingFlashcards,
        isFlipped: false,
        sessionEnded: remainingFlashcards.length === 0,
      };
    });
  }, []);

  const flipCard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFlipped: !prev.isFlipped,
    }));
  }, []);

  const resetSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      availableFlashcards: prev.flashcards,
      currentFlashcard: null,
      isFlipped: false,
      sessionEnded: false,
    }));
  }, []);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  return {
    state,
    drawFlashcard,
    flipCard,
    resetSession,
  };
}
