import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fakerCategories, getFakerMethodByPath } from "@/lib/faker-types";
import { Copy, Download, Plus, Trash2, Shuffle } from "lucide-react";

interface SchemaField {
  id: string;
  name: string;
  category: string;
  method: string;
}

export function JsonGenerator() {
  const [fields, setFields] = useState<SchemaField[]>([
    { id: "1", name: "id", category: "String", method: "UUID" },
    { id: "2", name: "name", category: "Person", method: "Full Name" },
    { id: "3", name: "email", category: "Internet", method: "Email" },
  ]);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        name: "field",
        category: "String",
        method: "UUID",
      },
    ]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const generate = () => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const obj: Record<string, unknown> = {};
      for (const field of fields) {
        const fn = getFakerMethodByPath(field.category, field.method);
        obj[field.name] = fn ? fn() : null;
      }
      results.push(obj);
    }
    setOutput(JSON.stringify(results, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadJson = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
      {/* Schema Builder */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-2 px-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Schema Builder</CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Count:</label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-16 h-7 text-xs"
                min={1}
                max={100}
              />
              <Button onClick={generate} size="sm" className="h-7">
                <Shuffle className="h-3 w-3 mr-1" /> Generate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-2 space-y-1.5">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center gap-1.5">
              <Input
                value={field.name}
                onChange={(e) =>
                  updateField(field.id, { name: e.target.value })
                }
                placeholder="Field name"
                className="w-24 h-8 text-xs"
              />
              <Select
                value={field.category}
                onValueChange={(value) => {
                  const category = fakerCategories.find(
                    (c) => c.name === value,
                  );
                  updateField(field.id, {
                    category: value,
                    method: category?.methods[0]?.name || "",
                  });
                }}
              >
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fakerCategories.map((cat) => (
                    <SelectItem
                      key={cat.name}
                      value={cat.name}
                      className="text-xs"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={field.method}
                onValueChange={(value) =>
                  updateField(field.id, { method: value })
                }
              >
                <SelectTrigger className="flex-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fakerCategories
                    .find((c) => c.name === field.category)
                    ?.methods.map((m) => (
                      <SelectItem
                        key={m.name}
                        value={m.name}
                        className="text-xs"
                      >
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField(field.id)}
                className="shrink-0 h-8 w-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addField}
            size="sm"
            className="w-full h-8 mt-2"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Field
          </Button>
        </CardContent>
      </Card>

      {/* Output */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-2 px-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Generated Output</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                disabled={!output}
                className="h-7 w-7"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadJson}
                disabled={!output}
                className="h-7 w-7"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <Textarea
            value={output}
            readOnly
            className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0"
            placeholder="Click Generate to create data..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
