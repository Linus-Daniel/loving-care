import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ParentShell } from "@/components/parent/ParentShell";
import { prisma } from "@/lib/prisma";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || "/parent";

  if (!userId) {
    redirect(`/login?redirect_url=${encodeURIComponent(pathname)}`);
  }

  // Resolve role and user info from DB — avoids dependency on Clerk backend API
  // which can fail if CLERK_SECRET_KEY is missing or rate-limited.
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, name: true, email: true, avatar: true, role: true },
  });

  const role = dbUser?.role ?? "PARENT";

  // Enforce: admins/staff must NOT use the parent portal
  const adminRoles = ["ADMIN", "SUPER_ADMIN", "STAFF"];
  if (adminRoles.includes(role)) {
    redirect("/admin/dashboard");
  }

  const shellUser = {
    fullName: dbUser?.name ?? "Parent",
    imageUrl: dbUser?.avatar ?? null,
    role,
  };

  return <ParentShell user={shellUser}>{children}</ParentShell>;
}
