"use client";

import { useAuth, useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/client/api";

function errorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors?: Array<{ message?: string }> }).errors)
  ) {
    return (error as { errors: Array<{ message?: string }> }).errors[0]?.message ?? "Sign in failed";
  }

  return error instanceof Error ? error.message : "Sign in failed";
}

export function AdminLoginForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user, isLoaded: userLoaded } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsSecondFactor, setNeedsSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingRole, setIsSyncingRole] = useState(false);

  const currentRole = String(user?.publicMetadata?.role ?? user?.unsafeMetadata?.role ?? "PARENT").toUpperCase();
  const isCurrentSessionAdmin = isSignedIn && ["ADMIN", "SUPER_ADMIN"].includes(currentRole);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("error") === "unauthorized") {
      setError("Unauthorized access. Please log in with an admin account.");
    }
  }, []);

  useEffect(() => {
    if (userLoaded && isCurrentSessionAdmin) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get("redirect_url") || "/admin/dashboard";
      router.replace(redirectUrl);
    }
  }, [isCurrentSessionAdmin, router, userLoaded]);

  async function completeSignIn(sessionId: string | null | undefined) {
    if (!sessionId || !setActive) {
      throw new Error("Clerk did not return a session");
    }

    await setActive({ session: sessionId });
    try {
      await apiFetch<{ role: string }>("/api/auth/sync-role", { method: "POST" });
      await user?.reload();
    } catch {
      // If sync fails, middleware will still enforce the current Clerk role.
    }
    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get("redirect_url") || "/admin/dashboard";
    router.replace(redirectUrl);
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signIn) return;

    setError("");
    setIsSubmitting(true);

    try {
      if (needsSecondFactor) {
        const result = await signIn.attemptSecondFactor({
          strategy: "totp",
          code,
        });

        if (result.status === "complete") {
          await completeSignIn(result.createdSessionId);
          return;
        }

        setError("Enter the verification code to continue.");
        return;
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await completeSignIn(result.createdSessionId);
        return;
      }

      if (result.status === "needs_second_factor") {
        setNeedsSecondFactor(true);
        return;
      }

      setError("Additional verification is required.");
    } catch (caughtError) {
      const message = errorMessage(caughtError);
      setError(
        message.toLowerCase().includes("session already exists")
          ? "A session already exists in this browser. Continue if it is your admin account, or sign out and log in with the promoted admin account."
          : message,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (userLoaded && isCurrentSessionAdmin) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          You are already signed in as an admin.
        </div>
        <Button className="w-full" onClick={() => router.replace("/admin/dashboard")}>
          Continue to Admin Dashboard
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => signOut({ redirectUrl: "/admin-login" })}>
          Sign out and use another account
        </Button>
      </div>
    );
  }

  if (userLoaded && isSignedIn && !isCurrentSessionAdmin) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-green-500">
          A non-admin session is already active for {user?.primaryEmailAddress?.emailAddress ?? "this browser"}.
          Sign out first, then log in with the promoted admin account.
        </div>
        <Button type="button" className="w-full" onClick={() => signOut({ redirectUrl: "/admin-login" })}>
          Sign out current session
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isSyncingRole}
          onClick={async () => {
            setError("");
            setIsSyncingRole(true);
            try {
              const result = await apiFetch<{ role: string }>("/api/auth/sync-role", { method: "POST" });
              await user?.reload();
              router.refresh();

              if (["ADMIN", "SUPER_ADMIN"].includes(String(result.data?.role).toUpperCase())) {
                router.replace("/admin/dashboard");
              } else {
                setError(`Database role is still ${result.data?.role ?? "PARENT"}. Set it to ADMIN or SUPER_ADMIN first.`);
              }
            } catch (caughtError) {
              setError(errorMessage(caughtError));
            } finally {
              setIsSyncingRole(false);
            }
          }}
        >
          {isSyncingRole ? "Syncing role..." : "Sync admin role from database"}
        </Button>
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="pl-9"
            placeholder="admin@example.com"
            required
            disabled={needsSecondFactor || isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="pl-9 pr-10"
            required
            disabled={needsSecondFactor || isSubmitting}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {needsSecondFactor ? (
        <div className="space-y-2">
          <Label htmlFor="admin-code">2FA code</Label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={!isLoaded || isSubmitting}>
        {isSubmitting ? "Signing in..." : needsSecondFactor ? "Verify Code" : "Login"}
      </Button>

      {needsSecondFactor ? (
        <Button type="button" variant="ghost" className="w-full" onClick={() => setNeedsSecondFactor(false)}>
          Use a different account
        </Button>
      ) : null}
    </form>
  );
}
