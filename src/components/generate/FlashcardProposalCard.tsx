import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FlashcardEditorField } from "./FlashcardEditorField";
import type { FlashcardProposalDTO } from "@/types";

interface FlashcardProposalCardProps {
  proposal: {
    id: string;
    front_content: string;
    back_content: string;
    isEdited: boolean;
    isSaving: boolean;
    errors?: {
      front_content?: string;
      back_content?: string;
    };
  };
  onAccept: () => Promise<void>;
  onReject: () => void;
  onUpdate: (updates: Partial<FlashcardProposalDTO>) => void;
}

export function FlashcardProposalCard({ proposal, onAccept, onReject, onUpdate }: FlashcardProposalCardProps) {
  const { front_content, back_content, isEdited, isSaving, errors } = proposal;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <FlashcardEditorField
          label="Front"
          value={front_content}
          onChange={(value) => onUpdate({ front_content: value })}
          error={errors?.front_content}
          disabled={isSaving}
        />
        <FlashcardEditorField
          label="Back"
          value={back_content}
          onChange={(value) => onUpdate({ back_content: value })}
          error={errors?.back_content}
          disabled={isSaving}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={onAccept} disabled={isSaving || Boolean(errors)} className="flex-1">
          {isSaving ? "Saving..." : isEdited ? "Accept Edited" : "Accept"}
        </Button>
        <Button variant="outline" onClick={onReject} disabled={isSaving} className="flex-1">
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
