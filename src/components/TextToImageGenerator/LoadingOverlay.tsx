import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  theme?: "light" | "dark" | "evening";
}

const LoadingOverlay = ({
  isVisible,
  message = "Processing...",
  theme = "light",
}: LoadingOverlayProps) => {
  if (!isVisible) return null;

  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900/80";
      case "evening":
        return "bg-indigo-900/80";
      default:
        return "bg-white/80";
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

  return (
    <div
      className={`fixed inset-0 ${getBackgroundColor()} flex items-center justify-center z-50 backdrop-blur-sm`}
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className={`text-lg font-medium ${getTextColor()}`}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
