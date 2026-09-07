"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Eye, EyeOff } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
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
      nextErrors.pin = "PIN must be 4 to 6 digits";
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

      const redirect = new URLSearchParams(window.location.search).get("redirect");
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
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b132b] text-brand-gold">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900">
            {isSignup ? "Create your Account" : "Welcome Back"}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isSignup
              ? "Enter a username & PIN to start practicing"
              : "Sign in with your username & security PIN"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-slate-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="e.g. alex_study"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/10"
              aria-invalid={Boolean(errors.username)}
            />
            {errors.username && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.username}</p>
            )}
          </div>

          {/* PIN */}
          <div>
            <label htmlFor="pin" className="block text-xs font-semibold text-slate-700">
              Security PIN (4–6 Digits)
            </label>
            <div className="relative mt-1">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 text-sm tracking-widest text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-brand-indigo focus:bg-white focus:ring-2 focus:ring-brand-indigo/10"
                aria-invalid={Boolean(errors.pin)}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.pin && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.pin}</p>
            )}
          </div>

          {errors.form && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
              {errors.form}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b132b] py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
          >
            <span>{isSubmitting ? "Processing..." : isSignup ? "Sign Up" : "Log In"}</span>
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-bold text-brand-indigo underline hover:text-slate-900"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </Link>
        </div>

      </div>
    </main>
  );
}
