// JSON Diff utility

export type DiffType = "added" | "removed" | "changed" | "unchanged";

export interface DiffResult {
  path: string;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function compareJson(
  obj1: unknown,
  obj2: unknown,
  path: string = "",
): DiffResult[] {
  const results: DiffResult[] = [];

  // Handle null/undefined
  if (obj1 === obj2) {
    return [
      {
        path: path || "root",
        type: "unchanged",
        oldValue: obj1,
        newValue: obj2,
      },
    ];
  }

  // Different types
  if (
    typeof obj1 !== typeof obj2 ||
    Array.isArray(obj1) !== Array.isArray(obj2)
  ) {
    return [
      { path: path || "root", type: "changed", oldValue: obj1, newValue: obj2 },
    ];
  }

  // Arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLen = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLen; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= obj1.length) {
        results.push({ path: itemPath, type: "added", newValue: obj2[i] });
      } else if (i >= obj2.length) {
        results.push({ path: itemPath, type: "removed", oldValue: obj1[i] });
      } else {
        results.push(...compareJson(obj1[i], obj2[i], itemPath));
      }
    }
    return results;
  }

  // Objects
  if (isObject(obj1) && isObject(obj2)) {
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of allKeys) {
      const keyPath = path ? `${path}.${key}` : key;

      if (!(key in obj1)) {
        results.push({ path: keyPath, type: "added", newValue: obj2[key] });
      } else if (!(key in obj2)) {
        results.push({ path: keyPath, type: "removed", oldValue: obj1[key] });
      } else {
        results.push(...compareJson(obj1[key], obj2[key], keyPath));
      }
    }
    return results;
  }

  // Primitives
  if (obj1 !== obj2) {
    return [
      { path: path || "root", type: "changed", oldValue: obj1, newValue: obj2 },
    ];
  }

  return [
    { path: path || "root", type: "unchanged", oldValue: obj1, newValue: obj2 },
  ];
}

export function getDiffStats(diffs: DiffResult[]): {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
} {
  return diffs.reduce(
    (acc, diff) => {
      acc[diff.type]++;
      return acc;
    },
    { added: 0, removed: 0, changed: 0, unchanged: 0 },
  );
}
