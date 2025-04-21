import { Button } from "../ui/button";

interface SessionEndMessageProps {
  onRestart: () => void;
  isVisible: boolean;
}

export function SessionEndMessage({ onRestart, isVisible }: SessionEndMessageProps) {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground">You&apos;ve reviewed all available flashcards!</p>
      <Button onClick={onRestart} aria-label="Restart learning session">
        Start Over
      </Button>
    </div>
  );
}
