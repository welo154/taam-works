"use client";

import { useActionState, useState } from "react";
import { signIn, type SignInState } from "@/app/admin/auth-actions";
import { btnPrimary, input, label } from "@/app/admin/ui";

const initial: SignInState = null;

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, initial);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      <label className={label}>
        Username
        <input
          className={input}
          name="user"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          autoFocus
        />
      </label>
      <label className={label}>
        Password
        <span className="relative block">
          <input
            className={`${input} pr-16`}
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-xs font-bold uppercase tracking-wide text-neutral-400 hover:text-cream"
            aria-pressed={show}
          >
            {show ? "Hide" : "Show"}
          </button>
        </span>
      </label>

      {state?.error ? (
        <p
          role="alert"
          className="admin-shake rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${btnPrimary} w-full py-3 text-base`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
