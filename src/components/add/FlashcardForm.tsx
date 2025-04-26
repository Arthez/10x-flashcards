import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { CreateManualFlashcardCommand } from "@/types";
import { flashcardService } from "@/services/flashcard.service";
import { flashcardSchema, type FlashcardFormData } from "@/schemas/flashcard.schema";

interface ValidationError {
  code: string;
  message: string;
  details: Record<string, { _errors: string[] }>;
}

export default function FlashcardForm() {
  const form = useForm<FlashcardFormData>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      front_content: "",
      back_content: "",
    },
    mode: "onChange",
    delayError: 0,
  });

  const onSubmit = async (data: FlashcardFormData) => {
    try {
      const command: CreateManualFlashcardCommand = {
        ...data,
        creation_method: "manual",
      };

      await flashcardService.create(command);
      toast.success("Flashcard created successfully!");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        const errorData = tryParseError(error.message) as ValidationError | null;
        if (errorData?.details) {
          // Handle validation errors from server
          Object.entries(errorData.details).forEach(([field, errors]) => {
            form.setError(field as keyof FlashcardFormData, {
              type: "server",
              message: errors._errors[0],
            });
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to create flashcard");
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="front_content"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                Front Content <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the question or prompt for the flashcard front"
                  className="min-h-[100px]"
                  onKeyDown={onKeyDown}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">{field.value.length}/200 characters</p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="back_content"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                Back Content <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the answer or information for the flashcard back"
                  className="min-h-[100px]"
                  onKeyDown={onKeyDown}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">{field.value.length}/200 characters</p>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? "Creating..." : "Create Flashcard"}
          </Button>
          <p className="text-xs text-gray-500 text-center">Press Ctrl+Enter to submit the form</p>
        </div>
      </form>
    </Form>
  );
}

function tryParseError(message: string) {
  try {
    return JSON.parse(message);
  } catch {
    return null;
  }
}
