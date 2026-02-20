import { Button } from "@/components/ui/button";
import type { SavedEntry, InputActions } from "./types";
import {
  ClipboardPaste,
  FileUp,
  Globe,
  Database,
  FolderOpen,
  Trash2,
  TableProperties,
  X,
} from "lucide-react";

interface EmptyStateProps {
  inputActions: InputActions;
  savedEntries: SavedEntry[];
  onLoadSaved: (data: string) => void;
  onDeleteSaved: (id: string) => void;
  onClearAll: () => void;
  onLoadSample: () => void;
  error: string | null;
}

export function EmptyState({
  inputActions,
  savedEntries,
  onLoadSaved,
  onDeleteSaved,
  onClearAll,
  onLoadSample,
  error,
}: EmptyStateProps) {
  const {
    handlePaste,
    isFetching,
    fetchError,
    setIsFetching,
    setFetchError,
    fileInputRef,
  } = inputActions;

  const [showLoadPanel, setShowLoadPanel] = React.useState(false);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center max-w-lg w-full">
        {/* Hero */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center mb-4">
            <TableProperties className="h-8 w-8 text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold mb-1">JSON Table Viewer</h2>
          <p className="text-sm text-muted-foreground text-center">
            Paste, upload, or fetch JSON data to view it as an interactive table
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
          {/* Paste */}
          <button
            onClick={handlePaste}
            className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardPaste className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Paste JSON</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">From clipboard</p>
            </div>
          </button>

          {/* Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Upload File</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">.json, .csv, .txt</p>
            </div>
          </button>

          {/* Fetch */}
          <button
            onClick={() => {
              const url = prompt("Enter URL to fetch JSON from:");
              if (url) {
                setIsFetching(true);
                setFetchError(null);
                fetch(url.trim())
                  .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.text();
                  })
                  .then((text) => inputActions.setInput(text))
                  .catch((e) => setFetchError((e as Error).message))
                  .finally(() => setIsFetching(false));
              }
            }}
            className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="h-5 w-5 text-orange-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Fetch URL</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">GET request</p>
            </div>
          </button>
        </div>

        {/* Quick actions row */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onLoadSample}>
            <Database className="h-3 w-3 mr-1.5" /> Load Sample Data
          </Button>
          {savedEntries.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowLoadPanel(true)}
            >
              <FolderOpen className="h-3 w-3 mr-1.5" /> Saved ({savedEntries.length})
            </Button>
          )}
        </div>

        {/* Fetching indicator */}
        {isFetching && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Fetching data...
          </div>
        )}
        {fetchError && (
          <div className="mt-4 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            Fetch failed: {fetchError}
          </div>
        )}

        {/* Saved entries panel */}
        {showLoadPanel && (
          <SavedEntriesPanel
            entries={savedEntries}
            onLoad={onLoadSaved}
            onDelete={onDeleteSaved}
            onClearAll={onClearAll}
            onClose={() => setShowLoadPanel(false)}
          />
        )}

        {/* Error from bad input */}
        {error && (
          <div className="mt-4 w-full px-3 py-2 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-destructive text-xs font-medium">Invalid Input</p>
            <p className="text-destructive/80 text-[10px] mt-0.5">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-component: Saved entries panel ────────────────────────────────────
import React from "react";

function SavedEntriesPanel({
  entries,
  onLoad,
  onDelete,
  onClearAll,
  onClose,
}: {
  entries: SavedEntry[];
  onLoad: (data: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 w-full border rounded-xl bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold">Saved Data</p>
        <div className="flex items-center gap-1">
          {entries.length > 0 && (
            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive" onClick={onClearAll}>
              Clear All
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-3">No saved data</p>
      ) : (
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted/50 group">
              <button
                className="flex-1 text-left text-xs truncate cursor-pointer"
                onClick={() => onLoad(entry.data)}
              >
                <span className="font-medium">{entry.id}</span>
                <span className="text-muted-foreground ml-2 text-[10px]">
                  {new Date(entry.savedAt).toLocaleDateString()}
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
