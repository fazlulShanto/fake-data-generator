import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Upload, Trash2 } from "lucide-react";

interface ValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}

function validateJson(input: string): ValidationResult {
  if (!input.trim()) {
    return { valid: false, error: { message: "Empty input" } };
  }

  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const error = e as SyntaxError;
    const match = error.message.match(/at position (\d+)/);

    let line = 1;
    let column = 1;

    if (match) {
      const position = parseInt(match[1]);
      const lines = input.substring(0, position).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      valid: false,
      error: {
        message: error.message,
        line,
        column,
      },
    };
  }
}

export function JsonValidator() {
  const [input, setInput] = useState("");

  const result = useMemo(() => validateJson(input), [input]);

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  };

  const handleClear = () => {
    setInput("");
  };

  const getLineNumbers = () => {
    const lines = input.split("\n");
    return lines.map((_, i) => i + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
      {/* Input */}
      <Card className="flex flex-col overflow-hidden lg:col-span-2">
        <CardHeader className="py-2 px-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">JSON Input</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                className="h-7"
              >
                <Upload className="h-3 w-3 mr-1" /> Paste
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="h-full flex rounded-none overflow-hidden">
            {/* Line numbers */}
            <div className="flex flex-col py-2 px-1 text-[10px] text-muted-foreground bg-muted/50 font-mono select-none border-r min-w-[2.5rem] text-right">
              {getLineNumbers().map((num) => (
                <span
                  key={num}
                  className={`leading-5 px-1 ${
                    result.error?.line === num
                      ? "text-destructive font-bold bg-destructive/20"
                      : ""
                  }`}
                >
                  {num}
                </span>
              ))}
            </div>
            {/* Editor */}
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0 leading-5 py-2"
              placeholder='{"example": "value"}'
            />
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-2 px-3 border-b shrink-0">
          <CardTitle className="text-sm">Result</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-3">
          {!input.trim() ? (
            <div className="text-center text-muted-foreground text-xs">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">{}</span>
              </div>
              <p>Enter JSON to validate</p>
            </div>
          ) : result.valid ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-200">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm font-semibold text-green-500">Valid JSON</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {input.split("\n").length} lines
              </p>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded">
                <XCircle className="w-5 h-5 text-destructive shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-destructive">
                    Invalid
                  </p>
                  {result.error?.line && (
                    <p className="text-[10px] text-muted-foreground">
                      Line {result.error.line}:{result.error.column}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-[10px] font-mono text-destructive-foreground break-all">
                  {result.error?.message}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
