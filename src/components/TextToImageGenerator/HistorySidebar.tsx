import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2, Edit, X } from "lucide-react";

interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onDownload: (item: HistoryItem) => void;
  onShare: (item: HistoryItem) => void;
  onEdit: (item: HistoryItem) => void;
  theme?: "light" | "dark" | "evening";
}

const HistorySidebar = ({
  history = [],
  onClose,
  onSelect,
  onDownload,
  onShare,
  onEdit,
  theme = "dark",
}: HistorySidebarProps) => {
  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900";
      case "evening":
        return "bg-gradient-to-br from-indigo-950 to-purple-950";
      default:
        return "bg-white";
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`h-full flex flex-col ${getBackgroundColor()} ${getTextColor()} border-l border-gray-800`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <h2 className="font-bold">Generation History</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-400">
            <Clock className="h-12 w-12 mb-2 opacity-50" />
            <p>No history yet</p>
            <p className="text-sm">Generated images will appear here</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="relative aspect-video">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs text-white">
                        {formatTime(item.timestamp)}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(item);
                          }}
                        >
                          <Download className="h-3 w-3 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(item);
                          }}
                        >
                          <Share2 className="h-3 w-3 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                        >
                          <Edit className="h-3 w-3 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs truncate">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HistorySidebar;
