import { ApiError } from "./errors";
import type { ApiResponse, FieldError, PageMeta, TokenPair } from "../types";

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;
type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Set to false for login, register, google and refresh. Those never trigger a token refresh. */
  auth?: boolean;
  signal?: AbortSignal;
}

export interface ApiClientOptions {
  /** Already includes /api/v1. */
  baseUrl: string;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onTokens: (tokens: TokenPair) => void;
  /** Called only when the refresh token is definitively rejected. */
  onAuthFailure: () => void;
  fetchFn?: FetchFn;
}

const REFRESH_PATH = "/auth/refresh-token";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFieldError(value: unknown): value is FieldError {
  return (
    isRecord(value) &&
    typeof value.field === "string" &&
    typeof value.message === "string"
  );
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, QueryValue>,
): string {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with "/": ${path}`);
  }
  if (path.startsWith("/api/")) {
    throw new Error(
      `API path must not repeat the /api prefix, the base URL already has it: ${path}`,
    );
  }
  const url = baseUrl.replace(/\/+$/, "") + path;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const seconds = Number(header);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toApiError(res: Response, body: unknown): ApiError {
  const payload = isRecord(body) ? body : {};
  const message =
    typeof payload.message === "string" && payload.message
      ? payload.message
      : res.statusText || "Request failed";
  const errors = Array.isArray(payload.errors)
    ? payload.errors.filter(isFieldError)
    : [];
  return new ApiError({
    status: res.status,
    message,
    errors,
    retryAfter: parseRetryAfter(res.headers.get("retry-after")),
  });
}

function toSuccess<T>(body: unknown): ApiResponse<T> {
  const payload = isRecord(body) ? body : {};
  return {
    success: true,
    message: typeof payload.message === "string" ? payload.message : "",
    data: payload.data as T,
    meta: isRecord(payload.meta)
      ? (payload.meta as unknown as PageMeta)
      : undefined,
  };
}

function sessionExpired(): ApiError {
  return new ApiError({
    status: 401,
    message: "Your session has expired. Please sign in again.",
  });
}

export function createApiClient(options: ApiClientOptions) {
  const { baseUrl, getAccessToken, getRefreshToken, onTokens, onAuthFailure } =
    options;
  const fetchFn: FetchFn =
    options.fetchFn ?? ((input, init) => globalThis.fetch(input, init));

  async function send(
    path: string,
    opts: RequestOptions,
    token: string | null,
  ) {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    // Outside the try block: a bad path is a programming error, not a network failure.
    const url = buildUrl(baseUrl, path, opts.query);

    let res: Response;
    try {
      res = await fetchFn(url, {
        method: opts.method ?? "GET",
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        signal: opts.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError")
        throw error;
      throw new ApiError({ status: 0, message: "Network error" });
    }
    return { res, body: await readBody(res) };
  }

  async function performRefresh(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      onAuthFailure();
      throw sessionExpired();
    }

    const { res, body } = await send(
      REFRESH_PATH,
      { method: "POST", body: { refreshToken }, auth: false },
      null,
    );

    if (res.ok) {
      const tokens = toSuccess<Partial<TokenPair> | undefined>(body).data;
      if (!tokens?.accessToken || !tokens.refreshToken) {
        throw new ApiError({
          status: 502,
          message: "Unexpected response from the server.",
        });
      }
      onTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      return tokens.accessToken;
    }

    // Only a definitive rejection ends the session. Rate limits, 5xx and network
    // problems are transient, so the session stays and the original request fails.
    if (res.status === 401 || res.status === 403) {
      onAuthFailure();
      throw sessionExpired();
    }
    throw toApiError(res, body);
  }

  // Single-flight: concurrent 401s share one refresh. Refresh tokens rotate,
  // so parallel refreshes would invalidate each other.
  let inFlight: Promise<string> | null = null;
  function refresh(): Promise<string> {
    if (!inFlight) {
      inFlight = performRefresh().finally(() => {
        inFlight = null;
      });
    }
    return inFlight;
  }

  async function request<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const useAuth = opts.auth !== false;
    const tokenUsed = useAuth ? getAccessToken() : null;

    let { res, body } = await send(path, opts, tokenUsed);

    if (res.status === 401 && useAuth) {
      // If another request already refreshed while this one was in flight,
      // reuse the new token. Otherwise refresh. Either way, retry exactly once.
      const current = getAccessToken();
      const token =
        current && current !== tokenUsed ? current : await refresh();
      ({ res, body } = await send(path, opts, token));
    }

    if (!res.ok) throw toApiError(res, body);
    return toSuccess<T>(body);
  }

  type Extra = Omit<RequestOptions, "method" | "body">;

  return {
    request,
    get: <T>(path: string, opts?: Extra) =>
      request<T>(path, { ...opts, method: "GET" }),
    post: <T>(path: string, body?: unknown, opts?: Extra) =>
      request<T>(path, { ...opts, method: "POST", body }),
    patch: <T>(path: string, body?: unknown, opts?: Extra) =>
      request<T>(path, { ...opts, method: "PATCH", body }),
    delete: <T>(path: string, opts?: Extra) =>
      request<T>(path, { ...opts, method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
