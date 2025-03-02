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
  theme?: "light" | "dark" | "evening";
  credits?: number;
}

const GenerateButton = ({
  onClick = () => {},
  onFastGenerate = () => {},
  isLoading = false,
  disabled = false,
  text = "Generate Image",
  estimatedTime = 15,
  theme = "light",
  credits = 10,
}: GenerateButtonProps) => {
  const getContainerBg = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800";
      case "evening":
        return "bg-indigo-800";
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
          className="flex-1 h-[50px] text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg rounded-xl"
          onClick={onClick}
          disabled={disabled || isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              {text}
            </>
          )}
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-[50px] aspect-square rounded-xl bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900 dark:border-blue-800 dark:hover:bg-blue-800"
                onClick={onFastGenerate}
                disabled={disabled || isLoading || credits <= 0}
              >
                <Sparkles className="h-5 w-5 text-blue-500 dark:text-blue-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fast generation (uses 1 credit)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-between w-full text-xs px-1">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-gray-500" />
          <span
            className={theme === "light" ? "text-gray-500" : "text-gray-300"}
          >
            Est. time: {estimatedTime}s
          </span>
        </div>
        <div className={theme === "light" ? "text-gray-500" : "text-gray-300"}>
          Credits: {credits}
        </div>
      </div>
    </div>
  );
};

export default GenerateButton;
