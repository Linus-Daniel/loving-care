import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || "";

  // Bypass auth for the login page specifically if it's nested (though /admin-login is preferred)
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  if (!userId) {
    const currentPath = pathname || "/admin/dashboard";
    redirect(`/admin-login?redirect_url=${encodeURIComponent(currentPath)}`);
  }

  // Fetch user data from Prisma (synced via webhooks)
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { name: true, avatar: true, role: true },
  });

  const role = dbUser?.role || "PARENT";
  const isAuthorized = ["ADMIN", "SUPER_ADMIN", "STAFF"].includes(role.toUpperCase());

  if (!isAuthorized) {
    redirect("/admin-login?error=unauthorized");
  }

  // Bypass shell for Studio
  if (pathname.startsWith("/admin/studio")) {
    return <>{children}</>;
  }

  const shellUser = {
    fullName: dbUser?.name ?? "Admin",
    imageUrl: dbUser?.avatar ?? null,
    role: role,
  };

  return <AdminShell user={shellUser}>{children}</AdminShell>;
}
