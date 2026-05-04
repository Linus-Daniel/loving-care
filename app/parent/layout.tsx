import { auth, clerkClient } from "@clerk/nextjs/server";
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
  const pathname = headerList.get("x-invoke-path") || "";

  if (!userId) {
    const currentPath = pathname || "/parent";
    redirect(`/login?redirect_url=${encodeURIComponent(currentPath)}`);
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

  const shellUser = {
    fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.primaryEmailAddress?.emailAddress || "Parent",
    imageUrl: user.imageUrl,
    role: role,
  };

  return <ParentShell user={shellUser}>{children}</ParentShell>;
}
