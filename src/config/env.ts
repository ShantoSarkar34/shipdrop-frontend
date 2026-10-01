const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local.",
  );
}

export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/+$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
} as const;
