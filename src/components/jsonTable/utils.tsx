import {
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
} from "@/components/ui/tooltip";

// ── Sample data ───────────────────────────────────────────────────────────
export const SAMPLE_DATA = JSON.stringify(
  [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 29, city: "New York", role: "Engineer", active: true, salary: 95000 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", age: 34, city: "San Francisco", role: "Designer", active: true, salary: 88000 },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", age: 27, city: "Chicago", role: "Engineer", active: false, salary: 78000 },
    { id: 4, name: "Diana Prince", email: "diana@example.com", age: 31, city: "Austin", role: "Manager", active: true, salary: 105000 },
    { id: 5, name: "Eve Williams", email: "eve@example.com", age: 26, city: "Seattle", role: "Engineer", active: true, salary: 92000 },
  ],
  null,
  2,
);

export const PAGINATION_THRESHOLD = 1000;

// ── Cell formatting helpers ───────────────────────────────────────────────
export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function getCellColorClass(value: unknown): string {
  if (value === null || value === undefined) return "text-muted-foreground";
  if (typeof value === "boolean") return value ? "text-emerald-500" : "text-orange-400";
  if (typeof value === "number") return "text-blue-400";
  return "";
}

// ── Tooltip wrapper for faster show ───────────────────────────────────────
export function QuickTooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Tooltip delay={100}>
      <TooltipTrigger render={children as React.ReactElement} />
      <TooltipPopup>{label}</TooltipPopup>
    </Tooltip>
  );
}
