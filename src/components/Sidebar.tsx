import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Palette,
  Image as ImageIcon,
  Wand2,
  Layers,
  Settings,
  History,
  Brush,
  Sparkles,
  Box,
  Filter,
  Sliders,
  Shapes,
  Droplet,
  Eraser,
  Type,
  Star,
  Heart,
  Square,
  Circle,
  Triangle,
  Pipette,
  Sticker,
  Stamp,
  Scissors,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Download,
  Share2,
  Undo2,
  Redo2,
  Save,
  Trash2,
  Pen,
  Highlighter,
  Spline,
  Lightbulb,
  Zap,
  Flame,
  Snowflake,
  Cloud,
  Sun,
  Moon,
  Sunset,
} from "lucide-react";

interface SidebarProps {
  onSelectFeature: (feature: string) => void;
  activeFeature: string;
}

const Sidebar = ({ onSelectFeature, activeFeature }: SidebarProps) => {
  // State to track if sidebar is collapsed on mobile
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const features = [
    {
      id: "text-to-image",
      name: "Text to Image",
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      id: "drawing",
      name: "Drawing Tools",
      icon: <Brush className="h-5 w-5" />,
      subFeatures: [
        {
          id: "advanced-drawing",
          name: "Advanced Drawing",
          icon: <Brush className="h-4 w-4" />,
        },
      ],
    },
    {
      id: "styles",
      name: "Styles",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      id: "filters",
      name: "Filters",
      icon: <Filter className="h-5 w-5" />,
      subFeatures: [
        {
          id: "artistic",
          name: "Artistic",
          icon: <Palette className="h-4 w-4" />,
        },
        {
          id: "color",
          name: "Color",
          icon: <Droplet className="h-4 w-4" />,
        },
        {
          id: "effects",
          name: "Effects",
          icon: <Sparkles className="h-4 w-4" />,
        },
        {
          id: "atmosphere",
          name: "Atmosphere",
          icon: <Cloud className="h-4 w-4" />,
        },
      ],
    },
    {
      id: "3d-model",
      name: "3D Model",
      icon: <Box className="h-5 w-5" />,
    },
    {
      id: "image-editor",
      name: "Image Editor",
      icon: <Sliders className="h-5 w-5" />,
      subFeatures: [
        {
          id: "crop",
          name: "Crop",
          icon: <Crop className="h-4 w-4" />,
        },
        {
          id: "rotate",
          name: "Rotate",
          icon: <RotateCw className="h-4 w-4" />,
        },
        {
          id: "flip",
          name: "Flip",
          icon: <FlipHorizontal className="h-4 w-4" />,
        },
        {
          id: "adjust",
          name: "Adjust",
          icon: <Sliders className="h-4 w-4" />,
        },
      ],
    },
    {
      id: "history",
      name: "History",
      icon: <History className="h-5 w-5" />,
    },
    {
      id: "settings",
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={`${collapsed ? "w-16" : "w-64"} md:h-screen bg-black text-white border-r border-gray-800 flex flex-col transition-all duration-300 md:w-64 overflow-y-auto`}
    >
      <button
        className="md:hidden absolute top-4 right-[-12px] z-10 bg-gray-800 rounded-full p-1 shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {collapsed ? (
            <path d="M9 18l6-6-6-6" />
          ) : (
            <path d="M15 18l-6-6 6-6" />
          )}
        </svg>
      </button>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="md:block">
              <h1 className="text-xl font-bold">AI Image Generator</h1>
              <p className="text-xs opacity-70">
                Turn imagination into reality
              </p>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-6">
          {features.map((feature) => (
            <div key={feature.id} className="space-y-1">
              <Button
                variant={activeFeature === feature.id ? "default" : "ghost"}
                className={`w-full justify-start ${activeFeature === feature.id ? "bg-gray-800" : ""}`}
                onClick={() => onSelectFeature(feature.id)}
              >
                <div className="flex items-center">
                  {feature.icon}
                  {!collapsed && (
                    <span className="ml-2 md:inline">{feature.name}</span>
                  )}
                </div>
              </Button>

              {feature.subFeatures && activeFeature === feature.id && (
                <div className="ml-6 space-y-1 mt-2">
                  {feature.subFeatures.map((subFeature) => (
                    <Button
                      key={subFeature.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => onSelectFeature(subFeature.id)}
                    >
                      <div className="flex items-center">
                        {subFeature.icon}
                        {!collapsed && (
                          <span className="ml-2 md:inline">
                            {subFeature.name}
                          </span>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <Button variant="outline" className="w-full">
          <Wand2 className="h-4 w-4 mr-2" />
          {!collapsed && <span className="md:inline">Premium Features</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

// Add Pencil icon since it's not imported from lucide-react
const Pencil = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);
