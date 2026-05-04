"use client";

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div>
      <div className="bg-green py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-yellow/20 text-yellow border-yellow/30 mb-4">Contact</Badge>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/70 max-w-2xl mx-auto">We'd love to hear from you. Reach out for inquiries, enrollment, or just to say hello.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="yellow-50 rounded-xl p-6 lg:p-8 shadow-soft">
            <h2 className="text-xl font-display font-bold text-green mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+234..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us more..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full bg-yellow text-green hover:bg-yellow-400 font-semibold">
                <Send className="w-4 h-4 mr-2" /> Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="yellow-50 rounded-xl p-6 shadow-soft">
              <h3 className="font-display font-semibold text-green mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <p className="font-medium text-green">Address</p>
                    <p className="text-sm text-muted-foreground">12 Unity Avenue, Ikeja, Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green/5 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <p className="font-medium text-green">Phone</p>
                    <p className="text-sm text-muted-foreground">+234 801 234 5678</p>
                    <p className="text-sm text-muted-foreground">+234 802 345 6789</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green/5 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <p className="font-medium text-green">Email</p>
                    <p className="text-sm text-muted-foreground">info@lovingfamily.ng</p>
                    <p className="text-sm text-muted-foreground">enrollment@lovingfamily.ng</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green rounded-xl p-6 text-white">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow" /> Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/70">Monday - Friday</span><span>7:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span className="text-white/70">Saturday</span><span>9:00 AM - 2:00 PM</span></div>
                <div className="flex justify-between"><span className="text-white/70">Sunday</span><span>Closed</span></div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-green/5 flex items-center justify-center hover:bg-green hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-green/5 flex items-center justify-center hover:bg-green hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-green/5 flex items-center justify-center hover:bg-green hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
