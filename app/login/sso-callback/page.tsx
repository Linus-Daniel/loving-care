"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function LoginSSOCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/parent"
      signUpFallbackRedirectUrl="/parent"
    />
  );
}
