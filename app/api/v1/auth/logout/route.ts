import { cookies } from "next/headers";
import { wrap } from "@/lib/api/handler";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

export const POST = wrap(async () => {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);
  return { data: { loggedOut: true } };
});
