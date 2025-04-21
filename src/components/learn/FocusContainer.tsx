import { useRef, useEffect, type ReactNode } from "react";
import { logger } from "../../lib/logger";

interface FocusContainerProps {
  children: ReactNode;
  isActive: boolean;
  onFocus?: () => void;
  description: string;
}

export function FocusContainer({ children, isActive, onFocus, description }: FocusContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.focus();
      onFocus?.();
      logger.debug("Focus container activated", {
        context: "FocusContainer",
        data: { description },
      });
    }
  }, [isActive, onFocus, description]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      role="region"
      aria-label={description}
    >
      {children}
    </div>
  );
}
