import { auth, clerkClient } from "@clerk/nextjs/server";
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

  // Fetch user role from Clerk or Prisma
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  // Check role from metadata or fallback to Prisma
  let role = (user.publicMetadata?.role as string) || (user.unsafeMetadata?.role as string);
  
  if (!role) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    role = dbUser?.role || "PARENT";
  }

  const isAuthorized = ["ADMIN", "SUPER_ADMIN"].includes(role.toUpperCase());

  if (!isAuthorized) {
    redirect("/admin-login?error=unauthorized");
  }

  // Bypass shell for Studio
  if (pathname.startsWith('/admin/studio')) {
    return <>{children}</>;
  }

  const shellUser = {
    fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.primaryEmailAddress?.emailAddress || "Admin",
    imageUrl: user.imageUrl,
    role: role,
  };

  return <AdminShell user={shellUser}>{children}</AdminShell>;
}
