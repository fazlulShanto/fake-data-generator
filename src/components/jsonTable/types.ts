import type { Table } from "@tanstack/react-table";

export interface SavedEntry {
    id: string;
    data: string;
    savedAt: string;
}

export type DataRow = Record<string, unknown>;

export interface JsonTableState {
    input: string;
    setInput: (v: string) => void;
    error: string | null;
    parsedData: DataRow[];
    table: Table<DataRow>;
    globalFilter: string;
    setGlobalFilter: (v: string) => void;
    showColumnFilters: boolean;
    setShowColumnFilters: (v: boolean) => void;
    isDense: boolean;
    setIsDense: (v: boolean) => void;
    shouldPaginate: boolean;
}

export interface SaveActions {
    savedEntries: SavedEntry[];
    showSaveDialog: boolean;
    setShowSaveDialog: (v: boolean) => void;
    saveName: string;
    setSaveName: (v: string) => void;
    saveSuccess: boolean;
    handleSave: () => void;
    handleLoadSaved: (data: string) => void;
    handleDeleteSaved: (id: string) => void;
    handleClearAll: () => void;
}

export interface InputActions {
    handlePaste: () => void;
    handleLoadSample: () => void;
    handleClear: () => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFetchUrl: () => void;
    handleCopyTableData: () => void;
    curlUrl: string;
    setCurlUrl: (v: string) => void;
    isFetching: boolean;
    fetchError: string | null;
    setIsFetching: (v: boolean) => void;
    setFetchError: (v: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}
