import type { FlashcardDTO } from "../../types";
import { Card } from "../ui/card";

interface FlashcardDisplayProps {
  flashcard: FlashcardDTO;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardDisplay({ flashcard, isFlipped, onFlip }: FlashcardDisplayProps) {
  return (
    <Card
      className="w-full max-w-[500px] min-h-[200px] p-6 flex items-center justify-center text-center cursor-pointer select-none"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip();
        }
      }}
      aria-label={isFlipped ? "Back of flashcard" : "Front of flashcard"}
    >
      <p className="text-xl break-all">{isFlipped ? flashcard.back_content : flashcard.front_content}</p>
    </Card>
  );
}
