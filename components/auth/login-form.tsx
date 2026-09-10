"use client";
import { useActionState } from "react";
import { loginAction } from "@/server/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="grid gap-5">
      <label className="grid gap-2 text-sm font-semibold">
        İstifadəçi adı
        <input
          className="h-11 border bg-paper px-3 font-normal"
          name="username"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Şifrə
        <input
          className="h-11 border bg-paper px-3 font-normal"
          name="password"
          required
          type="password"
        />
      </label>
      {state && !state.ok ? (
        <p className="text-sm text-copper">{state.error.message}</p>
      ) : null}
      <button
        className="h-12 bg-ink font-semibold text-paper disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Yoxlanılır…" : "Daxil ol"}
      </button>
    </form>
  );
}
