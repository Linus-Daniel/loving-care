import { clerkClient } from "@clerk/nextjs/server";

export async function updateClerkRole(clerkId: string, role: string) {
  const client = await clerkClient();
  return client.users.updateUserMetadata(clerkId, {
    publicMetadata: { role },
  });
}

export async function createParentInvitation(email: string, redirectUrl: string) {
  const client = await clerkClient();

  return client.invitations.createInvitation({
    emailAddress: email,
    expiresInDays: 30,
    ignoreExisting: true,
    notify: false,
    publicMetadata: { role: "PARENT" },
    redirectUrl,
  });
}
