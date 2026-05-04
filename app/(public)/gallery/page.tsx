"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePublicGallery } from "@/hooks/usePublicContent";

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { data: images = [], isLoading } = usePublicGallery();

  const categories = useMemo(() => {
    const unique = new Set(images.map((image) => image.category).filter(Boolean));
    return ["All", ...Array.from(unique)] as string[];
  }, [images]);

  const filtered = filter === "All" ? images : images.filter((image) => image.category === filter);

  return (
    <div>
      <div className="bg-green py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-yellow/20 text-yellow border-yellow/30 mb-4">Gallery</Badge>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-white mb-3">Our Gallery</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Moments of joy, learning, and discovery from Sanity gallery content.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat ? "bg-yellow text-green" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-square animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length ? (
          <motion.div layout className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
            <AnimatePresence>
              {filtered.map((image, index) => (
                <motion.div
                  key={image._id ?? image.imageUrl ?? index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => setLightbox(index)}
                >
                  {image.imageUrl ? (
                    <Image
                      src={image.imageUrl}
                      alt={image.caption ?? "Gallery image"}
                      width={520}
                      height={520}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="aspect-square bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-green/0 group-hover:bg-green/50 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center text-white p-4">
                      <ZoomIn className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">{image.caption}</p>
                      {image.category ? <Badge className="mt-2 bg-yellow/80 text-green text-xs">{image.category}</Badge> : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState title="No gallery images published" description="Add gallery images in Sanity to populate this page." />
        )}
      </div>

      {lightbox !== null && filtered[lightbox] ? (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button
            className="absolute top-4 right-4 p-2 rounded-full yellow-50/10 hover:yellow-50/20 text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[90vh]" onClick={(event) => event.stopPropagation()}>
            {filtered[lightbox].imageUrl ? (
              <Image
                src={filtered[lightbox].imageUrl}
                alt={filtered[lightbox].caption ?? "Gallery image"}
                width={1100}
                height={800}
                unoptimized
                className="max-w-full max-h-[80vh] rounded-xl object-contain"
              />
            ) : null}
            <p className="text-white text-center mt-3 font-medium">{filtered[lightbox].caption}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
