import "server-only";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

export const authService = {
  async validate(username: string, password: string) {
    const passwordMatches = await bcrypt.compare(
      password,
      env.ADMIN_PASSWORD_HASH,
    );
    return username === env.ADMIN_USERNAME && passwordMatches;
  },
};
