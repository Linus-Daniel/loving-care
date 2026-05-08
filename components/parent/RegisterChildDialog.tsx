"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/client/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const enrollSchema = z.object({
  childFirstName: z.string().min(1, "First name is required"),
  childLastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  program: z.string().min(1, "Program is required"),
  streetAddress: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  emergencyName: z.string().min(1, "Emergency contact is required"),
  emergencyPhone: z.string().min(1, "Emergency phone is required"),
  emergencyRel: z.string().min(1, "Relationship is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
  parentalConsent: z.boolean().refine((val) => val === true, {
    message: "Parental consent is required",
  }),
});

type EnrollValues = z.infer<typeof enrollSchema>;

export function RegisterChildDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const form = useForm<EnrollValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      childFirstName: "",
      childLastName: "",
      dateOfBirth: "",
      gender: "",
      program: "",
      streetAddress: "",
      city: "",
      state: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRel: "",
      termsAccepted: false,
      privacyAccepted: false,
      parentalConsent: false,
    },
  });

  const onSubmit = async (values: EnrollValues) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        parentName: currentUser.name,
        parentEmail: currentUser.email,
        parentPhone: currentUser.phone || "000-000-0000",
        country: "Nigeria",
        paymentMethod: "card",
      };

      await apiFetch("/api/registrations", {
        method: "POST",
        body: payload,
      });

      toast.success("Registration submitted successfully!");
      setOpen(false);
      form.reset();
      setStep(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fields: (keyof EnrollValues)[] = [];
    if (step === 1) {
      fields = ["childFirstName", "childLastName", "dateOfBirth", "gender", "program"];
    } else if (step === 2) {
      fields = ["streetAddress", "city", "state", "emergencyName", "emergencyPhone", "emergencyRel"];
    }

    const isValid = await form.trigger(fields);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-green-500 text-white hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Enroll Child
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-green-500">Enroll Your Child</DialogTitle>
          <DialogDescription>
            Fill out the form below to register your child for our programs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Step 1: Child Info */}
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...form.register("childFirstName")} placeholder="John" />
                {form.formState.errors.childFirstName && (
                  <p className="text-xs text-destructive">{form.formState.errors.childFirstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...form.register("childLastName")} placeholder="Doe" />
                {form.formState.errors.childLastName && (
                  <p className="text-xs text-destructive">{form.formState.errors.childLastName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" {...form.register("dateOfBirth")} />
                {form.formState.errors.dateOfBirth && (
                  <p className="text-xs text-destructive">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  onValueChange={(val) => form.setValue("gender", val)}
                  defaultValue={form.getValues("gender")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-xs text-destructive">{form.formState.errors.gender.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Program</Label>
                <Select
                  onValueChange={(val) => form.setValue("program", val)}
                  defaultValue={form.getValues("program")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infant Care">Infant Care</SelectItem>
                    <SelectItem value="Toddler Program">Toddler Program</SelectItem>
                    <SelectItem value="Preschool">Preschool</SelectItem>
                    <SelectItem value="After School">After School</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.program && (
                  <p className="text-xs text-destructive">{form.formState.errors.program.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Address & Emergency */}
          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Street Address</Label>
                <Input {...form.register("streetAddress")} placeholder="123 Street Name" />
                {form.formState.errors.streetAddress && (
                  <p className="text-xs text-destructive">{form.formState.errors.streetAddress.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...form.register("city")} placeholder="Lagos" />
                {form.formState.errors.city && (
                  <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...form.register("state")} placeholder="Lagos State" />
                {form.formState.errors.state && (
                  <p className="text-xs text-destructive">{form.formState.errors.state.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2 border-t pt-2 mt-2">
                <Label className="text-green-500 font-semibold">Emergency Contact</Label>
              </div>
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input {...form.register("emergencyName")} />
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input {...form.register("emergencyRel")} placeholder="e.g. Aunt" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Emergency Phone</Label>
                <Input {...form.register("emergencyPhone")} />
              </div>
            </div>
          )}

          {/* Step 3: Consents */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    onCheckedChange={(checked) => form.setValue("termsAccepted", !!checked)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    I accept the terms and conditions of the daycare.
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="privacy"
                    onCheckedChange={(checked) => form.setValue("privacyAccepted", !!checked)}
                  />
                  <Label htmlFor="privacy" className="text-sm font-normal">
                    I accept the privacy policy.
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    onCheckedChange={(checked) => form.setValue("parentalConsent", !!checked)}
                  />
                  <Label htmlFor="consent" className="text-sm font-normal">
                    I give my consent for my child to be enrolled.
                  </Label>
                </div>
              </div>
              {(form.formState.errors.termsAccepted || form.formState.errors.privacyAccepted || form.formState.errors.parentalConsent) && (
                <p className="text-xs text-destructive">All consents must be accepted to continue.</p>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="bg-green-500 text-white hover:bg-green-600">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary text-green-500 hover:bg-secondary-400 font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Register Child
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
