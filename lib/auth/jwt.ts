import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";
import type { Session } from "@/types/auth";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signJwt(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<Session> {
  const { payload } = await jwtVerify(token, secret);
  if (payload.sub !== "admin" || typeof payload.username !== "string")
    throw new Error("Invalid session");
  return { sub: "admin", username: payload.username };
}
