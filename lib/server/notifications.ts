import type { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const ADMIN_ROLES: Role[] = ["ADMIN", "SUPER_ADMIN", "STAFF"];

export type AdminNotificationInput = {
  title: string;
  message: string;
  type: "payment" | "message" | "registration" | "enrollment" | "support" | "announcement";
  link?: string;
  userIds?: string[];
};

export async function notifyAdmins(input: AdminNotificationInput) {
  const admins = input.userIds?.length
    ? input.userIds.map((id) => ({ id }))
    : await prisma.user.findMany({
        where: { role: { in: ADMIN_ROLES } },
        select: { id: true },
      });

  if (admins.length === 0) return;

  const existing = input.link
    ? await prisma.notification.findMany({
        where: {
          userId: { in: admins.map((admin) => admin.id) },
          type: input.type,
          link: input.link,
        },
        select: { userId: true },
      })
    : [];

  const notifiedUserIds = new Set(existing.map((notification) => notification.userId));
  const data = admins
    .filter((admin) => !notifiedUserIds.has(admin.id))
    .map((admin) => ({
      userId: admin.id,
      title: input.title,
      message: input.message,
      type: input.type,
      link: input.link,
    }));

  if (data.length === 0) return;

  await prisma.notification.createMany({ data });
}

export async function safeNotifyAdmins(input: AdminNotificationInput) {
  try {
    await notifyAdmins(input);
  } catch (error) {
    console.error("Failed to create admin notification", error);
  }
}
