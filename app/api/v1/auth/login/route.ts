import { cookies } from "next/headers";
import { z } from "zod";
import { AppError } from "@/lib/api/errors";
import { wrap } from "@/lib/api/handler";
import { signJwt } from "@/lib/auth/jwt";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/session-cookie";
import { authService } from "@/server/services/auth.service";

const Input = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const POST = wrap(async (request) => {
  const input = Input.parse(await request.json());
  console.log("Login input:", input);
  if (!(await authService.validate(input.username, input.password)))
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Yanlış istifadəçi adı və ya şifrə",
      401,
    );
  const token = await signJwt({ sub: "admin", username: input.username });
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
  return { data: { username: input.username } };
});
