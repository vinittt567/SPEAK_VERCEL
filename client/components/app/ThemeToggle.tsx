import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle({ onDarkEnabled }: { onDarkEnabled?: () => void }){
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const handleClick = () => {
    if (theme !== "dark") onDarkEnabled?.();
    toggle();
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full"
      onClick={handleClick}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
    </Button>
  );
}
