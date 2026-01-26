import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="json-tools-theme">
      <Routes>
        <Route path="/" element={<Navigate to="/generator" replace />} />
        <Route path="/:toolId" element={<Layout />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
