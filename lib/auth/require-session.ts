import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

export async function requireSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");
  try {
    return await verifyJwt(token);
  } catch {
    redirect("/login");
  }
}
