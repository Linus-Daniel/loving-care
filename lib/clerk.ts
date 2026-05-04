import { clerkClient } from "@clerk/nextjs/server";

export async function updateClerkRole(clerkId: string, role: string) {
  const client = await clerkClient();
  return client.users.updateUserMetadata(clerkId, {
    publicMetadata: { role },
  });
}
