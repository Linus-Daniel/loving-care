"use client";

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight, Building2, CreditCard, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { useChildren } from "@/hooks/useChildren";
import { useCreatePaymentIntent } from "@/hooks/usePayments";
import { useCreateResource } from "@/hooks/useResources";
import { UploadDropzone, uploadedFileUrl, type UploadedClientFile } from "@/lib/uploadthing";

const TUITION_PER_MONTH = 60_000;
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null;

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function CardPaymentForm({ 
  amount, 
  childId, 
  duration, 
  onSuccess 
}: { 
  amount: number; 
  childId: string; 
  duration: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const createIntent = useCreatePaymentIntent();

  async function pay() {
    if (!stripe || !elements) return;
    if (!childId) {
      toast.error("Select a child before making payment");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      const result = await createIntent.mutateAsync({
        amount,
        currency: "ngn",
        description: `Tuition for ${duration} month(s)`,
        metadata: { childId, duration: String(duration) },
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
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <CardElement options={{ 
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: 'var(--foreground)',
                '::placeholder': { color: 'var(--muted-foreground)' },
              }
            }
          }} />
        </div>
      </div>
      <Button 
        className="w-full bg-secondary font-semibold text-green-500 hover:bg-secondary-400" 
        onClick={pay} 
        disabled={!stripe || createIntent.isPending || !childId}
      >
        {createIntent.isPending ? "Preparing..." : `Pay ${money(amount)}`}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

export default function MakePayment() {
  const [method, setMethod] = useState<"card" | "bank">("card");
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [duration, setDuration] = useState(1);
  
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const stripeOptions = useMemo(() => ({ appearance: { theme: "stripe" as const } }), []);
  const createResource = useCreateResource();

  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const selectedChild = children.find(c => c.id === selectedChildId);
  const totalAmount = TUITION_PER_MONTH * duration;

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
        // We could add child info here too
      });
      toast.success("Payment proof uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save payment proof");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Make Payment" description="Pay tuition and fees for your children" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-green-500">1. Select Child</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {childrenLoading ? (
              <p className="text-sm text-muted-foreground">Loading children...</p>
            ) : (
              <div className="grid gap-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      selectedChildId === child.id 
                        ? "border-green-500 bg-green-500/5 ring-1 ring-green-500" 
                        : "border-border hover:border-green-500/50"
                    }`}
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                      {child.photo && <img src={child.photo} alt={child.firstName} className="h-full w-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium">{child.firstName} {child.lastName}</p>
                      <p className="text-xs text-muted-foreground">{child.program}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-green-500">2. Select Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 6, 9, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className={`rounded-lg border p-2 text-center transition-all ${
                    duration === m 
                      ? "border-green-500 bg-green-500/5 font-bold text-green-500" 
                      : "border-border hover:border-green-500/50"
                  }`}
                >
                  <p className="text-lg">{m}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Month{m > 1 ? 's' : ''}</p>
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">Paying for</p>
              <p className="font-bold text-green-500">
                {duration === 1 ? "Current Month" : `${duration} Months Upfront`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-warning/30 bg-warning/5 shadow-card">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Total to Pay for {selectedChild?.firstName || "Child"}</p>
            <p className="font-display text-4xl font-bold text-green-500">{money(totalAmount)}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{money(TUITION_PER_MONTH)} / month</p>
            <p>x {duration} month{duration > 1 ? 's' : ''}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base text-green-500">3. Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setMethod("card")} className={`rounded-lg border-2 p-3 text-center transition-colors ${method === "card" ? "border-green-500 bg-green-500/5" : "border-border"}`}>
              <CreditCard className="mx-auto mb-1 h-5 w-5 text-green-500" />
              <span className="text-xs font-medium">Card</span>
            </button>
            <button onClick={() => setMethod("bank")} className={`rounded-lg border-2 p-3 text-center transition-colors ${method === "bank" ? "border-green-500 bg-green-500/5" : "border-border"}`}>
              <Building2 className="mx-auto mb-1 h-5 w-5 text-green-500" />
              <span className="text-xs font-medium">Bank Transfer</span>
            </button>
          </div>

          {method === "card" && (
            stripePromise ? (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CardPaymentForm 
                  amount={totalAmount} 
                  childId={selectedChildId} 
                  duration={duration} 
                  onSuccess={() => {}} 
                />
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
                <p className="text-xs text-muted-foreground italic">
                  Note: Please transfer <strong>{money(totalAmount)}</strong> and upload the receipt.
                </p>
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
                  container: "bg-background border-border",
                  button: "bg-green-500 text-white hover:bg-green-500/90",
                  label: "text-green-500",
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>SSL secured payment. Your information is encrypted.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
