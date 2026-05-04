"use client";

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight, Building2, CreditCard, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCreatePaymentIntent } from "@/hooks/usePayments";
import { useCreateResource } from "@/hooks/useResources";
import { UploadDropzone, uploadedFileUrl, type UploadedClientFile } from "@/lib/uploadthing";

const amount = 60_000;
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null;

function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);
}

function CardPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const createIntent = useCreatePaymentIntent();

  async function pay() {
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      const result = await createIntent.mutateAsync({
        amount,
        currency: "ngn",
        description: "Monthly tuition payment",
      });

      if (!result?.clientSecret) {
        toast.error("Unable to initialize payment");
        return;
      }

      const confirmation = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: { card },
      });

      if (confirmation.error) {
        toast.error(confirmation.error.message ?? "Payment failed");
        return;
      }

      toast.success("Payment submitted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="rounded-lg border border-border yellow-50 p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      <Button className="w-full bg-yellow font-semibold text-green hover:bg-yellow-400" onClick={pay} disabled={!stripe || createIntent.isPending}>
        {createIntent.isPending ? "Preparing..." : `Pay ${money(amount)}`}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

export default function MakePayment() {
  const [method, setMethod] = useState<"card" | "bank">("card");
  const stripeOptions = useMemo(() => ({ appearance: { theme: "stripe" as const } }), []);
  const createResource = useCreateResource();

  async function savePaymentProof(file: UploadedClientFile) {
    const url = uploadedFileUrl(file);
    if (!url) return;

    try {
      await createResource.mutateAsync({
        name: file.serverData?.name ?? file.name,
        fileUrl: url,
        fileType: (file.serverData?.name ?? file.name).split(".").pop()?.toLowerCase() ?? "file",
        category: "Payment Proofs",
        visibility: "admin",
      });
      toast.success("Payment proof uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save payment proof");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Make Payment" description="Pay outstanding tuition and fees" />

      <Card className="border-warning/30 bg-warning/5 shadow-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Outstanding Balance</p>
          <p className="font-display text-3xl font-bold text-green">{money(amount)}</p>
          <p className="text-xs text-muted-foreground">Due monthly</p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="font-display text-base text-green">Payment Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Monthly Tuition</span><span>{money(60_000)}</span></div>
          <div className="flex justify-between"><span>Extras</span><span>{money(0)}</span></div>
          <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{money(amount)}</span></div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="font-display text-base text-green">Payment Method</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setMethod("card")} className={`rounded-lg border-2 p-3 text-center transition-colors ${method === "card" ? "border-green bg-green/5" : "border-border"}`}>
              <CreditCard className="mx-auto mb-1 h-5 w-5 text-green" />
              <span className="text-xs font-medium">Card</span>
            </button>
            <button onClick={() => setMethod("bank")} className={`rounded-lg border-2 p-3 text-center transition-colors ${method === "bank" ? "border-green bg-green/5" : "border-border"}`}>
              <Building2 className="mx-auto mb-1 h-5 w-5 text-green" />
              <span className="text-xs font-medium">Bank Transfer</span>
            </button>
          </div>

          {method === "card" && (
            stripePromise ? (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CardPaymentForm />
              </Elements>
            ) : (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                Stripe public key is not configured. Add `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` to enable card payments.
              </div>
            )
          )}

          {method === "bank" && (
            <div className="space-y-4 rounded-lg bg-muted p-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Bank Transfer Details</p>
                <p>Bank: First Bank of Nigeria</p>
                <p>Account Name: Loving Family Daycare Ltd</p>
                <p>Account Number: 3024567890</p>
                <p className="text-xs text-muted-foreground">Use your child&apos;s name as the transfer reference.</p>
              </div>
              <UploadDropzone
                endpoint="documentUploader"
                onClientUploadComplete={(files) => {
                  const file = files[0] as UploadedClientFile | undefined;
                  if (file) void savePaymentProof(file);
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
                appearance={{
                  container: "yellow-50 border-border",
                  button: "bg-green text-white hover:bg-green/90",
                  label: "text-green",
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>SSL secured payment. Your information is encrypted.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
