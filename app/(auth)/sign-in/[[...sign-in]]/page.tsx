import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the Loving Family Daycare parent portal.",
};

const clerkAppearance = {
  elements: {
    cardBox: "shadow-card rounded-2xl",
    formButtonPrimary: "bg-green-500 hover:bg-green-500-600 text-white",
    footerActionLink: "text-teal hover:text-teal-700",
    headerTitle: "font-display text-green-500",
  },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Heart className="h-5 w-5 text-secondary" fill="currentColor" />
            </span>
            <span className="font-display text-lg font-bold text-green-500">Loving Family Daycare</span>
          </Link>
        </div>
        <SignIn
          appearance={clerkAppearance}
          fallbackRedirectUrl="/parent"
          signUpUrl="/sign-up"
          path="/sign-in"
        />
      </div>
    </div>
  );
}
