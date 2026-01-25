import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { jsonrepair } from "jsonrepair";
import { Wrench, Copy, Upload, CheckCircle2 } from "lucide-react";

export function JsonRepair() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [repaired, setRepaired] = useState(false);

  const handleRepair = () => {
    try {
      const result = jsonrepair(input);
      setOutput(JSON.stringify(JSON.parse(result), null, 2));
      setError(null);
      setRepaired(true);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
      setRepaired(false);
    }
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
    setRepaired(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <p className="text-xs text-muted-foreground">
          Fix malformed JSON automatically
        </p>
        <Button onClick={handleRepair} disabled={!input.trim()} size="sm">
          <Wrench className="h-3 w-3 mr-1" /> Repair JSON
        </Button>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Input */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Malformed JSON</CardTitle>
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
              onChange={(e) => {
                setInput(e.target.value);
                setRepaired(false);
              }}
              className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0"
              placeholder={`{name: 'John', items: [1, 2, 3,]}`}
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">Repaired</CardTitle>
                {repaired && (
                  <span className="flex items-center gap-1 text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" /> Fixed
                  </span>
                )}
              </div>
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
                  <p className="text-destructive font-semibold">
                    Unable to repair
                  </p>
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
                placeholder="Repaired JSON will appear here..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
