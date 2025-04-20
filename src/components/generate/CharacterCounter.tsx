import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  currentCount: number;
  minCount: number;
  maxCount: number;
  className?: string;
}

export function CharacterCounter({ currentCount, minCount, maxCount, className }: CharacterCounterProps) {
  const isValid = currentCount >= minCount && currentCount <= maxCount;
  const isUnderMin = currentCount < minCount;

  return (
    <div
      className={cn(
        "text-sm flex items-center gap-1",
        isValid ? "text-muted-foreground" : "text-destructive",
        className
      )}
    >
      <span>{currentCount}</span>
      <span>/</span>
      <span>{isUnderMin ? `min ${minCount}` : `max ${maxCount}`}</span>
      <span className="text-muted-foreground">characters</span>
    </div>
  );
}
