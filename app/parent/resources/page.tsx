"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiGet } from "@/lib/client/api";

type ResourceRecord = {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  category: string;
  createdAt: string;
};

const categories = ["All", "Forms", "Newsletters", "Curriculum", "Policies"];

export default function Resources() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources", filter],
    queryFn: () =>
      apiGet<ResourceRecord[]>("/api/resources", {
        category: filter === "All" ? undefined : filter,
      }).then((res) => res.data ?? []),
  });

  const filtered = resources.filter((resource) => resource.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <Badge className="mb-4 border-0 bg-secondary-100 text-primary hover:bg-secondary-100">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Family Library
            </Badge>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Resources & Downloads</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Access school forms, policies, curriculum notes, newsletters, and shared documents in one place.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Library Summary</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{resources.length}</p>
            <p className="text-sm text-muted-foreground">available resource{resources.length === 1 ? "" : "s"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-primary/10 bg-white p-4 shadow-soft sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="h-12 rounded-2xl border-primary/10 bg-[#FFF9F0] pl-11"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
                  filter === category
                    ? "bg-accent text-white shadow-soft"
                    : "bg-secondary-50 text-primary hover:bg-secondary-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <LoadingTable columns={3} rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No resources found" description="Resources uploaded by the school will appear here." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => (
            <Card key={resource.id} className="group border-primary/10 bg-white shadow-card transition-all hover:-translate-y-1">
              <CardContent className="flex h-full flex-col gap-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent">
                    <FileText className="h-6 w-6" />
                  </span>
                  <Badge variant="outline" className="border-primary/15 text-[10px] text-primary">
                    {resource.category}
                  </Badge>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-display text-lg font-bold text-primary">{resource.name}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-secondary-50 px-2 py-1 font-bold text-primary">
                      {resource.fileType.toUpperCase()}
                    </span>
                    <span>{new Date(resource.createdAt).toLocaleDateString("en-NG")}</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-accent text-white hover:bg-accent-400">
                  <a href={resource.fileUrl} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
