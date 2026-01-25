import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { compareJson, getDiffStats, type DiffResult } from "@/lib/json-diff";
import { GitCompare, Upload, Plus, Minus, RefreshCw } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  highlightLines?: Set<number>;
  highlightColor?: string;
}

function CodeEditor({
  value,
  onChange,
  placeholder,
  highlightLines,
  highlightColor = "bg-yellow-500/20",
}: CodeEditorProps) {
  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 8);

  return (
    <div className="h-full flex rounded-none overflow-hidden font-mono text-xs">
      <div className="flex flex-col py-2 px-1 text-[10px] text-muted-foreground bg-muted/50 select-none border-r min-w-[2.5rem] text-right">
        {Array.from({ length: lineCount }, (_, i) => (
          <span
            key={i + 1}
            className={`leading-5 px-1 ${highlightLines?.has(i + 1) ? highlightColor : ""}`}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-full bg-transparent resize-none focus:outline-none leading-5 py-2 px-2 text-xs"
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
}

function buildPathToLineMap(rawJsonString: string): Map<string, number> {
  const map = new Map<string, number>();
  const lines = rawJsonString.split("\n");
  const currentPath: string[] = [];
  const bracketStack: Array<"{" | "["> = [];
  const arrayIndexStack: number[] = [];
  let inArray = false;
  let arrayIndex = 0;

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === "{" || char === "[") {
        bracketStack.push(char);
        if (char === "[") {
          arrayIndexStack.push(arrayIndex);
          inArray = true;
          arrayIndex = 0;
        }
        i++;
        continue;
      }

      if (char === "}" || char === "]") {
        if (bracketStack.length > 0) {
          const last = bracketStack.pop();
          if (last === "[") {
            arrayIndex = arrayIndexStack.pop() || 0;
            inArray = arrayIndexStack.length > 0;
          }
          if (
            currentPath.length > 0 &&
            bracketStack.length < currentPath.length
          ) {
            currentPath.pop();
          }
        }
        i++;
        continue;
      }

      if (char === '"') {
        let j = i + 1;
        while (j < line.length && line[j] !== '"') {
          if (line[j] === "\\") j++;
          j++;
        }

        if (j < line.length) {
          const strContent = line.slice(i + 1, j);
          let k = j + 1;
          while (k < line.length && (line[k] === " " || line[k] === "\t")) k++;

          if (line[k] === ":") {
            const keyPath =
              currentPath.length > 0
                ? `${currentPath.join(".")}.${strContent}`
                : strContent;
            map.set(keyPath, lineNum + 1);

            let afterColon = k + 1;
            while (
              afterColon < line.length &&
              (line[afterColon] === " " || line[afterColon] === "\t")
            )
              afterColon++;

            if (line[afterColon] === "{" || line[afterColon] === "[") {
              currentPath.push(strContent);
            }
          }
          i = j + 1;
          continue;
        }
      }
      i++;
    }
  }
  return map;
}

export function JsonDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [error, setError] = useState<string | null>(null);

  const leftPathMap = useMemo(() => buildPathToLineMap(left), [left]);
  const rightPathMap = useMemo(() => buildPathToLineMap(right), [right]);

  const result = useMemo(() => {
    if (!left.trim() || !right.trim()) return null;
    try {
      const leftJson = JSON.parse(left);
      const rightJson = JSON.parse(right);
      setError(null);
      return compareJson(leftJson, rightJson);
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [left, right]);

  const diffsWithLines = useMemo(() => {
    if (!result) return [];
    return result
      .filter((d) => d.type !== "unchanged")
      .map((diff, index) => ({
        ...diff,
        index: index + 1,
        leftLine: leftPathMap.get(diff.path),
        rightLine: rightPathMap.get(diff.path),
      }));
  }, [result, leftPathMap, rightPathMap]);

  const leftHighlightLines = useMemo(() => {
    const lines = new Set<number>();
    diffsWithLines.forEach((d) => {
      if (d.leftLine && (d.type === "removed" || d.type === "changed"))
        lines.add(d.leftLine);
    });
    return lines;
  }, [diffsWithLines]);

  const rightHighlightLines = useMemo(() => {
    const lines = new Set<number>();
    diffsWithLines.forEach((d) => {
      if (d.rightLine && (d.type === "added" || d.type === "changed"))
        lines.add(d.rightLine);
    });
    return lines;
  }, [diffsWithLines]);

  const stats = result ? getDiffStats(result) : null;

  const handlePasteLeft = async () => {
    const text = await navigator.clipboard.readText();
    setLeft(text);
  };

  const handlePasteRight = async () => {
    const text = await navigator.clipboard.readText();
    setRight(text);
  };

  const renderDiffType = (type: DiffResult["type"]) => {
    switch (type) {
      case "added":
        return (
          <Badge className="bg-green-500 h-5 text-[10px]">
            <Plus className="h-2.5 w-2.5 mr-0.5" />
            Add
          </Badge>
        );
      case "removed":
        return (
          <Badge className="bg-red-500 h-5 text-[10px]">
            <Minus className="h-2.5 w-2.5 mr-0.5" />
            Del
          </Badge>
        );
      case "changed":
        return (
          <Badge className="bg-yellow-500 h-5 text-[10px]">
            <RefreshCw className="h-2.5 w-2.5 mr-0.5" />
            Mod
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">
            Compare two JSON objects
          </span>
        </div>
        {stats && (
          <div className="flex gap-1.5 text-[10px]">
            <Badge
              variant="outline"
              className="text-green-500 border-green-500 h-5"
            >
              +{stats.added}
            </Badge>
            <Badge
              variant="outline"
              className="text-red-500 border-red-500 h-5"
            >
              -{stats.removed}
            </Badge>
            <Badge
              variant="outline"
              className="text-yellow-500 border-yellow-500 h-5"
            >
              ~{stats.changed}
            </Badge>
          </div>
        )}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Original</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePasteLeft}
                className="h-7"
              >
                <Upload className="h-3 w-3 mr-1" /> Paste
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <CodeEditor
              value={left}
              onChange={setLeft}
              placeholder='{"name": "John"}'
              highlightLines={leftHighlightLines}
              highlightColor="bg-red-500/20"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Modified</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePasteRight}
                className="h-7"
              >
                <Upload className="h-3 w-3 mr-1" /> Paste
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <CodeEditor
              value={right}
              onChange={setRight}
              placeholder='{"name": "Jane"}'
              highlightLines={rightHighlightLines}
              highlightColor="bg-green-500/20"
            />
          </CardContent>
        </Card>
      </div>

      {/* Result */}
      {error && (
        <Card className="border-destructive shrink-0">
          <CardContent className="py-2 px-3">
            <p className="text-destructive text-xs">Invalid JSON: {error}</p>
          </CardContent>
        </Card>
      )}

      {result && diffsWithLines.length > 0 && (
        <Card className="shrink-0 max-h-40 overflow-hidden flex flex-col">
          <CardHeader className="py-1.5 px-3 border-b shrink-0">
            <CardTitle className="text-xs">
              Differences (L:Original → R:Modified)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1.5 overflow-auto flex-1">
            <div className="space-y-1">
              {diffsWithLines.map((diff) => (
                <div
                  key={diff.index}
                  className={`p-1.5 rounded font-mono text-[10px] flex items-start gap-2 ${diff.type === "added" ? "bg-green-500/10" : diff.type === "removed" ? "bg-red-500/10" : "bg-yellow-500/10"}`}
                >
                  <span className="shrink-0 w-14 text-muted-foreground font-semibold">
                    {diff.type === "added" && (
                      <span className="text-green-500">
                        →R:{diff.rightLine || "?"}
                      </span>
                    )}
                    {diff.type === "removed" && (
                      <span className="text-red-500">
                        L:{diff.leftLine || "?"}→
                      </span>
                    )}
                    {diff.type === "changed" && (
                      <span className="text-yellow-500">
                        L:{diff.leftLine || "?"}→R:{diff.rightLine || "?"}
                      </span>
                    )}
                  </span>
                  {renderDiffType(diff.type)}
                  <div className="flex-1 min-w-0">
                    <span className="text-cyan-400">{diff.path}</span>
                    {diff.type === "changed" && (
                      <div className="mt-0.5">
                        <span className="text-red-400">
                          -{JSON.stringify(diff.oldValue)}
                        </span>
                        <span className="text-green-400 ml-2">
                          +{JSON.stringify(diff.newValue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
