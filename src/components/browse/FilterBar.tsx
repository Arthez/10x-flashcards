import type { CreationMethod } from "../../types";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export type FilterType = "all" | Extract<CreationMethod, "ai_full" | "ai_edited" | "manual">;
export type SortDirection = "newest" | "oldest";

interface FilterBarProps {
  activeFilter: FilterType;
  sortDirection: SortDirection;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: () => void;
}

const FilterBar = ({ activeFilter, sortDirection, onFilterChange, onSortChange }: FilterBarProps) => {
  const filters: { type: FilterType; label: string }[] = [
    { type: "all", label: "All types" },
    { type: "ai_full", label: "AI Generated" },
    { type: "ai_edited", label: "AI Edited" },
    { type: "manual", label: "Manual" },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map(({ type, label }) => (
          <Button
            key={type}
            variant={activeFilter === type ? "default" : "outline"}
            onClick={() => onFilterChange(type)}
            aria-pressed={activeFilter === type}
          >
            {label}
          </Button>
        ))}
      </div>

      <Button variant="outline" onClick={onSortChange} className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4" />
        <span>{sortDirection === "newest" ? "Newest" : "Oldest"}</span>
      </Button>
    </div>
  );
};

export default FilterBar;
