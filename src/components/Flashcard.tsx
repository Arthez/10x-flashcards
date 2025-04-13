import { useState } from "react";

export interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleClick = () => setShowAnswer((prev) => !prev);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      className="max-w-md mx-auto p-4 border rounded-lg shadow-md cursor-pointer"
    >
      <h2 className="text-xl font-bold mb-2">{question}</h2>
      {showAnswer && <p className="text-gray-700">{answer}</p>}
    </div>
  );
}
