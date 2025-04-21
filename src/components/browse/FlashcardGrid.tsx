import { useEffect, useState } from "react";
import type { FlashcardDTO, UpdateFlashcardCommand } from "../../types";
import FlashcardCard from "./FlashcardCard";
import type { FilterType, SortDirection } from "./FilterBar";

interface FlashcardGridProps {
  activeFilter: FilterType;
  sortDirection: SortDirection;
  onEdit: (id: string, data: UpdateFlashcardCommand) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSuccess?: () => void;
}

const FlashcardGrid = ({ activeFilter, sortDirection, onEdit, onDelete, onSuccess }: FlashcardGridProps) => {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/flashcards");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch flashcards");
      }
      const data = await response.json();
      setFlashcards(data.flashcards);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleEdit = async (id: string, data: UpdateFlashcardCommand) => {
    await onEdit(id, data);
    await fetchFlashcards();
    onSuccess?.();
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    await fetchFlashcards();
    onSuccess?.();
  };

  // Filter and sort flashcards
  const filteredAndSortedFlashcards = flashcards
    .filter((flashcard) => {
      if (activeFilter === "all") return true;
      return flashcard.creation_method === activeFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "newest" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-48 rounded-lg border border-border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 space-y-4">
        <p className="text-destructive">{error}</p>
        <button onClick={fetchFlashcards} className="text-sm text-primary hover:underline">
          Try again
        </button>
      </div>
    );
  }

  if (filteredAndSortedFlashcards.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          {flashcards.length === 0
            ? "No flashcards found. Create your first flashcard to get started!"
            : "No flashcards match the selected filter."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAndSortedFlashcards.map((flashcard) => (
        <FlashcardCard key={flashcard.id} flashcard={flashcard} onEdit={handleEdit} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default FlashcardGrid;
