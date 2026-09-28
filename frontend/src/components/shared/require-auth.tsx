"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/use-auth";

import { Loader } from "@/components/shared/loader";

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
      <main className="flex min-h-[60vh] flex-1 items-center justify-center">
        <Loader
          size="lg"
          text="Verifying Student Session..."
          subtext="Connecting to your revision profile"
        />
      </main>
    );
  }

  return children;
}
