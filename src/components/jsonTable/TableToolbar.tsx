import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetTrigger,
  SheetPopup,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { JsonTableState, InputActions, SaveActions } from "./types";
import { QuickTooltip } from "./utils";
import {
  Search,
  ListFilter,
  Columns3,
  Rows3,
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Save,
  FolderOpen,
  Trash2,
  Upload,
  FileUp,
  Database,
  Globe,
  TableProperties,
  X,
  ListTodo,
} from "lucide-react";

interface TableToolbarProps {
  tableState: JsonTableState;
  inputActions: InputActions;
  saveActions: SaveActions;
  sheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
}

export function TableToolbar({
  tableState,
  inputActions,
  saveActions,
  sheetOpen,
  setSheetOpen,
}: TableToolbarProps) {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    showColumnFilters,
    setShowColumnFilters,
    isDense,
    setIsDense,
    shouldPaginate,
    input,
    error,
  } = tableState;

  const {
    handlePaste,
    handleLoadSample,
    handleClear,
    handleCopyTableData,
    handleFetchUrl,
    curlUrl,
    setCurlUrl,
    isFetching,
    fetchError,
    fileInputRef,
  } = inputActions;

  const {
    savedEntries,
    showSaveDialog,
    setShowSaveDialog,
    saveName,
    setSaveName,
    saveSuccess,
    handleSave,
    handleLoadSaved,
    handleDeleteSaved,
    handleClearAll,
  } = saveActions;

  const totalRows = tableState.parsedData.length;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const visibleColumns = table.getVisibleLeafColumns().length;
  const totalColumns = table.getAllLeafColumns().length;

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Left: Title + stats */}
      <div className="text-sm flex items-center gap-2 font-semibold">
        <TableProperties className="h-4 w-4 text-muted-foreground" />
        Table View
        <Badge variant="secondary" size="sm">
          {totalRows.toLocaleString()} rows
        </Badge>
        <Badge variant="secondary" size="sm">
          {totalColumns} cols
        </Badge>
        {filteredRows !== totalRows && (
          <Badge variant="outline" size="sm">
            {filteredRows.toLocaleString()} filtered
          </Badge>
        )}
        {shouldPaginate && <Badge variant="info" size="sm">Paginated</Badge>}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="pl-7 h-7 w-44 text-xs"
          />
        </div>

        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Column Filters Toggle */}
        <QuickTooltip label="Column filters">
          <Button
            variant={showColumnFilters ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowColumnFilters(!showColumnFilters)}
          >
            <ListFilter className="h-3 w-3" />
          </Button>
        </QuickTooltip>

        {/* Column Visibility */}
        <ColumnVisibilityPopover
          table={table}
          visibleColumns={visibleColumns}
          totalColumns={totalColumns}
        />

        {/* Dense Mode */}
        <QuickTooltip label={isDense ? "Comfortable rows" : "Compact rows"}>
          <Button variant={isDense ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setIsDense(!isDense)}>
            <Rows3 className="h-3 w-3" />
          </Button>
        </QuickTooltip>

        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Copy Data */}
        <QuickTooltip label="Copy as JSON">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyTableData}>
            <Copy className="h-3 w-3" />
          </Button>
        </QuickTooltip>

        {/* Save to IndexedDB */}
        <SaveButton
          showSaveDialog={showSaveDialog}
          setShowSaveDialog={setShowSaveDialog}
          saveName={saveName}
          setSaveName={setSaveName}
          saveSuccess={saveSuccess}
          onSave={() => handleSave(input)}
        />

        {/* Load saved */}
        {savedEntries.length > 0 && (
          <SavedEntriesPopover
            entries={savedEntries}
            onLoad={handleLoadSaved}
            onDelete={handleDeleteSaved}
            onClearAll={handleClearAll}
          />
        )}

        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Edit Data (opens sheet) */}
        <EditDataSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          input={input}
          setInput={tableState.setInput}
          error={error}
          handlePaste={handlePaste}
          handleLoadSample={handleLoadSample}
          handleClear={handleClear}
          handleFetchUrl={handleFetchUrl}
          curlUrl={curlUrl}
          setCurlUrl={setCurlUrl}
          isFetching={isFetching}
          fetchError={fetchError}
          fileInputRef={fileInputRef}
        />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

import type { Table } from "@tanstack/react-table";
import type { DataRow } from "./types";

function ColumnVisibilityPopover({
  table,
  visibleColumns,
  totalColumns,
}: {
  table: Table<DataRow>;
  visibleColumns: number;
  totalColumns: number;
}) {
  return (
    <Popover>
      <QuickTooltip label="Toggle columns">
        <PopoverTrigger
          render={
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ListTodo className="h-3 w-3" />
            </Button>
          }
        />
      </QuickTooltip>
      <PopoverPopup side="bottom" align="end" className="w-52">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Toggle Columns</p>
          <div className="flex items-center gap-1.5 mb-2">
            <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1" onClick={() => table.toggleAllColumnsVisible(true)}>
              <Eye className="h-3 w-3 mr-1" /> All
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1" onClick={() => table.toggleAllColumnsVisible(false)}>
              <EyeOff className="h-3 w-3 mr-1" /> None
            </Button>
          </div>
          <div className="max-h-52 overflow-y-auto space-y-0.5">
            {table.getAllLeafColumns().map((column) => (
              <label key={column.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-muted/50 cursor-pointer select-none">
                <Checkbox checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)} />
                <span className="truncate font-mono text-[11px]">{column.id}</span>
              </label>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground pt-1 border-t">
            {visibleColumns} of {totalColumns} columns visible
          </p>
        </div>
      </PopoverPopup>
    </Popover>
  );
}

function SaveButton({
  showSaveDialog,
  setShowSaveDialog,
  saveName,
  setSaveName,
  saveSuccess,
  onSave,
}: {
  showSaveDialog: boolean;
  setShowSaveDialog: (v: boolean) => void;
  saveName: string;
  setSaveName: (v: string) => void;
  saveSuccess: boolean;
  onSave: () => void;
}) {
  if (showSaveDialog) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          placeholder="Name..."
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
          className="h-7 w-28 px-2 text-xs rounded-md border border-border bg-background outline-none focus:border-primary/50"
          autoFocus
        />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-500" onClick={onSave} disabled={!saveName.trim()}>
          <Save className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowSaveDialog(false)}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <QuickTooltip label={saveSuccess ? "Saved!" : "Save data"}>
      <Button
        variant="ghost"
        size="icon"
        className={`h-7 w-7 ${saveSuccess ? "text-emerald-500" : ""}`}
        onClick={() => setShowSaveDialog(true)}
      >
        <Save className="h-3 w-3" />
      </Button>
    </QuickTooltip>
  );
}

import type { SavedEntry } from "./types";

function SavedEntriesPopover({
  entries,
  onLoad,
  onDelete,
  onClearAll,
}: {
  entries: SavedEntry[];
  onLoad: (data: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}) {
  return (
    <Popover>
      <QuickTooltip label={`Load saved (${entries.length})`}>
        <PopoverTrigger
          render={
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <FolderOpen className="h-3 w-3" />
            </Button>
          }
        />
      </QuickTooltip>
      <PopoverPopup side="bottom" align="end" className="w-56">
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-muted-foreground">Saved Data</p>
            <Button variant="ghost" size="sm" className="h-5 text-[10px] text-destructive" onClick={onClearAll}>
              Clear All
            </Button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-muted/50 group">
                <button className="flex-1 text-left text-xs truncate cursor-pointer" onClick={() => onLoad(entry.data)}>
                  <span className="font-medium">{entry.id}</span>
                  <span className="text-muted-foreground ml-1.5 text-[10px]">{new Date(entry.savedAt).toLocaleDateString()}</span>
                </button>
                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => onDelete(entry.id)}>
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  );
}

function EditDataSheet({
  open,
  onOpenChange,
  input,
  setInput,
  error,
  handlePaste,
  handleLoadSample,
  handleClear,
  handleFetchUrl,
  curlUrl,
  setCurlUrl,
  isFetching,
  fetchError,
  fileInputRef,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  input: string;
  setInput: (v: string) => void;
  error: string | null;
  handlePaste: () => void;
  handleLoadSample: () => void;
  handleClear: () => void;
  handleFetchUrl: () => void;
  curlUrl: string;
  setCurlUrl: (v: string) => void;
  isFetching: boolean;
  fetchError: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <QuickTooltip label="Edit data">
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Pencil className="h-3 w-3" />
            </Button>
          }
        />
      </QuickTooltip>
      <SheetPopup side="left" className="max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-base">Edit JSON Data</SheetTitle>
          <SheetDescription>Modify or replace the JSON data powering the table.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 p-4 overflow-hidden flex flex-col gap-3 min-h-0">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handlePaste}>
              <Upload className="h-3 w-3 mr-1" /> Paste
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => fileInputRef.current?.click()}>
              <FileUp className="h-3 w-3 mr-1" /> Upload
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleLoadSample}>
              <Database className="h-3 w-3 mr-1" /> Sample
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={handleClear}>
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </Button>
          </div>
          {/* Fetch from URL */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="url"
                value={curlUrl}
                onChange={(e) => setCurlUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchUrl()}
                placeholder="https://api.example.com/data.json"
                className="w-full h-7 pl-7 pr-2 text-xs rounded-md border border-border bg-background outline-none focus:border-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleFetchUrl} disabled={!curlUrl.trim() || isFetching}>
              {isFetching ? "..." : "Fetch"}
            </Button>
          </div>
          {fetchError && (
            <p className="text-destructive text-[10px]">Error: {fetchError}</p>
          )}
          {/* Textarea */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              className="h-full w-full font-mono text-xs resize-none"
              placeholder={'[\n  { "name": "Alice", "age": 30 }\n]'}
            />
          </div>
          {error && (
            <div className="px-2 py-1.5 rounded bg-destructive/5 border border-destructive/20">
              <p className="text-destructive text-xs font-medium">Invalid Input</p>
              <p className="text-destructive/80 text-[10px]">{error}</p>
            </div>
          )}
        </div>
      </SheetPopup>
    </Sheet>
  );
}
