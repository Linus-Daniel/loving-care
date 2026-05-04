"use client";

import Link from 'next/link';
import { Heart, Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function PublicFooter() {
  return (
    <footer className="bg-green text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow flex items-center justify-center">
                <Heart className="w-5 h-5 text-green" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">Loving Family</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Providing a nurturing, safe, and stimulating environment for children to learn and grow since 2015. Our mission is to build bright futures together.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full yellow-50/5 flex items-center justify-center hover:bg-yellow hover:text-green transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full yellow-50/5 flex items-center justify-center hover:bg-yellow hover:text-green transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full yellow-50/5 flex items-center justify-center hover:bg-yellow hover:text-green transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-white/60 hover:text-yellow transition-colors text-sm">About Us</Link></li>
              <li><Link href="/programs" className="text-white/60 hover:text-yellow transition-colors text-sm">Our Programs</Link></li>
              <li><Link href="/gallery" className="text-white/60 hover:text-yellow transition-colors text-sm">Photo Gallery</Link></li>
              <li><Link href="/events" className="text-white/60 hover:text-yellow transition-colors text-sm">Upcoming Events</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-yellow transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow shrink-0" />
                <span className="text-white/60 text-sm">12 Unity Avenue, Ikeja, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow shrink-0" />
                <span className="text-white/60 text-sm">+234 801 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow shrink-0" />
                <span className="text-white/60 text-sm">info@lovingfamily.ng</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-white/60 text-sm mb-4">Subscribe to get the latest news and event updates.</p>
            <form className="space-y-3">
              <div className="relative">
                <Input 
                  placeholder="Your Email" 
                  className="yellow-50/5 border-white/10 text-white placeholder:text-white/40 rounded-full pr-12 h-12"
                />
                <button className="absolute right-1 top-1 w-10 h-10 bg-yellow rounded-full flex items-center justify-center text-green hover:bg-yellow-400 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Loving Family Daycare. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white transition-colors text-xs">Privacy Policy</Link>
            <Link href="/terms" className="text-white/40 hover:text-white transition-colors text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
