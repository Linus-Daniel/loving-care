import type { Metadata } from "next";
import { Heart, Shield } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Restricted admin access for Loving Family Daycare staff.",
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
            <Heart className="h-6 w-6" fill="currentColor" />
          </span>
          <div>
            <p className="font-display text-xl font-bold">Loving Family Daycare</p>
            <p className="text-sm text-white/70">Nurturing every child with care.</p>
          </div>
        </div>
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full secondary-50/10 px-3 py-1 text-sm">
            <Shield className="h-4 w-4 text-accent" />
            Admin Portal Access
          </p>
          <h1 className="max-w-md font-display text-4xl font-extrabold leading-tight text-white">
            Secure school operations for authorized staff.
          </h1>
        </div>
      </section>

      <section className="flex items-center justify-center bg-[#FFF9F0] p-4">
        <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-white p-6 shadow-card lg:p-8">
          <div className="mb-6 text-center">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Shield className="h-4 w-4" />
              Admin Portal Access
            </p>
            <h2 className="font-display text-2xl font-bold text-primary">Admin Sign In</h2>
            <p className="text-sm text-muted-foreground">No registration is available from this portal.</p>
          </div>
          <AdminLoginForm />
        </div>
      </section>
    </div>
  );
}
