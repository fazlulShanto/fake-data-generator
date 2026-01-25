# JSON Tools

A powerful, all-in-one suite of JSON utilities built with React, Vite, and Tailwind CSS. Designed for developers who work with data daily.

![JSON Tools Screenshot](https://raw.githubusercontent.com/fazlulShanto/fake-data-generator/main/public/screenshot.png)
_(Note: You may need to add a screenshot to your repo)_

## 🚀 Features

### 🛠️ Data Generator

- **Visual Schema Builder**: Create complex nested JSON structures using a drag-and-drop interface.
- **Rich Data Types**: Built on [FakerJS](https://fakerjs.dev/) to generate realistic data (Names, Emails, UUIDs, Dates, etc.).
- **Nested Support**: Create Objects and Arrays with infinite nesting depth.
- **Drag & Drop**: Reorder fields effortlessly using `@dnd-kit`.
- **Export**: Copy to clipboard or download as `.json` file.

### 🔍 JSON Viewer & Editor

- **Interactive Tree View**: Explore deep JSON structures with collapsible nodes.
- **Search**: Value and key search within the tree.
- **Type Highlighting**: Color-coded values for strings, numbers, booleans, etc.

### ✅ Validators & Fixers

- **Syntax Validator**: Checks for valid JSON and points out syntax errors with line numbers.
- **Schema Validator**: Validate JSON data against **JSON Schema (Draft-07)** using `ajv`.
- **Auto-Repair**: Automatically fix malformed JSON (missing quotes, trailing commas) using `jsonrepair`.

### 🔄 Converters & Formatters

- **Formatter**: Beautify (indent) or Minify JSON to save space.
- **Diff Tool**: Compare two JSON objects side-by-side to spot additions, deletions, and changes.
- **TypeScript Generator**: Instantly generate TypeScript definitions from JSON.
- **Zod Schema Generator**: Create Zod validation schemas from your data.

### 🎨 UI & UX

- **Modern Design**: Sleek, glassmorphism-inspired UI with a deep navy dark mode.
- **Theme Support**: Light, Dark, and System modes with persistent preference.
- **Responsive Layout**: Collapsible sidebar for maximum workspace.
- **Keyboard Accessible**: Full keyboard navigation support.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Validation**: [Ajv](https://ajv.js.org/)
- **Utilities**: `jsonrepair`, `faker`, `clsx`, `tailwind-merge`

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fazlulShanto/fake-data-generator.git
   cd fake-data-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Build for production**
   ```bash
   pnpm build
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
