import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Loving Family Daycare parent portal account.",
};

const clerkAppearance = {
  elements: {
    cardBox: "shadow-card rounded-2xl",
    formButtonPrimary: "bg-green hover:bg-green-600 text-white",
    footerActionLink: "text-teal hover:text-teal-700",
    headerTitle: "font-display text-green",
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green">
              <Heart className="h-5 w-5 text-yellow" fill="currentColor" />
            </span>
            <span className="font-display text-lg font-bold text-green">Loving Family Daycare</span>
          </Link>
        </div>
        <SignUp
          appearance={clerkAppearance}
          fallbackRedirectUrl="/parent"
          forceRedirectUrl="/parent"
          signInUrl="/login"
        />
      </div>
    </div>
  );
}
