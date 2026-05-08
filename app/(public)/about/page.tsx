
"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Award, Users, Heart, BookOpen, ArrowRight, CheckCircle, Sparkles,
  Target, Eye, Zap, Shield, Star, MapPin, Phone, Mail, Calendar,
  ChevronRight, Quote, Trophy, GraduationCap, Baby
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { usePublicAbout } from '@/hooks/usePublicContent';
import { EmptyState } from '@/components/shared/EmptyState';

// ─── Scroll Progress ───
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

// ─── Text Reveal ───
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

// ─── Stagger Grid ───
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
        visible: { transition: { staggerChildren: 0.12 } },
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
          opacity: 1, y: 0, scale: 1,
          transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
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

function StaffSkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-soft h-full">
      <PulseBlock className="aspect-square w-full rounded-none" />
      <div className="p-5">
        <PulseBlock className="mb-2 h-5 w-3/4" />
        <PulseBlock className="mb-3 h-4 w-1/2" />
        <div className="space-y-2">
          <PulseBlock className="h-4 w-full" />
          <PulseBlock className="h-4 w-5/6" />
          <PulseBlock className="h-4 w-2/3" />
        </div>
      </div>
    </div>
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
  const handleMouseLeave = useCallback(() => setPosition({ x: 0, y: 0 }), []);
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
    setRotate({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 });
  }, []);
  const handleMouseLeave = useCallback(() => setRotate({ x: 0, y: 0 }), []);
  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Counter ───
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
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(step);
        else setHasBounced(true);
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

// ─── Wave Divider ───
function WaveDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: 80 }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`absolute w-full h-full ${flip ? 'rotate-180' : ''}`}>
        <motion.path
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
          fill="currentColor"
          className="text-primary-50"
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

// ─── Marquee Text ───
function MarqueeText({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden py-4 bg-secondary-50/70 border-y border-primary-100">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1920] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-sm font-medium text-primary-600/60">
            <Sparkles className="w-4 h-4 mr-2" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN ABOUT COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function About() {
  const router = useRouter();
  const { data: staff = [], isLoading: staffLoading } = useStaff();
  const { data: about } = usePublicAbout();

  const fallbackTimeline = [
    { year: '2015', title: 'Founded', desc: 'Loving Family Daycare started with a single classroom and 5 children in Lagos.', icon: Baby },
    { year: '2017', title: 'Expansion', desc: 'Added toddler and preschool programs with dedicated play areas.', icon: Users },
    { year: '2019', title: 'Accreditation', desc: 'Received national accreditation for early childhood education excellence.', icon: Award },
    { year: '2021', title: 'Digital Platform', desc: 'Launched parent portal for real-time updates, attendance, and payments.', icon: Zap },
    { year: '2024', title: '250+ Families', desc: 'Serving over 250 families with a team of 18 qualified educators.', icon: Heart },
  ];

  const fallbackValues = [
    { icon: Heart, title: 'Love & Care', desc: 'Every child deserves to feel loved, safe, and valued every single day.', color: 'from-rose-50 to-pink-50', iconColor: 'text-rose-500', bgColor: 'bg-rose-100' },
    { icon: BookOpen, title: 'Learning Excellence', desc: 'Research-based curriculum designed to foster curiosity and critical thinking.', color: 'from-blue-50 to-indigo-50', iconColor: 'text-blue-500', bgColor: 'bg-blue-100' },
    { icon: Users, title: 'Inclusivity', desc: 'Celebrating diversity and creating an environment where every child belongs.', color: 'from-violet-50 to-purple-50', iconColor: 'text-violet-500', bgColor: 'bg-violet-100' },
    { icon: Award, title: 'Integrity', desc: 'Honest, transparent communication with parents in all we do.', color: 'from-accent-50 to-yellow-50', iconColor: 'text-accent-500', bgColor: 'bg-accent-100' },
  ];

  const iconMap = { heart: Heart, book: BookOpen, users: Users, award: Award };
  const timeline = about?.timeline?.length
    ? about.timeline.map((item) => ({
        year: item.year ?? "",
        title: item.title ?? "",
        desc: item.description ?? "",
        icon: iconMap[(item.icon?.toLowerCase() as keyof typeof iconMap) ?? ""] ?? Star,
      }))
    : fallbackTimeline;

  const values = about?.values?.length
    ? about.values.map((item) => ({
        icon: iconMap[(item.icon?.toLowerCase() as keyof typeof iconMap) ?? ""] ?? Heart,
        title: item.title ?? "",
        desc: item.description ?? "",
        color: 'from-background to-secondary-50',
        iconColor: 'text-primary-500',
        bgColor: 'bg-secondary-100',
      }))
    : fallbackValues;

  const awards = about?.awards?.length
    ? about.awards
    : [
        'National Association of Early Childhood Educators',
        'Ministry of Education Certified',
        'Child Safety Excellence Award 2023',
        'ISO 9001 Quality Management',
      ];

  const quickStats = [
    { value: 250, suffix: '+', label: 'Happy Families', icon: Heart },
    { value: 18, suffix: '', label: 'Qualified Staff', icon: Users },
    { value: 10, suffix: '+', label: 'Years of Care', icon: Calendar },
    { value: 98, suffix: '%', label: 'Parent Satisfaction', icon: Star },
  ];

  return (
    <div className="overflow-x-hidden">
      <ScrollProgress />

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[82vh] overflow-hidden bg-background flex items-center">
        <Image
          src={about?.heroImageUrl ?? "/images/about-hero.png"}
          alt="About Loving Family"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/0" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute -left-20 -top-24 h-64 w-80 rounded-[45%_55%_62%_38%/48%_42%_58%_52%] bg-surface/85" />
        <div className="absolute -bottom-28 -left-16 h-72 w-96 rounded-[58%_42%_45%_55%/42%_48%_52%_58%] bg-secondary/80" />

        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <motion.div
              className="max-w-[580px]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <Badge className="mb-6 border-border bg-background/80 px-4 py-1.5 text-sm text-primary shadow-sm backdrop-blur-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent" />
                Our Story Since 2015
              </Badge>

              <h1 className="mb-6 font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                <span className="block text-[#2C4D63]">A second home</span>
                <span className="block text-[#E28E6B]">for little hearts</span>
                <span className="block text-[#A0AE9A]">and bright minds</span>
              </h1>

              <motion.p
                className="max-w-[500px] text-lg leading-relaxed text-[#343A40] lg:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {about?.heroSubtitle ?? "Our story, mission, and the team behind Loving Family"}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

     
     

      {/* ═══════ QUICK STATS ═══════ */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="py-10 px-4 text-center group">
                  <motion.div
                    className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-secondary-50 flex items-center justify-center group-hover:bg-secondary-100 transition-colors"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20 lg:space-y-32">

        {/* ═══════ MISSION & VISION ═══════ */}
        <section>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-secondary-50/70 px-4 py-1">
                Our Purpose
              </Badge>
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800 mb-4">
              <TextReveal text="What Drives Us" />
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-accent/20 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500" />
              <div className="relative bg-accent-50 rounded-3xl p-8 lg:p-10 text-primary overflow-hidden border border-border shadow-soft">
                <div className="absolute inset-0 bg-primary/5" />

                <motion.div
                  className="relative w-16 h-16 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center mb-6"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Target className="w-8 h-8 text-primary" />
                </motion.div>

                <Badge className="relative bg-background/80 text-primary border-border mb-4 backdrop-blur-sm">
                  Our Mission
                </Badge>

                <h3 className="relative text-2xl lg:text-3xl font-display font-bold mb-4">
                  {about?.missionTitle ?? "Nurturing Tomorrow's Leaders Today"}
                </h3>

                <p className="relative text-muted-foreground text-base leading-relaxed">
                  {about?.missionBody ?? "To provide a safe, loving, and stimulating environment where children can develop socially, emotionally, physically, and intellectually through play-based learning and guided discovery."}
                </p>

                <div className="relative mt-6 flex flex-wrap gap-2">
                  {['Safety First', 'Play-Based', 'Individual Care'].map((tag) => (
                    <span key={tag} className="text-xs bg-background/70 text-primary/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-secondary/30 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500" />
              <div className="relative bg-secondary-50 rounded-3xl p-8 lg:p-10 text-primary overflow-hidden border border-border shadow-soft">
                <div className="absolute inset-0 bg-primary/5" />

                <motion.div
                  className="relative w-16 h-16 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center mb-6"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Eye className="w-8 h-8 text-primary" />
                </motion.div>

                <Badge className="relative bg-background/80 text-primary border-border mb-4 backdrop-blur-sm">
                  Our Vision
                </Badge>

                <h3 className="relative text-2xl lg:text-3xl font-display font-bold mb-4">
                  {about?.visionTitle ?? "The Premier Daycare in Nigeria"}
                </h3>

                <p className="relative text-muted-foreground text-base leading-relaxed">
                  {about?.visionBody ?? "To be the most trusted and sought-after early childhood education institution in Nigeria, recognized for excellence in child development, innovation in education, and unwavering commitment to families."}
                </p>

                <div className="relative mt-6 flex flex-wrap gap-2">
                  {['Excellence', 'Innovation', 'Community'].map((tag) => (
                    <span key={tag} className="text-xs bg-background/70 text-primary/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════ TIMELINE ═══════ */}
        <section>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-secondary-50/70 px-4 py-1">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Our Journey
              </Badge>
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800 mb-4">
              <TextReveal text="Our Story" />
            </h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              From a single classroom to a thriving community — see how we've grown over the years.
            </motion.p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Center line */}
            <motion.div
              className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-surface to-secondary-300 lg:-translate-x-px rounded-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />

            <div className="space-y-12 lg:space-y-16">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                  className={`relative flex items-start gap-6 lg:gap-0 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Desktop content */}
                  <div className={`hidden lg:block lg:w-1/2 ${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                    <TiltCard className={`inline-block ${i % 2 === 0 ? 'lg:ml-auto' : ''}`}>
                      <motion.div
                        className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-500 border border-border max-w-md"
                        whileHover={{ y: -5 }}
                      >
                        <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-background to-secondary-50 flex items-center justify-center">
                            <item.icon className="w-6 h-6 text-primary-600" />
                          </div>
                          <span className="text-primary-600 font-display font-bold text-2xl">{item.year}</span>
                        </div>
                        <h3 className="font-display font-bold text-primary-800 text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </motion.div>
                    </TiltCard>
                  </div>

                  {/* Center dot */}
                  <motion.div
                    className="absolute left-4 lg:left-1/2 w-5 h-5 bg-gradient-to-br from-accent to-secondary-500 rounded-full border-4 border-background shadow-lg z-10 -translate-x-2 mt-2 lg:-translate-x-2.5"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-accent"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Mobile content */}
                  <div className="lg:hidden ml-10 flex-1">
                    <motion.div
                      className="bg-card rounded-2xl p-5 shadow-soft border border-border"
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-background to-secondary-50 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-primary-600 font-display font-bold text-xl">{item.year}</span>
                      </div>
                      <h3 className="font-display font-bold text-primary-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══════ CORE VALUES ═══════ */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary-50/70 to-transparent -z-10 rounded-3xl" />

          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-secondary-50/70 px-4 py-1">
                <Heart className="w-3.5 h-3.5 mr-1" />
                What We Believe
              </Badge>
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800 mb-4">
              <TextReveal text="Our Core Values" />
            </h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              The principles that guide everything we do, every single day.
            </motion.p>
          </div>

          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <TiltCard className="h-full">
                  <motion.div
                    className={`bg-gradient-to-br ${value.color} rounded-2xl p-8 shadow-soft hover:shadow-xl transition-all duration-500 border border-border h-full group`}
                    whileHover={{ y: -8 }}
                  >
                    <motion.div
                      className={`w-16 h-16 rounded-2xl ${value.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <value.icon className={`w-8 h-8 ${value.iconColor}`} />
                    </motion.div>

                    <h3 className="text-xl font-display font-bold text-primary-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {value.desc}
                    </p>

                    <motion.div
                      className="mt-6 flex items-center gap-1 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      Learn more
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>

        {/* ═══════ TEAM ═══════ */}
        <section>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-secondary-50/70 px-4 py-1">
                <Users className="w-3.5 h-3.5 mr-1" />
                Our Team
              </Badge>
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-800 mb-4">
              <TextReveal text="Meet Our Team" />
            </h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Passionate educators dedicated to nurturing your child's growth and development.
            </motion.p>
          </div>

          {staffLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <StaffSkeletonCard key={index} />
              ))}
            </div>
          ) : staff.length ? (
            <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {staff.filter((member) => member.isActive).slice(0, 8).map((member) => (
                <StaggerItem key={member.name}>
                  <motion.div
                    className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 h-full"
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative overflow-hidden">
                      {member.photo ? (
                        <motion.div
                          className="w-full aspect-square"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Image
                            src={member.photo}
                            alt={member.name}
                            width={360}
                            height={360}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-background to-secondary-50 text-4xl font-display font-bold text-primary-400">
                          {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <motion.div
                        className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                      >
                        <div className="flex gap-2">
                          {[member.role, member.class].filter((spec): spec is string => Boolean(spec)).slice(0, 3).map((spec) => (
                            <span key={spec} className="text-xs bg-card/90 text-primary-700 px-2 py-1 rounded-full backdrop-blur-sm">
                              {spec}
                            </span>
                          )) || (
                            <span className="text-xs bg-card/90 text-primary-700 px-2 py-1 rounded-full backdrop-blur-sm">
                              Educator
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display font-bold text-primary-800 text-lg">{member.name}</h3>
                      <p className="text-xs text-secondary-600 font-semibold mb-3 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {member.role}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : (
            <EmptyState title="No staff profiles published" description="Active staff records from the staff API will appear here." />
          )}
        </section>

        {/* ═══════ ACCREDITATIONS ═══════ */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary-50" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-100/50 rounded-full blur-3xl" />

          <div className="relative p-8 lg:p-14">
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4 border-primary-300 text-primary-600 bg-card px-4 py-1">
                  <Trophy className="w-3.5 h-3.5 mr-1" />
                  Recognitions
                </Badge>
              </motion.div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-800 mb-2">
                <TextReveal text="Accreditations & Awards" />
              </h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Trusted and recognized by leading organizations
              </motion.p>
            </div>

            <StaggerGrid className="flex flex-wrap justify-center gap-4">
              {awards.map((award) => (
                <StaggerItem key={award}>
                  <motion.div
                    className="flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-soft hover:shadow-md transition-all border border-border"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-primary-800 font-medium">{award}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* Decorative quote */}
            <motion.div
              className="mt-12 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Quote className="w-8 h-8 text-primary-200 mx-auto mb-4" />
              <p className="text-primary-700 italic text-lg">
                "Excellence in early childhood education isn't just what we do — it's who we are."
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary-50 to-accent-50" />
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute inset-x-0 top-0 h-px bg-border" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-border" />

          <div className="relative p-12 lg:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-background/80 border border-border backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-primary/90 text-sm font-medium">Join 250+ Happy Families</span>
              </motion.div>

              <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary mb-4 leading-tight">
                Ready to Join
                <br />
                <span className="text-accent">Our Family?</span>
              </h2>

              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Take the first step toward giving your child the nurturing, enriching environment they deserve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <MagneticButton
                  className="bg-accent text-primary-900 hover:bg-accent-200 font-bold rounded-full px-10 py-4 text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                  onClick={() => router.push('/register')}
                >
                  Enroll Your Child
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
                    <p className="text-xs text-primary/60">Call us anytime</p>
                    <p className="text-sm font-semibold">(555) 123-4567</p>
                  </div>
                </motion.button>
              </div>

              <motion.div
                className="flex flex-wrap justify-center gap-6 mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {[
                  { icon: Shield, text: "Licensed & Insured" },
                  { icon: Users, text: "Small Class Sizes" },
                  { icon: Heart, text: "Loving Environment" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-primary/60">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

  
    </div>
  );
}
