"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
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
    <div className="space-y-6">
      <PageHeader title="Resources & Downloads" description="Access forms, newsletters, curriculum guides, and policies" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search resources..." className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === category ? "bg-secondary text-green-500" : "bg-muted text-muted-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingTable columns={3} rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No resources found" description="Resources uploaded by the school will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((resource) => (
            <Card key={resource.id} className="shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{resource.name}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">
                      {resource.category}
                    </Badge>
                    <span>{resource.fileType.toUpperCase()}</span>
                    <span>{new Date(resource.createdAt).toLocaleDateString("en-NG")}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={resource.fileUrl} target="_blank" rel="noreferrer" aria-label={`Download ${resource.name}`}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
