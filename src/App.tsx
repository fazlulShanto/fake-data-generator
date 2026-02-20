import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/generator" replace />,
  },
  {
    path: "/:toolId",
    Component: Layout,
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="json-tools-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
