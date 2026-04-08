"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

// shadcn/ui imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Column<T> = {
  title: string;
  key: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string | number;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  emptyMessage?: string;
  showRowNumbers?: boolean;
  onRowClick?: (row: T) => void;
};

export default function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  onSort,
  sortKey,
  sortDirection = "asc",
  emptyMessage = "No data available",
  showRowNumbers = false,
  onRowClick,
}: Props<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, newDirection);
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {showRowNumbers && <TableHead className="w-12">#</TableHead>}
              {columns.map((col) => (
                <TableHead key={col.key} style={{ width: col.width }}>
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                {showRowNumbers && (
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {showRowNumbers && <TableHead className="w-12">#</TableHead>}
              {columns.map((col) => (
                <TableHead key={col.key} style={{ width: col.width }}>
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length + (showRowNumbers ? 1 : 0)}
                className="h-32 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {showRowNumbers && (
                <TableHead className="w-12 text-center">#</TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div
                    className={`flex items-center gap-1 ${col.className || ""}`}
                  >
                    {col.title}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={(row as any).id || index}
                className={`
                  transition-colors
                  ${onRowClick ? "cursor-pointer hover:bg-muted/50" : "hover:bg-muted/30"}
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {showRowNumbers && (
                  <TableCell className="text-center text-muted-foreground">
                    {index + 1}
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} className="py-3">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
