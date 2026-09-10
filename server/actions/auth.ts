"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signJwt } from "@/lib/auth/jwt";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/session-cookie";
import { authService } from "@/server/services/auth.service";
import type { ActionResult } from "@/types/api";

const LoginInput = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(200),
});

export async function loginAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = LoginInput.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  console.log("Parsed login input:", parsed);
  if (!parsed.success)
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "İstifadəçi adı və şifrə tələb olunur",
      },
    };
  if (!(await authService.validate(parsed.data.username, parsed.data.password)))
    return {
      ok: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Yanlış istifadəçi adı və ya şifrə",
      },
    };
  const token = await signJwt({ sub: "admin", username: parsed.data.username });
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
  redirect("/dashboard");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
