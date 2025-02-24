"use client"; // 👈 Ensure this runs as a Client Component

import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://us-east-1oujanaorl.auth.us-east-1.amazoncognito.com",
  client_id: "5sp0c1su50tem5iaa5k86ptrp7",
  redirect_uri: "http://localhost:3000/auth/callback",
  response_type: "code",
  scope: "openid email profile",
};

export default function AppAuthProvider({ children }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
