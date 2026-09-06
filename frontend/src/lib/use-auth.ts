"use client";

import { useEffect, useState } from "react";

type AuthState = {
  loggedIn: boolean;
  username?: string;
  isLoading: boolean;
};

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({ loggedIn: false, isLoading: true });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => setAuth({ loggedIn: Boolean(data.loggedIn), username: data.username, isLoading: false }))
      .catch(() => setAuth({ loggedIn: false, isLoading: false }));
  }, []);

  return auth;
}
