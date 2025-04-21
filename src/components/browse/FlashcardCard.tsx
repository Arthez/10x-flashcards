import { useState } from "react";
import type { FlashcardDTO, UpdateFlashcardCommand } from "../../types";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { Textarea } from "../ui/textarea";

interface FlashcardCardProps {
  flashcard: FlashcardDTO;
  onEdit: (id: string, data: UpdateFlashcardCommand) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface ValidationErrors {
  front?: string;
  back?: string;
}

const FlashcardCard = ({ flashcard, onEdit, onDelete }: FlashcardCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [frontContent, setFrontContent] = useState(flashcard.front_content);
  const [backContent, setBackContent] = useState(flashcard.back_content);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openModal } = useConfirmModal();

  const validateContent = (content: string): string | undefined => {
    if (content.length < 2) {
      return "Content must be at least 2 characters long";
    }
    if (content.length > 200) {
      return "Content must not exceed 200 characters";
    }
    return undefined;
  };

  const handleEdit = () => {
    openModal({
      title: "Edit Flashcard",
      message: "Are you sure you want to edit this flashcard?",
      confirmLabel: "Edit",
      onConfirm: () => {
        setIsEditing(true);
        setFrontContent(flashcard.front_content);
        setBackContent(flashcard.back_content);
      },
    });
  };

  const handleSave = async () => {
    const frontError = validateContent(frontContent);
    const backError = validateContent(backContent);

    if (frontError || backError) {
      setErrors({ front: frontError, back: backError });
      return;
    }

    try {
      setIsSubmitting(true);
      await onEdit(flashcard.id, {
        front_content: frontContent,
        back_content: backContent,
      });
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      setErrors({
        front: "Failed to save changes",
        back: "Failed to save changes",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    openModal({
      title: "Delete Flashcard",
      message: "Are you sure you want to delete this flashcard? This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: () => onDelete(flashcard.id),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setFrontContent(flashcard.front_content);
    setBackContent(flashcard.back_content);
  };

  const creationMethodStyles = {
    ai_full: "bg-green-500",
    ai_edited: "bg-blue-500",
    manual: "bg-gray-500",
  };

  return (
    <Card className="relative">
      <div
        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${creationMethodStyles[flashcard.creation_method]}`}
        title={`Creation method: ${flashcard.creation_method}`}
      />
      <CardContent className="p-4 space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Textarea
                placeholder="Front content"
                value={frontContent}
                onChange={(e) => setFrontContent(e.target.value)}
                className={errors.front ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.front && <p className="text-xs text-destructive">{errors.front}</p>}
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Back content"
                value={backContent}
                onChange={(e) => setBackContent(e.target.value)}
                className={errors.back ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.back && <p className="text-xs text-destructive">{errors.back}</p>}
            </div>
          </>
        ) : (
          <>
            <p className="font-medium">{flashcard.front_content}</p>
            <p className="text-muted-foreground">{flashcard.back_content}</p>
          </>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default FlashcardCard;
