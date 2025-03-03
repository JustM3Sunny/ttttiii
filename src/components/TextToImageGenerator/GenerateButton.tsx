import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GenerateButtonProps {
  onClick?: () => void;
  onFastGenerate?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text?: string;
  estimatedTime?: number; // in seconds
  theme?: "light" | "dark" | "evening" | "luxury" | "neon";
  credits?: number;
}

const GenerateButton = ({
  onClick = () => {},
  onFastGenerate = () => {},
  isLoading = false,
  disabled = false,
  text = "Generate Image",
  estimatedTime = 15,
  theme = "dark",
  credits = 30,
}: GenerateButtonProps) => {
  const getContainerBg = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900";
      case "evening":
        return "bg-indigo-900/90 backdrop-blur-sm";
      case "luxury":
        return "bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-700/30";
      case "neon":
        return "bg-black border border-pink-600/30";
      default:
        return "bg-white";
    }
  };

  return (
    <div
      className={`w-full max-w-[400px] ${getContainerBg()} flex flex-col items-center justify-center gap-2 p-2 rounded-xl`}
    >
      <div className="w-full flex gap-2">
        <Button
          className={`flex-1 h-[60px] text-lg font-medium transition-all duration-300 shadow-lg rounded-xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700"
              : theme === "evening"
                ? "bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600"
                : theme === "luxury"
                  ? "bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500"
                  : theme === "neon"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          }`}
          onClick={onClick}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{text}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              <span>{text}</span>
            </div>
          )}
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={`h-[60px] w-[60px] flex items-center justify-center rounded-xl ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : theme === "evening"
                      ? "bg-indigo-800 border-indigo-700 hover:bg-indigo-700"
                      : theme === "luxury"
                        ? "bg-gray-800 border-amber-700 hover:bg-gray-700"
                        : theme === "neon"
                          ? "bg-gray-900 border-pink-600 hover:bg-gray-800"
                          : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                }`}
                onClick={onFastGenerate}
                disabled={disabled || isLoading || credits <= 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${theme === "dark" || theme === "evening" || theme === "luxury" || theme === "neon" ? "text-white" : "text-gray-900"}`}
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fast Generate (Uses 1 Credit)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="w-full flex justify-between items-center text-xs">
        <div
          className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : theme === "evening" ? "text-indigo-200" : theme === "luxury" ? "text-amber-200" : theme === "neon" ? "text-pink-300" : "text-gray-500"}`}
        >
          <Clock className="h-3 w-3" />
          <span>~{estimatedTime}s</span>
        </div>
        <div
          className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : theme === "evening" ? "text-indigo-200" : theme === "luxury" ? "text-amber-200" : theme === "neon" ? "text-pink-300" : "text-gray-500"}`}
        >
          <span>Credits: {credits}</span>
        </div>
      </div>
    </div>
  );
};

export default GenerateButton;
