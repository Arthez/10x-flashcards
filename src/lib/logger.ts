const isDevelopment = import.meta.env.DEV;

interface LogOptions {
  context?: string;
  data?: unknown;
}

function formatMessage(message: string, options?: LogOptions): string {
  const parts = ["[10x-Flashcards]"];
  if (options?.context) {
    parts.push(`[${options.context}]`);
  }
  parts.push(message);
  return parts.join(" ");
}

export const logger = {
  info(message: string, options?: LogOptions) {
    if (isDevelopment) {
      console.info(formatMessage(message, options), options?.data ? options.data : "");
    }
  },

  error(message: string, error?: Error | unknown, options?: LogOptions) {
    if (isDevelopment) {
      console.error(formatMessage(message, options), error || "", options?.data ? options.data : "");
    }
  },

  warn(message: string, options?: LogOptions) {
    if (isDevelopment) {
      console.warn(formatMessage(message, options), options?.data ? options.data : "");
    }
  },

  debug(message: string, options?: LogOptions) {
    if (isDevelopment) {
      console.debug(formatMessage(message, options), options?.data ? options.data : "");
    }
  },
};
