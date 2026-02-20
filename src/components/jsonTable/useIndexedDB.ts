import { useState, useEffect, useCallback } from "react";
import type { SavedEntry } from "./types";

const IDB_DB_NAME = "json-table-tool";
const IDB_STORE_NAME = "saved-data";
const IDB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_DB_NAME, IDB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
                db.createObjectStore(IDB_STORE_NAME, { keyPath: "id" });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function saveToIDB(name: string, data: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(IDB_STORE_NAME, "readwrite");
    tx.objectStore(IDB_STORE_NAME).put({
        id: name,
        data,
        savedAt: new Date().toISOString(),
    });
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function getAllFromIDB(): Promise<SavedEntry[]> {
    const db = await openDB();
    const tx = db.transaction(IDB_STORE_NAME, "readonly");
    const req = tx.objectStore(IDB_STORE_NAME).getAll();
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result as SavedEntry[]);
        req.onerror = () => reject(req.error);
    });
}

async function deleteFromIDB(id: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(IDB_STORE_NAME, "readwrite");
    tx.objectStore(IDB_STORE_NAME).delete(id);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function clearAllIDB(): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(IDB_STORE_NAME, "readwrite");
    tx.objectStore(IDB_STORE_NAME).clear();
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export function useIndexedDB() {
    const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [saveName, setSaveName] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);

    const refreshSavedEntries = useCallback(async () => {
        try {
            const entries = await getAllFromIDB();
            setSavedEntries(entries);
        } catch {
            // silently fail
        }
    }, []);

    useEffect(() => {
        refreshSavedEntries();
    }, [refreshSavedEntries]);

    const handleSave = useCallback(
        async (input: string) => {
            if (!saveName.trim() || !input.trim()) return;
            try {
                await saveToIDB(saveName.trim(), input);
                setSaveName("");
                setShowSaveDialog(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
                await refreshSavedEntries();
            } catch {
                // save failed
            }
        },
        [saveName, refreshSavedEntries],
    );

    const handleDeleteSaved = useCallback(
        async (id: string) => {
            await deleteFromIDB(id);
            await refreshSavedEntries();
        },
        [refreshSavedEntries],
    );

    const handleClearAll = useCallback(async () => {
        await clearAllIDB();
        await refreshSavedEntries();
    }, [refreshSavedEntries]);

    return {
        savedEntries,
        showSaveDialog,
        setShowSaveDialog,
        saveName,
        setSaveName,
        saveSuccess,
        handleSave,
        handleDeleteSaved,
        handleClearAll,
    };
}
