"use client";

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight, Building2, CreditCard, Lock, ReceiptText, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  onSuccess,
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
        <div className="rounded-2xl border border-primary/10 bg-white p-4 shadow-xs">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#21445E",
                  "::placeholder": { color: "#6B7280" },
                },
              },
            }}
          />
        </div>
      </div>
      <Button className="w-full bg-accent text-white hover:bg-accent-400" onClick={pay} disabled={!stripe || createIntent.isPending || !childId}>
        {createIntent.isPending ? "Preparing..." : `Pay ${money(amount)}`}
        <ArrowRight className="h-4 w-4" />
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

  const selectedChild = children.find((child) => child.id === selectedChildId);
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
      });
      toast.success("Payment proof uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save payment proof");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <WalletCards className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Make Payment</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Choose a child, select the tuition duration, and complete payment by card or bank transfer.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Total</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{money(totalAmount)}</p>
            <p className="text-sm text-muted-foreground">
              {money(TUITION_PER_MONTH)} x {duration} month{duration > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      {childrenLoading ? (
        <Card className="border-primary/10 bg-white shadow-card">
          <CardContent className="p-6 text-sm text-muted-foreground">Loading children...</CardContent>
        </Card>
      ) : children.length === 0 ? (
        <EmptyState title="No child profile found" description="A child profile is required before payment can be made." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card className="border-primary/10 bg-white shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-xl text-primary">1. Select Child</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {children.map((child) => {
                  const active = selectedChildId === child.id;
                  return (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex items-center gap-3 rounded-3xl border p-4 text-left transition-all ${
                        active
                          ? "border-accent bg-accent-50 ring-2 ring-accent/20"
                          : "border-primary/10 bg-[#FFF9F0] hover:border-accent/50"
                      }`}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={child.photo ?? undefined} />
                        <AvatarFallback className="bg-secondary-100 font-bold text-primary">
                          {child.firstName[0]}
                          {child.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        <span className="block font-bold text-primary">
                          {child.firstName} {child.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground">{child.program}</span>
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-white shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-xl text-primary">2. Select Duration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 6, 9, 12].map((months) => (
                    <button
                      key={months}
                      onClick={() => setDuration(months)}
                      className={`rounded-2xl border p-3 text-center transition-all ${
                        duration === months
                          ? "border-accent bg-accent text-white shadow-soft"
                          : "border-primary/10 bg-[#FFF9F0] text-primary hover:border-accent/50"
                      }`}
                    >
                      <p className="font-display text-xl font-bold">{months}</p>
                      <p className="text-[10px] font-bold uppercase opacity-75">Month{months > 1 ? "s" : ""}</p>
                    </button>
                  ))}
                </div>
                <div className="rounded-3xl bg-secondary-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Paying for</p>
                  <p className="mt-1 font-bold text-primary">{duration === 1 ? "Current Month" : `${duration} Months Upfront`}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/10 bg-white shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl text-primary">3. Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-3xl bg-accent-50 p-5">
                <p className="text-sm text-muted-foreground">Total to pay for {selectedChild?.firstName || "child"}</p>
                <p className="mt-1 font-display text-4xl font-bold text-primary">{money(totalAmount)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMethod("card")}
                  className={`rounded-3xl border-2 p-4 text-center transition-colors ${
                    method === "card" ? "border-accent bg-accent-50" : "border-primary/10 bg-[#FFF9F0]"
                  }`}
                >
                  <CreditCard className="mx-auto mb-2 h-5 w-5 text-accent" />
                  <span className="text-sm font-bold text-primary">Card</span>
                </button>
                <button
                  onClick={() => setMethod("bank")}
                  className={`rounded-3xl border-2 p-4 text-center transition-colors ${
                    method === "bank" ? "border-accent bg-accent-50" : "border-primary/10 bg-[#FFF9F0]"
                  }`}
                >
                  <Building2 className="mx-auto mb-2 h-5 w-5 text-accent" />
                  <span className="text-sm font-bold text-primary">Bank Transfer</span>
                </button>
              </div>

              {method === "card" &&
                (stripePromise ? (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <CardPaymentForm amount={totalAmount} childId={selectedChildId} duration={duration} onSuccess={() => {}} />
                  </Elements>
                ) : (
                  <div className="rounded-3xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                    Stripe public key is not configured. Add `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` to enable card payments.
                  </div>
                ))}

              {method === "bank" && (
                <div className="space-y-4 rounded-3xl bg-secondary-50 p-4 text-sm">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 font-bold text-primary">
                      <ReceiptText className="h-4 w-4 text-accent" />
                      Bank Transfer Details
                    </p>
                    <p>Bank: First Bank of Nigeria</p>
                    <p>Account Name: Loving Family Daycare Ltd</p>
                    <p>Account Number: 3024567890</p>
                    <p className="text-xs italic text-muted-foreground">
                      Transfer <strong>{money(totalAmount)}</strong> and upload the receipt.
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
                      container: "bg-white border-primary/10",
                      button: "bg-accent text-white hover:bg-accent-400",
                      label: "text-primary",
                    }}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 rounded-2xl bg-[#FFF9F0] p-3 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                <span>SSL secured payment. Your information is encrypted.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
