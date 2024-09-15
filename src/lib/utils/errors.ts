export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly scopeData?: Record<string, unknown>;
  constructor(
    description: string,
    isOperational: boolean,
    scopeData?: Record<string, unknown>
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.isOperational = isOperational;
    this.scopeData = scopeData;
    this.name = "AppError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
  }
}
