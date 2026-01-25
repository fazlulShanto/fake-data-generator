import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  FileCheck2,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

interface ValidationError {
  path: string;
  message: string;
  keyword: string;
}

export function JsonSchemaValidator() {
  const [jsonData, setJsonData] = useState("");
  const [jsonSchema, setJsonSchema] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const validate = () => {
    setErrors([]);
    setIsValid(null);
    setParseError(null);

    if (!jsonData.trim() || !jsonSchema.trim()) {
      setParseError("Please provide both JSON data and schema");
      return;
    }

    let data: unknown;
    let schema: unknown;

    try {
      data = JSON.parse(jsonData);
    } catch (e) {
      setParseError(`Invalid JSON data: ${(e as Error).message}`);
      return;
    }

    try {
      schema = JSON.parse(jsonSchema);
    } catch (e) {
      setParseError(`Invalid JSON schema: ${(e as Error).message}`);
      return;
    }

    try {
      const validateFn = ajv.compile(schema as object);
      const valid = validateFn(data);

      if (valid) {
        setIsValid(true);
        setErrors([]);
      } else {
        setIsValid(false);
        const validationErrors: ValidationError[] = (
          validateFn.errors || []
        ).map((err) => ({
          path: err.instancePath || "/",
          message: err.message || "Unknown error",
          keyword: err.keyword,
        }));
        setErrors(validationErrors);
      }
    } catch (e) {
      setParseError(`Schema error: ${(e as Error).message}`);
    }
  };

  const handlePasteData = async () => {
    const text = await navigator.clipboard.readText();
    setJsonData(text);
  };

  const handlePasteSchema = async () => {
    const text = await navigator.clipboard.readText();
    setJsonSchema(text);
  };

  const loadExampleSchema = () => {
    setJsonSchema(
      JSON.stringify(
        {
          $schema: "http://json-schema.org/draft-07/schema#",
          type: "object",
          properties: {
            name: { type: "string", minLength: 1 },
            age: { type: "integer", minimum: 0 },
            email: { type: "string", format: "email" },
          },
          required: ["name", "email"],
        },
        null,
        2,
      ),
    );
  };

  const loadExampleData = () => {
    setJsonData(
      JSON.stringify(
        {
          name: "John Doe",
          age: 30,
          email: "john@example.com",
        },
        null,
        2,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">
            Validate JSON data against a JSON Schema
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadExampleData}
            className="h-7 text-xs"
          >
            Example Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadExampleSchema}
            className="h-7 text-xs"
          >
            Example Schema
          </Button>
          <Button size="sm" onClick={validate} className="h-7">
            <FileCheck2 className="h-3 w-3 mr-1" /> Validate
          </Button>
        </div>
      </div>

      {/* Input Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* JSON Data */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">JSON Data</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePasteData}
                className="h-7"
              >
                <Upload className="h-3 w-3 mr-1" /> Paste
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0"
              placeholder='{"name": "John", "age": 30}'
            />
          </CardContent>
        </Card>

        {/* JSON Schema */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">JSON Schema</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePasteSchema}
                className="h-7"
              >
                <Upload className="h-3 w-3 mr-1" /> Paste
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <Textarea
              value={jsonSchema}
              onChange={(e) => setJsonSchema(e.target.value)}
              className="h-full w-full font-mono text-xs border-0 rounded-none resize-none focus-visible:ring-0"
              placeholder='{"type": "object", "properties": {...}}'
            />
          </CardContent>
        </Card>
      </div>

      {/* Result */}
      {parseError && (
        <Card className="border-destructive shrink-0">
          <CardContent className="py-2 px-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-destructive text-xs">{parseError}</p>
          </CardContent>
        </Card>
      )}

      {isValid !== null && (
        <Card
          className={`shrink-0 ${isValid ? "border-green-500/50" : "border-destructive/50"}`}
        >
          <CardHeader className="py-2 px-3 border-b">
            <div className="flex items-center gap-2">
              {isValid ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <CardTitle className="text-sm text-green-500">
                    Valid
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    JSON data matches the schema
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-sm text-destructive">
                    Invalid
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-destructive border-destructive text-[10px]"
                  >
                    {errors.length} error{errors.length !== 1 ? "s" : ""}
                  </Badge>
                </>
              )}
            </div>
          </CardHeader>
          {!isValid && errors.length > 0 && (
            <CardContent className="py-2 px-3 max-h-32 overflow-auto">
              <div className="space-y-1">
                {errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs p-1.5 bg-destructive/10 rounded"
                  >
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] font-mono"
                    >
                      {err.path || "/"}
                    </Badge>
                    <span className="text-destructive">{err.message}</span>
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-[10px] ml-auto"
                    >
                      {err.keyword}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
