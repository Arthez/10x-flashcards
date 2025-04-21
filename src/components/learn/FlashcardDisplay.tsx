import type { FlashcardDTO } from "../../types";
import { Card } from "../ui/card";

interface FlashcardDisplayProps {
  flashcard: FlashcardDTO;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardDisplay({ flashcard, isFlipped, onFlip }: FlashcardDisplayProps) {
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
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front of card */}
        <Card className="absolute w-full min-h-[200px] p-6 flex items-center justify-center text-center cursor-pointer select-none backface-hidden">
          <p className="text-xl break-all">{flashcard.front_content}</p>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full min-h-[200px] p-6 flex items-center justify-center text-center cursor-pointer select-none backface-hidden rotate-y-180">
          <p className="text-xl break-all">{flashcard.back_content}</p>
        </Card>
      </div>
    </div>
  );
}
