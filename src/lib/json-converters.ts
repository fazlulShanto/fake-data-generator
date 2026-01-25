// JSON to TypeScript interface generator

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function getTypeFromValue(
  value: JsonValue,
  key: string,
  indent: number,
): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const itemType = getTypeFromValue(value[0], key, indent);
    return `${itemType}[]`;
  }
  if (typeof value === "object") {
    return generateInterface(value, capitalize(key), indent);
  }
  return typeof value;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelToTitle(str: string): string {
  return str.replace(/([A-Z])/g, " $1").trim();
}

function generateInterface(
  obj: { [key: string]: JsonValue },
  name: string,
  indent: number = 0,
): string {
  const spaces = "  ".repeat(indent);
  const innerSpaces = "  ".repeat(indent + 1);

  const lines: string[] = [];
  const nestedInterfaces: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const nestedName = capitalize(key);
      nestedInterfaces.push(
        generateInterfaceDeclaration(value, nestedName, indent),
      );
      lines.push(`${innerSpaces}${key}: ${nestedName};`);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null
    ) {
      const nestedName = capitalize(key.replace(/s$/, ""));
      nestedInterfaces.push(
        generateInterfaceDeclaration(
          value[0] as { [key: string]: JsonValue },
          nestedName,
          indent,
        ),
      );
      lines.push(`${innerSpaces}${key}: ${nestedName}[];`);
    } else {
      const type = getTypeFromValue(value, key, indent);
      lines.push(`${innerSpaces}${key}: ${type};`);
    }
  }

  const interfaceBody = `{\n${lines.join("\n")}\n${spaces}}`;

  if (nestedInterfaces.length > 0) {
    return (
      nestedInterfaces.join("\n\n") +
      "\n\n" +
      `${spaces}interface ${name} ${interfaceBody}`
    );
  }

  return `${spaces}interface ${name} ${interfaceBody}`;
}

function generateInterfaceDeclaration(
  obj: { [key: string]: JsonValue },
  name: string,
  indent: number = 0,
): string {
  const spaces = "  ".repeat(indent);
  const innerSpaces = "  ".repeat(indent + 1);

  const lines: string[] = [];
  const nestedInterfaces: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const nestedName = capitalize(key);
      nestedInterfaces.push(
        generateInterfaceDeclaration(value, nestedName, indent),
      );
      lines.push(`${innerSpaces}${key}: ${nestedName};`);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null
    ) {
      const nestedName = capitalize(key.replace(/s$/, ""));
      nestedInterfaces.push(
        generateInterfaceDeclaration(
          value[0] as { [key: string]: JsonValue },
          nestedName,
          indent,
        ),
      );
      lines.push(`${innerSpaces}${key}: ${nestedName}[];`);
    } else {
      const type = getTypeFromValue(value, key, indent);
      lines.push(`${innerSpaces}${key}: ${type};`);
    }
  }

  const result = `${spaces}interface ${name} {\n${lines.join("\n")}\n${spaces}}`;

  if (nestedInterfaces.length > 0) {
    return nestedInterfaces.join("\n\n") + "\n\n" + result;
  }

  return result;
}

export function jsonToTypeScript(
  json: string,
  rootName: string = "Root",
): string {
  try {
    const parsed = JSON.parse(json);

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) return `type ${rootName} = unknown[];`;
      const itemType = generateInterfaceDeclaration(
        parsed[0],
        rootName + "Item",
      );
      return itemType + `\n\ntype ${rootName} = ${rootName}Item[];`;
    }

    return generateInterfaceDeclaration(parsed, rootName);
  } catch {
    throw new Error("Invalid JSON");
  }
}

// JSON to Zod schema generator

function getZodTypeFromValue(value: JsonValue, key: string): string {
  if (value === null) return "z.null()";
  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";
    const itemType = getZodTypeFromValue(value[0], key);
    return `z.array(${itemType})`;
  }
  if (typeof value === "object") {
    return generateZodObject(value, capitalize(key));
  }
  switch (typeof value) {
    case "string":
      return "z.string()";
    case "number":
      return Number.isInteger(value) ? "z.number().int()" : "z.number()";
    case "boolean":
      return "z.boolean()";
    default:
      return "z.unknown()";
  }
}

function generateZodObject(
  obj: { [key: string]: JsonValue },
  _name: string,
): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const zodType = getZodTypeFromValue(value, key);
    lines.push(`  ${key}: ${zodType},`);
  }

  return `z.object({\n${lines.join("\n")}\n})`;
}

export function jsonToZod(json: string, schemaName: string = "schema"): string {
  try {
    const parsed = JSON.parse(json);

    const importStatement = 'import { z } from "zod";\n\n';

    if (Array.isArray(parsed)) {
      if (parsed.length === 0)
        return importStatement + `const ${schemaName} = z.array(z.unknown());`;
      const itemSchema = generateZodObject(parsed[0], schemaName + "Item");
      return importStatement + `const ${schemaName} = z.array(${itemSchema});`;
    }

    const schema = generateZodObject(parsed, schemaName);
    return (
      importStatement +
      `const ${schemaName} = ${schema};\n\nexport type ${capitalize(schemaName)} = z.infer<typeof ${schemaName}>;`
    );
  } catch {
    throw new Error("Invalid JSON");
  }
}
