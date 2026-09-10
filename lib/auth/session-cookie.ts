export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-session" : "session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 8,
} as const;
