"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-3 border-b border-border" : "bg-transparent py-5"
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
                    "text-sm font-medium transition-colors hover:text-accent",
                    pathname === link.href 
                      ? "text-accent" 
                      : (scrolled || pathname !== '/' ? "text-green-500/70" : "text-white/80")
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 border-l border-border pl-8">
              <Link href="/login" className={cn(
                "text-sm font-semibold hover:opacity-80 transition-opacity",
                scrolled || pathname !== '/' ? "text-green-500" : "text-white"
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
                <Button variant="outline" className="w-full border-green-500 text-green-500 rounded-full" asChild>
                  <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent-400 rounded-full" asChild>
                  <Link href="/register" onClick={() => setIsOpen(false)}>Enroll Now</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
