import { Button } from "@/components/ui/button";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/ui/menu";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative overflow-hidden"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <MenuPopup align="end" sideOffset={8}>
        <MenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="h-4 w-4" />
          Light
          {theme === "light" && (
            <Check className="h-4 w-4 ml-auto text-primary" />
          )}
        </MenuItem>
        <MenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="h-4 w-4" />
          Dark
          {theme === "dark" && (
            <Check className="h-4 w-4 ml-auto text-primary" />
          )}
        </MenuItem>
        <MenuItem onClick={() => setTheme("system")} className="gap-2">
          <Monitor className="h-4 w-4" />
          System
          {theme === "system" && (
            <Check className="h-4 w-4 ml-auto text-primary" />
          )}
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
