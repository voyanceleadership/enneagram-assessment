"use client"; // 👈 Ensure this runs on the client side

import { createContext, useContext } from "react";
import { useAuth } from "react-oidc-context";

// Create Auth Context
const AuthContext = createContext<any>(null);

// Auth Provider Wrapper
export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Custom Hook
export function useAuthContext() {
  return useContext(AuthContext);
}
