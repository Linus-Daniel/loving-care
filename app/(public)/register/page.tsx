"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormStepper } from "@/components/forms/RegistrationForm/FormStepper";
import { apiFetch } from "@/lib/client/api";
import {
  defaultRegistrationValues,
  registrationFormSchema,
  registrationStepSchemas,
  type RegistrationFormValues,
} from "@/lib/validations/registration-form";
import { useAppStore } from "@/store/useAppStore";

const steps = ["Personal", "Address", "Medical", "Consent", "Payment", "Review"];

type FieldName = keyof RegistrationFormValues;
type ConsentFieldName = "termsAccepted" | "privacyAccepted" | "parentalConsent";

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-destructive">{message}</p> : null;
}

function fieldNames(schema: z.ZodObject<z.ZodRawShape>) {
  return Object.keys(schema.shape) as FieldName[];
}

export default function Registration() {
  const router = useRouter();
  const { registrationStep, registrationDraft, setRegistrationStep, updateRegistrationDraft, resetRegistrationDraft } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(
    () => ({ ...defaultRegistrationValues, ...registrationDraft }) as RegistrationFormValues,
    [registrationDraft],
  );

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const step = Math.min(registrationStep, steps.length - 1);
  const values = form.watch();

  const persistDraft = () => updateRegistrationDraft(form.getValues());

  const validateCurrentStep = async () => {
    if (step >= registrationStepSchemas.length) return true;
    const schema = registrationStepSchemas[step];
    const names = fieldNames(schema);
    const valid = await form.trigger(names, { shouldFocus: true });
    if (!valid) return false;

    const parsed = schema.safeParse(form.getValues());
    if (!parsed.success) return false;
    persistDraft();
    return true;
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;
    setRegistrationStep(Math.min(step + 1, steps.length - 1));
  };

  const handleBack = () => {
    persistDraft();
    setRegistrationStep(Math.max(step - 1, 0));
  };

  const handleSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        preferredStart: data.preferredStart || null,
        medicalInfo: data.medicalInfo || undefined,
        medications: data.medications || undefined,
        doctorContact: data.doctorContact || undefined,
        previousSchool: data.previousSchool || undefined,
        gradeLevel: data.gradeLevel || undefined,
        referralSource: data.referralSource || undefined,
        comments: data.comments || undefined,
      };

      const response = await apiFetch<{ id: string }>("/api/registrations", { method: "POST", body: payload });
      resetRegistrationDraft();
      toast.success("Registration submitted");
      router.push(`/register/success?confirmation=${response.data?.id ?? ""}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errors = form.formState.errors;

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-green">Enroll Your Child</h1>
          <p className="text-sm text-muted-foreground">Complete the registration form and our admissions team will follow up.</p>
        </div>

        <div className="mb-8 rounded-2xl yellow-50 p-4 shadow-card">
          <FormStepper steps={steps} currentStep={step} />
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="rounded-2xl yellow-50 p-6 shadow-card lg:p-8">
          {step === 0 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-display font-semibold text-green">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Child&apos;s First Name</Label>
                  <Input {...form.register("childFirstName")} />
                  <FieldError message={errors.childFirstName?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Child&apos;s Last Name</Label>
                  <Input {...form.register("childLastName")} />
                  <FieldError message={errors.childLastName?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" {...form.register("dateOfBirth")} />
                  <FieldError message={errors.dateOfBirth?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Input {...form.register("gender")} placeholder="Female / Male" />
                  <FieldError message={errors.gender?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Start Date</Label>
                  <Input type="date" {...form.register("preferredStart")} />
                </div>
              </div>
              <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Parent&apos;s Full Name</Label>
                  <Input {...form.register("parentName")} />
                  <FieldError message={errors.parentName?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...form.register("parentEmail")} />
                  <FieldError message={errors.parentEmail?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...form.register("parentPhone")} placeholder="+234..." />
                  <FieldError message={errors.parentPhone?.message} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-display font-semibold text-green">Address & Emergency Contact</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Street Address</Label>
                  <Input {...form.register("streetAddress")} />
                  <FieldError message={errors.streetAddress?.message} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input {...form.register("city")} />
                  <FieldError message={errors.city?.message} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input {...form.register("state")} />
                  <FieldError message={errors.state?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input {...form.register("country")} />
                  <FieldError message={errors.country?.message} />
                </div>
              </div>
              <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Emergency Contact Name</Label>
                  <Input {...form.register("emergencyName")} />
                  <FieldError message={errors.emergencyName?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Input {...form.register("emergencyRel")} />
                  <FieldError message={errors.emergencyRel?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Phone</Label>
                  <Input {...form.register("emergencyPhone")} placeholder="+234..." />
                  <FieldError message={errors.emergencyPhone?.message} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-display font-semibold text-green">Medical & Educational Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Program Applying For</Label>
                  <select {...form.register("program")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Select a program</option>
                    <option value="Infant Care">Infant Care</option>
                    <option value="Toddler Program">Toddler Program</option>
                    <option value="Preschool">Preschool</option>
                    <option value="After School">After School</option>
                  </select>
                  <FieldError message={errors.program?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <Input {...form.register("medicalInfo")} placeholder="None, if not applicable" />
                </div>
                <div className="space-y-2">
                  <Label>Current Medications</Label>
                  <Input {...form.register("medications")} placeholder="None, if not applicable" />
                </div>
                <div className="space-y-2">
                  <Label>Doctor Contact</Label>
                  <Input {...form.register("doctorContact")} />
                </div>
                <div className="space-y-2">
                  <Label>Previous School</Label>
                  <Input {...form.register("previousSchool")} />
                </div>
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Input {...form.register("gradeLevel")} />
                </div>
                <div className="space-y-2">
                  <Label>Referral Source</Label>
                  <Input {...form.register("referralSource")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Additional Comments</Label>
                  <Textarea rows={4} {...form.register("comments")} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-display font-semibold text-green">Consent</h2>
              {([
                ["termsAccepted", "I have read and accepted the Terms of Service."],
                ["privacyAccepted", "I have read and accepted the Privacy Policy."],
                ["parentalConsent", "I confirm I am authorized to register this child and provide parental consent."],
              ] as Array<[ConsentFieldName, string]>).map(([name, label]) => (
                <div key={name} className="rounded-lg bg-muted p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={name}
                      checked={values[name]}
                      onCheckedChange={(checked) => form.setValue(name, Boolean(checked), { shouldValidate: true })}
                    />
                    <Label htmlFor={name} className="text-sm font-normal leading-relaxed">
                      {label}
                      {name === "termsAccepted" ? <Link href="/terms" className="ml-1 text-teal underline">View terms</Link> : null}
                      {name === "privacyAccepted" ? <Link href="/privacy-policy" className="ml-1 text-teal underline">View privacy policy</Link> : null}
                    </Label>
                  </div>
                  <FieldError message={errors[name as FieldName]?.message} />
                </div>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-display font-semibold text-green">Payment Method</h2>
              <div className="rounded-xl border border-yellow bg-yellow/10 p-4">
                <p className="font-medium text-green">Registration fee: NGN 20,000</p>
                <p className="text-sm text-muted-foreground">You will receive payment instructions after submission. Card payments are completed after admissions review.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "card", title: "Card via Stripe", icon: CreditCard },
                  { value: "bank_transfer", title: "Bank Transfer", icon: Landmark },
                ].map((method) => {
                  const Icon = method.icon;
                  const selected = values.paymentMethod === method.value;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => form.setValue("paymentMethod", method.value as RegistrationFormValues["paymentMethod"], { shouldValidate: true })}
                      className={`rounded-xl border-2 p-4 text-left transition-colors ${selected ? "border-green bg-green/5" : "border-border hover:border-green"}`}
                    >
                      <Icon className="mb-3 h-5 w-5 text-green" />
                      <p className="font-medium text-green">{method.title}</p>
                      <p className="text-xs text-muted-foreground">Selected during admissions processing</p>
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.paymentMethod?.message} />
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                Your registration data is submitted securely.
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-display font-semibold text-green">Review Registration</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Child", `${values.childFirstName} ${values.childLastName}`],
                  ["Date of Birth", values.dateOfBirth],
                  ["Program", values.program],
                  ["Parent", values.parentName],
                  ["Email", values.parentEmail],
                  ["Phone", values.parentPhone],
                  ["Address", `${values.streetAddress}, ${values.city}, ${values.state}`],
                  ["Emergency Contact", `${values.emergencyName} (${values.emergencyRel})`],
                  ["Payment", values.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Card via Stripe"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-background p-3">
                    <p className="text-xs uppercase text-muted-foreground">{label}</p>
                    <p className="font-medium text-green">{value || "Not provided"}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between">
            <Button type="button" variant="outline" onClick={handleBack} disabled={step === 0 || isSubmitting} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={handleNext} className="gap-2 bg-green text-white hover:bg-green/90">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="gap-2 bg-yellow font-semibold text-green hover:bg-yellow/90" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Registration"} <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
