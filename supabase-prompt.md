"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  X, ZoomIn, Camera, Sparkles, ChevronLeft, ChevronRight,
  Grid3X3, Layers, Heart, Share2, Download
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePublicGallery } from "@/hooks/usePublicContent";

// ─── Scroll Progress ───
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 z-[100] origin-left"
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
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
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
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Particles ───
function FloatingParticles() {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -50, 0, 30, 0],
            x: [0, 20, -20, 10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.5, p.opacity],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
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

// ─── Lightbox Component ───
function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: {
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (dir: number) => void;
}) {
  const [direction, setDirection] = useState(0);
  const currentImage = images[currentIndex];

  const handleNavigate = useCallback((dir: number) => {
    setDirection(dir);
    onNavigate(dir);
  }, [onNavigate]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -400 : 400,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Close button */}
      <MagneticButton
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </MagneticButton>

      {/* Navigation */}
      <MagneticButton
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
        onClick={() => handleNavigate(-1)}
      >
        <ChevronLeft className="w-6 h-6" />
      </MagneticButton>

      <MagneticButton
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
        onClick={() => handleNavigate(1)}
      >
        <ChevronRight className="w-6 h-6" />
      </MagneticButton>

      {/* Image container */}
      <div className="relative z-10 max-w-5xl max-h-[85vh] w-full px-20" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col items-center"
          >
            {currentImage?.imageUrl ? (
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={currentImage.imageUrl}
                  alt={currentImage.caption ?? "Gallery image"}
                  width={1200}
                  height={800}
                  unoptimized
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl"
                />
              </motion.div>
            ) : null}

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white text-lg font-medium mb-2">{currentImage?.caption}</p>
              <div className="flex items-center justify-center gap-4">
                {currentImage?.category ? (
                  <Badge className="bg-white/15 text-white border-white/25 backdrop-blur-sm">
                    {currentImage.category}
                  </Badge>
                ) : null}
                <span className="text-white/50 text-sm">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
        {images.map((img, i) => (
          <motion.button
            key={i}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              i === currentIndex ? "border-emerald-400 scale-110" : "border-transparent opacity-50 hover:opacity-80"
            }`}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              onNavigate(i - currentIndex);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {img.imageUrl ? (
              <Image
                src={img.imageUrl}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Gallery Image Card ───
function GalleryImageCard({
  image,
  index,
  onClick,
  layoutId,
}: {
  image: any;
  index: number;
  onClick: () => void;
  layoutId: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
      className="group relative break-inside-avoid overflow-hidden rounded-2xl cursor-pointer shadow-soft hover:shadow-xl transition-shadow"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {image.imageUrl ? (
        <motion.div
          className="w-full"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <Image
            src={image.imageUrl}
            alt={image.caption ?? "Gallery image"}
            width={520}
            height={520}
            className="w-full object-cover"
            unoptimized
          />
        </motion.div>
      ) : (
        <div className="aspect-square bg-slate-200" />
      )}

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-white" />
            </div>
            <motion.button
              className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                isLiked ? "bg-rose-500/80" : "bg-white/20 hover:bg-white/30"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "text-white fill-current" : "text-white"}`} />
            </motion.button>
          </div>

          <p className="text-white font-medium text-sm mb-1">{image.caption}</p>
          {image.category ? (
            <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
              {image.category}
            </Badge>
          ) : null}
        </motion.div>
      </motion.div>

      {/* Corner accent */}
      <motion.div
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/0 flex items-center justify-center"
        animate={{
          backgroundColor: isHovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0)",
          backdropFilter: isHovered ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: isHovered ? 1 : 0, rotate: isHovered ? 0 : -45 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN GALLERY COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { data: images = [], isLoading } = usePublicGallery();

  const categories = useMemo(() => {
    const unique = new Set(images.map((image) => image.category).filter(Boolean));
    return ["All", ...Array.from(unique)] as string[];
  }, [images]);

  const filtered = filter === "All" ? images : images.filter((image) => image.category === filter);

  const handleNavigate = useCallback((dir: number) => {
    setLightbox((prev) => {
      if (prev === null) return null;
      const next = prev + dir;
      if (next < 0) return filtered.length - 1;
      if (next >= filtered.length) return 0;
      return next;
    });
  }, [filtered.length]);

  // Keyboard navigation
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") handleNavigate(-1);
      if (e.key === "ArrowRight") handleNavigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="overflow-x-hidden">
      <ScrollProgress />

      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden">
        <FloatingParticles />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge className="bg-white/15 text-white border-white/25 mb-6 backdrop-blur-sm px-4 py-1.5 text-sm">
              <Camera className="w-3.5 h-3.5 mr-1.5" />
              Capturing Memories
            </Badge>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
            <TextReveal text="Our Gallery" />
          </h1>

          <motion.p
            className="text-white/70 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Moments of joy, learning, and discovery from our daily adventures together.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            className="flex justify-center gap-8 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {[
              { icon: Camera, value: images.length, label: "Photos" },
              { icon: Layers, value: categories.length - 1, label: "Categories" },
              { icon: Heart, value: "∞", label: "Memories" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-2 text-white/80 mb-1">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-2xl font-display font-bold">{stat.value}</span>
                </div>
                <span className="text-white/50 text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ FILTER & GALLERY ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Filter buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all overflow-hidden ${
                filter === cat
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter === cat && (
                <motion.div
                  className="absolute inset-0 bg-emerald-600"
                  layoutId="activeFilter"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ borderRadius: 9999 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-2xl bg-slate-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
              />
            ))}
          </div>
        ) : filtered.length ? (
          <motion.div layout className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((image, index) => (
                <GalleryImageCard
                  key={image._id ?? image.imageUrl ?? index}
                  image={image}
                  index={index}
                  onClick={() => setLightbox(index)}
                  layoutId={`gallery-${index}`}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyState
              title="No gallery images published"
              description="Add gallery images in Sanity to populate this page."
            />
          </motion.div>
        )}
      </section>

      {/* ═══════ LIGHTBOX ═══════ */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] ? (
          <Lightbox
            images={filtered}
            currentIndex={lightbox}
            onClose={() => setLightbox(null)}
            onNavigate={handleNavigate}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}