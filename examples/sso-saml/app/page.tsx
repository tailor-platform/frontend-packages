"use client";
import { usePlatform } from "@tailor-platform/auth/client";
import { useCallback } from "react";
import { useAuth } from "@tailor-platform/auth/client";

export default function Home() {
  const { getCurrentUser } = usePlatform();
  const user = getCurrentUser();
  const { login, logout } = useAuth();
  const doLogin = useCallback(() => {
    login({
      name: "saml",
      options: {
        redirectPath: "/",
      },
    });
  }, [login]);
  const doLogout = useCallback(() => {
    logout({
      redirectPath: "/",
    });
  }, [logout]);

  return (
    <main>
      <div>
        <h1>SSO Saml Example</h1>
        <p>
          This example shows how to use SAML SSO with Next.js and
          Tailor-platform.
        </p>
        {user?.email && <button onClick={doLogout}>Logout</button>}
        {!user?.email && <button onClick={doLogin}>Login</button>}
        <pre>{user?.email && JSON.stringify(user, null, "  ")}</pre>
      </div>
    </main>
  );
}
