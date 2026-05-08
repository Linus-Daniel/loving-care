import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/contact(.*)",
  "/events(.*)",
  "/faq(.*)",
  "/gallery(.*)",
  "/login(.*)",
  "/admin-login(.*)",
  "/privacy(.*)",
  "/privacy-policy(.*)",
  "/programs(.*)",
  "/register(.*)",
  "/robots.txt",
  "/sitemap.xml",
  "/terms(.*)",
  "/api/public(.*)",
  "/api/webhooks(.*)",
  "/favicon.ico",
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  const { pathname } = new URL(req.url);

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Set headers on the request for Server Components to read
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.url);
  requestHeaders.set("x-invoke-path", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
