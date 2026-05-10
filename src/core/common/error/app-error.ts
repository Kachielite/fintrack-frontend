import { isAxiosError } from "axios";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network error. Please check your connection.") {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export function mapAxiosErrorToAppError(error: unknown): AppError {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const message: string =
      data?.message ?? data?.error ?? error.message ?? "Request failed";

    if (status === 401) return new UnauthorizedError(message);
    if (status === 404) return new NotFoundError(message);
    if (status === 400 || status === 422) return new ValidationError(message);
    if (!error.response) return new NetworkError();
    return new AppError(message, String(status));
  }

  // Shape produced internally: { status, error: { code, message } }
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as Record<string, unknown>).error === "object"
  ) {
    const e = error as { error: { message?: string } };
    return new AppError(e.error?.message ?? "Unknown error");
  }

  if (error instanceof Error) return new AppError(error.message);
  return new AppError("An unexpected error occurred");
}
