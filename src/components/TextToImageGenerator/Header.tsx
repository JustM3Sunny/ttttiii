import React from "react";
import {
  MoonIcon,
  SunIcon,
  SunsetIcon,
  HelpCircleIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title?: string;
  onThemeChange?: (theme: "light" | "dark" | "evening") => void;
  currentTheme?: "light" | "dark" | "evening";
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
  return (
    <div
      className={`w-full shadow-sm p-4 sticky top-0 z-10 ${currentTheme === "dark" ? "bg-gray-900 text-white" : currentTheme === "evening" ? "bg-indigo-900 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {currentTheme === "dark" ? (
                  <MoonIcon className="h-5 w-5" />
                ) : currentTheme === "evening" ? (
                  <SunsetIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onThemeChange("light")}>
                <SunIcon className="mr-2 h-4 w-4" />
                <span>Light Mode</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onThemeChange("dark")}>
                <MoonIcon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onThemeChange("evening")}>
                <SunsetIcon className="mr-2 h-4 w-4" />
                <span>Evening Mode</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            className="rounded-full"
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
