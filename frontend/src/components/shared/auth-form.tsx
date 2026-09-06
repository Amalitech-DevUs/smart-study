"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    pin?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const isSignup = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!username.trim()) {
      nextErrors.username = "Enter a username";
    }

    if (!/^\d{4,6}$/.test(pin)) {
      nextErrors.pin = "PIN must be at least 4 digits";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), pin }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setErrors({
          form: result?.error ?? "Authentication failed. Please try again.",
        });
        return;
      }

      const redirect = new URLSearchParams(window.location.search).get(
        "redirect",
      );
      const destination =
        redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";
      router.push(destination);
    } catch {
      setErrors({ form: "Unable to connect. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-6 py-12 pb-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-text-secondary/15 bg-white p-6 shadow-sm sm:p-8"
        noValidate
      >
        <p className="text-sm font-medium uppercase tracking-wide text-brand-gold">
          Smart Study
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-brand-indigo">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-3 text-text-secondary">
          {isSignup
            ? "Start building your study habit."
            : "Continue your study session."}
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-text-primary"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-md border border-text-secondary/30 px-3 text-text-primary outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="mt-1 text-sm text-danger">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-text-primary"
            >
              PIN
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4,6}"
              minLength={4}
              maxLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={pin}
              onChange={(event) =>
                setPin(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-text-secondary/30 px-3 text-text-primary outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              aria-invalid={Boolean(errors.pin)}
              aria-describedby={errors.pin ? "pin-error" : undefined}
            />
            {errors.pin && (
              <p id="pin-error" className="mt-1 text-sm text-danger">
                {errors.pin}
              </p>
            )}
          </div>
        </div>

        {errors.form && (
          <p className="mt-4 text-sm text-danger" role="alert">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 min-h-11 w-full rounded-md bg-brand-gold px-5 py-3 font-medium text-brand-indigo transition-colors hover:bg-brand-gold/90 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : isSignup
              ? "Create account"
              : "Log in"}
        </button>

        <p className="mt-6 text-center text-sm text-text-secondary">
          {isSignup ? "Already have an account?" : "New to Smart Study?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-medium text-brand-indigo underline underline-offset-4"
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </form>
    </main>
  );
}
