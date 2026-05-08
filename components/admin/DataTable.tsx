"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  emptyTitle?: string;
};

export function DataTable<TData extends object>({
  columns,
  data,
  isLoading = false,
  searchable = true,
  exportable = false,
  emptyTitle = "No records found",
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const tableData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function exportCsv() {
    const csv = table
      .getFilteredRowModel()
      .rows.map((row) => JSON.stringify(row.original))
      .join("\n");
    const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export.ndjson";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  if (isLoading) return <LoadingTable columns={columns.length || 5} />;

  return (
    <div className="space-y-3">
      {(searchable || exportable) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Search..."
                className="h-11 rounded-2xl border-primary/10 bg-[#FFF9F0] pl-9"
              />
            </div>
          ) : (
            <span />
          )}
          {exportable ? (
            <Button variant="outline" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          ) : null}
        </div>
      )}

      {table.getRowModel().rows.length === 0 ? (
        <EmptyState title={emptyTitle} description="Try changing your filters or adding a new record." />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-primary/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-primary/10 transition-colors hover:bg-[#FFF9F0]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
