import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Copy, Upload, Search, ChevronsDownUp, ChevronsUpDown } from "lucide-react";

interface TreeNodeProps {
  keyName: string | number;
  value: unknown;
  depth: number;
  searchTerm: string;
  expandAll: boolean | null; // null = user control, true = expand all, false = collapse all
}

function TreeNode({ keyName, value, depth, searchTerm, expandAll }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  // Respond to expand/collapse all commands
  useEffect(() => {
    if (expandAll !== null) {
      setIsExpanded(expandAll);
    }
  }, [expandAll]);

  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);

  const matchesSearch =
    searchTerm &&
    (String(keyName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (!isObject &&
        String(value).toLowerCase().includes(searchTerm.toLowerCase())));

  const getValueColor = (val: unknown) => {
    if (val === null) return "text-orange-400";
    if (typeof val === "string") return "text-green-400";
    if (typeof val === "number") return "text-blue-400";
    if (typeof val === "boolean") return "text-purple-400";
    return "text-foreground";
  };

  const formatValue = (val: unknown) => {
    if (val === null) return "null";
    if (typeof val === "string") return `"${val}"`;
    return String(val);
  };

  return (
    <div className="font-mono text-xs" style={{ marginLeft: depth * 12 }}>
      <div
        className={`flex items-center gap-1 py-0.5 hover:bg-muted/50 rounded cursor-pointer ${matchesSearch ? "bg-yellow-500/20 ring-1 ring-yellow-500/50" : ""}`}
        onClick={() => isObject && setIsExpanded(!isExpanded)}
      >
        {isObject ? (
          <span className="w-3 h-3 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </span>
        ) : (
          <span className="w-3" />
        )}
        <span className="text-cyan-400">{keyName}</span>
        <span className="text-muted-foreground">:</span>
        {isObject ? (
          <span className="text-muted-foreground text-[10px]">
            {isArray
              ? `Array(${(value as unknown[]).length})`
              : `{${Object.keys(value as object).length}}`}
          </span>
        ) : (
          <span className={getValueColor(value)}>{formatValue(value)}</span>
        )}
      </div>
      {isObject && isExpanded && (
        <div>
          {Object.entries(value as object).map(([k, v]) => (
            <TreeNode
              key={k}
              keyName={isArray ? parseInt(k) : k}
              value={v}
              depth={depth + 1}
              searchTerm={searchTerm}
              expandAll={expandAll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function JsonViewer() {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expandAll, setExpandAll] = useState<boolean | null>(null);
  const [expandKey, setExpandKey] = useState(0); // Used to trigger re-render on expand/collapse all

  const parsedJson = useMemo(() => {
    if (!input.trim()) return null;
    try {
      setError(null);
      return JSON.parse(input);
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [input]);

  // Count search results by traversing the entire JSON tree
  const searchResultCount = useMemo(() => {
    if (!searchTerm || !parsedJson) return 0;
    
    let count = 0;
    const searchLower = searchTerm.toLowerCase();
    
    const countMatches = (obj: unknown, keyName: string | number = "root") => {
      // Check if key matches
      if (String(keyName).toLowerCase().includes(searchLower)) {
        count++;
      }
      
      if (obj !== null && typeof obj === "object") {
        // For objects/arrays, recurse into children
        Object.entries(obj as object).forEach(([k, v]) => {
          countMatches(v, Array.isArray(obj) ? parseInt(k) : k);
        });
      } else {
        // For primitives, check if value matches
        if (String(obj).toLowerCase().includes(searchLower)) {
          count++;
        }
      }
    };
    
    countMatches(parsedJson);
    return count;
  }, [searchTerm, parsedJson]);

  const handleExpandAll = () => {
    setExpandAll(true);
    setExpandKey(prev => prev + 1);
    // Reset to null after a brief moment to allow manual toggling again
    setTimeout(() => setExpandAll(null), 100);
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setExpandKey(prev => prev + 1);
    // Reset to null after a brief moment to allow manual toggling again
    setTimeout(() => setExpandAll(null), 100);
  };

  const copyToClipboard = () => {
    if (parsedJson) {
      navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2));
    }
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
      {/* Input */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-2 px-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">JSON Input</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="h-7"
            >
              <Upload className="h-3 w-3 mr-1" /> Paste
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0"
            placeholder='{"example": "paste your JSON here"}'
          />
        </CardContent>
      </Card>

      {/* Tree View */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-2 px-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">Tree View</CardTitle>
            <div className="flex items-center gap-1">
              {/* Expand/Collapse All buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExpandAll}
                disabled={!parsedJson}
                className="h-7 w-7"
                title="Expand All"
              >
                <ChevronsUpDown className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCollapseAll}
                disabled={!parsedJson}
                className="h-7 w-7"
                title="Collapse All"
              >
                <ChevronsDownUp className="h-3 w-3" />
              </Button>
              <div className="w-px h-5 bg-border mx-1" />
              {/* Search with result count */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search keys & values..."
                  className={`pl-7 pr-12 h-7 w-44 text-xs ${searchTerm && searchResultCount === 0 ? "border-destructive" : searchTerm && searchResultCount > 0 ? "border-green-500" : ""}`}
                />
                {searchTerm && (
                  <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded ${searchResultCount > 0 ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"}`}>
                    {searchResultCount}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                disabled={!parsedJson}
                className="h-7 w-7"
                title="Copy JSON"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-2 overflow-auto">
          {error ? (
            <div className="text-destructive p-2 bg-destructive/10 rounded text-xs">
              <p className="font-semibold">Invalid JSON</p>
              <p className="text-[10px]">{error}</p>
            </div>
          ) : parsedJson ? (
            <div className="p-1 bg-muted/30 rounded">
              <TreeNode
                key={expandKey}
                keyName="root"
                value={parsedJson}
                depth={0}
                searchTerm={searchTerm}
                expandAll={expandAll}
              />
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-4 text-xs">
              Enter JSON to view its structure
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
