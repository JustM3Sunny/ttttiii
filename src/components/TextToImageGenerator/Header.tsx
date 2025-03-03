import React from "react";
import {
  HelpCircleIcon,
  SettingsIcon,
  UserIcon,
  ImageIcon,
  Sparkles,
  Crown,
  Palette,
  History,
  BookOpen,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSelector from "./ThemeSelector";

interface HeaderProps {
  title?: string;
  onThemeChange?: (
    theme: "light" | "dark" | "evening" | "luxury" | "neon",
  ) => void;
  currentTheme?: "light" | "dark" | "evening" | "luxury" | "neon";
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenProfile?: () => void;
}

const Header = ({
  title = "AI Image Generator",
  onThemeChange = () => {},
  currentTheme = "light",
  onOpenSettings = () => {},
  onOpenHelp = () => {},
  onOpenProfile = () => {},
}: HeaderProps) => {
  const getHeaderBackground = () => {
    switch (currentTheme) {
      case "dark":
        return "bg-gray-900 border-b border-gray-800";
      case "evening":
        return "bg-gradient-to-r from-indigo-950 to-purple-950 border-b border-indigo-800";
      case "luxury":
        return "bg-gradient-to-r from-gray-900 to-gray-800 border-b border-amber-700/50";
      case "neon":
        return "bg-black border-b border-pink-600/50";
      default:
        return "bg-white border-b border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (currentTheme) {
      case "dark":
      case "evening":
      case "luxury":
      case "neon":
        return "text-white";
      default:
        return "text-gray-900";
    }
  };

  const getLogoGradient = () => {
    switch (currentTheme) {
      case "luxury":
        return "from-amber-500 to-yellow-300";
      case "neon":
        return "from-pink-500 to-purple-500";
      case "evening":
        return "from-indigo-500 to-purple-500";
      default:
        return "from-purple-600 to-blue-500";
    }
  };

  return (
    <div
      className={`w-full shadow-md p-4 sticky top-0 z-10 ${getHeaderBackground()} ${getTextColor()}`}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getLogoGradient()} flex items-center justify-center shadow-lg`}
          >
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center">{title}</h1>
            <p className="text-xs opacity-70">Turn imagination into reality</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 lg:space-x-6 overflow-x-auto">
          <Button variant="ghost" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Styles</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Projects</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>History</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Tutorials</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onOpenHelp}
          >
            <HelpCircleIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onOpenSettings}
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${currentTheme === "luxury" ? "bg-amber-800/30" : currentTheme === "neon" ? "bg-pink-900/30" : ""}`}
            onClick={onOpenProfile}
          >
            <UserIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
