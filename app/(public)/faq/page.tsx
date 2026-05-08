"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Search } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePublicFaq } from "@/hooks/usePublicContent";

function PulseBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function FaqSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, categoryIndex) => (
        <div key={categoryIndex}>
          <PulseBlock className="mb-4 h-6 w-40" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((__, itemIndex) => (
              <div key={itemIndex} className="secondary-50 rounded-lg px-4 py-4 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <PulseBlock className="h-4 w-4/5" />
                  <PulseBlock className="h-4 w-4 shrink-0 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FAQ() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data: faqItems = [], isLoading } = usePublicFaq();

  const grouped = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    const matching = faqItems.filter((item) =>
      item.question.toLowerCase().includes(normalizedSearch) ||
      item.answer.toLowerCase().includes(normalizedSearch),
    );

    return matching.reduce<Record<string, typeof faqItems>>((acc, item) => {
      const category = item.category || "General";
      acc[category] = [...(acc[category] ?? []), item];
      return acc;
    }, {});
  }, [faqItems, search]);

  const categories = Object.entries(grouped);

  return (
    <div>
      <div className="bg-green-500 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">FAQ</Badge>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Find answers from the school FAQ content managed in Sanity.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            className="pl-12 py-6 text-base"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isLoading ? (
          <FaqSkeleton />
        ) : categories.length ? (
          <div className="space-y-8">
            {categories.map(([category, items]) => (
              <div key={category}>
                <h2 className="text-lg font-display font-semibold text-green-500 mb-4">{category}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {items.map((item) => (
                    <AccordionItem key={item._id} value={item._id} className="secondary-50 rounded-lg px-4 shadow-soft border-none">
                      <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={search ? `No results for "${search}"` : "No FAQs published"}
            description={search ? "Try a different search term." : "Add FAQ items in Sanity to populate this page."}
            action={search ? <Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button> : undefined}
          />
        )}

        <div className="mt-12 bg-teal rounded-xl p-8 text-white text-center">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 text-secondary" />
          <h3 className="text-xl font-display font-bold mb-2">Still Have Questions?</h3>
          <p className="text-white/80 text-sm mb-4">Our team is happy to help with any other inquiries you may have.</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent-400 font-semibold" onClick={() => router.push("/contact")}>
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
