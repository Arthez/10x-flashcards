import { Button } from "../ui/button";

interface FlipCardButtonProps {
  onFlip: () => void;
  disabled: boolean;
}

export function FlipCardButton({ onFlip, disabled }: FlipCardButtonProps) {
  return (
    <Button onClick={onFlip} disabled={disabled} variant="outline">
      Flip Card
    </Button>
  );
}
