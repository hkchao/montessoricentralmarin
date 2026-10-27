"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/Button";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-navy">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[1rem] text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-sun/60"
          required
        />
      </div>
      {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Checking..." : "Enter admin"}
      </Button>
    </form>
  );
}
