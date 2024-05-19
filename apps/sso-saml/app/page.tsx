'use client'
import {useCallback} from "react";
import {useAuth} from "@tailor-platform/auth/client";

export default function Home() {
  const { login } = useAuth();
  const doLogin = useCallback(() => {
    login({
      name: "saml",
      options: {
        redirectPath: "/",
      },
    });
  }, [login]);

  return (
    <main>
      <div>
        <h1>SSO Saml Example</h1>
        <p>This example shows how to use SAML SSO with Next.js and Tailor-platform.</p>
        <button onClick={doLogin}>Login</button>
      </div>
    </main>
  );
}
