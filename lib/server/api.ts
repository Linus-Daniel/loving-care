import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

import { prisma } from "@/lib/prisma";

export type ApiRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "PARENT";

export type ApiSession = {
  clerkId: string;
  role: ApiRole;
  userId?: string;
};

type ApiResult<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
  meta?: Record<string, unknown>;
};

type RoleClaims = {
  metadata?: { role?: ApiRole };
  publicMetadata?: { role?: ApiRole };
};

export function apiResponse<T>(
  data: T,
  init?: ResponseInit & { meta?: Record<string, unknown> },
) {
  const body: ApiResult<T> = {
    success: true,
    data,
    error: null,
    ...(init?.meta ? { meta: init.meta } : {}),
  };

  return NextResponse.json(body, init);
}

export function apiError(error: string, status = 400, meta?: Record<string, unknown>) {
  return NextResponse.json(
    { success: false, data: null, error, ...(meta ? { meta } : {}) },
    { status },
  );
}

export async function requireSession(roles?: ApiRole[]): Promise<ApiSession> {
  const session = await auth();

  if (!session.userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const claims = session.sessionClaims as RoleClaims | null | undefined;
  let role = (claims?.metadata?.role ?? claims?.publicMetadata?.role ?? "PARENT") as ApiRole;

  const user = await prisma.user.findUnique({
    where: { clerkId: session.userId },
    select: { id: true, role: true },
  });

  // Database role is the ultimate source of truth if synced
  if (user?.role) {
    role = user.role as ApiRole;
  }

  if (roles && !roles.includes(role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return { clerkId: session.userId, role, userId: user?.id };
}

export function handleRouteError(error: unknown) {
  if (error instanceof Response) {
    return apiError(error.statusText || error.status.toString(), error.status);
  }

  if (error instanceof ZodError) {
    return apiError("Validation failed", 422, { issues: error.issues });
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  return apiError(message, 500);
}

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  const body: unknown = await request.json();
  return schema.parse(body);
}

export function paginationParams(url: URL) {
  const page = Math.max(Number(url.searchParams.get("page") ?? "1"), 1);
  const pageSize = Math.min(Math.max(Number(url.searchParams.get("pageSize") ?? "20"), 1), 100);
  return { page, pageSize, skip: (page - 1) * pageSize };
}
