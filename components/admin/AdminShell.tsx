"use client";

import { useClerk } from "@clerk/nextjs";
import {
  Baby,
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useMarkAllNotificationsRead, useNotifications, useRealtimeNotifications } from "@/hooks/useNotifications";

const sidebarSections = [
  {
    title: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "People",
    items: [
      { href: "/admin/children", label: "Children", icon: Baby },
      { href: "/admin/parents", label: "Parents", icon: Users },
      { href: "/admin/staff", label: "Staff", icon: ShieldCheck },
    ],
  },
  {
    title: "Attendance",
    items: [
      { href: "/admin/attendance", label: "Attendance", icon: CalendarDays },
      { href: "/admin/attendance-reports", label: "Reports", icon: BarChart3 },
      { href: "/admin/calendar", label: "Calendar", icon: Calendar },
    ],
  },
  {
    title: "Registrations",
    items: [{ href: "/admin/registrations", label: "Registrations", icon: ClipboardList }],
  },
  {
    title: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    title: "Communications",
    items: [
      { href: "/admin/events", label: "Events", icon: Calendar },
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/resources", label: "Resources", icon: FileText },
      { href: "/admin/cms", label: "CMS", icon: FileText },
      { href: "/admin/studio", label: "Studio", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/support", label: "Support", icon: HelpCircle },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/seo", label: "SEO", icon: Search },
      { href: "/admin/social", label: "Social", icon: Megaphone },
      { href: "/admin/roles", label: "Roles", icon: ShieldCheck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const notificationTypeByHref: Record<string, string> = {
  "/admin/payments": "payment",
  "/admin/messages": "message",
  "/admin/registrations": "registration",
  "/admin/children": "enrollment",
};

const notificationColorByType: Record<string, string> = {
  payment: "bg-surface",
  message: "bg-accent",
  registration: "bg-accent",
  enrollment: "bg-accent",
};

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    fullName: string | null;
    imageUrl: string | null;
    role: string;
  };
}

export function AdminShell({ children, user }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { data: unreadNotifications = [] } = useNotifications({ unreadOnly: true });
  const markNotificationsRead = useMarkAllNotificationsRead();
  useRealtimeNotifications();

  const unreadCounts = useMemo(() => {
    return unreadNotifications.reduce<Record<string, number>>((counts, notification) => {
      counts[notification.type] = (counts[notification.type] ?? 0) + 1;
      return counts;
    }, {});
  }, [unreadNotifications]);

  const totalUnread = unreadNotifications.length;
  const displayName = user.fullName || "Admin";
  const initials =
    displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  const markSectionRead = useCallback(
    (href: string) => {
      const type = notificationTypeByHref[href];
      if (!type || !unreadCounts[type] || markNotificationsRead.isPending) return;
      markNotificationsRead.mutate(type);
    },
    [markNotificationsRead, unreadCounts],
  );

  useEffect(() => {
    const matchingHref = Object.keys(notificationTypeByHref)
      .sort((a, b) => b.length - a.length)
      .find((href) => pathname.startsWith(href));

    if (matchingHref) {
      markSectionRead(matchingHref);
    }
  }, [markSectionRead, pathname]);

  const renderNotificationMarker = (href: string, active: boolean) => {
    const type = notificationTypeByHref[href];
    const count = type ? unreadCounts[type] ?? 0 : 0;
    if (!type || count === 0) return null;

    return (
      <span className="ml-auto flex min-w-6 items-center justify-end gap-1">
        <span className={`h-2 w-2 rounded-full ${notificationColorByType[type] ?? "bg-accent"}`} />
        <span className={`text-[10px] font-bold ${active ? "text-white" : "text-primary"}`}>{count > 9 ? "9+" : count}</span>
      </span>
    );
  };

  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-3">
      {sidebarSections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    markSectionRead(item.href);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                    active
                      ? "bg-accent text-white shadow-soft"
                      : "text-primary/80 hover:bg-secondary-50 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                  {renderNotificationMarker(item.href, active)}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-primary">
      <aside className="fixed left-4 top-4 bottom-4 hidden w-72 flex-col rounded-3xl border border-primary/10 bg-white/90 shadow-card backdrop-blur lg:flex">
        <div className="border-b border-primary/10 p-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white shadow-soft">
              <Heart className="h-5 w-5" fill="currentColor" />
            </span>
            <span>
              <span className="block font-display text-base font-bold leading-tight text-primary">Loving Family</span>
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Admin Portal
              </span>
            </span>
          </Link>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="h-11 rounded-2xl border-primary/10 bg-[#FFF9F0] pl-9 text-sm" />
          </div>
        </div>

        {nav}

        <div className="border-t border-primary/10 p-4">
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
          <div className="absolute left-0 top-0 flex h-full w-80 flex-col border-r border-primary/10 bg-[#FFF9F0] shadow-premium">
            <div className="flex items-center justify-between border-b border-primary/10 p-4">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold text-primary">Loving Family</span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Admin Portal
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
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl p-2 text-primary hover:bg-secondary-50 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <p className="font-display text-lg font-bold text-primary">Admin workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative rounded-xl border border-primary/10 bg-white/80 p-2 text-primary shadow-xs hover:bg-secondary-50">
                <Bell className="h-5 w-5" />
                {totalUnread > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" /> : null}
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

        <main className="px-4 py-5 pb-16 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
