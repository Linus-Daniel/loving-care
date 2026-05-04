import { auth, clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError } from "@/lib/server/api";

export async function POST() {
  try {
    const session = await auth();
    if (!session.userId) return apiError("Unauthorized", 401);

    const user = await prisma.user.findUnique({
      where: { clerkId: session.userId },
      select: { role: true },
    });

    if (!user) {
      return apiError("No database user is linked to this Clerk account", 404);
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(session.userId, {
      publicMetadata: { role: user.role },
    });

    return apiResponse({ role: user.role });
  } catch (error) {
    return handleRouteError(error);
  }
}
