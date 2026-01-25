import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  JsonGenerator,
  JsonViewer,
  JsonValidator,
  JsonRepair,
  JsonFormatter,
  JsonDiff,
  JsonToTypescript,
  JsonToZod,
  JsonSchemaValidator,
} from "@/components/json-tools";
import {
  Shuffle,
  Eye,
  CheckCircle,
  Wrench,
  Maximize2,
  GitCompare,
  FileType,
  Shield,
  Braces,
  PanelLeftClose,
  PanelLeft,
  Github,
  FileCheck2,
  Star,
} from "lucide-react";

type ToolId =
  | "generator"
  | "viewer"
  | "validator"
  | "schema-validator"
  | "repair"
  | "formatter"
  | "diff"
  | "typescript"
  | "zod";

interface ToolItem {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  category: "generate" | "view" | "convert";
  color: string;
}

const tools: ToolItem[] = [
  {
    id: "generator",
    name: "Generator",
    description: "Generate mock data with FakerJS",
    icon: <Shuffle className="h-4 w-4" />,
    component: <JsonGenerator />,
    category: "generate",
    color: "text-violet-500",
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Interactive tree view",
    icon: <Eye className="h-4 w-4" />,
    component: <JsonViewer />,
    category: "view",
    color: "text-blue-500",
  },
  {
    id: "validator",
    name: "Validator",
    description: "Validate JSON syntax",
    icon: <CheckCircle className="h-4 w-4" />,
    component: <JsonValidator />,
    category: "view",
    color: "text-emerald-500",
  },
  {
    id: "schema-validator",
    name: "Schema",
    description: "Validate against JSON Schema",
    icon: <FileCheck2 className="h-4 w-4" />,
    component: <JsonSchemaValidator />,
    category: "view",
    color: "text-teal-500",
  },
  {
    id: "repair",
    name: "Repair",
    description: "Fix malformed JSON",
    icon: <Wrench className="h-4 w-4" />,
    component: <JsonRepair />,
    category: "view",
    color: "text-orange-500",
  },
  {
    id: "formatter",
    name: "Formatter",
    description: "Beautify or minify",
    icon: <Maximize2 className="h-4 w-4" />,
    component: <JsonFormatter />,
    category: "view",
    color: "text-cyan-500",
  },
  {
    id: "diff",
    name: "Diff",
    description: "Compare two JSON objects",
    icon: <GitCompare className="h-4 w-4" />,
    component: <JsonDiff />,
    category: "view",
    color: "text-pink-500",
  },
  {
    id: "typescript",
    name: "→ TypeScript",
    description: "Generate interfaces",
    icon: <FileType className="h-4 w-4" />,
    component: <JsonToTypescript />,
    category: "convert",
    color: "text-blue-400",
  },
  {
    id: "zod",
    name: "→ Zod",
    description: "Generate Zod schemas",
    icon: <Shield className="h-4 w-4" />,
    component: <JsonToZod />,
    category: "convert",
    color: "text-purple-500",
  },
];

export function Layout() {
  const [activeTool, setActiveTool] = useState<ToolId>("generator");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentTool = tools.find((t) => t.id === activeTool);

  const toolsByCategory = {
    generate: tools.filter((t) => t.category === "generate"),
    view: tools.filter((t) => t.category === "view"),
    convert: tools.filter((t) => t.category === "convert"),
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-14" : "w-52"
        } border-r bg-card/50 backdrop-blur-xl flex flex-col transition-all duration-200 shrink-0`}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-2 border-b">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Braces className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">JSON Tools</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 shrink-0 mx-auto"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-4 px-2">
            {/* Generate */}
            <div className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2">
                  Generate
                </p>
              )}
              {toolsByCategory.generate.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-8 ${sidebarCollapsed ? "justify-center px-0 w-10 mx-auto" : "justify-start px-2 w-full"} group`}
                  onClick={() => setActiveTool(tool.id)}
                  title={sidebarCollapsed ? tool.name : undefined}
                >
                  <span
                    className={`${tool.color} group-hover:scale-110 transition-transform shrink-0`}
                  >
                    {tool.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="ml-2 text-xs truncate">{tool.name}</span>
                  )}
                </Button>
              ))}
            </div>

            <Separator className="opacity-50" />

            {/* View / Edit */}
            <div className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2">
                  View / Edit
                </p>
              )}
              {toolsByCategory.view.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-8 ${sidebarCollapsed ? "justify-center px-0 w-10 mx-auto" : "justify-start px-2 w-full"} group`}
                  onClick={() => setActiveTool(tool.id)}
                  title={sidebarCollapsed ? tool.name : undefined}
                >
                  <span
                    className={`${tool.color} group-hover:scale-110 transition-transform shrink-0`}
                  >
                    {tool.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="ml-2 text-xs truncate">{tool.name}</span>
                  )}
                </Button>
              ))}
            </div>

            <Separator className="opacity-50" />

            {/* Convert */}
            <div className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2">
                  Convert
                </p>
              )}
              {toolsByCategory.convert.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-8 ${sidebarCollapsed ? "justify-center px-0 w-10 mx-auto" : "justify-start px-2 w-full"} group`}
                  onClick={() => setActiveTool(tool.id)}
                  title={sidebarCollapsed ? tool.name : undefined}
                >
                  <span
                    className={`${tool.color} group-hover:scale-110 transition-transform shrink-0`}
                  >
                    {tool.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="ml-2 text-xs truncate">{tool.name}</span>
                  )}
                </Button>
              ))}
            </div>
          </nav>
        </ScrollArea>

        {/* GitHub Star Card */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t bg-card/30 mt-auto">
            <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-background/80 shadow-sm ring-1 ring-border/50 shrink-0">
                  <Github className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">Open Source</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    Star us on GitHub
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full h-8 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 border-0"
                onClick={() =>
                  window.open(
                    "https://github.com/fazlulShanto/fake-data-generator",
                    "_blank",
                  )
                }
              >
                <Star className="h-3.5 w-3.5 mr-1.5 fill-white/20" /> Star Repo
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar - Compact */}
        <header className="h-12 flex items-center justify-between px-4 border-b bg-card/30 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`${currentTool?.color}`}>{currentTool?.icon}</span>
            <div>
              <h1 className="text-sm font-semibold leading-none">
                {currentTool?.name}
              </h1>
              <p className="text-[10px] text-muted-foreground">
                {currentTool?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="View on GitHub"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <Github className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content Area - Full Height */}
        <div className="flex-1 overflow-auto p-3">
          <div className="h-full">{currentTool?.component}</div>
        </div>
      </main>
    </div>
  );
}
