import { useGeneration } from "@/hooks/useGeneration";
import { useFlashcardProposals } from "@/hooks/useFlashcardProposals";
import { InputForm } from "./InputForm";
import { FlashcardProposalsList } from "./FlashcardProposalsList";
import { toast } from "sonner";
import type { GenerateFlashcardsCommand } from "@/types";

export function GenerateView() {
  const { isGenerating, error, generateFlashcards } = useGeneration();
  const { proposals, initializeProposals, updateProposal, acceptProposal, rejectProposal } = useFlashcardProposals();

  async function handleGenerate(data: GenerateFlashcardsCommand) {
    try {
      const result = await generateFlashcards(data);
      initializeProposals(result.proposals, result.generation_id);
      toast.success(`Generated ${result.total_generated} flashcards`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate flashcards");
    }
  }

  return (
    <div className="space-y-8">
      <InputForm onSubmit={handleGenerate} isLoading={isGenerating} />
      {error && <div className="rounded-md bg-destructive/15 p-4 text-destructive">{error}</div>}
      <FlashcardProposalsList
        proposals={proposals}
        onAccept={acceptProposal}
        onReject={rejectProposal}
        onUpdate={updateProposal}
      />
    </div>
  );
}
