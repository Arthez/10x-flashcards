import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../ui/button";
import { logger } from "../../lib/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class LearnErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Learn view error", error, {
      context: "LearnErrorBoundary",
      data: {
        componentStack: errorInfo.componentStack,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-6 p-8 text-center" role="alert">
          <h2 className="text-2xl font-semibold text-destructive">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md">
            An unexpected error occurred while displaying the flashcards. Our team has been notified.
          </p>
          {this.state.error && (
            <pre className="p-4 bg-muted rounded-lg text-sm overflow-auto max-w-full">{this.state.error.message}</pre>
          )}
          <Button onClick={this.handleReset} variant="outline">
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
