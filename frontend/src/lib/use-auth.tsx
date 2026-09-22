"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export type AuthState = {
  loggedIn: boolean;
  username?: string;
  isLoading: boolean;
};

export type AuthContextType = AuthState & {
  user: {
    loggedIn: boolean;
    username?: string;
  };
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "smartstudy_auth_sync";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>({
    loggedIn: false,
    username: undefined,
    isLoading: true,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
        headers: { "Pragma": "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setAuth({
          loggedIn: Boolean(data.loggedIn),
          username: data.username,
          isLoading: false,
        });
      } else {
        setAuth({ loggedIn: false, username: undefined, isLoading: false });
      }
    } catch {
      setAuth({ loggedIn: false, username: undefined, isLoading: false });
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch auth state once on mount because it depends on the browser session/cookie state.
    checkAuth();
  }, [checkAuth]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        checkAuth();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [checkAuth]);

  const logout = useCallback(async () => {
    setAuth({ loggedIn: false, username: undefined, isLoading: false });
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
    } catch {
      // Ignore network errors on logout
    }

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, String(Date.now()));
    } catch {
      // Ignore localStorage errors
    }

    router.replace("/login");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        user: {
          loggedIn: auth.loggedIn,
          username: auth.username,
        },
        logout,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    // Graceful fallback for components outside of AuthProvider during testing
    return {
      loggedIn: false,
      username: undefined,
      isLoading: false,
      user: {
        loggedIn: false,
        username: undefined,
      },
      logout: async () => {},
      refreshAuth: async () => {},
    };
  }
  return context;
}
