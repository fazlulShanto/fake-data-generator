import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Copy, Upload, Search } from "lucide-react";

interface TreeNodeProps {
  keyName: string | number;
  value: unknown;
  depth: number;
  searchTerm: string;
}

function TreeNode({ keyName, value, depth, searchTerm }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

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
        className={`flex items-center gap-1 py-0.5 hover:bg-muted/50 rounded cursor-pointer ${matchesSearch ? "bg-yellow-500/20" : ""}`}
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
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-7 h-7 w-28 text-xs"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                disabled={!parsedJson}
                className="h-7 w-7"
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
                keyName="root"
                value={parsedJson}
                depth={0}
                searchTerm={searchTerm}
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
