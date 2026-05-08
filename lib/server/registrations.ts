import type { PrismaClient, Registration } from "@prisma/client";

import { sendRegistrationApprovedEmail } from "@/lib/server/email";

type PrismaTransaction = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function pendingClerkId(email: string) {
  return `pending:${normalizeEmail(email)}`;
}

export async function ensureParentAccountForRegistration(tx: PrismaTransaction, registration: Registration) {
  const email = normalizeEmail(registration.parentEmail);

  const existingUser = await tx.user.findUnique({ where: { email } });

  if (existingUser) {
    return tx.user.update({
      where: { email },
      data: {
        email,
        name: registration.parentName,
        phone: registration.parentPhone,
      },
    });
  }

  return tx.user.create({
    data: {
      clerkId: pendingClerkId(email),
      email,
      name: registration.parentName,
      phone: registration.parentPhone,
      role: "PARENT",
    },
  });
}

export async function approveRegistration(tx: PrismaTransaction, registration: Registration) {
  const user = await ensureParentAccountForRegistration(tx, registration);

  const existingChild = await tx.child.findFirst({
    where: {
      parentId: user.id,
      firstName: registration.childFirstName,
      lastName: registration.childLastName,
      dateOfBirth: registration.dateOfBirth,
    },
    select: { id: true },
  });

  if (!existingChild) {
    await tx.child.create({
      data: {
        firstName: registration.childFirstName,
        lastName: registration.childLastName,
        dateOfBirth: registration.dateOfBirth,
        gender: registration.gender,
        program: registration.program,
        enrollmentDate: registration.preferredStart ?? new Date(),
        status: "ACTIVE",
        parentId: user.id,
        medicalInfo: {
          create: {
            conditions: registration.medicalInfo,
            medications: registration.medications,
            doctorName: registration.doctorContact,
          },
        },
      },
    });
  }
}

export async function sendApprovalEmail(registration: Registration) {
  await sendRegistrationApprovedEmail({
    parentName: registration.parentName,
    parentEmail: registration.parentEmail,
    childName: `${registration.childFirstName} ${registration.childLastName}`,
    startDate: registration.preferredStart ?? new Date(),
  });
}
