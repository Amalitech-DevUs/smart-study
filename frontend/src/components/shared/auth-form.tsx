"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/lib/notification-context";
import { useAuth } from "@/lib/use-auth";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    pin?: string;
    confirmPin?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { loggedIn, refreshAuth } = useAuth();
  const { showToast } = useNotifications();
  const isSignup = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!username.trim()) nextErrors.username = "Username is required";
    if (!/^\d{4,6}$/.test(pin)) nextErrors.pin = "PIN must be 4–6 digits";
    if (isSignup) {
      if (!confirmPin) nextErrors.confirmPin = "Please confirm your PIN";
      else if (confirmPin !== pin) nextErrors.confirmPin = "PINs do not match";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), pin }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const msg = result?.error ?? "Authentication failed. Please check your credentials.";
        setErrors({ form: msg });
        showToast("error", msg, isSignup ? "Registration Failed" : "Sign In Failed");
        return;
      }

      showToast(
        "success",
        isSignup
          ? `Welcome to SmartStudy, ${username}! Your account is ready.`
          : `Welcome back, ${username}!`,
        isSignup ? "Account Created" : "Signed In"
      );

      try {
        localStorage.setItem("smartstudy_auth_sync", String(Date.now()));
      } catch {
        // Storage quota or private mode
      }
      await refreshAuth();

      const redirect = new URLSearchParams(window.location.search).get("redirect");
      const destination =
        redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";
      router.replace(destination);
      router.refresh();
    } catch {
      const errMsg = "Unable to connect right now. Please try again.";
      setErrors({ form: errMsg });
      showToast("error", errMsg, "Connection Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12 sm:px-10">
      <div className="w-full max-w-[380px]">

        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Brand */}
        <div className="mb-7">
          <Link
            href={loggedIn ? "/dashboard" : "/"}
            className="font-heading text-2xl font-black tracking-tight text-slate-900 hover:opacity-80 transition-opacity"
          >
            SmartStudy
          </Link>
          <p className="mt-1 text-xs text-slate-400">
            {isSignup ? "Create your revision account" : "Sign in to continue your session"}
          </p>
        </div>

        {/* Mode switch tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <Link
            href="/login"
            className={`rounded-lg py-2 text-center transition-all ${
              !isSignup ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={`rounded-lg py-2 text-center transition-all ${
              isSignup ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Register
          </Link>
        </div>

        {/* Form error */}
        {errors.form && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username */}
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              placeholder="e.g. kwame_study"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`h-11 w-full rounded-xl border bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 ${
                errors.username
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
              }`}
              aria-invalid={Boolean(errors.username)}
            />
            {errors.username && (
              <p className="mt-1 text-[11px] font-medium text-red-600">{errors.username}</p>
            )}
          </div>

          {/* PIN */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="pin" className="block text-xs font-semibold text-slate-700">
                Security PIN
              </label>
              <span className="text-[11px] text-slate-400">4–6 digits</span>
            </div>
            <div className="relative">
              <input
                id="pin"
                name="pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={`h-11 w-full rounded-xl border bg-slate-50 pl-3.5 pr-16 text-sm tracking-widest text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 ${
                  errors.pin
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
                aria-invalid={Boolean(errors.pin)}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-[11px] font-semibold text-slate-400 hover:text-slate-900 transition-colors select-none"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? "Hide" : "Show"}
              </button>
            </div>
            {errors.pin && (
              <p className="mt-1 text-[11px] font-medium text-red-600">{errors.pin}</p>
            )}
          </div>

          {/* Confirm PIN (signup only) */}
          {isSignup && (
            <div>
              <label htmlFor="confirmPin" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Confirm PIN
              </label>
              <input
                id="confirmPin"
                name="confirmPin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                maxLength={6}
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={`h-11 w-full rounded-xl border bg-slate-50 px-3.5 text-sm tracking-widest text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-2 ${
                  errors.confirmPin
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
                aria-invalid={Boolean(errors.confirmPin)}
              />
              {errors.confirmPin && (
                <p className="mt-1 text-[11px] font-medium text-red-600">{errors.confirmPin}</p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#0e1726] text-sm font-semibold text-white transition-all hover:bg-slate-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                {isSignup ? "Creating account…" : "Signing in…"}
              </span>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-slate-900 underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            {isSignup ? "Sign in" : "Register now"}
          </Link>
        </p>
      </div>
    </main>
  );
}
