"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Toaster } from "@/components/ui/sonner";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true,
      person_profiles: "identified_only",
    });
  }, []);

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk"}
      signInUrl="/login"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/parent"
      signUpFallbackRedirectUrl="/parent"
    >
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </QueryClientProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}
