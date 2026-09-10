import { cookies } from "next/headers";
import { wrap } from "@/lib/api/handler";
import { verifyJwt } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

export const GET = wrap(async () => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  return { data: token ? await verifyJwt(token) : null };
});
