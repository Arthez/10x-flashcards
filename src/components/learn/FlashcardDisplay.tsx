import type { FlashcardDTO } from "../../types";
import { Card } from "../ui/card";

interface FlashcardDisplayProps {
  flashcard: FlashcardDTO;
  isFlipped: boolean;
  onFlip: () => void;
  enableAnimation?: boolean;
}

export function FlashcardDisplay({ flashcard, isFlipped, onFlip, enableAnimation = true }: FlashcardDisplayProps) {
  return (
    <div
      className="w-full max-w-[500px] min-h-[200px] perspective-1000"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip();
        }
      }}
      onClick={onFlip}
      aria-label={isFlipped ? "Back of flashcard" : "Front of flashcard"}
      data-testid="flashcard-display"
    >
      <div
        className={`relative w-full h-full preserve-3d ${
          enableAnimation ? "transition-transform duration-500" : ""
        } ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front of card */}
        <Card className="absolute w-full min-h-[200px] p-6 flex items-center justify-center text-center cursor-pointer select-none backface-hidden">
          <p className="text-xl break-word">{flashcard.front_content}</p>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full min-h-[200px] p-6 flex items-center justify-center text-center cursor-pointer select-none backface-hidden rotate-y-180">
          <p className="text-xl break-word">{flashcard.back_content}</p>
        </Card>
      </div>
    </div>
  );
}
