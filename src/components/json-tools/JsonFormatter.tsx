import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Copy, Upload, Minimize2, Maximize2 } from "lucide-react";

type FormatMode = "beautify" | "minify";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<FormatMode>("beautify");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      const parsed = JSON.parse(input);
      setError(null);
      if (mode === "beautify") {
        return JSON.stringify(parsed, null, indentSize);
      } else {
        return JSON.stringify(parsed);
      }
    } catch (e) {
      setError((e as Error).message);
      return "";
    }
  }, [input, mode, indentSize]);

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const stats = useMemo(() => {
    if (!input.trim() || error) return null;
    const inputSize = new Blob([input]).size;
    const outputSize = new Blob([output]).size;
    const savings = inputSize - outputSize;
    const percent = ((savings / inputSize) * 100).toFixed(1);
    return { inputSize, outputSize, savings, percent };
  }, [input, output, error]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as FormatMode)}
            className="h-8"
          >
            <ToggleGroupItem
              value="beautify"
              className="gap-1 h-8 text-xs px-2"
            >
              <Maximize2 className="h-3 w-3" /> Beautify
            </ToggleGroupItem>
            <ToggleGroupItem value="minify" className="gap-1 h-8 text-xs px-2">
              <Minimize2 className="h-3 w-3" /> Minify
            </ToggleGroupItem>
          </ToggleGroup>

          {mode === "beautify" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Indent:</span>
              <Slider
                value={[indentSize]}
                onValueChange={([v]) => setIndentSize(v)}
                min={1}
                max={8}
                step={1}
                className="w-20"
              />
              <span className="text-xs font-mono w-3">{indentSize}</span>
            </div>
          )}
        </div>

        {stats && mode === "minify" && stats.savings > 0 && (
          <div className="text-xs text-muted-foreground">
            Saved{" "}
            <span className="text-green-500 font-semibold">
              {stats.savings}B
            </span>{" "}
            ({stats.percent}%)
          </div>
        )}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Input */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Input</CardTitle>
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
              placeholder='{"paste": "json here"}'
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {mode === "beautify" ? "Beautified" : "Minified"}
              </CardTitle>
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
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {error}
                  </p>
                </div>
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0"
                placeholder="Formatted output..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
