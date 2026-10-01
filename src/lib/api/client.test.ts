import { describe, expect, it, vi } from "vitest";
import { createApiClient } from "./client";
import { ApiError, getErrorMessage, getFieldErrors } from "./errors";

function json(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

const ok = (data: unknown) => json(200, { success: true, message: "ok", data });
const unauthorized = () =>
  json(401, {
    success: false,
    message: "Invalid or expired access token",
    errors: [],
  });
const refreshed = () =>
  json(200, {
    success: true,
    message: "Token refreshed successfully",
    data: { accessToken: "new-access", refreshToken: "new-refresh" },
  });

type Handler = (url: URL, init: RequestInit) => Response | Promise<Response>;

function setup(handler: Handler) {
  const tokens = { access: "old-access", refresh: "old-refresh" };
  const fetchFn = vi.fn(async (input: string, init?: RequestInit) =>
    handler(new URL(input), init ?? {}),
  );
  const onAuthFailure = vi.fn();
  const client = createApiClient({
    baseUrl: "https://api.test/api/v1",
    fetchFn,
    getAccessToken: () => tokens.access,
    getRefreshToken: () => tokens.refresh,
    onTokens: (pair) => {
      tokens.access = pair.accessToken;
      tokens.refresh = pair.refreshToken;
    },
    onAuthFailure,
  });
  return { client, fetchFn, onAuthFailure, tokens };
}

const isRefresh = (url: URL) => url.pathname.endsWith("/auth/refresh-token");
const bearer = (init: RequestInit) =>
  new Headers(init.headers).get("authorization");

// A protected route that only accepts the rotated token.
const protectedRoute: Handler = (url, init) => {
  if (isRefresh(url)) return refreshed();
  return bearer(init) === "Bearer new-access"
    ? ok({ ok: true })
    : unauthorized();
};

describe("api client", () => {
  it("sends the bearer token and returns data and meta", async () => {
    const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
    const { client, fetchFn } = setup(() =>
      json(200, { success: true, message: "ok", data: [{ id: 1 }], meta }),
    );

    const res = await client.get<{ id: number }[]>("/parcels", {
      query: { page: 1, q: undefined },
    });

    expect(res.data).toEqual([{ id: 1 }]);
    expect(res.meta).toEqual(meta);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("https://api.test/api/v1/parcels?page=1");
    expect(bearer(init ?? {})).toBe("Bearer old-access");
  });

  it("refreshes once on 401, stores the new pair and retries the request", async () => {
    const { client, fetchFn, tokens } = setup(protectedRoute);

    const res = await client.get("/users/me");

    expect(res.data).toEqual({ ok: true });
    expect(tokens).toEqual({ access: "new-access", refresh: "new-refresh" });
    expect(fetchFn).toHaveBeenCalledTimes(3); // 401, refresh, retry
    const refreshCall = fetchFn.mock.calls.find(([url]) =>
      url.endsWith("/auth/refresh-token"),
    );
    expect(JSON.parse(String(refreshCall?.[1]?.body))).toEqual({
      refreshToken: "old-refresh",
    });
  });

  it("shares a single refresh between concurrent 401s", async () => {
    const { client, fetchFn } = setup(protectedRoute);

    const results = await Promise.all([
      client.get("/a"),
      client.get("/b"),
      client.get("/c"),
    ]);

    expect(results).toHaveLength(3);
    const refreshCalls = fetchFn.mock.calls.filter(([url]) =>
      url.endsWith("/auth/refresh-token"),
    );
    expect(refreshCalls).toHaveLength(1);
  });

  it("does not refresh again when the retried request is still 401", async () => {
    const { client, fetchFn } = setup((url) =>
      isRefresh(url) ? refreshed() : unauthorized(),
    );

    await expect(client.get("/users/me")).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchFn).toHaveBeenCalledTimes(3); // original, one refresh, one retry
  });

  it("ends the session when the refresh token is rejected", async () => {
    const { client, onAuthFailure } = setup((url) =>
      isRefresh(url)
        ? json(401, {
            success: false,
            message: "Invalid or expired refresh token",
            errors: [],
          })
        : unauthorized(),
    );

    await expect(client.get("/users/me")).rejects.toMatchObject({
      status: 401,
    });
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
  });

  it("keeps the session when refresh is rate limited", async () => {
    const { client, onAuthFailure } = setup((url) =>
      isRefresh(url)
        ? json(
            429,
            { success: false, message: "Too many attempts", errors: [] },
            { "Retry-After": "30" },
          )
        : unauthorized(),
    );

    await expect(client.get("/users/me")).rejects.toMatchObject({
      status: 429,
      retryAfter: 30,
    });
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it("never tries to refresh for auth: false requests", async () => {
    const { client, fetchFn } = setup(() =>
      json(401, {
        success: false,
        message: "Invalid email or password",
        errors: [],
      }),
    );

    await expect(
      client.post(
        "/auth/login",
        { email: "a@b.co", password: "x" },
        { auth: false },
      ),
    ).rejects.toThrow("Invalid email or password");
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("turns network failures into an ApiError with status 0", async () => {
    const { client } = setup(() => {
      throw new TypeError("fetch failed");
    });

    const error = await client.get("/parcels").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 0 });
    expect(getErrorMessage(error)).toMatch(/can't reach the server/i);
  });

  it("maps backend validation errors to form field paths", async () => {
    const { client } = setup(() =>
      json(422, {
        success: false,
        message: "Validation failed",
        errors: [{ field: "body.email", message: "Invalid email address" }],
      }),
    );

    const error = await client
      .post("/auth/login", {}, { auth: false })
      .catch((e: unknown) => e);
    expect(getFieldErrors(error)).toEqual({ email: "Invalid email address" });
  });

  it("rejects paths that repeat the /api prefix", async () => {
    const { client } = setup(() => ok(null));
    await expect(client.get("/api/v1/parcels")).rejects.toThrow(
      /must not repeat/,
    );
  });

  it("maps a whole-body validation error to a root error", async () => {
    const { client } = setup(() =>
      json(422, {
        success: false,
        message: "Validation failed",
        errors: [
          {
            field: "body",
            message: "At least one field must be provided to update",
          },
        ],
      }),
    );

    const error = await client.patch("/users/me", {}).catch((e: unknown) => e);
    expect(getFieldErrors(error)).toEqual({
      root: "At least one field must be provided to update",
    });
  });
});
