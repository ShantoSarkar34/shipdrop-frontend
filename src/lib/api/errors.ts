import type { FieldError } from "../types";

export class ApiError extends Error {
  readonly status: number;
  readonly errors: FieldError[];
  /** Seconds, taken from the Retry-After header when the browser can read it. */
  readonly retryAfter: number | null;

  constructor(init: {
    status: number;
    message: string;
    errors?: FieldError[];
    retryAfter?: number | null;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.errors = init.errors ?? [];
    this.retryAfter = init.retryAfter ?? null;
  }

  /** Status 0 means the request never got an HTTP response. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function formatWait(seconds: number): string {
  if (seconds < 60) return `${Math.max(1, Math.ceil(seconds))} seconds`;
  const minutes = Math.ceil(seconds / 60);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

/** A message that is safe to show to a user. Never exposes server internals. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!isApiError(error)) return fallback;

  const { status, message, retryAfter } = error;
  const serverMessage = message.trim();

  if (status === 0)
    return "Can't reach the server. Check your connection and try again.";
  if (status === 422)
    return "Please check the highlighted fields and try again.";
  if (status === 429) {
    return retryAfter
      ? `Too many attempts. Please wait about ${formatWait(retryAfter)} and try again.`
      : "Too many attempts. Please wait a few minutes and try again.";
  }
  if (status >= 500)
    return "Something went wrong on our side. Please try again shortly.";
  if (serverMessage) return serverMessage;

  switch (status) {
    case 401:
      return "Please sign in to continue.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return "That action conflicts with the current state. Refresh and try again.";
    default:
      return fallback;
  }
}

const FIELD_PREFIX = /^(body|query|params)\./;

/** Maps backend validation errors to { fieldPath: message } for React Hook Form. */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!isApiError(error)) return {};
  const result: Record<string, string> = {};
  for (const { field, message } of error.errors) {
    const key = field === "body" ? "root" : field.replace(FIELD_PREFIX, "");
    if (!(key in result)) result[key] = message;
  }
  return result;
}
