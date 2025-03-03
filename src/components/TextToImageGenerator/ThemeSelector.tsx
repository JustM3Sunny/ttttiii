import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoonIcon,
  SunIcon,
  SunsetIcon,
  Sparkles,
  Crown,
  Palette,
} from "lucide-react";

interface ThemeSelectorProps {
  currentTheme: "light" | "dark" | "evening" | "luxury" | "neon";
  onThemeChange: (
    theme: "light" | "dark" | "evening" | "luxury" | "neon",
  ) => void;
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const getThemeIcon = () => {
    switch (currentTheme) {
      case "dark":
        return <MoonIcon className="h-5 w-5" />;
      case "evening":
        return <SunsetIcon className="h-5 w-5" />;
      case "luxury":
        return <Crown className="h-5 w-5" />;
      case "neon":
        return <Sparkles className="h-5 w-5" />;
      default:
        return <SunIcon className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {getThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onThemeChange("dark")}>
          <MoonIcon className="mr-2 h-4 w-4" />
          <span>Dark Mode</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
