import { useState } from "react";
import type { FlashcardProposalDTO, AcceptAIFlashcardCommand } from "../types";
import { toast } from "sonner";

interface FlashcardProposalViewModel extends FlashcardProposalDTO {
  id: string;
  isEdited: boolean;
  isSaving: boolean;
  errors?: {
    front_content?: string;
    back_content?: string;
  };
}

export function useFlashcardProposals() {
  const [proposals, setProposals] = useState<FlashcardProposalViewModel[]>([]);
  const [generationId, setGenerationId] = useState<string | null>(null);

  function initializeProposals(proposalsDTO: FlashcardProposalDTO[], genId: string) {
    setGenerationId(genId);
    setProposals(
      proposalsDTO.map((p, index) => ({
        ...p,
        id: `proposal-${index}`,
        isEdited: false,
        isSaving: false,
      }))
    );
  }

  function updateProposal(id: string, updates: Partial<FlashcardProposalDTO>) {
    setProposals((current) =>
      current.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              isEdited: true,
              errors: validateProposal(
                updates.front_content ?? p.front_content,
                updates.back_content ?? p.back_content
              ),
            }
          : p
      )
    );
  }

  async function acceptProposal(id: string) {
    if (!generationId) return;

    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) return;

    const errors = validateProposal(proposal.front_content, proposal.back_content);
    if (errors) {
      setProposals((current) => current.map((p) => (p.id === id ? { ...p, errors } : p)));
      return;
    }

    setProposals((current) => current.map((p) => (p.id === id ? { ...p, isSaving: true } : p)));

    try {
      const command: AcceptAIFlashcardCommand = {
        front_content: proposal.front_content,
        back_content: proposal.back_content,
        creation_method: proposal.isEdited ? "ai_edited" : "ai_full",
        generation_id: generationId,
      };

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error("Failed to save flashcard");
      }

      setProposals((current) => current.filter((p) => p.id !== id));
      toast.success("Flashcard saved successfully!");
    } catch {
      setProposals((current) => current.map((p) => (p.id === id ? { ...p, isSaving: false } : p)));
      toast.error("Failed to save flashcard. Please try again.");
    }
  }

  function rejectProposal(id: string) {
    setProposals((current) => current.filter((p) => p.id !== id));
  }

  function reset() {
    setProposals([]);
    setGenerationId(null);
  }

  function validateProposal(front: string, back: string) {
    const errors: FlashcardProposalViewModel["errors"] = {};

    if (front.length < 2) {
      errors.front_content = "Enter at least 2 characters";
    } else if (front.length > 200) {
      errors.front_content = "Text cannot exceed 200 characters";
    }

    if (back.length < 2) {
      errors.back_content = "Enter at least 2 characters";
    } else if (back.length > 200) {
      errors.back_content = "Text cannot exceed 200 characters";
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  }

  return {
    proposals,
    generationId,
    initializeProposals,
    updateProposal,
    acceptProposal,
    rejectProposal,
    reset,
  };
}
