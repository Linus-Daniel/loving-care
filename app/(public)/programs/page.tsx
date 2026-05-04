"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle, Clock, Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePublicPrograms } from "@/hooks/usePublicContent";

export default function Programs() {
  const router = useRouter();
  const { data: programs = [], isLoading } = usePublicPrograms();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!activeTab && programs[0]?._id) setActiveTab(programs[0]._id);
  }, [activeTab, programs]);

  return (
    <div>
      <div className="bg-green py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-yellow/20 text-yellow border-yellow/30 mb-4">Our Programs</Badge>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-white mb-3">Programs & Curriculum</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Age-appropriate programs published by the school content team.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-xl bg-muted" />
            <div className="h-96 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : programs.length ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-muted p-1 rounded-xl w-full flex flex-wrap h-auto gap-1">
              {programs.map((program) => (
                <TabsTrigger
                  key={program._id ?? program.name}
                  value={program._id ?? program.name}
                  className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-yellow data-[state=active]:text-green py-2.5"
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
                  className="grid lg:grid-cols-2 gap-8"
                >
                  <div>
                    {program.imageUrl ? (
                      <Image
                        src={program.imageUrl}
                        alt={program.name}
                        width={720}
                        height={540}
                        className="rounded-xl shadow-card w-full aspect-[4/3] object-cover mb-6"
                      />
                    ) : (
                      <div className="rounded-xl shadow-card w-full aspect-[4/3] bg-muted mb-6" />
                    )}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {program.ageRange ? <Badge className="bg-teal text-white"><Users className="w-3 h-3 mr-1" />{program.ageRange}</Badge> : null}
                      <Badge variant="outline" className="border-yellow text-yellow"><Star className="w-3 h-3 mr-1" />Active Program</Badge>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-green mb-3">{program.name}</h2>
                    <p className="text-muted-foreground mb-6">{program.description}</p>
                    <div className="space-y-2 mb-6">
                      {(program.features ?? []).map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="bg-yellow text-green hover:bg-yellow-400 font-semibold rounded-full px-6" onClick={() => router.push("/register")}>
                      Enroll in {program.name} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div>
                    <div className="yellow-50 rounded-xl p-6 shadow-soft mb-6">
                      <h3 className="font-display font-semibold text-green mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-teal" /> Weekly Schedule
                      </h3>
                      <div className="space-y-3">
                        {(program.weeklySchedule ?? []).map((item, index) => (
                          <div key={`${item.day}-${index}`} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {item.day ? `${item.day}: ` : ""}{item.activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-green rounded-xl p-6 text-white">
                      <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-yellow" /> Curriculum Approach
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
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
