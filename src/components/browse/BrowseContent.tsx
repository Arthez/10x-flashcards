import { useState } from "react";
import type { UpdateFlashcardCommand } from "../../types";
import StatsPanel from "./StatsPanel";
import FilterBar from "./FilterBar";
import FlashcardGrid from "./FlashcardGrid";
import type { FilterType, SortDirection } from "./FilterBar";

const BrowseContent = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleSortChange = () => {
    setSortDirection((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const handleEdit = async (id: string, data: UpdateFlashcardCommand) => {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to update flashcard");
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to delete flashcard");
    }
  };

  return (
    <div className="space-y-8">
      <StatsPanel />

      <div className="space-y-4">
        <FilterBar
          activeFilter={activeFilter}
          sortDirection={sortDirection}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
        <FlashcardGrid
          activeFilter={activeFilter}
          sortDirection={sortDirection}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default BrowseContent;
