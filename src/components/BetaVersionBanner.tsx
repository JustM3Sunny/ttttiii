import React from "react";
import { AlertTriangle } from "lucide-react";

interface BetaVersionBannerProps {
  theme?: "light" | "dark" | "evening";
}

const BetaVersionBanner = ({ theme = "dark" }: BetaVersionBannerProps) => {
  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-yellow-900/60";
      case "evening":
        return "bg-indigo-900/60";
      default:
        return "bg-yellow-100";
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
      className={`w-full py-2 px-4 ${getBackgroundColor()} flex items-center justify-center`}
    >
      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
      <p className={`text-sm font-medium ${getTextColor()}`}>
        Beta Version: This application is in development. Some features may be
        unstable.
      </p>
    </div>
  );
};

export default BetaVersionBanner;
