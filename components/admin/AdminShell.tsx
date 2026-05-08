"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Baby, CalendarDays, CreditCard, ClipboardList,
  Calendar, MessageSquare, Megaphone, FileText, HelpCircle, BarChart3,
  ShieldCheck, Settings, LogOut, Menu, X, Heart, Bell, Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClerk } from '@clerk/nextjs';
import { useMarkAllNotificationsRead, useNotifications, useRealtimeNotifications } from '@/hooks/useNotifications';

const sidebarSections = [
  {
    title: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'People',
    items: [
      { href: '/admin/children', label: 'Children', icon: Baby },
      { href: '/admin/parents', label: 'Parents', icon: Users },
      { href: '/admin/staff', label: 'Staff', icon: ShieldCheck },
    ],
  },
  {
    title: 'Attendance',
    items: [
      { href: '/admin/attendance', label: 'Attendance', icon: CalendarDays },
      { href: '/admin/attendance-reports', label: 'Reports', icon: BarChart3 },
      { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    title: 'Registrations',
    items: [
      { href: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
    ],
  },
  {
    title: 'Finance',
    items: [
      { href: '/admin/payments', label: 'Payments', icon: CreditCard },
      { href: '/admin/invoices', label: 'Invoices', icon: FileText },
    ],
  },
  {
    title: 'Communications',
    items: [
      { href: '/admin/events', label: 'Events', icon: Calendar },
      { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
      { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { href: '/admin/resources', label: 'Resources', icon: FileText },
      { href: '/admin/cms', label: 'CMS', icon: FileText },
      { href: '/admin/studio', label: 'Studio', icon: FileText },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/support', label: 'Support', icon: HelpCircle },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/admin/seo', label: 'SEO', icon: Search },
      { href: '/admin/social', label: 'Social', icon: Megaphone },
      { href: '/admin/roles', label: 'Roles', icon: ShieldCheck },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
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
  payment: "bg-emerald-300",
  message: "bg-red-400",
  registration: "bg-red-400",
  enrollment: "bg-red-400",
};

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    fullName: string | null;
    imageUrl: string;
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
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  const markSectionRead = useCallback((href: string) => {
    const type = notificationTypeByHref[href];
    if (!type || !unreadCounts[type] || markNotificationsRead.isPending) return;
    markNotificationsRead.mutate(type);
  }, [markNotificationsRead, unreadCounts]);

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
      <span className="ml-auto flex min-w-5 items-center justify-end gap-1">
        <span className={`h-2 w-2 rounded-full ${notificationColorByType[type] ?? "bg-red-400"}`} />
        <span className={`text-[10px] font-bold ${active ? "text-green-500" : "text-white"}`}>
          {count > 9 ? "9+" : count}
        </span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-green-500 text-white fixed h-screen overflow-y-auto">
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-4 h-4 text-green-500" fill="currentColor" />
            </div>
            <div>
              <span className="font-display font-bold text-sm leading-tight block">Loving Family</span>
              <span className="text-[9px] uppercase tracking-wider text-secondary -mt-0.5 block">Admin Portal</span>
            </div>
          </Link>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search..."
              className="pl-9 secondary-50/10 border-white/10 text-white placeholder:text-white/40 text-sm"
            />
          </div>
        </div>

        <nav className="flex-1 py-2 px-3">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => markSectionRead(item.href)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-secondary text-green-500'
                          : 'text-white/80 hover:secondary-50/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate">{item.label}</span>
                      {renderNotificationMarker(item.href, active)}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-green-500 text-white overflow-y-auto">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Heart className="w-4 h-4 text-green-500" fill="currentColor" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm block">Loving Family</span>
                  <span className="text-[9px] uppercase tracking-wider text-secondary block">Admin Portal</span>
                </div>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:secondary-50/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="py-2 px-3">
              {sidebarSections.map((section) => (
                <div key={section.title} className="mb-4">
                  <p className="px-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            markSectionRead(item.href);
                            setMobileOpen(false);
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            active ? 'bg-secondary text-green-500' : 'text-white/80 hover:secondary-50/10'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="truncate">{item.label}</span>
                          {renderNotificationMarker(item.href, active)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 secondary-50 border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {totalUnread > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{initials || "AD"}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user.role.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
