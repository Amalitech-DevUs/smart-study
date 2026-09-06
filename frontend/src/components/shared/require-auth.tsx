"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/use-auth";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !loggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, loggedIn, pathname, router]);

  if (isLoading || !loggedIn) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background px-6 py-16 text-text-secondary">
        Checking your session...
      </main>
    );
  }

  return children;
}
