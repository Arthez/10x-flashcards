import type { FlashcardProposalDTO } from "@/types";
import { FlashcardProposalCard } from "./FlashcardProposalCard";

interface FlashcardProposalsListProps {
  proposals: {
    id: string;
    front_content: string;
    back_content: string;
    isEdited: boolean;
    isSaving: boolean;
    errors?: {
      front_content?: string;
      back_content?: string;
    };
  }[];
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FlashcardProposalDTO>) => void;
}

export function FlashcardProposalsList({ proposals, onAccept, onReject, onUpdate }: FlashcardProposalsListProps) {
  if (proposals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="flashcard-proposals-container">
      <h2 className="text-2xl font-semibold" data-testid="flashcard-proposals-title">
        Generated Flashcards
      </h2>
      <div className="grid gap-6 md:grid-cols-2" data-testid="flashcard-proposals-grid">
        {proposals.map((proposal) => (
          <FlashcardProposalCard
            key={proposal.id}
            proposal={proposal}
            onAccept={() => onAccept(proposal.id)}
            onReject={() => onReject(proposal.id)}
            onUpdate={(updates) => onUpdate(proposal.id, updates)}
          />
        ))}
      </div>
    </div>
  );
}
