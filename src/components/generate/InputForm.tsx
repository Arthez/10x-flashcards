import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CharacterCounter } from "./CharacterCounter";
import type { GenerateFlashcardsCommand } from "@/types";

interface InputFormProps {
  onSubmit: (data: GenerateFlashcardsCommand) => Promise<void>;
  isLoading: boolean;
}

const MIN_CHARS = 1000;
const MAX_CHARS = 10000;

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const characterCount = inputText.length;
  const isValid = characterCount >= MIN_CHARS && characterCount <= MAX_CHARS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError(
        characterCount < MIN_CHARS
          ? `Please enter at least ${MIN_CHARS} characters`
          : `Text cannot exceed ${MAX_CHARS} characters`
      );
      return;
    }

    try {
      await onSubmit({ input_text: inputText });
      setInputText("");
    } catch {
      // Error is handled by the parent component
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
          placeholder="Enter your text here (minimum 1000 characters up to 10000 characters)"
          className="min-h-[200px]"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center">
          <CharacterCounter currentCount={characterCount} minCount={MIN_CHARS} maxCount={MAX_CHARS} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
      <Button type="submit" disabled={!isValid || isLoading}>
        {isLoading ? "Generating..." : "Generate Flashcards"}
      </Button>
    </form>
  );
}
