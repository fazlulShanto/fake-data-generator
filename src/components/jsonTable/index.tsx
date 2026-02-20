import { useState, useMemo, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { DataRow } from "./types";
import { SAMPLE_DATA, PAGINATION_THRESHOLD, formatCellValue, getCellColorClass } from "./utils";
import { useIndexedDB } from "./useIndexedDB";
import { EmptyState } from "./EmptyState";
import { TableToolbar } from "./TableToolbar";
import { DataTable } from "./DataTable";
import { RowDetailSheet } from "./RowDetailSheet";
import { Pagination } from "./Pagination";

export function JsonTable() {
  // ── Core state ──────────────────────────────────────────────────────────
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDense, setIsDense] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  // ── Fetch state ─────────────────────────────────────────────────────────
  const [curlUrl, setCurlUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Sheet states ────────────────────────────────────────────────────────
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── IndexedDB hook ──────────────────────────────────────────────────────
  const idb = useIndexedDB();

  // ── Parse JSON ──────────────────────────────────────────────────────────
  const parsedData = useMemo<DataRow[]>(() => {
    if (!input.trim()) {
      setError(null);
      return [];
    }
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        setError("JSON must be an array of objects, e.g. [{...}, {...}]");
        return [];
      }
      if (parsed.length === 0) {
        setError(null);
        return [];
      }
      const validItems = parsed.filter(
        (item: unknown) => item !== null && typeof item === "object" && !Array.isArray(item),
      );
      if (validItems.length === 0) {
        setError("Array items must be objects with key-value pairs");
        return [];
      }
      setError(null);
      return validItems;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [input]);

  const hasData = parsedData.length > 0;

  // ── Infer columns ───────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<DataRow>[]>(() => {
    if (parsedData.length === 0) return [];
    const keySet = new Set<string>();
    for (const item of parsedData) {
      for (const key of Object.keys(item)) {
        keySet.add(key);
      }
    }
    return Array.from(keySet).map((key) => ({
      accessorKey: key,
      header: key,
      cell: ({ getValue }: { getValue: () => unknown }) => {
        const value = getValue();
        return <span className={getCellColorClass(value)}>{formatCellValue(value)}</span>;
      },
      filterFn: "includesString" as const,
    }));
  }, [parsedData]);

  // ── Pagination ──────────────────────────────────────────────────────────
  const shouldPaginate = parsedData.length > PAGINATION_THRESHOLD;

  // ── TanStack Table ──────────────────────────────────────────────────────
  const table = useReactTable({
    data: parsedData,
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(shouldPaginate ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    initialState: shouldPaginate ? { pagination: { pageSize: 100 } } : {},
  });

  // ── Input actions ───────────────────────────────────────────────────────
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // clipboard permission denied
    }
  }, []);

  const handleLoadSample = useCallback(() => setInput(SAMPLE_DATA), []);

  const handleClear = useCallback(() => {
    setInput("");
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
    setGlobalFilter("");
  }, []);

  const handleCopyTableData = useCallback(() => {
    const rows = table.getFilteredRowModel().rows;
    const data = rows.map((row) => row.original);
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }, [table]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setInput(event.target?.result as string);
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFetchUrl = useCallback(async () => {
    if (!curlUrl.trim()) return;
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(curlUrl.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const text = await res.text();
      setInput(text);
      setCurlUrl("");
    } catch (e) {
      setFetchError((e as Error).message);
    } finally {
      setIsFetching(false);
    }
  }, [curlUrl]);

  const handleLoadSaved = useCallback((data: string) => setInput(data), []);

  // ── Bundled props ───────────────────────────────────────────────────────
  const inputActions = {
    handlePaste,
    handleLoadSample,
    handleClear,
    handleFileUpload,
    handleFetchUrl,
    handleCopyTableData,
    curlUrl,
    setCurlUrl,
    isFetching,
    fetchError,
    setIsFetching,
    setFetchError,
    setInput,
    fileInputRef,
  };

  const saveActions = {
    ...idb,
    handleSave: () => idb.handleSave(input),
    handleLoadSaved,
    handleDeleteSaved: idb.handleDeleteSaved,
    handleClearAll: idb.handleClearAll,
  };

  const tableState = {
    input,
    setInput,
    error,
    parsedData,
    table,
    globalFilter,
    setGlobalFilter,
    showColumnFilters,
    setShowColumnFilters,
    isDense,
    setIsDense,
    shouldPaginate,
  };

  // ── Hidden file input ───────────────────────────────────────────────────
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".json,.csv,.txt"
      className="hidden"
      onChange={handleFileUpload}
    />
  );

  // ── Empty State ─────────────────────────────────────────────────────────
  if (!hasData && !error) {
    return (
      <TooltipProvider delay={100}>
        {fileInput}
        <EmptyState
          inputActions={inputActions}
          savedEntries={idb.savedEntries}
          onLoadSaved={handleLoadSaved}
          onDeleteSaved={idb.handleDeleteSaved}
          onClearAll={idb.handleClearAll}
          onLoadSample={handleLoadSample}
          error={error}
        />
      </TooltipProvider>
    );
  }

  // ── Data View ───────────────────────────────────────────────────────────
  return (
    <TooltipProvider delay={100}>
      {fileInput}
      <Card className="flex flex-col overflow-hidden h-full">
        <CardHeader className="py-2 px-3 border-b shrink-0">
          <TableToolbar
            tableState={tableState}
            inputActions={inputActions}
            saveActions={saveActions}
            sheetOpen={sheetOpen}
            setSheetOpen={setSheetOpen}
          />
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-auto">
          <DataTable
            table={table}
            columns={columns}
            isDense={isDense}
            showColumnFilters={showColumnFilters}
            onRowClick={setSelectedRow}
          />
        </CardContent>

        {shouldPaginate && <Pagination table={table} />}
      </Card>

      <RowDetailSheet
        selectedRow={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </TooltipProvider>
  );
}