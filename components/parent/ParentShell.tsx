"use client";

import { useClerk } from "@clerk/nextjs";
import {
  Bell,
  Calendar,
  CalendarDays,
  CreditCard,
  FileText,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parent/child", label: "My Child", icon: UserCircle },
  { href: "/parent/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/parent/payments", label: "Payments", icon: CreditCard },
  { href: "/parent/events", label: "Events", icon: Calendar },
  { href: "/parent/messages", label: "Messages", icon: MessageSquare },
  { href: "/parent/resources", label: "Resources", icon: FileText },
  { href: "/parent/support", label: "Support", icon: HelpCircle },
  { href: "/parent/settings", label: "Settings", icon: Settings },
];

interface ParentShellProps {
  children: React.ReactNode;
  user: {
    fullName: string | null;
    imageUrl: string | null;
    role: string;
  };
}

export function ParentShell({ children, user }: ParentShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  const displayName = user.fullName || "Parent";
  const initials =
    displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PA";

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                active
                  ? "bg-accent text-accent-foreground shadow-soft"
                  : "text-primary/80 hover:bg-secondary-50 hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-primary">
      <aside className="fixed left-4 top-4 bottom-4 hidden w-72 flex-col rounded-3xl border border-primary/10 bg-white/85 shadow-card backdrop-blur lg:flex">
        <div className="border-b border-primary/10 p-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white shadow-soft">
              <Heart className="h-5 w-5" fill="currentColor" />
            </span>
            <span>
              <span className="block font-display text-base font-bold leading-tight text-primary">Loving Family</span>
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Parent Portal
              </span>
            </span>
          </Link>
        </div>

        {nav}

        <div className="border-t border-primary/10 p-4">
          <div className="mb-4 rounded-2xl border border-secondary-200 bg-secondary-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Need help?</p>
            <p className="mt-1 text-sm font-semibold text-primary">Support is one tap away.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-accent-50 hover:text-accent-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-primary/25"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-primary/10 bg-[#FFF9F0] shadow-premium">
            <div className="flex items-center justify-between border-b border-primary/10 p-4">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold text-primary">Loving Family</span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Parent Portal
                  </span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-primary hover:bg-secondary-50"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-80">
        <header className="sticky top-0 z-40 border-b border-primary/10 bg-[#FFF9F0]/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between">
            <button
              className="rounded-xl p-2 text-primary hover:bg-secondary-50 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Parent Portal</p>
              <p className="font-display text-lg font-bold text-primary">Family care dashboard</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative rounded-xl border border-primary/10 bg-white/80 p-2 text-primary shadow-xs hover:bg-secondary-50">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </button>
              <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-white/80 px-2 py-1.5 shadow-xs">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.imageUrl ?? undefined} />
                  <AvatarFallback className="bg-secondary-100 text-xs font-bold text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-sm font-bold text-primary">{displayName}</p>
                  <p className="text-xs capitalize text-muted-foreground">{user.role.replace("_", " ").toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-5 rounded-2xl border border-primary/10 bg-white/95 p-1.5 shadow-card backdrop-blur lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition-colors ${
                active ? "bg-accent text-white" : "text-muted-foreground hover:bg-secondary-50 hover:text-primary"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
