import { useState, useCallback } from "react";
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
import {
  Copy,
  Download,
  Plus,
  Trash2,
  Shuffle,
  ChevronDown,
  ChevronRight,
  Braces,
  List,
} from "lucide-react";

type FieldType = "value" | "object" | "array";

interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  // For value type
  category?: string;
  method?: string;
  // For object type
  children?: SchemaField[];
  // For array type
  arrayCount?: number;
  arrayItemType?: "value" | "object";
  arrayCategory?: string;
  arrayMethod?: string;
  arrayChildren?: SchemaField[];
  // UI state
  expanded?: boolean;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function createDefaultField(): SchemaField {
  return {
    id: generateId(),
    name: "field",
    type: "value",
    category: "String",
    method: "UUID",
    expanded: true,
  };
}

function createDefaultObjectField(): SchemaField {
  return {
    id: generateId(),
    name: "nested",
    type: "object",
    children: [createDefaultField()],
    expanded: true,
  };
}

function createDefaultArrayField(): SchemaField {
  return {
    id: generateId(),
    name: "items",
    type: "array",
    arrayCount: 3,
    arrayItemType: "value",
    arrayCategory: "String",
    arrayMethod: "UUID",
    arrayChildren: [],
    expanded: true,
  };
}

interface FieldEditorProps {
  field: SchemaField;
  depth: number;
  onUpdate: (id: string, updates: Partial<SchemaField>) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string, type: FieldType) => void;
}

function FieldEditor({
  field,
  depth,
  onUpdate,
  onRemove,
  onAddChild,
}: FieldEditorProps) {
  const toggleExpand = () => onUpdate(field.id, { expanded: !field.expanded });

  const hasChildren =
    field.type === "object" ||
    (field.type === "array" && field.arrayItemType === "object");
  const children =
    field.type === "object" ? field.children : field.arrayChildren;

  return (
    <div
      className={`${depth > 0 ? "ml-4 pl-3 border-l border-dashed border-muted-foreground/30" : ""}`}
    >
      <div className="flex items-center gap-1.5 py-1">
        {/* Expand/Collapse for nested types */}
        {hasChildren ? (
          <button
            onClick={toggleExpand}
            className="p-0.5 hover:bg-muted rounded"
          >
            {field.expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Type indicator */}
        <span className="shrink-0">
          {field.type === "object" && (
            <Braces className="h-3 w-3 text-orange-500" />
          )}
          {field.type === "array" && <List className="h-3 w-3 text-blue-500" />}
          {field.type === "value" && (
            <span className="w-3 h-3 rounded-full bg-green-500/50 block" />
          )}
        </span>

        {/* Field Name */}
        <Input
          value={field.name}
          onChange={(e) => onUpdate(field.id, { name: e.target.value })}
          className="w-24 h-7 text-xs"
          placeholder="name"
        />

        {/* Type Selector */}
        <Select
          value={field.type}
          onValueChange={(value: FieldType) => {
            if (value === "object") {
              onUpdate(field.id, {
                type: value,
                children: field.children || [createDefaultField()],
                expanded: true,
              });
            } else if (value === "array") {
              onUpdate(field.id, {
                type: value,
                arrayCount: field.arrayCount || 3,
                arrayItemType: "value",
                arrayCategory: "String",
                arrayMethod: "UUID",
                arrayChildren: [],
                expanded: true,
              });
            } else {
              onUpdate(field.id, {
                type: value,
                category: field.category || "String",
                method: field.method || "UUID",
              });
            }
          }}
        >
          <SelectTrigger className="w-20 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value" className="text-xs">
              Value
            </SelectItem>
            <SelectItem value="object" className="text-xs">
              Object
            </SelectItem>
            <SelectItem value="array" className="text-xs">
              Array
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Value type: Category & Method */}
        {field.type === "value" && (
          <>
            <Select
              value={field.category}
              onValueChange={(value) => {
                const category = fakerCategories.find((c) => c.name === value);
                onUpdate(field.id, {
                  category: value,
                  method: category?.methods[0]?.name || "",
                });
              }}
            >
              <SelectTrigger className="w-24 h-7 text-xs">
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
              onValueChange={(value) => onUpdate(field.id, { method: value })}
            >
              <SelectTrigger className="flex-1 h-7 text-xs min-w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fakerCategories
                  .find((c) => c.name === field.category)
                  ?.methods.map((m) => (
                    <SelectItem key={m.name} value={m.name} className="text-xs">
                      {m.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </>
        )}

        {/* Array type: count & item type */}
        {field.type === "array" && (
          <>
            <Input
              type="number"
              value={field.arrayCount}
              onChange={(e) =>
                onUpdate(field.id, {
                  arrayCount: parseInt(e.target.value) || 1,
                })
              }
              className="w-12 h-7 text-xs"
              min={1}
              max={20}
              title="Array size"
            />
            <Select
              value={field.arrayItemType}
              onValueChange={(value: "value" | "object") => {
                if (value === "object") {
                  onUpdate(field.id, {
                    arrayItemType: value,
                    arrayChildren: field.arrayChildren?.length
                      ? field.arrayChildren
                      : [createDefaultField()],
                  });
                } else {
                  onUpdate(field.id, {
                    arrayItemType: value,
                    arrayCategory: "String",
                    arrayMethod: "UUID",
                  });
                }
              }}
            >
              <SelectTrigger className="w-20 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value" className="text-xs">
                  Values
                </SelectItem>
                <SelectItem value="object" className="text-xs">
                  Objects
                </SelectItem>
              </SelectContent>
            </Select>
            {field.arrayItemType === "value" && (
              <>
                <Select
                  value={field.arrayCategory}
                  onValueChange={(value) => {
                    const category = fakerCategories.find(
                      (c) => c.name === value,
                    );
                    onUpdate(field.id, {
                      arrayCategory: value,
                      arrayMethod: category?.methods[0]?.name || "",
                    });
                  }}
                >
                  <SelectTrigger className="w-24 h-7 text-xs">
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
                  value={field.arrayMethod}
                  onValueChange={(value) =>
                    onUpdate(field.id, { arrayMethod: value })
                  }
                >
                  <SelectTrigger className="flex-1 h-7 text-xs min-w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fakerCategories
                      .find((c) => c.name === field.arrayCategory)
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
              </>
            )}
          </>
        )}

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(field.id)}
          className="shrink-0 h-7 w-7"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Children for Object type */}
      {field.type === "object" && field.expanded && (
        <div className="mt-1">
          {field.children?.map((child) => (
            <FieldEditor
              key={child.id}
              field={child}
              depth={depth + 1}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onAddChild={onAddChild}
            />
          ))}
          <div className="ml-4 pl-3 border-l border-dashed border-muted-foreground/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(field.id, "value")}
              className="h-6 text-xs text-muted-foreground"
            >
              <Plus className="h-3 w-3 mr-1" /> Add field
            </Button>
          </div>
        </div>
      )}

      {/* Children for Array of Objects */}
      {field.type === "array" &&
        field.arrayItemType === "object" &&
        field.expanded && (
          <div className="mt-1">
            <div className="ml-4 pl-3 border-l border-dashed border-blue-500/30 text-[10px] text-muted-foreground mb-1">
              Array item structure:
            </div>
            {field.arrayChildren?.map((child) => (
              <FieldEditor
                key={child.id}
                field={child}
                depth={depth + 1}
                onUpdate={onUpdate}
                onRemove={onRemove}
                onAddChild={onAddChild}
              />
            ))}
            <div className="ml-4 pl-3 border-l border-dashed border-blue-500/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddChild(field.id, "value")}
                className="h-6 text-xs text-muted-foreground"
              >
                <Plus className="h-3 w-3 mr-1" /> Add field
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}

// Recursive function to generate data from schema
function generateFromField(field: SchemaField): unknown {
  if (field.type === "value") {
    const fn = getFakerMethodByPath(field.category || "", field.method || "");
    return fn ? fn() : null;
  }

  if (field.type === "object") {
    const obj: Record<string, unknown> = {};
    for (const child of field.children || []) {
      obj[child.name] = generateFromField(child);
    }
    return obj;
  }

  if (field.type === "array") {
    const count = field.arrayCount || 1;
    const items: unknown[] = [];

    for (let i = 0; i < count; i++) {
      if (field.arrayItemType === "value") {
        const fn = getFakerMethodByPath(
          field.arrayCategory || "",
          field.arrayMethod || "",
        );
        items.push(fn ? fn() : null);
      } else {
        const obj: Record<string, unknown> = {};
        for (const child of field.arrayChildren || []) {
          obj[child.name] = generateFromField(child);
        }
        items.push(obj);
      }
    }
    return items;
  }

  return null;
}

export function JsonGenerator() {
  const [fields, setFields] = useState<SchemaField[]>([
    {
      id: "1",
      name: "id",
      type: "value",
      category: "String",
      method: "UUID",
      expanded: true,
    },
    {
      id: "2",
      name: "name",
      type: "value",
      category: "Person",
      method: "Full Name",
      expanded: true,
    },
    {
      id: "3",
      name: "email",
      type: "value",
      category: "Internet",
      method: "Email",
      expanded: true,
    },
  ]);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  // Recursive update function
  const updateFieldRecursive = useCallback(
    (
      fields: SchemaField[],
      id: string,
      updates: Partial<SchemaField>,
    ): SchemaField[] => {
      return fields.map((field) => {
        if (field.id === id) {
          return { ...field, ...updates };
        }
        if (field.children) {
          return {
            ...field,
            children: updateFieldRecursive(field.children, id, updates),
          };
        }
        if (field.arrayChildren) {
          return {
            ...field,
            arrayChildren: updateFieldRecursive(
              field.arrayChildren,
              id,
              updates,
            ),
          };
        }
        return field;
      });
    },
    [],
  );

  // Recursive remove function
  const removeFieldRecursive = useCallback(
    (fields: SchemaField[], id: string): SchemaField[] => {
      return fields
        .filter((field) => field.id !== id)
        .map((field) => {
          if (field.children) {
            return {
              ...field,
              children: removeFieldRecursive(field.children, id),
            };
          }
          if (field.arrayChildren) {
            return {
              ...field,
              arrayChildren: removeFieldRecursive(field.arrayChildren, id),
            };
          }
          return field;
        });
    },
    [],
  );

  // Add child to parent (for objects and arrays)
  const addChildToParent = useCallback(
    (
      fields: SchemaField[],
      parentId: string,
      childType: FieldType,
    ): SchemaField[] => {
      return fields.map((field) => {
        if (field.id === parentId) {
          const newChild =
            childType === "object"
              ? createDefaultObjectField()
              : childType === "array"
                ? createDefaultArrayField()
                : createDefaultField();
          if (field.type === "object") {
            return {
              ...field,
              children: [...(field.children || []), newChild],
            };
          }
          if (field.type === "array" && field.arrayItemType === "object") {
            return {
              ...field,
              arrayChildren: [...(field.arrayChildren || []), newChild],
            };
          }
        }
        if (field.children) {
          return {
            ...field,
            children: addChildToParent(field.children, parentId, childType),
          };
        }
        if (field.arrayChildren) {
          return {
            ...field,
            arrayChildren: addChildToParent(
              field.arrayChildren,
              parentId,
              childType,
            ),
          };
        }
        return field;
      });
    },
    [],
  );

  const handleUpdate = useCallback(
    (id: string, updates: Partial<SchemaField>) => {
      setFields((prev) => updateFieldRecursive(prev, id, updates));
    },
    [updateFieldRecursive],
  );

  const handleRemove = useCallback(
    (id: string) => {
      setFields((prev) => removeFieldRecursive(prev, id));
    },
    [removeFieldRecursive],
  );

  const handleAddChild = useCallback(
    (parentId: string, type: FieldType) => {
      setFields((prev) => addChildToParent(prev, parentId, type));
    },
    [addChildToParent],
  );

  const addRootField = (type: FieldType) => {
    const newField =
      type === "object"
        ? createDefaultObjectField()
        : type === "array"
          ? createDefaultArrayField()
          : createDefaultField();
    setFields([...fields, newField]);
  };

  const generate = () => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const obj: Record<string, unknown> = {};
      for (const field of fields) {
        obj[field.name] = generateFromField(field);
      }
      results.push(obj);
    }
    setOutput(JSON.stringify(results, null, 2));
  };

  const copyToClipboard = () => navigator.clipboard.writeText(output);

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
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-sm">Schema Builder</CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Count:</label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-14 h-7 text-xs"
                min={1}
                max={100}
              />
              <Button onClick={generate} size="sm" className="h-7">
                <Shuffle className="h-3 w-3 mr-1" /> Generate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-2">
          <div className="space-y-0.5">
            {fields.map((field) => (
              <FieldEditor
                key={field.id}
                field={field}
                depth={0}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                onAddChild={handleAddChild}
              />
            ))}
          </div>
          <div className="flex gap-1 mt-3">
            <Button
              variant="outline"
              onClick={() => addRootField("value")}
              size="sm"
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" /> Value
            </Button>
            <Button
              variant="outline"
              onClick={() => addRootField("object")}
              size="sm"
              className="h-7 text-xs"
            >
              <Braces className="h-3 w-3 mr-1" /> Object
            </Button>
            <Button
              variant="outline"
              onClick={() => addRootField("array")}
              size="sm"
              className="h-7 text-xs"
            >
              <List className="h-3 w-3 mr-1" /> Array
            </Button>
          </div>
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
