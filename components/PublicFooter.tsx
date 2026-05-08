"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Twitter,
} from "lucide-react";

const links = ["Programs", "Gallery", "Events", "About Us", "Contact"];

export default function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background text-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary-50 to-accent-50" />
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute -left-24 -top-24 h-64 w-80 rounded-[45%_55%_62%_38%/48%_42%_58%_52%] bg-surface/70" />
      <div className="absolute -right-28 bottom-0 h-72 w-96 rounded-[58%_42%_45%_55%/42%_48%_52%_58%] bg-secondary/70" />

      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.75fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-accent" />
                Loving care since 2015
              </div>
              <h3 className="mb-4 flex items-center gap-3 font-display text-3xl font-bold text-[#2C4D63]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary-900 shadow-sm">
                  <Heart className="h-6 w-6 fill-current" />
                </span>
                Loving Family Daycare
              </h3>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                A warm second home where children feel safe, loved, and inspired to grow every day.
              </p>

              <div className="mt-6 flex items-center gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm transition-colors hover:bg-accent hover:text-primary-900"
                    aria-label="Social media link"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="mb-4 font-display text-lg font-bold text-accent">Quick Links</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(" ", "-")}`}
                      className="group flex items-center gap-2 rounded-full px-1 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-accent transition-transform group-hover:translate-x-1" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm"
            >
              <h4 className="mb-4 font-display text-lg font-bold text-accent">Contact</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>12 Unity Avenue, Ikeja, Lagos, Nigeria</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>+234 801 234 5678</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>info@lovingfamily.ng</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2025 Loving Family Daycare. All rights reserved. Made with love for little ones.
          </motion.div>
        </div>
      </section>
    </footer>
  );
}
