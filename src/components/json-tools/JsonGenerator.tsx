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
import { Badge } from "@/components/ui/badge";
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
  Hash,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FieldType = "value" | "object" | "array";

interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  category?: string;
  method?: string;
  children?: SchemaField[];
  arrayCount?: number;
  arrayItemType?: "value" | "object";
  arrayCategory?: string;
  arrayMethod?: string;
  arrayChildren?: SchemaField[];
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

interface SortableFieldProps {
  field: SchemaField;
  depth: number;
  onUpdate: (id: string, updates: Partial<SchemaField>) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string, type: FieldType) => void;
  onReorderChildren: (
    parentId: string | null,
    activeId: string,
    overId: string,
  ) => void;
}

function SortableField({
  field,
  depth,
  onUpdate,
  onRemove,
  onAddChild,
  onReorderChildren,
}: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const toggleExpand = () => onUpdate(field.id, { expanded: !field.expanded });
  const hasChildren =
    field.type === "object" ||
    (field.type === "array" && field.arrayItemType === "object");

  const typeColors = {
    value: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    object: "bg-amber-500/20 border-amber-500/40 text-amber-400",
    array: "bg-blue-500/20 border-blue-500/40 text-blue-400",
  };

  const typeIcons = {
    value: <Hash className="h-3 w-3" />,
    object: <Braces className="h-3 w-3" />,
    array: <List className="h-3 w-3" />,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleChildDragEnd = (
    event: DragEndEvent,
    isArrayChildren: boolean,
  ) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderChildren(field.id, active.id as string, over.id as string);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={depth > 0 ? "ml-6 relative" : ""}
    >
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-muted-foreground/30 to-transparent -ml-3" />
      )}

      <div
        className={`group relative rounded-lg border bg-card/50 p-2 mb-2 transition-all hover:bg-card/80 hover:shadow-sm ${depth > 0 ? "border-dashed" : "border-solid"} ${isDragging ? "shadow-lg ring-2 ring-primary/50" : ""}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/60" />
          </button>

          {/* Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={toggleExpand}
              className="p-1 hover:bg-muted rounded transition-colors"
              title={field.expanded ? "Collapse" : "Expand"}
            >
              {field.expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : null}

          {/* Type Badge */}
          <Badge
            variant="outline"
            className={`${typeColors[field.type]} gap-1 text-[10px] px-1.5 py-0 h-5 shrink-0`}
          >
            {typeIcons[field.type]}
            {field.type}
          </Badge>

          {/* Field Name */}
          <Input
            value={field.name}
            onChange={(e) => onUpdate(field.id, { name: e.target.value })}
            className="w-28 h-7 text-xs font-medium bg-background/50"
            placeholder="fieldName"
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
            <SelectTrigger className="w-24 h-7 text-xs bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value" className="text-xs">
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3 w-3 text-emerald-400" /> Value
                </span>
              </SelectItem>
              <SelectItem value="object" className="text-xs">
                <span className="flex items-center gap-1.5">
                  <Braces className="h-3 w-3 text-amber-400" /> Object
                </span>
              </SelectItem>
              <SelectItem value="array" className="text-xs">
                <span className="flex items-center gap-1.5">
                  <List className="h-3 w-3 text-blue-400" /> Array
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Value type: Category & Method */}
          {field.type === "value" && (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[10px] text-muted-foreground shrink-0">
                →
              </span>
              <Select
                value={field.category}
                onValueChange={(value) => {
                  const category = fakerCategories.find(
                    (c) => c.name === value,
                  );
                  onUpdate(field.id, {
                    category: value,
                    method: category?.methods[0]?.name || "",
                  });
                }}
              >
                <SelectTrigger className="w-28 h-7 text-xs bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
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
                <SelectTrigger className="flex-1 min-w-24 h-7 text-xs bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
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
            </div>
          )}

          {/* Array type */}
          {field.type === "array" && (
            <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
              <span className="text-[10px] text-muted-foreground shrink-0">
                ×
              </span>
              <Input
                type="number"
                value={field.arrayCount}
                onChange={(e) =>
                  onUpdate(field.id, {
                    arrayCount: parseInt(e.target.value) || 1,
                  })
                }
                className="w-14 h-7 text-xs bg-background/50"
                min={1}
                max={50}
              />
              <span className="text-[10px] text-muted-foreground shrink-0">
                of
              </span>
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
                <SelectTrigger className="w-24 h-7 text-xs bg-background/50">
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
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    →
                  </span>
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
                    <SelectTrigger className="w-24 h-7 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
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
                    <SelectTrigger className="flex-1 min-w-20 h-7 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
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
            </div>
          )}

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(field.id)}
            className="shrink-0 h-7 w-7 opacity-50 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Children for Object type */}
        {field.type === "object" && field.expanded && field.children && (
          <div className="mt-3 pt-2 border-t border-dashed border-amber-500/30">
            <div className="flex items-center gap-1.5 mb-2">
              <Braces className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                Object Properties
              </span>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleChildDragEnd(e, false)}
            >
              <SortableContext
                items={field.children.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {field.children.map((child) => (
                  <SortableField
                    key={child.id}
                    field={child}
                    depth={depth + 1}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    onAddChild={onAddChild}
                    onReorderChildren={onReorderChildren}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(field.id, "value")}
              className="h-6 text-[10px] text-muted-foreground hover:text-amber-400 ml-6"
            >
              <Plus className="h-3 w-3 mr-1" /> Add property
            </Button>
          </div>
        )}

        {/* Children for Array of Objects */}
        {field.type === "array" &&
          field.arrayItemType === "object" &&
          field.expanded &&
          field.arrayChildren && (
            <div className="mt-3 pt-2 border-t border-dashed border-blue-500/30">
              <div className="flex items-center gap-1.5 mb-2">
                <List className="h-3 w-3 text-blue-400" />
                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">
                  Item Schema
                </span>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleChildDragEnd(e, true)}
              >
                <SortableContext
                  items={field.arrayChildren.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {field.arrayChildren.map((child) => (
                    <SortableField
                      key={child.id}
                      field={child}
                      depth={depth + 1}
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                      onAddChild={onAddChild}
                      onReorderChildren={onReorderChildren}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddChild(field.id, "value")}
                className="h-6 text-[10px] text-muted-foreground hover:text-blue-400 ml-6"
              >
                <Plus className="h-3 w-3 mr-1" /> Add field
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const updateFieldRecursive = useCallback(
    (
      fields: SchemaField[],
      id: string,
      updates: Partial<SchemaField>,
    ): SchemaField[] => {
      return fields.map((field) => {
        if (field.id === id) return { ...field, ...updates };
        if (field.children)
          return {
            ...field,
            children: updateFieldRecursive(field.children, id, updates),
          };
        if (field.arrayChildren)
          return {
            ...field,
            arrayChildren: updateFieldRecursive(
              field.arrayChildren,
              id,
              updates,
            ),
          };
        return field;
      });
    },
    [],
  );

  const removeFieldRecursive = useCallback(
    (fields: SchemaField[], id: string): SchemaField[] => {
      return fields
        .filter((field) => field.id !== id)
        .map((field) => {
          if (field.children)
            return {
              ...field,
              children: removeFieldRecursive(field.children, id),
            };
          if (field.arrayChildren)
            return {
              ...field,
              arrayChildren: removeFieldRecursive(field.arrayChildren, id),
            };
          return field;
        });
    },
    [],
  );

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
          if (field.type === "object")
            return {
              ...field,
              children: [...(field.children || []), newChild],
            };
          if (field.type === "array" && field.arrayItemType === "object")
            return {
              ...field,
              arrayChildren: [...(field.arrayChildren || []), newChild],
            };
        }
        if (field.children)
          return {
            ...field,
            children: addChildToParent(field.children, parentId, childType),
          };
        if (field.arrayChildren)
          return {
            ...field,
            arrayChildren: addChildToParent(
              field.arrayChildren,
              parentId,
              childType,
            ),
          };
        return field;
      });
    },
    [],
  );

  // Reorder children within a parent
  const reorderChildren = useCallback(
    (parentId: string | null, activeId: string, overId: string) => {
      setFields((prev) => {
        if (parentId === null) {
          // Reorder root level
          const oldIndex = prev.findIndex((f) => f.id === activeId);
          const newIndex = prev.findIndex((f) => f.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(prev, oldIndex, newIndex);
          }
          return prev;
        }

        // Reorder within a parent
        const reorderInParent = (fields: SchemaField[]): SchemaField[] => {
          return fields.map((field) => {
            if (field.id === parentId) {
              if (field.type === "object" && field.children) {
                const oldIndex = field.children.findIndex(
                  (f) => f.id === activeId,
                );
                const newIndex = field.children.findIndex(
                  (f) => f.id === overId,
                );
                if (oldIndex !== -1 && newIndex !== -1) {
                  return {
                    ...field,
                    children: arrayMove(field.children, oldIndex, newIndex),
                  };
                }
              }
              if (field.type === "array" && field.arrayChildren) {
                const oldIndex = field.arrayChildren.findIndex(
                  (f) => f.id === activeId,
                );
                const newIndex = field.arrayChildren.findIndex(
                  (f) => f.id === overId,
                );
                if (oldIndex !== -1 && newIndex !== -1) {
                  return {
                    ...field,
                    arrayChildren: arrayMove(
                      field.arrayChildren,
                      oldIndex,
                      newIndex,
                    ),
                  };
                }
              }
            }
            if (field.children)
              return { ...field, children: reorderInParent(field.children) };
            if (field.arrayChildren)
              return {
                ...field,
                arrayChildren: reorderInParent(field.arrayChildren),
              };
            return field;
          });
        };

        return reorderInParent(prev);
      });
    },
    [],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderChildren(null, active.id as string, over.id as string);
    }
  };

  const handleUpdate = useCallback(
    (id: string, updates: Partial<SchemaField>) =>
      setFields((prev) => updateFieldRecursive(prev, id, updates)),
    [updateFieldRecursive],
  );
  const handleRemove = useCallback(
    (id: string) => setFields((prev) => removeFieldRecursive(prev, id)),
    [removeFieldRecursive],
  );
  const handleAddChild = useCallback(
    (parentId: string, type: FieldType) =>
      setFields((prev) => addChildToParent(prev, parentId, type)),
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
        <CardHeader className="py-3 px-4 border-b shrink-0 bg-gradient-to-r from-violet-500/5 to-transparent">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Braces className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">Schema Builder</CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  {fields.length} fields • Drag to reorder
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-muted/50 rounded-md px-2 py-1">
                <span className="text-[10px] text-muted-foreground">
                  Generate
                </span>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-12 h-6 text-xs text-center border-0 bg-background/50"
                  min={1}
                  max={100}
                />
                <span className="text-[10px] text-muted-foreground">items</span>
              </div>
              <Button
                onClick={generate}
                size="sm"
                className="h-8 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/25"
              >
                <Shuffle className="h-3.5 w-3.5 mr-1.5" /> Generate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  depth={0}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  onAddChild={handleAddChild}
                  onReorderChildren={reorderChildren}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex gap-2 mt-4 pt-3 border-t border-dashed">
            <Button
              variant="outline"
              onClick={() => addRootField("value")}
              size="sm"
              className="h-8 text-xs gap-1.5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              <Hash className="h-3 w-3" /> Value
            </Button>
            <Button
              variant="outline"
              onClick={() => addRootField("object")}
              size="sm"
              className="h-8 text-xs gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
            >
              <Braces className="h-3 w-3" /> Object
            </Button>
            <Button
              variant="outline"
              onClick={() => addRootField("array")}
              size="sm"
              className="h-8 text-xs gap-1.5 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <List className="h-3 w-3" /> Array
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b shrink-0 bg-gradient-to-r from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Download className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">Generated Output</CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  {output
                    ? `${output.split("\n").length} lines`
                    : "Ready to generate"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                disabled={!output}
                className="h-8 w-8 hover:bg-emerald-500/10"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadJson}
                disabled={!output}
                className="h-8 w-8 hover:bg-emerald-500/10"
                title="Download JSON"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <Textarea
            value={output}
            readOnly
            className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0 bg-muted/20"
            placeholder="Click Generate to create mock data..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
