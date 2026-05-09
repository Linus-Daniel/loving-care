import { clerkClient } from "@clerk/nextjs/server";

function splitDisplayName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ");

  return { firstName, lastName };
}

export async function updateClerkRole(clerkId: string, role: string) {
  const client = await clerkClient();
  return client.users.updateUserMetadata(clerkId, {
    publicMetadata: { role },
  });
}

export async function updateClerkProfileName(clerkId: string, name: string) {
  if (clerkId.startsWith("pending:")) return null;

  const client = await clerkClient();
  const { firstName, lastName } = splitDisplayName(name);

  return client.users.updateUser(clerkId, {
    firstName,
    lastName,
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
