import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CreateManualFlashcardCommand, FlashcardDTO } from "@/types";

// Form schema and state types
interface FormSchema {
  front_content: string;
  back_content: string;
}

interface FormState {
  values: FormSchema;
  errors: {
    front_content?: string;
    back_content?: string;
  };
  isSubmitting: boolean;
  isValid: boolean;
  successMessage?: string;
}

// Custom hook for flashcard form management
function useFlashcardForm() {
  const [formState, setFormState] = useState<FormState>({
    values: { front_content: "", back_content: "" },
    errors: {},
    isSubmitting: false,
    isValid: false,
  });

  // Reference to first input element for focus management
  const frontInputRef = useRef<HTMLTextAreaElement>(null);

  // Focus management after form submission
  useEffect(() => {
    if (formState.successMessage && frontInputRef.current) {
      // Set focus back to first input after successful submission
      frontInputRef.current.focus();
    }
  }, [formState.successMessage]);

  // Validates a form field and returns error message if invalid
  const validateField = (name: keyof FormSchema, value: string): string | undefined => {
    if (value.length < 2) {
      return "Must be at least 2 characters";
    }
    if (value.length > 200) {
      return "Must be no more than 200 characters";
    }
    return undefined;
  };

  // Updates a single field value and validates it
  const handleChange = (name: keyof FormSchema, value: string) => {
    const error = validateField(name, value);

    const newFormState = {
      ...formState,
      values: {
        ...formState.values,
        [name]: value,
      },
      errors: {
        ...formState.errors,
        [name]: error,
      },
      // Clear success message when user starts editing again
      successMessage: undefined,
    };

    // Check if the entire form is valid
    const isValid =
      !validateField("front_content", newFormState.values.front_content) &&
      !validateField("back_content", newFormState.values.back_content);

    setFormState({
      ...newFormState,
      isValid,
    });
  };

  // Handle keyboard events in the form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab + Shift navigates backwards, which is default behavior
    // Tab navigates forward, which is default behavior

    // Ctrl+Enter submits the form if it's valid
    if (e.key === "Enter" && e.ctrlKey && formState.isValid && !formState.isSubmitting) {
      e.preventDefault();
      const formElement = (e.target as HTMLElement).closest("form");
      if (formElement) {
        formElement.requestSubmit();
      }
    }
  };

  // Resets form to initial state
  const resetForm = () => {
    setFormState({
      values: { front_content: "", back_content: "" },
      errors: {},
      isSubmitting: false,
      isValid: false,
      successMessage: "Flashcard created successfully!",
    });
  };

  // API function to create a flashcard
  const createFlashcard = async (data: CreateManualFlashcardCommand): Promise<FlashcardDTO> => {
    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle different error codes from the API
        const errorCode = responseData.error?.code || "UNKNOWN_ERROR";
        const errorMessage = responseData.error?.message || "An unknown error occurred";

        // Handle validation errors from server if applicable
        const fieldErrors: Record<string, string> = {};
        let details;

        switch (errorCode) {
          case "VALIDATION_ERROR":
            details = responseData.error?.details || {};

            if (details.front_content) {
              fieldErrors.front_content = details.front_content._errors[0] || "Invalid front content";
            }

            if (details.back_content) {
              fieldErrors.back_content = details.back_content._errors[0] || "Invalid back content";
            }

            break;

          case "INTERNAL_ERROR":
            throw new Error("Server error. Please try again later.");

          default:
            throw new Error(errorMessage);
        }

        // Update form errors with server validation errors
        if (Object.keys(fieldErrors).length > 0) {
          setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, ...fieldErrors },
            isValid: false,
          }));
        }

        throw new Error(errorMessage);
      }

      return responseData as FlashcardDTO;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("An unknown error occurred");
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const frontError = validateField("front_content", formState.values.front_content);
    const backError = validateField("back_content", formState.values.back_content);

    if (frontError || backError) {
      setFormState({
        ...formState,
        errors: {
          front_content: frontError,
          back_content: backError,
        },
        isValid: false,
      });
      return;
    }

    // Set submitting state
    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Create flashcard command
      const command: CreateManualFlashcardCommand = {
        front_content: formState.values.front_content,
        back_content: formState.values.back_content,
        creation_method: "manual",
      };

      // Send API request
      const flashcard = await createFlashcard(command);

      // Show success toast and reset form
      toast.success("Flashcard created successfully!");
      resetForm();

      return flashcard;
    } catch (error) {
      // Show error toast
      toast.error(error instanceof Error ? error.message : "Failed to create flashcard");
    } finally {
      // Reset submitting state
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return {
    formState,
    handleChange,
    handleSubmit,
    handleKeyDown,
    frontInputRef,
    resetForm,
  };
}

// FlashcardForm component
export default function FlashcardForm() {
  const { formState, handleChange, handleSubmit, handleKeyDown, frontInputRef } = useFlashcardForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-busy={formState.isSubmitting}>
      {formState.successMessage && (
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="status"
        >
          <span className="font-medium">Success:</span> {formState.successMessage}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="front_content" className="block text-sm font-medium">
          Front Content <span className="text-red-500">*</span>
        </label>
        <Textarea
          ref={frontInputRef}
          id="front_content"
          name="front_content"
          value={formState.values.front_content}
          onChange={(e) => handleChange("front_content", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Enter the question or prompt for the flashcard front"
          required
          aria-invalid={!!formState.errors.front_content}
          aria-describedby={formState.errors.front_content ? "front-content-error" : "front-content-hint"}
          className={formState.errors.front_content ? "border-red-500" : ""}
          disabled={formState.isSubmitting}
        />
        {formState.errors.front_content && (
          <p className="text-sm text-red-500" id="front-content-error" role="alert">
            {formState.errors.front_content}
          </p>
        )}
        <p className="text-xs text-gray-500" id="front-content-hint" aria-live="polite">
          {formState.values.front_content.length}/200 characters
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="back_content" className="block text-sm font-medium">
          Back Content <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="back_content"
          name="back_content"
          value={formState.values.back_content}
          onChange={(e) => handleChange("back_content", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Enter the answer or information for the flashcard back"
          required
          aria-invalid={!!formState.errors.back_content}
          aria-describedby={formState.errors.back_content ? "back-content-error" : "back-content-hint"}
          className={formState.errors.back_content ? "border-red-500" : ""}
          disabled={formState.isSubmitting}
        />
        {formState.errors.back_content && (
          <p className="text-sm text-red-500" id="back-content-error" role="alert">
            {formState.errors.back_content}
          </p>
        )}
        <p className="text-xs text-gray-500" id="back-content-hint" aria-live="polite">
          {formState.values.back_content.length}/200 characters
        </p>
      </div>

      <div className="space-y-2">
        <Button
          type="submit"
          disabled={!formState.isValid || formState.isSubmitting}
          className="w-full"
          aria-busy={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Creating..." : "Create Flashcard"}
        </Button>

        <p className="text-xs text-gray-500 text-center">Press Ctrl+Enter to submit the form</p>
      </div>
    </form>
  );
}
