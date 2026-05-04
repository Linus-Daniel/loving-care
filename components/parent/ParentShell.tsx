"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UserCircle, CalendarDays, CreditCard, Calendar, MessageSquare,
  FileText, HelpCircle, Settings, LogOut, Menu, X, Heart, Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClerk } from '@clerk/nextjs';

const navItems = [
  { href: '/parent', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/parent/child', label: 'My Child', icon: UserCircle },
  { href: '/parent/attendance', label: 'Attendance', icon: CalendarDays },
  { href: '/parent/payments', label: 'Payments', icon: CreditCard },
  { href: '/parent/events', label: 'Events', icon: Calendar },
  { href: '/parent/messages', label: 'Messages', icon: MessageSquare },
  { href: '/parent/resources', label: 'Resources', icon: FileText },
  { href: '/parent/support', label: 'Support', icon: HelpCircle },
  { href: '/parent/settings', label: 'Settings', icon: Settings },
];

interface ParentShellProps {
  children: React.ReactNode;
  user: {
    fullName: string | null;
    imageUrl: string;
    role: string;
  };
}

export function ParentShell({ children, user }: ParentShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  const displayName = user.fullName || "Parent";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-green text-white fixed h-screen">
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow flex items-center justify-center">
              <Heart className="w-4 h-4 text-green" fill="currentColor" />
            </div>
            <div>
              <span className="font-display font-bold text-sm leading-tight block">Loving Family</span>
              <span className="text-[9px] uppercase tracking-wider text-yellow -mt-0.5 block">Parent Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-yellow text-green'
                    : 'text-white/80 hover:yellow-50/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
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
          <div className="absolute left-0 top-0 h-full w-64 bg-green text-white">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow flex items-center justify-center">
                  <Heart className="w-4 h-4 text-green" fill="currentColor" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm block">Loving Family</span>
                  <span className="text-[9px] uppercase tracking-wider text-yellow block">Parent Portal</span>
                </div>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:yellow-50/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-yellow text-green' : 'text-white/80 hover:yellow-50/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 yellow-50 border-b border-border px-4 py-3 flex items-center justify-between lg:justify-end">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{initials || "PA"}</AvatarFallback>
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

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 yellow-50 border-t border-border z-40 flex items-center justify-around py-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs ${
                active ? 'text-green' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
