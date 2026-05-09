"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ArrowRight, LogOut, LayoutDashboard, ChevronDown, User } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/programs', label: 'Programs' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' });
  };

  const role = user?.publicMetadata?.role as string || 'parent';
  const dashboardHref = role === 'admin' ? '/admin' : '/parent';
  const displayName = user?.fullName || user?.firstName || user?.username || "Account";
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-3 border-b border-border" : "bg-background/50 py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center transition-transform group-hover:scale-110">
              <Heart className="w-5 h-5 text-secondary" fill="currentColor" />
            </div>
            <span className={cn(
              "font-display font-bold text-xl tracking-tight transition-colors",
              scrolled || pathname !== '/' ? "text-green-500" : "text-white"
            )}>
              Loving Family
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm px-2 py-1 font-medium transition-colors hover:text-accent",
                    pathname === link.href 
                      ? "border-[2px] border-solid rounded-md border-primary-600" 
                      : (scrolled || pathname !== '/' ? "text-green-500/70" : "")
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 border-l border-border pl-8">
              {isLoaded && user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-border bg-background/50 p-1.5 pr-3 shadow-sm transition-all hover:bg-background/80 hover:shadow-md"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary-50">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="bg-primary-100 text-[10px] font-bold text-primary-600">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Welcome</p>
                      <p className="text-xs font-bold text-primary-900 leading-none">{displayName}</p>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-border bg-background p-2 shadow-xl ring-1 ring-black/5"
                      >
                        <div className="px-3 py-2 mb-1">
                          <p className="text-xs font-medium text-muted-foreground">Signed in as</p>
                          <p className="truncate text-sm font-bold text-primary">{user.primaryEmailAddress?.emailAddress}</p>
                        </div>
                        <div className="h-px bg-border mx-2 mb-1" />
                        <Link
                          href={dashboardHref}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-secondary-50 hover:text-accent-700"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={`${dashboardHref}/settings`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-secondary-50 hover:text-accent-700"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                        <div className="h-px bg-border mx-2 my-1" />
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/login" className={cn(
                    "text-sm font-semibold bg-primary-600 text-white p-3 rounded-full hover:opacity-80 transition-opacity",
                    scrolled || pathname !== '/' ? "text-white" : ""
                  )}>
                    Sign In
                  </Link>
                  <Button 
                    className="bg-accent-400 text-accent-foreground hover:bg-accent-400 font-bold rounded-full px-6"
                    asChild
                  >
                    <Link href="/register">
                      Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              scrolled || pathname !== '/' ? "text-green-500 hover:bg-muted" : "text-white hover:secondary-50/10"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden secondary-50 border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-lg text-base font-medium transition-colors",
                    pathname === link.href ? "bg-secondary/10 text-green-500 font-bold" : "text-green-500/70 hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {isLoaded && user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-4 rounded-2xl bg-secondary-50 border border-secondary-200">
                      <Avatar className="h-12 w-12 ring-2 ring-white">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback className="bg-primary-100 font-bold text-primary-600">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-primary">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-primary-600 text-primary-600 rounded-full font-bold" asChild>
                      <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-red-500 hover:bg-red-50 rounded-full font-bold"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full border-green-500 text-green-500 rounded-full" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent-400 rounded-full" asChild>
                      <Link href="/register" onClick={() => setIsOpen(false)}>Enroll Now</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
