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
