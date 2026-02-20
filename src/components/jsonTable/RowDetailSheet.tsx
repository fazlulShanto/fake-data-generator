import {
  Sheet,
  SheetPopup,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { getCellColorClass } from "./utils";
import type { DataRow } from "./types";

interface RowDetailSheetProps {
  selectedRow: DataRow | null;
  onClose: () => void;
}

export function RowDetailSheet({ selectedRow, onClose }: RowDetailSheetProps) {
  return (
    <Sheet open={!!selectedRow} onOpenChange={(open) => !open && onClose()}>
      <SheetPopup side="right" className="max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-base">Row Details</SheetTitle>
          <SheetDescription>Viewing all fields for the selected row</SheetDescription>
        </SheetHeader>
        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          {selectedRow && (
            <div className="space-y-3">
              {Object.entries(selectedRow).map(([key, value]) => {
                const isObj = value !== null && typeof value === "object";
                const displayValue = isObj
                  ? JSON.stringify(value, null, 2)
                  : value === null || value === undefined
                    ? "null"
                    : String(value);

                return (
                  <div
                    key={key}
                    className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 border-b border-border/40 bg-muted/30">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {key}
                      </span>
                    </div>
                    <div className="px-3 py-2.5">
                      {isObj ? (
                        <pre className="text-xs font-mono text-blue-400 whitespace-pre-wrap break-all">
                          {displayValue}
                        </pre>
                      ) : (
                        <p className={`text-sm font-medium break-all ${getCellColorClass(value)}`}>
                          {displayValue}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetPopup>
    </Sheet>
  );
}
