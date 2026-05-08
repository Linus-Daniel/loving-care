type LoadingTableProps = {
  columns?: number;
  rows?: number;
};

export function LoadingTable({ columns = 5, rows = 5 }: LoadingTableProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="grid gap-3 rounded-3xl border border-primary/10 bg-white p-4 shadow-xs"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((__, column) => (
            <div key={column} className="h-4 animate-pulse rounded-full bg-secondary-50" />
          ))}
        </div>
      ))}
    </div>
  );
}
