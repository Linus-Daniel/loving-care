"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Shield, GraduationCap, Heart, Star, ArrowRight, Calendar, MapPin,
  ChevronLeft, ChevronRight, Sparkles, Play, Users, Clock, BookOpen,
  Smile, Baby, TreePine, Music, Palette, Dumbbell, Utensils, Camera,
  Phone, CheckCircle2, Bell, Sun, Zap, Waves, Leaf, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePublicHomeContent } from '@/hooks/usePublicContent';

type Testimonial = {
  rating?: number;
  quote?: string;
  avatarUrl?: string | null;
  parentName?: string | null;
};

type GalleryImage = {
  imageUrl?: string | null;
  caption?: string | null;
};

type EventItem = {
  date: string | number | Date;
  category?: string | null;
  title: string;
  time?: string | null;
  location?: string | null;
  description?: string | null;
};

// ─── Animated Counter with Bounce ───
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasBounced, setHasBounced] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setCount(Math.floor(eased * end));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setHasBounced(true);
        }
      };
      requestAnimationFrame(step);
    }
  }, [inView, end]);

  return (
    <span ref={ref} className="tabular-nums inline-block">
      <motion.span
        animate={hasBounced ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="inline-block"
      >
        {count}{suffix}
      </motion.span>
    </span>
  );
}

// ─── Scroll Progress Indicator ───
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-surface to-secondary-400 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}

// ─── Staggered Text Reveal ───
function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Magnetic Button ───
function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}

// ─── 3D Tilt Card ───
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotate({
      x: (y - 0.5) * -10,
      y: (x - 0.5) * 10,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Marquee Text ───
function MarqueeText({ items }: { items: { text: string; icon: any }[] }) {
  return (
    <div className="overflow-hidden py-4 bg-secondary-50 border-y border-border group/marquee cursor-default">
      <motion.div
        className="flex whitespace-nowrap w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        whileHover={{ animationPlayState: "paused" }}
      >
        <div className="flex shrink-0">
          {[...items, ...items].map((item, i) => (
            <span key={`m1-${i}`} className="inline-flex items-center mx-8 text-sm font-medium text-primary/70">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: i * 0.1 
                }}
                className="mr-2 text-accent"
              >
                <item.icon className="w-4 h-4" />
              </motion.div>
              {item.text}
            </span>
          ))}
        </div>
        <div className="flex shrink-0">
          {[...items, ...items].map((item, i) => (
            <span key={`m2-${i}`} className="inline-flex items-center mx-8 text-sm font-medium text-primary/70">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: i * 0.1 
                }}
                className="mr-2 text-accent"
              >
                <item.icon className="w-4 h-4" />
              </motion.div>
              {item.text}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Wave Divider ───
function WaveDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: 80 }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`absolute w-full h-full ${flip ? 'rotate-180' : ''}`}
      >
        <motion.path
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
          fill="currentColor"
          className="text-background"
          initial={{ d: "M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" }}
          animate={{
            d: [
              "M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z",
              "M0,40 C360,0 720,80 1080,40 C1260,20 1380,30 1440,40 L1440,80 L0,80 Z",
              "M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// ─── Staggered Grid Animation ───
function StaggerGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            ease: [0.215, 0.61, 0.355, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function PulseBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function WhyUsSkeletonCard() {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-soft border border-border h-full">
      <PulseBlock className="mb-6 h-16 w-16 rounded-2xl" />
      <PulseBlock className="mb-3 h-6 w-3/4" />
      <div className="space-y-2">
        <PulseBlock className="h-4 w-full" />
        <PulseBlock className="h-4 w-11/12" />
        <PulseBlock className="h-4 w-2/3" />
      </div>
      <PulseBlock className="mt-6 h-4 w-24" />
    </div>
  );
}

function ProgramSkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-soft h-full border border-border">
      <div className="relative aspect-[4/3] bg-muted animate-pulse">
        <PulseBlock className="absolute left-4 top-4 h-6 w-28 rounded-full bg-white/70" />
      </div>
      <div className="p-6">
        <PulseBlock className="mb-3 h-6 w-2/3" />
        <div className="mb-5 space-y-2">
          <PulseBlock className="h-4 w-full" />
          <PulseBlock className="h-4 w-4/5" />
        </div>
        <PulseBlock className="h-4 w-28" />
      </div>
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="relative h-[400px]">
        <div className="absolute inset-0 bg-card rounded-3xl p-8 lg:p-12 text-center shadow-xl border border-primary-100/50">
          <div className="mb-6 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <PulseBlock key={index} className="h-6 w-6 rounded-full" />
            ))}
          </div>
          <div className="mx-auto mb-8 max-w-2xl space-y-3">
            <PulseBlock className="h-5 w-full" />
            <PulseBlock className="h-5 w-11/12 mx-auto" />
            <PulseBlock className="h-5 w-2/3 mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <PulseBlock className="h-14 w-14 rounded-full" />
            <div className="space-y-2 text-left">
              <PulseBlock className="h-4 w-36" />
              <PulseBlock className="h-3 w-44" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center gap-4">
        <PulseBlock className="h-11 w-11 rounded-full" />
        <div className="flex gap-2">
          <PulseBlock className="h-2 w-8 rounded-full" />
          <PulseBlock className="h-2 w-2 rounded-full" />
          <PulseBlock className="h-2 w-2 rounded-full" />
        </div>
        <PulseBlock className="h-11 w-11 rounded-full" />
      </div>
    </div>
  );
}

function GalleryMasonrySkeleton() {
  const getSpan = (i: number) => {
    if (i === 0) return "md:row-span-2 md:col-span-1";
    if (i === 3) return "md:row-span-2 md:col-span-1";
    if (i === 4) return "md:col-span-2";
    return "";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className={`relative overflow-hidden rounded-2xl bg-muted animate-pulse ${getSpan(i)}`}>
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="h-4 w-2/3 rounded bg-white/40" />
            <div className="h-3 w-1/2 rounded bg-white/30" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EventSkeletonCard() {
  return (
    <div className="relative bg-card rounded-2xl overflow-hidden shadow-soft border border-border">
      <div className="p-6 pl-7">
        <div className="mb-4 flex items-start justify-between">
          <PulseBlock className="h-7 w-20 rounded-full" />
          <PulseBlock className="h-[60px] w-[68px] rounded-xl" />
        </div>
        <PulseBlock className="mb-3 h-6 w-3/4" />
        <div className="flex flex-wrap items-center gap-4">
          <PulseBlock className="h-7 w-24 rounded-md" />
          <PulseBlock className="h-7 w-28 rounded-md" />
        </div>
        <div className="mt-4 border-t border-border pt-4 space-y-2">
          <PulseBlock className="h-4 w-full" />
          <PulseBlock className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

// ─── Testimonial Carousel with 3D Stack ───
function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const navigate = useCallback((dir: number) => {
    setIsAutoPlaying(false);
    setIdx((i) => {
      const next = i + dir;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  const getPosition = (index: number) => {
    const diff = (index - idx + testimonials.length) % testimonials.length;
    if (diff === 0) return "center";
    if (diff === 1 || (testimonials.length === 2 && diff === 1)) return "right";
    if (diff === testimonials.length - 1) return "left";
    return "hidden";
  };

  const variants = {
    center: {
      x: "0%",
      y: 0,
      scale: 1,
      zIndex: 20,
      opacity: 1,
      rotateY: 0,
      filter: "blur(0px)",
    },
    left: {
      x: "-45%",
      y: 0,
      scale: 0.8,
      zIndex: 10,
      opacity: 0.5,
      rotateY: 25,
      filter: "blur(2px)",
    },
    right: {
      x: "45%",
      y: 0,
      scale: 0.8,
      zIndex: 10,
      opacity: 0.5,
      rotateY: -25,
      filter: "blur(2px)",
    },
    hidden: {
      x: "0%",
      y: 0,
      scale: 0.5,
      zIndex: 0,
      opacity: 0,
      rotateY: 0,
      filter: "blur(10px)",
    }
  };

  return (
    <div
      className="relative max-w-7xl mx-auto px-4"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative h-[450px] lg:h-[500px] flex items-center justify-center perspective-[1500px] overflow-hidden py-10">
        <AnimatePresence initial={false}>
          {testimonials.map((testimonial, i) => {
            const position = getPosition(i);
            if (position === "hidden" && testimonials.length > 3) return null;

            return (
              <motion.div
                key={i}
                initial="hidden"
                animate={{
                  ...variants[position],
                  y: position === "center" ? [0, -10, 0] : variants[position].y
                }}
                exit="hidden"
                variants={variants}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.32, 0.72, 0, 1],
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }
                }}
                className="absolute w-full max-w-[450px] aspect-[4/5] lg:aspect-[5/4] h-auto bg-card rounded-[2.5rem] p-8 lg:p-10 text-center shadow-2xl border border-primary-100/50 flex flex-col justify-between"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex justify-center mb-6">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star 
                        key={s} 
                        className={`w-5 h-5 ${s < (testimonial.rating ?? 5) ? 'text-accent fill-accent' : 'text-primary-100'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-foreground text-base lg:text-lg mb-6 italic leading-relaxed line-clamp-6">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {testimonial.avatarUrl ? (
                      <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.parentName ?? "Parent"}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-50"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary-100 ring-4 ring-primary-50 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary-400" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-primary-800 font-bold text-base">{testimonial.parentName}</p>
                    <p className="text-primary-500/60 text-xs uppercase tracking-wider font-semibold">Verified Parent</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-6 mt-8">
        <MagneticButton
          className="p-4 rounded-full bg-white shadow-md hover:shadow-lg text-primary-600 transition-all border border-border"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-6 h-6" />
        </MagneticButton>

        <div className="flex gap-2.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setIdx(i);
              }}
              className={`transition-all duration-500 rounded-full ${
                i === idx
                  ? "w-10 h-2.5 bg-accent"
                  : "w-2.5 h-2.5 bg-primary-200 hover:bg-primary-300"
              }`}
            />
          ))}
        </div>

        <MagneticButton
          className="p-4 rounded-full bg-white shadow-md hover:shadow-lg text-primary-600 transition-all border border-border"
          onClick={() => navigate(1)}
        >
          <ChevronRight className="w-6 h-6" />
        </MagneticButton>
      </div>
    </div>
  );
}

// ─── Gallery Masonry with Lightbox Preview ───
function GalleryMasonry({ images }: { images: GalleryImage[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getSpan = (i: number) => {
    if (i === 0) return "md:row-span-2 md:col-span-1";
    if (i === 3) return "md:row-span-2 md:col-span-1";
    if (i === 4) return "md:col-span-2";
    return "";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
      {images.slice(0, 7).map((img, i) => (
        <motion.div
          key={`${img.imageUrl}-${i}`}
          className={`group relative overflow-hidden rounded-2xl cursor-pointer ${getSpan(i)}`}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              scale: hoveredIdx === i ? 1.1 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          >
            <Image
              src={img.imageUrl ?? ""}
              alt={img.caption ?? `Daycare moment ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-primary-900/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredIdx === i ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hoveredIdx === i ? 1 : 0,
              y: hoveredIdx === i ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white font-medium text-sm">{img.caption ?? `Moment ${i + 1}`}</p>
            <div className="flex items-center gap-2 mt-1">
              <Camera className="w-3 h-3 text-white/70" />
              <span className="text-white/70 text-xs">Loving Family Daycare</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: hoveredIdx === i ? 1 : 0,
              scale: hoveredIdx === i ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4 text-white -rotate-45" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Event Card with Hover Expand ───
function EventCard({ event, index }: { event: EventItem; index: number }) {
  const eventDate = new Date(event.date);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 border border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-200 to-secondary-500 transform origin-top transition-transform duration-500 group-hover:scale-y-100 scale-y-0" />

      <div className="p-6 pl-7">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="outline" className="border-primary-300 text-primary-600 bg-primary-50/50">
              {event.category ?? "Public"}
            </Badge>
          </motion.div>

          <motion.div
            className="text-center bg-gradient-to-br from-accent-100 via-accent-200 to-secondary-500 rounded-xl px-4 py-2 shadow-lg"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white font-bold text-sm uppercase tracking-wider">
              {eventDate.toLocaleString("default", { month: "short" })}
            </p>
            <p className="text-white text-xl font-display font-bold">{eventDate.getDate()}</p>
          </motion.div>
        </div>

        <motion.h3
          className="text-lg font-display font-bold text-primary-800 mb-3 group-hover:text-primary-600 transition-colors"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {event.title}
        </motion.h3>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-background px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-primary-500" />
            {event.time}
          </span>
          <span className="flex items-center gap-1.5 bg-background px-2 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            {event.location}
          </span>
        </div>

        <motion.div
          className="mt-4 pt-4 border-t border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description ?? "Join us for this wonderful event! We look forward to seeing you and your little ones there."}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── CTA Section with Animated Background ───
function CTASection({ onEnroll }: { onEnroll: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-secondary-50 to-accent-50"
        style={{ y: backgroundY }}
      />
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
       
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary mb-6 leading-tight">
            Ready to Give Your Child
            <br />
            <span className="text-accent">the Best Start?</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Enroll your child today and join hundreds of happy families who trust
            Loving Family Daycare with their most precious ones. Every child deserves
            a nurturing beginning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MagneticButton
              className="bg-accent text-primary-900 hover:bg-accent-200 font-bold rounded-full px-10 py-4 text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              onClick={onEnroll}
            >
              Start Enrollment
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </MagneticButton>

            <motion.button
              className="flex items-center gap-2 text-primary/80 hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-full bg-card/80 border border-border backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Call us anytime</p>
                <p className="text-sm font-semibold">(555) 123-4567</p>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            { icon: Shield, text: "Licensed & Insured" },
            { icon: Users, text: "Small Class Sizes" },
            { icon: Heart, text: "Loving Environment" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-primary/70">
              <item.icon className="w-4 h-4 text-accent" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN HOME COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const router = useRouter();
  const { data: content, isLoading } = usePublicHomeContent();

  const stats = [
    { value: 200, suffix: '+', label: 'Happy Families', icon: Heart },
    { value: 10, suffix: '+', label: 'Years Experience', icon: Clock },
    { value: 30, suffix: '+', label: 'Qualified Staff', icon: Users },
    { value: 6, suffix: '', label: 'Programs Offered', icon: BookOpen },
  ];

  const iconMap = {
    shield: Shield,
    graduation: GraduationCap,
    heart: Heart,
    star: Star,
    smile: Smile,
    baby: Baby,
    tree: TreePine,
    music: Music,
    palette: Palette,
    dumbbell: Dumbbell,
    utensils: Utensils,
  };

  const heroSubtext = "We’re more than a daycare—we’re a second home where children feel safe, loved, and inspired to grow every day.";
  const features = (content?.home?.whyUsItems ?? []).slice(0, 3);
  const programs = content?.programs ?? [];
  const testimonials = content?.home?.testimonials ?? [];
  const gallery = (content?.gallery ?? []).filter((image) => image.imageUrl);
  const events = content?.events ?? [];

  return (
    <div className="space-y-0 overflow-x-hidden">
      <ScrollProgress />

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative min-h-[88vh] overflow-hidden bg-background flex items-center">
        <Image
          src="/images/hero-bg.png"
          alt="Teacher helping children play and learn at Loving Family Daycare"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/72 to-background/0" />
        <div className="absolute inset-y-0 left-0 w-[54%] bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute -left-20 -top-24 h-64 w-80 rounded-[45%_55%_62%_38%/48%_42%_58%_52%] bg-surface/85" />
        <div className="absolute -bottom-28 -left-16 h-72 w-96 rounded-[58%_42%_45%_55%/42%_48%_52%_58%] bg-secondary/85" />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <motion.div
              className="max-w-[560px]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <Badge className="bg-background/80 text-primary border-border mb-6 backdrop-blur-sm px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent" />
                Nurturing Young Minds Since 2015
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.08] mb-6 max-w-xl">
                <span className="block text-[#2C4D63]">Nurturing Little</span>
                <span className="block text-[#2C4D63]">Minds, <span className="text-[#E28E6B]">Creating</span></span>
                <span className="block text-[#A0AE9A]">Bright Futures</span>
              </h1>

              <motion.p
                className="text-[#343A40] text-lg lg:text-xl mb-8 max-w-[470px] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {heroSubtext}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <MagneticButton
                  className="bg-accent text-primary-900 hover:bg-primary-600 hover:text-white font-bold rounded-full px-8 py-4 text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  onClick={() => router.push('/register')}
                >
                  Enroll Now
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>

                <motion.button
                  className="flex items-center gap-3 text-primary hover:text-accent transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/programs')}
                >
                  <div className="w-12 h-12 rounded-full bg-card/80 border border-border backdrop-blur-sm flex items-center justify-center group-hover:bg-secondary-100 transition-colors shadow-sm">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <span className="font-medium">Explore Programs</span>
                </motion.button>
              </motion.div>

              <motion.div
                className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {[
                  { icon: Heart, label: "4.9/5 parent rating" },
                  { icon: Shield, label: "Safe daily care" },
                  { icon: Users, label: "Small groups" },
                  { icon: BookOpen, label: "Play-based learning" },
                ].map((item) => (
                  <div key={item.label} className="border rounded-sm border-border bg-background/75 px-4 py-3 text-primary shadow-sm backdrop-blur-sm">
                    <item.icon className="mb-2 h-5 w-5 text-accent" />
                    <p className="text-sm font-medium leading-snug">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-primary/50 text-xs">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-primary/25 flex justify-center pt-2 bg-background/40 backdrop-blur-sm"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent/70"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee */}
      <MarqueeText items={[
        { text: "Nurturing Environment", icon: Heart },
        { text: "Qualified Educators", icon: GraduationCap },
        { text: "Safe & Secure", icon: Shield },
        { text: "Play-Based Learning", icon: Baby },
        { text: "Small Class Sizes", icon: Users },
        { text: "Healthy Meals", icon: Utensils },
        { text: "Outdoor Activities", icon: TreePine },
        { text: "Creative Arts", icon: Palette },
        { text: "STEM for Kids", icon: Zap },
        { text: "Parent Updates Daily", icon: Bell },
      ]} />

      {/* ═══════ STATS BAR ═══════ */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="py-10 px-4 text-center group">
                  <motion.div
                    className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-7 h-7 text-primary-600" />
                  </motion.div>
                  <p className="text-4xl lg:text-5xl font-display font-bold text-primary-600 mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US ═══════ */}
      <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-primary-50/50 px-4 py-1">
                Why Choose Us
              </Badge>
            </motion.div>

            <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800 mb-4">
              <TextReveal text="Building Bright Futures Together" />
            </h2>

            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              We provide a nurturing environment where children feel safe, loved, and inspired to learn through play and discovery.
            </motion.p>
          </div>

          <StaggerGrid className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <StaggerItem key={i}>
                  <WhyUsSkeletonCard />
                </StaggerItem>
              ))
            ) : features.length ? (
              features.map((feature) => {
                const Icon = iconMap[(feature.icon?.toLowerCase() as keyof typeof iconMap) ?? ""] ?? Shield;
                return (
                  <StaggerItem key={feature.title}>
                    <TiltCard className="h-full">
                      <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-xl transition-all duration-500 border border-border h-full group">
                        <motion.div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center mb-6 group-hover:from-primary-100 group-hover:to-secondary-100 transition-all"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          <Icon className="w-8 h-8 text-primary-600" />
                        </motion.div>
                        <h3 className="text-xl font-display font-bold text-primary-800 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>

                        <motion.div
                          className="mt-6 flex items-center gap-2 text-primary-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          Learn more
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </TiltCard>
                  </StaggerItem>
                );
              })
            ) : (
              <div className="md:col-span-3">
                <EmptyState title="No feature cards published" description="Add Why Us items in Sanity to fill this section." />
              </div>
            )}
          </StaggerGrid>
        </div>
      </section>

      <WaveDivider />

      {/* ═══════ PROGRAMS ═══════ */}
      <section className="py-20 lg:py-28 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-card">
                Our Programs
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800">
                Programs for Every Age
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Button
                variant="outline"
                className="border-primary-500 text-primary-600 hover:bg-accent hover:border-accent hover:text-primary-900 w-fit rounded-full px-6"
                onClick={() => router.push('/programs')}
              >
                View All Programs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          <StaggerGrid className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <StaggerItem key={i}>
                  <ProgramSkeletonCard />
                </StaggerItem>
              ))
            ) : programs.length ? (
              programs.map((program) => (
                <StaggerItem key={program.name}>
                  <motion.div
                    className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 h-full border border-border"
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative overflow-hidden">
                      {program.imageUrl ? (
                        <motion.div
                          className="w-full aspect-[4/3]"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Image
                            src={program.imageUrl}
                            alt={program.name}
                            width={480}
                            height={360}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full aspect-[4/3] bg-muted" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {program.ageRange && (
                        <Badge className="absolute top-4 left-4 bg-white/90 text-primary-700 backdrop-blur-sm shadow-md">
                          <Baby className="w-3 h-3 mr-1" />
                          {program.ageRange}
                        </Badge>
                      )}

                      <motion.div
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowRight className="w-5 h-5 text-primary-600" />
                      </motion.div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold text-primary-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {program.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {program.description}
                      </p>
                      <Link
                        href="/programs"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1 group/link"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))
            ) : (
              <div className="md:col-span-3">
                <EmptyState title="No programs published" description="Active Sanity programs will appear here." />
              </div>
            )}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-accent-100 text-accent-700 border-accent-200 mb-4 px-4 py-1">
                <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                Testimonials
              </Badge>
            </motion.div>

            <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800 mb-4">
              <TextReveal text="What Parents Say" />
            </h2>
          </div>

          {isLoading ? <TestimonialSkeleton /> : <TestimonialCarousel testimonials={testimonials} />}
        </div>
      </section>

      <WaveDivider flip />

      {/* ═══════ GALLERY ═══════ */}
      <section className="py-20 lg:py-28 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-card">
                <Camera className="w-3.5 h-3.5 mr-1" />
                Gallery
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800">
                Moments That Matter
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Button
                variant="outline"
                className="border-primary-500 text-primary-600 hover:bg-accent hover:border-accent hover:text-primary-900 w-fit rounded-full px-6"
                onClick={() => router.push('/gallery')}
              >
                View Gallery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          {isLoading ? (
            <GalleryMasonrySkeleton />
          ) : gallery.length ? (
            <GalleryMasonry images={gallery} />
          ) : (
            <EmptyState title="No gallery images published" description="Sanity gallery images will appear here." />
          )}
        </div>
      </section>

      {/* ═══════ EVENTS ═══════ */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-primary-50/50">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Upcoming
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800">
                Events & Activities
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Button
                variant="outline"
                className="border-primary-500 text-primary-600 hover:bg-accent hover:border-accent hover:text-primary-900 w-fit rounded-full px-6"
                onClick={() => router.push('/events')}
              >
                All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <EventSkeletonCard key={i} />
              ))
            ) : events.length ? (
              events.map((event, i) => (
                <EventCard key={event.title} event={event} index={i} />
              ))
            ) : (
              <div className="md:col-span-3">
                <EmptyState title="No events published" description="Public Sanity events will appear here." />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <CTASection onEnroll={() => router.push('/register')} />

    
    </div>
  );
}
