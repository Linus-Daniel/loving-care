"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import {
  Shield, GraduationCap, Heart, Star, ArrowRight, Calendar, MapPin,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePublicHomeContent } from '@/hooks/usePublicContent';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [inView, end]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const { data: content, isLoading } = usePublicHomeContent();

  const stats = [
    { value: 200, suffix: '+', label: 'Happy Families' },
    { value: 10, suffix: '+', label: 'Years Experience' },
    { value: 30, suffix: '+', label: 'Qualified Staff' },
    { value: 6, suffix: '', label: 'Programs Offered' },
  ];

  const iconMap = { shield: Shield, graduation: GraduationCap, heart: Heart };
  const heroHeadline = content?.home?.heroHeadline ?? "Where Little Minds Grow & Families Thrive";
  const heroSubtext = content?.home?.heroSubtext ?? "A warm, safe, and stimulating environment where your child can explore, learn, and develop to their fullest potential.";
  const features = (content?.home?.whyUsItems ?? []).slice(0, 3);
  const programs = content?.programs ?? [];
  const testimonials = content?.home?.testimonials ?? [];
  const gallery = (content?.gallery ?? []).filter((image) => image.imageUrl);
  const events = content?.events ?? [];
  const heroImage = gallery[0]?.imageUrl;
  const activeTestimonial = testimonials[testimonialIdx % Math.max(testimonials.length, 1)];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-green overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-yellow/20 text-yellow border-yellow/30 mb-4">
                Nurturing Young Minds Since 2015
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-4">
                {heroHeadline}
              </h1>
              <p className="text-white/70 text-base lg:text-lg mb-6 max-w-lg">
                {heroSubtext}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-yellow text-green hover:bg-yellow-400 font-semibold rounded-full px-6"
                  onClick={() => router.push('/register')}
                >
                  Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:yellow-50/10 rounded-full px-6"
                  onClick={() => router.push('/programs')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="Happy children at daycare"
                  width={720}
                  height={540}
                  className="rounded-2xl shadow-lift w-full object-cover aspect-[4/3]"
                  priority
                />
              ) : (
                <div className="rounded-2xl shadow-lift w-full aspect-[4/3] yellow-50/10" />
              )}
              <div className="absolute -bottom-4 -left-4 yellow-50 rounded-xl p-3 shadow-card hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green">Loved by Parents</p>
                    <p className="text-xs text-muted-foreground">4.9/5 rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="yellow-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {stats.map((stat) => (
              <div key={stat.label} className="py-8 px-4 text-center">
                <p className="text-3xl lg:text-4xl font-display font-bold text-green mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-teal text-teal">Why Choose Us</Badge>
            <h2 className="text-2xl lg:text-4xl font-display font-bold text-green mb-3">Building Bright Futures Together</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a nurturing environment where children feel safe, loved, and inspired to learn through play and discovery.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl yellow-50 shadow-soft" />
            )) : features.length ? features.map((feature, i) => {
              const Icon = iconMap[(feature.icon?.toLowerCase() as keyof typeof iconMap) ?? ""] ?? Shield;
              return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="yellow-50 rounded-xl p-6 shadow-soft hover:shadow-lift transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-green/5 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green" />
                </div>
                <h3 className="text-lg font-display font-semibold text-green mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
              );
            }) : <div className="md:col-span-3"><EmptyState title="No feature cards published" description="Add Why Us items in Sanity to fill this section." /></div>}
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-16 lg:py-24 yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-yellow text-yellow">Our Programs</Badge>
              <h2 className="text-2xl lg:text-4xl font-display font-bold text-green">Programs for Every Age</h2>
            </div>
            <Button variant="outline" className="border-green text-green hover:bg-green hover:text-white w-fit" onClick={() => router.push('/programs')}>
              View All Programs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            )) : programs.length ? programs.map((program, i) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-background rounded-xl overflow-hidden shadow-soft hover:shadow-lift transition-all"
              >
                <div className="relative overflow-hidden">
                  {program.imageUrl ? (
                    <Image
                      src={program.imageUrl}
                      alt={program.name}
                      width={480}
                      height={360}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-muted" />
                  )}
                  {program.ageRange ? <Badge className="absolute top-3 left-3 bg-yellow text-green">{program.ageRange}</Badge> : null}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-display font-semibold text-green mb-2">{program.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                  <Link href="/programs" className="text-sm font-medium text-teal hover:text-green transition-colors inline-flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            )) : <div className="md:col-span-3"><EmptyState title="No programs published" description="Active Sanity programs will appear here." /></div>}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="bg-yellow/20 text-yellow border-yellow/30 mb-3">Testimonials</Badge>
            <h2 className="text-2xl lg:text-4xl font-display font-bold text-white">What Parents Say</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="yellow-50/5 backdrop-blur rounded-2xl p-6 lg:p-10 text-center">
              {activeTestimonial ? (
                <>
              <div className="flex justify-center mb-4">
                {Array.from({ length: activeTestimonial.rating ?? 5 }).map((_, s) => (
                  <Star key={s} className="w-5 h-5 text-yellow" fill="currentColor" />
                ))}
              </div>
              <p className="text-white/90 text-base lg:text-lg mb-6 italic">
                "{activeTestimonial.quote}"
              </p>
              <div className="flex items-center justify-center gap-3 mb-6">
                {activeTestimonial.avatarUrl ? (
                  <Image
                    src={activeTestimonial.avatarUrl}
                    alt={activeTestimonial.parentName ?? "Parent testimonial"}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-yellow/20" />
                )}
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{activeTestimonial.parentName}</p>
                  <p className="text-white/60 text-xs">Loving Family parent</p>
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                  className="p-2 rounded-full yellow-50/10 hover:yellow-50/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                  className="p-2 rounded-full yellow-50/10 hover:yellow-50/20 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
                </>
              ) : (
                <p className="text-white/80">Parent testimonials will appear here once published in Sanity.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-teal text-teal">Gallery</Badge>
              <h2 className="text-2xl lg:text-4xl font-display font-bold text-green">Moments That Matter</h2>
            </div>
            <Button variant="outline" className="border-green text-green hover:bg-green hover:text-white w-fit" onClick={() => router.push('/gallery')}>
              View Gallery <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
            )) : gallery.length ? gallery.slice(0, 6).map((img, i) => (
              <motion.div
                key={`${img.imageUrl}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group relative overflow-hidden rounded-xl ${i === 0 || i === 3 ? 'md:row-span-2' : ''}`}
              >
                <Image
                  src={img.imageUrl ?? ""}
                  alt={img.caption ?? `Daycare moment ${i + 1}`}
                  width={420}
                  height={560}
                  className={`w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ${i === 0 || i === 3 ? 'aspect-[3/4]' : 'aspect-square'}`}
                />
                <div className="absolute inset-0 bg-green/0 group-hover:bg-green/40 transition-colors rounded-xl" />
              </motion.div>
            )) : <div className="col-span-2 md:col-span-3"><EmptyState title="No gallery images published" description="Sanity gallery images will appear here." /></div>}
          </div>
        </div>
      </section>

      {/* Events Strip */}
      <section className="py-16 lg:py-24 yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-yellow text-yellow">Upcoming</Badge>
              <h2 className="text-2xl lg:text-4xl font-display font-bold text-green">Events & Activities</h2>
            </div>
            <Button variant="outline" className="border-green text-green hover:bg-green hover:text-white w-fit" onClick={() => router.push('/events')}>
              All Events <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-background" />
            )) : events.length ? events.map((event, i) => {
              const eventDate = new Date(event.date);
              return (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-xl p-5 shadow-soft hover:shadow-lift transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="border-teal text-teal">Public</Badge>
                  <div className="text-center bg-green rounded-lg px-3 py-2">
                    <p className="text-yellow font-bold text-sm">{eventDate.toLocaleString("default", { month: "short" })}</p>
                    <p className="text-white text-xs">{eventDate.getDate()}</p>
                  </div>
                </div>
                <h3 className="text-lg font-display font-semibold text-green mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                </div>
              </motion.div>
              );
            }) : <div className="md:col-span-3"><EmptyState title="No events published" description="Public Sanity events will appear here." /></div>}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 lg:py-20 bg-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-4xl font-display font-bold text-white mb-4">
            Ready to Give Your Child the Best Start?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Enroll your child today and join hundreds of happy families who trust Loving Family Daycare with their most precious ones.
          </p>
          <Button
            className="bg-yellow text-green hover:bg-yellow-400 font-semibold rounded-full px-8 py-6 text-base"
            onClick={() => router.push('/register')}
          >
            Start Enrollment <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
