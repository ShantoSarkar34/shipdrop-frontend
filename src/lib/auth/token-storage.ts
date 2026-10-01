import type { TokenPair } from "../types";

const ACCESS_KEY = "swiftdrop.access";
const REFRESH_KEY = "swiftdrop.refresh";

// Fallback for browsers where localStorage is blocked (some private modes).
const memory: { access: string | null; refresh: string | null } = {
  access: null,
  refresh: null,
};

function read(key: string, fallback: string | null): string | null {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the in-memory copy still works for this tab.
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return read(ACCESS_KEY, memory.access);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return read(REFRESH_KEY, memory.refresh);
}

export function saveTokens(tokens: TokenPair) {
  memory.access = tokens.accessToken;
  memory.refresh = tokens.refreshToken;
  write(ACCESS_KEY, tokens.accessToken);
  write(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens() {
  memory.access = null;
  memory.refresh = null;
  write(ACCESS_KEY, null);
  write(REFRESH_KEY, null);
}
