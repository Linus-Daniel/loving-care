import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type SuccessPageProps = {
  searchParams: Promise<{ confirmation?: string }>;
};

export default async function RegistrationSuccess({ searchParams }: SuccessPageProps) {
  const { confirmation } = await searchParams;

  return (
    <main className="min-h-[70vh] bg-muted px-4 py-16">
      <section className="mx-auto max-w-2xl rounded-2xl secondary-50 p-8 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-7 w-7 text-success" />
        </div>
        <h1 className="font-display text-3xl font-bold text-green-500">Registration Submitted</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for applying to Loving Family Daycare. We have also sent instructions to set up your parent portal, where admissions updates, payments, and messages will stay connected to your family profile.
        </p>
        {confirmation ? (
          <div className="mt-6 rounded-xl border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Confirmation Number</p>
            <p className="mt-1 font-mono text-lg font-semibold text-green-500">{confirmation}</p>
          </div>
        ) : null}
        <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-left">
          <p className="font-medium text-green-500">Next steps</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Check your email for the registration confirmation and parent portal setup link.</li>
            <li>Prepare birth certificate, immunization records, and medical report.</li>
            <li>Admissions will review the application and contact you about payment and start date availability.</li>
          </ul>
        </div>
        <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent-400">
          <Link href="/">Return Home</Link>
        </Button>
      </section>
    </main>
  );
}
