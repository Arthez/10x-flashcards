import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FlashcardEditorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function FlashcardEditorField({
  label,
  value,
  onChange,
  error,
  disabled,
  className,
}: FlashcardEditorFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        disabled={disabled}
        className={cn("resize-none min-h-[100px]", error && "border-destructive focus-visible:ring-destructive")}
      />
    </div>
  );
}
