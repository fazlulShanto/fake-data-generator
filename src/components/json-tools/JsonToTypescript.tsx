import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jsonToTypeScript } from "@/lib/json-converters";
import { Copy, Upload, FileType } from "lucide-react";

export function JsonToTypescript() {
  const [input, setInput] = useState("");
  const [interfaceName, setInterfaceName] = useState("Root");
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      const result = jsonToTypeScript(input, interfaceName);
      setError(null);
      return result;
    } catch (e) {
      setError((e as Error).message);
      return "";
    }
  }, [input, interfaceName]);

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileType className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">
            Generate TypeScript interfaces
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Name:</span>
          <Input
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value || "Root")}
            className="w-24 h-7 text-xs"
            placeholder="Root"
          />
        </div>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">JSON</CardTitle>
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
              placeholder='{"id": 1, "name": "John"}'
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">TypeScript</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!output}
                className="h-7"
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            {error ? (
              <div className="h-full flex items-center justify-center p-3">
                <div className="text-center p-3 bg-destructive/10 rounded text-xs">
                  <p className="text-destructive font-semibold">Invalid JSON</p>
                </div>
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0 text-blue-400"
                placeholder="TypeScript interfaces..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
