export type ApiEnvelope<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
  meta?: Record<string, unknown>;
};

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "PARENT";

export type SelectOption = {
  label: string;
  value: string;
};
