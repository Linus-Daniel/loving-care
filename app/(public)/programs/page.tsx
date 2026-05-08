"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Baby, BookOpen, CheckCircle, Clock, Sparkles, Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePublicPrograms } from "@/hooks/usePublicContent";

function PulseBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function ProgramsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-soft">
        {Array.from({ length: 4 }).map((_, index) => (
          <PulseBlock key={index} className="h-11 min-w-[120px] flex-1 rounded-xl bg-background/80" />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <PulseBlock className="mb-6 aspect-[4/3] w-full rounded-3xl shadow-card" />
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <PulseBlock className="h-6 w-28 rounded-full" />
            <PulseBlock className="h-6 w-32 rounded-full" />
          </div>
          <PulseBlock className="mb-3 h-8 w-2/3" />
          <div className="mb-6 space-y-2">
            <PulseBlock className="h-4 w-full" />
            <PulseBlock className="h-4 w-5/6" />
          </div>
          <div className="mb-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <PulseBlock className="h-4 w-4 rounded-full" />
                <PulseBlock className="h-4 w-64 max-w-[80%]" />
              </div>
            ))}
          </div>
          <PulseBlock className="h-11 w-48 rounded-full" />
        </div>

        <div>
          <div className="mb-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <PulseBlock className="mb-4 h-6 w-44" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <PulseBlock className="h-2 w-2 rounded-full" />
                  <PulseBlock className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-secondary-50 p-6">
            <PulseBlock className="mb-3 h-6 w-48 bg-background/80" />
            <div className="space-y-2">
              <PulseBlock className="h-4 w-full bg-background/80" />
              <PulseBlock className="h-4 w-11/12 bg-background/80" />
              <PulseBlock className="h-4 w-2/3 bg-background/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Programs() {
  const router = useRouter();
  const { data: programs = [], isLoading } = usePublicPrograms();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!activeTab && programs[0]?._id) setActiveTab(programs[0]._id);
  }, [activeTab, programs]);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0">
          <Image
            src="/images/program-hero.png"
            alt="Children learning through play"
            fill
            className="object-cover object-center opacity-45"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-background/1" />
          <div className="absolute inset-0 bg-primary/5" />
        </div>
        <div className="absolute -left-24 -top-28 h-64 w-80 rounded-[45%_55%_62%_38%/48%_42%_58%_52%] bg-surface/80" />
        <div className="absolute -bottom-32 -left-12 h-72 w-96 rounded-[58%_42%_45%_55%/42%_48%_52%_58%] bg-secondary/75" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <Badge className="mb-5 border-border bg-background/80 px-4 py-1.5 text-primary shadow-sm backdrop-blur-sm">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent" />
              Our Programs
            </Badge>
            <h1 className="mb-5 max-w-3xl font-display text-4xl font-bold leading-tight text-[#2C4D63] sm:text-5xl lg:text-6xl">
              Programs that meet children where they are
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#343A40]">
              Age-appropriate care, play, and learning paths designed to help every child feel safe, confident, and ready to grow.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {isLoading ? (
          <ProgramsPageSkeleton />
        ) : programs.length ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="h-auto w-full flex-wrap gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-soft">
              {programs.map((program) => (
                <TabsTrigger
                  key={program._id ?? program.name}
                  value={program._id ?? program.name}
                  className="min-w-[140px] flex-1 rounded-xl py-3 font-semibold text-muted-foreground data-[state=active]:bg-accent data-[state=active]:text-primary-900 data-[state=active]:shadow-sm"
                >
                  {program.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {programs.map((program) => (
              <TabsContent key={program._id ?? program.name} value={program._id ?? program.name}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]"
                >
                  <div>
                    {program.imageUrl ? (
                      <div className="relative mb-6 overflow-hidden rounded-3xl border border-border shadow-card">
                        <Image
                          src={program.imageUrl}
                          alt={program.name}
                          width={720}
                          height={540}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="mb-6 aspect-[4/3] w-full rounded-3xl border border-border bg-muted shadow-card" />
                    )}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {program.ageRange ? (
                        <Badge className="bg-secondary text-primary">
                          <Users className="mr-1 h-3 w-3" />
                          {program.ageRange}
                        </Badge>
                      ) : null}
                      <Badge variant="outline" className="border-accent/60 bg-accent-50 text-accent-700">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        Active Program
                      </Badge>
                    </div>
                    <h2 className="mb-3 font-display text-3xl font-bold text-primary">{program.name}</h2>
                    <p className="mb-6 text-muted-foreground leading-relaxed">{program.description}</p>
                    <div className="mb-6 grid gap-3 sm:grid-cols-2">
                      {(program.features ?? []).map((feature) => (
                        <div key={feature} className="flex items-start gap-2 rounded-2xl border border-border bg-card p-3 text-sm shadow-sm">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="rounded-full bg-accent px-6 font-semibold text-primary-900 hover:bg-accent-200" onClick={() => router.push("/register")}>
                      Enroll in {program.name} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div>
                    <div className="mb-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
                      <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-primary">
                        <Clock className="h-5 w-5 text-accent" /> Weekly Schedule
                      </h3>
                      <div className="space-y-3">
                        {(program.weeklySchedule ?? []).map((item, index) => (
                          <div key={`${item.day}-${index}`} className="flex items-start gap-3 rounded-2xl bg-background/80 p-3">
                            <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                            <span className="text-sm leading-relaxed text-muted-foreground">
                              {item.day ? <span className="font-bold text-primary">{item.day}: </span> : null}{item.activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-border bg-secondary-50 p-6 shadow-soft">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-accent shadow-sm">
                        <Baby className="h-6 w-6" />
                      </div>
                      <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-primary">
                        <BookOpen className="h-5 w-5 text-accent" /> Curriculum Approach
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Program curriculum notes are managed in Sanity. Update the program description, feature list, and weekly schedule from the CMS.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <EmptyState title="No programs published" description="Create active programs in Sanity to populate this page." />
        )}
      </div>
    </div>
  );
}
