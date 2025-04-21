import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Trophy } from "lucide-react";

interface SessionEndMessageProps {
  onRestart: () => void;
  isVisible: boolean;
}

export function SessionEndMessage({ onRestart, isVisible }: SessionEndMessageProps) {
  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-[500px] p-8 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="rounded-full bg-primary/10 p-4">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Session Complete!</h2>
          <p className="text-muted-foreground">
            You&apos;ve reviewed all available flashcards. Great job on completing your study session!
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={onRestart} size="lg" className="font-semibold" aria-label="Restart learning session">
            Study Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/add">Create More Cards</a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
