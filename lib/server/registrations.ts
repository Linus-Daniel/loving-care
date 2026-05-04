import type { PrismaClient, Registration } from "@prisma/client";

import { sendRegistrationApprovedEmail } from "@/lib/server/email";

type PrismaTransaction = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export async function approveRegistration(tx: PrismaTransaction, registration: Registration) {
  const user = await tx.user.upsert({
    where: { email: registration.parentEmail },
    update: { name: registration.parentName, phone: registration.parentPhone, role: "PARENT" },
    create: {
      clerkId: `pending:${registration.parentEmail}`,
      email: registration.parentEmail,
      name: registration.parentName,
      phone: registration.parentPhone,
      role: "PARENT",
    },
  });

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
