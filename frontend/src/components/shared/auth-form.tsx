"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";

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

  const isSignup = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!username.trim()) {
      nextErrors.username = "Please enter your username";
    }

    if (!/^\d{4,6}$/.test(pin)) {
      nextErrors.pin = "PIN must be between 4 and 6 numbers";
    }

    if (isSignup) {
      if (!confirmPin) {
        nextErrors.confirmPin = "Please re-type your PIN to confirm";
      } else if (confirmPin !== pin) {
        nextErrors.confirmPin = "PINs do not match. Please verify your PIN.";
      }
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
          form: result?.error ?? "Authentication failed. Please check your credentials.",
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
      setErrors({ form: "Unable to connect right now. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50/60 px-4 py-10 sm:px-6">
      <div className="w-full max-w-4xl">
        {/* Back navigation link on mobile only */}
        <div className="mb-4 md:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Auth Container with Desktop Split Layout */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm grid md:grid-cols-2">
          {/* Brand Showcase Panel (Desktop only) */}
          <div className="hidden md:flex flex-col justify-between bg-[#0e1726] p-10 text-white">
            <div>
              <Link href="/" className="font-heading text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
                SmartStudy
              </Link>

              <div className="mt-14">
                <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                  BECE Revision Platform
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-white">
                  Practice past papers.<br />
                  <span className="text-[#f5a623]">Learn with clarity.</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Access 6 years of official WAEC exam papers with detailed answers and 24/7 AI tutor explanations.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "Official BECE questions from 2018 to 2023",
                  "Step-by-step guidance on difficult problems",
                  "Quick flashcards to retain formulas and facts",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-[#f5a623] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 text-xs text-slate-400">
              Designed for Ghanaian junior high school students.
            </div>
          </div>

          {/* Form Side */}
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <div className="mb-6">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {isSignup ? "Create an account" : "Welcome back"}
              </h1>
              <p className="mt-1.5 text-xs text-slate-500">
                {isSignup
                  ? "Set up your student profile in less than a minute."
                  : "Enter your username and PIN to continue studying."}
              </p>
            </div>

            {/* Mode switch tabs */}
            <div className="mb-6 flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              <Link
                href="/login"
                className={`flex-1 rounded-md py-2 text-center transition-colors ${
                  !isSignup
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`flex-1 rounded-md py-2 text-center transition-colors ${
                  isSignup
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Register
              </Link>
            </div>

            {errors.form && (
              <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="username" className="block text-xs font-semibold text-slate-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. kwame_study"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5 w-full min-h-[44px] rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
                  aria-invalid={Boolean(errors.username)}
                />
                {errors.username && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{errors.username}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="pin" className="block text-xs font-semibold text-slate-700">
                    Security PIN (4 to 6 digits)
                  </label>
                  <span className="text-[11px] text-slate-400">Numbers only</span>
                </div>
                <div className="relative mt-1.5">
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
                    className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-slate-50/50 pl-3.5 pr-10 text-sm tracking-widest text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
                    aria-invalid={Boolean(errors.pin)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.pin && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{errors.pin}</p>
                )}
              </div>

              {isSignup && (
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="confirmPin" className="block text-xs font-semibold text-slate-700">
                      Confirm Security PIN
                    </label>
                    <span className="text-[11px] text-slate-400">Re-enter PIN</span>
                  </div>
                  <div className="relative mt-1.5">
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
                      className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-slate-50/50 pl-3.5 pr-10 text-sm tracking-widest text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
                      aria-invalid={Boolean(errors.confirmPin)}
                    />
                  </div>
                  {errors.confirmPin && (
                    <p className="mt-1 text-xs font-medium text-rose-600">{errors.confirmPin}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 flex w-full min-h-[46px] items-center justify-center rounded-full bg-[#0e1726] py-3 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
              >
                {isSubmitting ? "Please wait..." : isSignup ? "Create Student Account" : "Sign In to SmartStudy"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              {isSignup ? "Already registered?" : "New to SmartStudy?"}{" "}
              <Link
                href={isSignup ? "/login" : "/signup"}
                className="font-semibold text-slate-900 underline hover:text-slate-700"
              >
                {isSignup ? "Sign in here" : "Create an account"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
