import { flexRender } from "@tanstack/react-table";
import type { Table, ColumnDef } from "@tanstack/react-table";
import {
  Table as UITable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { DataRow } from "./types";

interface DataTableProps {
  table: Table<DataRow>;
  columns: ColumnDef<DataRow>[];
  isDense: boolean;
  showColumnFilters: boolean;
  onRowClick: (row: DataRow) => void;
}

export function DataTable({
  table,
  columns,
  isDense,
  showColumnFilters,
  onRowClick,
}: DataTableProps) {
  return (
    <UITable>
      <TableHeader className="sticky top-0 z-10 bg-card">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className={`${isDense ? "py-1" : "py-1.5"} select-none`}>
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span className="font-mono text-[11px] font-semibold truncate">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </span>
                  <span className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                    {header.column.getIsSorted() === "asc" ? (
                      <ArrowUp className="h-3 w-3 text-primary" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ArrowDown className="h-3 w-3 text-primary" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </span>
                </div>
                {showColumnFilters && (
                  <div className="mt-1">
                    <input
                      type="text"
                      value={(header.column.getFilterValue() as string) ?? ""}
                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                      placeholder="Filter..."
                      className="w-full h-5 px-1.5 text-[10px] bg-muted/50 border border-border rounded outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                    />
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => onRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={`font-mono text-[11px] ${isDense ? "py-0.5 px-2" : "py-1.5 px-2.5"} max-w-75 truncate`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground text-xs">
              No results match your filters
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </UITable>
  );
}
