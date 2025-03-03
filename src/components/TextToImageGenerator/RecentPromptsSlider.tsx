import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Star, Clock } from "lucide-react";

interface RecentPromptsSliderProps {
  recentPrompts: string[];
  onSelectPrompt: (prompt: string) => void;
  theme?: "light" | "dark" | "evening";
  title?: string;
  showStar?: boolean;
}

const RecentPromptsSlider = ({
  recentPrompts = [],
  onSelectPrompt,
  theme = "light",
  title = "Recent Prompts",
  showStar = true,
}: RecentPromptsSliderProps) => {
  // Get theme-based styling
  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 border-gray-700";
      case "evening":
        return "bg-indigo-800 border-indigo-700";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case "dark":
      case "evening":
        return "text-white";
      default:
        return "text-gray-900";
    }
  };

  const getMutedTextColor = () => {
    switch (theme) {
      case "dark":
        return "text-gray-400";
      case "evening":
        return "text-indigo-200";
      default:
        return "text-gray-500";
    }
  };

  const getButtonStyle = () => {
    switch (theme) {
      case "dark":
        return "border-gray-700 hover:bg-gray-700";
      case "evening":
        return "border-indigo-700 hover:bg-indigo-700";
      default:
        return "border-gray-200 hover:bg-gray-100";
    }
  };

  if (recentPrompts.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full p-4 rounded-xl border ${getBackgroundColor()} shadow-sm transition-colors duration-200`}
    >
      <div className="flex items-center mb-3">
        {showStar ? (
          <Star
            className={`h-4 w-4 mr-2 ${theme === "evening" ? "text-indigo-300" : "text-yellow-500"}`}
          />
        ) : (
          <Clock className={`h-4 w-4 mr-2 ${getMutedTextColor()}`} />
        )}
        <h3 className={`text-sm font-medium ${getTextColor()}`}>{title}</h3>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          {recentPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelectPrompt(prompt)}
              className={`${getButtonStyle()} ${getTextColor()} text-xs whitespace-normal text-left h-auto py-2 px-3 min-w-[150px] max-w-[250px] truncate`}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentPromptsSlider;
