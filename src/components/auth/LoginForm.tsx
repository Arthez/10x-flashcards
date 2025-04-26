import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "@/hooks/useSearchParams";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain both letters and numbers"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/login" + (returnUrl ? `?returnUrl=${returnUrl}` : ""), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          form.setError("root", {
            message: data.error || "Invalid email or password",
          });
        } else {
          toast.error("An error occurred. Please try again later.");
        }
        return;
      }

      // Redirect on success
      window.location.href = data.redirect;
    } catch {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="login-form">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  disabled={isLoading}
                  data-testid="email-input"
                  {...field}
                />
              </FormControl>
              <FormMessage data-testid="email-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  disabled={isLoading}
                  data-testid="password-input"
                  {...field}
                />
              </FormControl>
              <FormMessage data-testid="password-error" />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive" data-testid="form-error">
            {form.formState.errors.root.message}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading} data-testid="submit-button">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
