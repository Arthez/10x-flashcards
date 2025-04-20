export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized access") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class DatabaseError extends APIError {
  constructor(message: string, details?: unknown) {
    super(message, 500, "DATABASE_ERROR", details);
  }
}

export const createAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle database-related errors
    if (error.message.includes("Failed to fetch")) {
      return new DatabaseError(error.message);
    }

    return new APIError(error.message, 500, "INTERNAL_SERVER_ERROR");
  }

  return new APIError("An unexpected error occurred", 500, "INTERNAL_SERVER_ERROR");
};
