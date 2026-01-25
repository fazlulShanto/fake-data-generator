import LZString from "lz-string";

export interface ShareableState {
  tool: string;
  data: unknown;
  version: number;
}

const CURRENT_VERSION = 1;
const MAX_URL_LENGTH = 4000; // Safe limit for most browsers

/**
 * Compress and encode state for URL sharing
 */
export function encodeState(state: ShareableState): string {
  const json = JSON.stringify(state);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

/**
 * Decode and decompress state from URL
 */
export function decodeState(encoded: string): ShareableState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const state = JSON.parse(json) as ShareableState;
    if (state.version !== CURRENT_VERSION) {
      console.warn("State version mismatch, may not decode correctly");
    }
    return state;
  } catch (e) {
    console.error("Failed to decode state:", e);
    return null;
  }
}

/**
 * Create a shareable URL from state
 * Returns null if the URL would be too long
 */
export function createShareableUrl(state: ShareableState): {
  url: string;
  tooLong: boolean;
} {
  const encoded = encodeState(state);
  const baseUrl = window.location.origin + window.location.pathname;
  const fullUrl = `${baseUrl}#state=${encoded}`;

  return {
    url: fullUrl,
    tooLong: fullUrl.length > MAX_URL_LENGTH,
  };
}

/**
 * Read state from current URL hash
 */
export function getStateFromUrl(): ShareableState | null {
  const hash = window.location.hash;
  if (!hash.startsWith("#state=")) return null;

  const encoded = hash.slice(7); // Remove "#state="
  return decodeState(encoded);
}

/**
 * Clear state from URL without reload
 */
export function clearUrlState(): void {
  history.replaceState(null, "", window.location.pathname);
}

/**
 * Get encoded state as copyable text (for large data)
 */
export function getEncodedStateText(state: ShareableState): string {
  return encodeState(state);
}

/**
 * Decode state from pasted text
 */
export function decodeStateFromText(text: string): ShareableState | null {
  return decodeState(text.trim());
}

/**
 * Estimate if state can fit in URL
 */
export function canFitInUrl(state: ShareableState): boolean {
  const encoded = encodeState(state);
  const estimatedLength = window.location.origin.length + 20 + encoded.length;
  return estimatedLength <= MAX_URL_LENGTH;
}
