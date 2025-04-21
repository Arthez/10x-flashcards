import { useEffect } from "react";
import { logger } from "../lib/logger";

interface UseLearnKeyboardShortcutsProps {
  onFlip: () => void;
  onNext: () => void;
  onRestart: () => void;
  isActive: boolean;
}

export function useLearnKeyboardShortcuts({ onFlip, onNext, onRestart, isActive }: UseLearnKeyboardShortcutsProps) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ":
        case "Enter":
          event.preventDefault();
          onFlip();
          logger.debug("Keyboard shortcut: flip card", { context: "KeyboardShortcuts" });
          break;
        case "ArrowRight":
        case "n":
          event.preventDefault();
          onNext();
          logger.debug("Keyboard shortcut: next card", { context: "KeyboardShortcuts" });
          break;
        case "r":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onRestart();
            logger.debug("Keyboard shortcut: restart session", { context: "KeyboardShortcuts" });
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onFlip, onNext, onRestart]);
}
