import { Button } from "../ui/button";

interface DrawFlashcardButtonProps {
  onDraw: () => void;
  disabled: boolean;
  isLarge?: boolean;
}

export function DrawFlashcardButton({ onDraw, disabled, isLarge }: DrawFlashcardButtonProps) {
  return (
    <Button onClick={onDraw} disabled={disabled} size={isLarge ? "lg" : "default"}>
      Draw Flashcard
    </Button>
  );
}
