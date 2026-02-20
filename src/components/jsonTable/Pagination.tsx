import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { DataRow } from "./types";

interface PaginationProps {
  table: Table<DataRow>;
}

export function Pagination({ table }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Rows/page</span>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(val) => val && table.setPageSize(Number(val))}
        >
          <SelectTrigger size="sm" className="h-7 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {[25, 50, 100, 500, 1000].map((size) => (
              <SelectItem key={size} value={String(size)}>{size}</SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex items-center gap-0.5">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <ChevronFirst className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <ChevronLast className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
