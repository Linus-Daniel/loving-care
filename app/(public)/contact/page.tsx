"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Loader2, MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter,
  Sparkles, MessageCircle, CalendarDays, Heart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/client/api';

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/api/contact', { method: 'POST', body: form });
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      <section className="relative min-h-[72vh] overflow-hidden border-b border-border bg-background flex items-center">
        <Image
          src="/images/contact-hero.png"
          alt="Teacher and children at Loving Family Daycare"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/78 to-background/10" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="absolute -left-20 -top-24 h-64 w-80 rounded-[45%_55%_62%_38%/48%_42%_58%_52%] bg-surface/85" />
        <div className="absolute -bottom-28 -left-16 h-72 w-96 rounded-[58%_42%_45%_55%/42%_48%_52%_58%] bg-secondary/80" />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-28">
            <motion.div
              className="max-w-[620px]"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <Badge className="bg-background/80 text-primary border-border mb-6 backdrop-blur-sm px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent" />
                Contact Loving Family
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-5 leading-[1.08]">
                <span className="block text-[#2C4D63]">Let’s talk about</span>
                <span className="block text-[#E28E6B]">your child’s</span>
                <span className="block text-[#A0AE9A]">next happy step</span>
              </h1>
              <p className="text-[#343A40] text-lg max-w-xl leading-relaxed">
                Reach out for enrollment questions, visits, fees, programs, or anything your family needs to feel confident.
              </p>

              <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { icon: Phone, label: "Call", value: "+234 801 234 5678" },
                  { icon: Mail, label: "Email", value: "info@lovingfamily.ng" },
                  { icon: Clock, label: "Hours", value: "Mon-Fri, 7AM-6PM" },
                ].map((item) => (
                  <div key={item.label} className="border border-border bg-background/75 px-4 py-3 text-primary shadow-sm backdrop-blur-sm">
                    <item.icon className="mb-2 h-5 w-5 text-accent" />
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold leading-snug">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          {/* Contact Form */}
          <motion.div
            className="rounded-3xl border border-border bg-card p-6 shadow-card lg:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <Badge className="mb-3 border-border bg-accent-50 text-accent-700">
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  Send a note
                </Badge>
                <h2 className="font-display text-2xl font-bold text-primary">Tell us how we can help</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  We usually respond within one school day. For urgent pickup or attendance issues, please call directly.
                </p>
              </div>
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary-50 text-accent sm:flex">
                <Heart className="h-7 w-7" />
              </div>
            </div>
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
              <Button type="submit" disabled={submitting} className="h-12 w-full rounded-2xl bg-accent font-bold text-primary-900 hover:bg-accent-200">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Send Message</>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <div className="space-y-6">
            <motion.div
              className="rounded-3xl border border-border bg-secondary-50 p-6 shadow-soft"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-display text-xl font-semibold text-primary mb-5">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Address</p>
                    <p className="text-sm text-muted-foreground">12 Unity Avenue, Ikeja, Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Phone</p>
                    <p className="text-sm text-muted-foreground">+234 801 234 5678</p>
                    <p className="text-sm text-muted-foreground">+234 802 345 6789</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Email</p>
                    <p className="text-sm text-muted-foreground">info@lovingfamily.ng</p>
                    <p className="text-sm text-muted-foreground">enrollment@lovingfamily.ng</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-border bg-accent-50 p-6 shadow-soft text-primary"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Monday - Friday</span><span className="font-semibold">7:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Saturday</span><span className="font-semibold">9:00 AM - 2:00 PM</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Sunday</span><span className="font-semibold">Closed</span></div>
              </div>
            </motion.div>

            <motion.div
              className="relative min-h-[220px] overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary-50 to-accent-50" />
              <div className="absolute inset-0 bg-primary/5" />
              <div className="absolute left-8 top-8 h-16 w-16 rounded-full border border-accent/30" />
              <div className="absolute right-10 bottom-8 h-24 w-24 rounded-full border border-secondary-300" />
              <div className="relative flex min-h-[220px] flex-col justify-between p-6">
                <div>
                  <Badge className="mb-3 border-border bg-background/80 text-primary">
                    <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-accent" />
                    Plan a visit
                  </Badge>
                  <h3 className="font-display text-xl font-bold text-primary">Come see the classrooms</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Book a visit to meet our team, view the spaces, and ask questions in person.
                  </p>
                </div>
                <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-bold text-primary shadow-sm">
                  <MapPin className="h-4 w-4 text-accent" />
                  Ikeja, Lagos
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4">
              <a href="#" className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-accent hover:text-primary-900 transition-colors shadow-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-accent hover:text-primary-900 transition-colors shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-accent hover:text-primary-900 transition-colors shadow-sm">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
