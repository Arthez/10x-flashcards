import { useLearnSession } from "../../hooks/useLearnSession";
import { useLearnKeyboardShortcuts } from "../../hooks/useLearnKeyboardShortcuts";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { DrawFlashcardButton } from "./DrawFlashcardButton";
import { FlipCardButton } from "./FlipCardButton";
import { SessionEndMessage } from "./SessionEndMessage";
import { FocusContainer } from "./FocusContainer";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { logger } from "../../lib/logger";
import { useEffect } from "react";

export default function LearnContainer() {
  const { state, drawFlashcard, flipCard, resetSession } = useLearnSession();

  useLearnKeyboardShortcuts({
    onFlip: flipCard,
    onNext: drawFlashcard,
    onRestart: resetSession,
    isActive: !state.isLoading && state.flashcards.length > 0,
  });

  // Log important state changes in development
  useEffect(() => {
    if (state.error) {
      logger.error("Failed to load flashcards", null, {
        context: "LearnContainer",
        data: { error: state.error },
      });
    }
  }, [state.error]);

  useEffect(() => {
    if (state.sessionEnded) {
      logger.info("Learning session ended", {
        context: "LearnContainer",
        data: { totalFlashcards: state.flashcards.length },
      });
    }
  }, [state.sessionEnded, state.flashcards.length]);

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]" role="status" aria-label="Loading flashcards">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center gap-4" role="alert">
        <p className="text-destructive">{state.error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (state.flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center" role="status">
        <p className="text-muted-foreground">You don&apos;t have any flashcards yet. Create some to start learning!</p>
        <Button asChild>
          <a href="/generate" data-test="create-flashcards-button">
            Create Flashcards
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto relative">
      <KeyboardShortcutsHelp />
      {state.flashcards.length > 0 && state.sessionEnded ? (
        <SessionEndMessage isVisible={true} onRestart={resetSession} />
      ) : state.currentFlashcard ? (
        <FocusContainer
          isActive={true}
          description="Current flashcard"
          onFocus={() => {
            const cardId = state.currentFlashcard?.id;
            if (cardId) {
              logger.debug("Flashcard focused", {
                context: "LearnContainer",
                data: { cardId },
              });
            }
          }}
        >
          <div className="space-y-6">
            <div className="flex gap-4 justify-center mb-4">
              <FlipCardButton onFlip={flipCard} disabled={false} />
              <DrawFlashcardButton onDraw={drawFlashcard} disabled={state.availableFlashcards.length === 0} />
            </div>
            <FlashcardDisplay flashcard={state.currentFlashcard} isFlipped={state.isFlipped} onFlip={flipCard} />
          </div>
        </FocusContainer>
      ) : (
        <FocusContainer isActive={true} description="Draw flashcard section">
          <DrawFlashcardButton onDraw={drawFlashcard} disabled={false} isLarge />
        </FocusContainer>
      )}
    </div>
  );
}
