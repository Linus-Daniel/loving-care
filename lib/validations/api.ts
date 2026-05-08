import { z } from "zod";

const dateField = z.coerce.date();
const optionalDateField = z.coerce.date().optional().nullable();

export const registrationCreateSchema = z.object({
  childFirstName: z.string().min(1),
  childLastName: z.string().min(1),
  dateOfBirth: dateField,
  gender: z.string().min(1),
  program: z.string().min(1),
  preferredStart: optionalDateField,
  parentName: z.string().min(1),
  parentEmail: z.string().email(),
  parentPhone: z.string().min(1),
  streetAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  emergencyName: z.string().min(1),
  emergencyPhone: z.string().min(1),
  emergencyRel: z.string().min(1),
  medicalInfo: z.string().optional(),
  medications: z.string().optional(),
  doctorContact: z.string().optional(),
  previousSchool: z.string().optional(),
  gradeLevel: z.string().optional(),
  referralSource: z.string().optional(),
  comments: z.string().optional(),
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
  parentalConsent: z.literal(true),
  paymentMethod: z.string().optional(),
});

export const registrationPatchSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "WAITLISTED"]).optional(),
  adminNotes: z.string().optional(),
  reviewedBy: z.string().optional(),
});

export const registrationBulkPatchSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(["APPROVED", "REJECTED", "WAITLISTED"]),
  adminNotes: z.string().optional(),
});

export const childCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: dateField,
  gender: z.string().min(1),
  program: z.string().min(1),
  enrollmentDate: dateField.default(() => new Date()),
  status: z.enum(["PENDING", "ACTIVE", "INACTIVE", "GRADUATED"]).default("ACTIVE"),
  photo: z.string().url().optional(),
  parentId: z.string().min(1),
});

export const childPatchSchema = childCreateSchema.partial().omit({ parentId: true }).extend({
  medicalInfo: z
    .object({
      conditions: z.string().optional(),
      medications: z.string().optional(),
      doctorName: z.string().optional(),
      doctorPhone: z.string().optional(),
      allergies: z.string().optional(),
    })
    .optional(),
});

export const parentPatchSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF", "PARENT"]).optional(),
});

export const attendanceSchema = z.object({
  childId: z.string().min(1),
  date: dateField,
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  notes: z.string().optional(),
});

export const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("ngn"),
  description: z.string().min(1),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export const paymentRefundSchema = z.object({
  amount: z.number().positive().optional(),
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).default("requested_by_customer"),
});

export const invoiceCreateSchema = z.object({
  parentEmail: z.string().email(),
  parentName: z.string().min(1),
  items: z.array(z.object({ description: z.string().min(1), amount: z.number().positive() })).min(1),
  dueDate: dateField,
  sendImmediately: z.boolean().default(false),
});

export const invoicePatchSchema = invoiceCreateSchema.partial().extend({
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  paidAt: optionalDateField,
});

export const invoiceSendSchema = z.object({
  sendImmediately: z.literal(true),
});

export const eventCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: dateField,
  time: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  coverPhoto: z.string().url().optional(),
  visibility: z.string().default("public"),
  status: z.string().default("scheduled"),
});

export const eventRegistrationSchema = z.object({
  reminder: z.boolean().default(true),
});

export const messageCreateSchema = z
  .object({
    receiverId: z.string().min(1).optional(),
    content: z.string().min(1),
    threadId: z.string().optional(),
  })
  .refine((value) => value.receiverId || value.threadId, {
    message: "receiverId or threadId is required",
    path: ["receiverId"],
  });

export const announcementCreateSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  targetRole: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF", "PARENT"]).default("PARENT"),
  targetClass: z.string().optional(),
  isDraft: z.boolean().default(false),
  scheduledAt: optionalDateField,
});

export const announcementPatchSchema = announcementCreateSchema.partial();

export const resourceCreateSchema = z.object({
  name: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string().min(1),
  category: z.string().min(1),
  visibility: z.string().default("parents"),
});

export const resourcePatchSchema = resourceCreateSchema.partial();

export const supportCreateSchema = z.object({
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const supportPatchSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  assignedTo: z.string().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

export const ticketReplyCreateSchema = z.object({
  content: z.string().min(1),
});

export const ticketReplyPatchSchema = z.object({
  content: z.string().min(1),
});

export const notificationPatchSchema = z.object({
  isRead: z.boolean(),
});

export const notificationBulkPatchSchema = z.object({
  isRead: z.literal(true),
  type: z.string().optional(),
});

export const staffCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string().min(1),
  class: z.string().optional(),
  photo: z.string().url().optional(),
  bio: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const staffPatchSchema = staffCreateSchema.partial();

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const siteSettingsSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  timezone: z.string().default("Africa/Lagos"),
  logo: z.string().url().optional().nullable(),
  favicon: z.string().url().optional().nullable(),
  primaryColor: z.string().min(1),
  accentColor: z.string().min(1),
  senderName: z.string().optional(),
  senderEmail: z.string().email().optional().or(z.literal("")),
  emailFooter: z.string().optional(),
  stripePublicKey: z.string().optional(),
  posthogKey: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  sanityProjectId: z.string().optional(),
  sanityDataset: z.string().optional(),
  clerkPublishableKey: z.string().optional(),
  maintenance: z.boolean().default(false),
  maintenanceMessage: z.string().optional(),
  registration: z.boolean().default(true),
});

export const socialSettingsSchema = z.object({
  platforms: z.object({
    instagram: z.object({ enabled: z.boolean(), url: z.string().url().optional().or(z.literal("")) }),
    facebook: z.object({ enabled: z.boolean(), url: z.string().url().optional().or(z.literal("")) }),
    twitter: z.object({ enabled: z.boolean(), url: z.string().url().optional().or(z.literal("")) }),
  }),
  shareButtons: z.object({
    programs: z.boolean(),
    gallery: z.boolean(),
    events: z.boolean(),
  }),
});

export const seoSettingsSchema = z.object({
  pages: z.array(z.object({
    page: z.string().min(1),
    path: z.string().min(1),
    title: z.string(),
    description: z.string(),
    keyword: z.string(),
    ogImage: z.string().url().optional().or(z.literal("")),
  })),
  robots: z.string(),
});
