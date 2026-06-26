"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type User = {
  email: string;
  name: string;
  type: "jobseeker" | "employer";
  employerName?: string;
  joinedAt: string;
};

type AuthState = {
  user: User | null;
  login: (email: string, name: string, type: "jobseeker" | "employer", employerName?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("aw_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const login = useCallback((email: string, name: string, type: "jobseeker" | "employer", employerName?: string) => {
    const u: User = { email, name, type, employerName, joinedAt: new Date().toISOString() };
    localStorage.setItem("aw_user", JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aw_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
