import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  Mic,
  Image as ImageIcon,
  Eraser,
  History,
  Upload,
  Camera,
  Palette,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PromptInputSectionProps {
  prompt?: string;
  onPromptChange?: (prompt: string) => void;
  onImageUpload?: (file: File) => void;
  onEnhancePrompt?: () => void;
  theme?: "light" | "dark" | "evening";
  recentPrompts?: string[];
}

const PromptInputSection = ({
  prompt = "",
  onPromptChange = () => {},
  onImageUpload = () => {},
  onEnhancePrompt = () => {},
  theme = "dark",
  recentPrompts = [
    "A futuristic cityscape with flying cars",
    "A serene mountain landscape at sunset",
    "A photorealistic portrait of a cyberpunk character",
  ],
}: PromptInputSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("text");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // In a real implementation, you would use the Web Speech API here
    setTimeout(() => {
      setIsRecording(false);
      onPromptChange(prompt + " (voice recorded text would appear here)");
    }, 2000);
  };

  const clearPrompt = () => {
    onPromptChange("");
  };

  const useRecentPrompt = (text: string) => {
    onPromptChange(text);
  };

  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 border-gray-800";
      case "evening":
        return "bg-indigo-900/90 backdrop-blur-sm border-indigo-800";
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

  const getInputBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 border-gray-700";
      case "evening":
        return "bg-indigo-800 border-indigo-700";
      default:
        return "bg-gray-50 border-gray-300";
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

  const getTabsActiveColor = () => {
    switch (theme) {
      case "dark":
        return "bg-indigo-700 hover:bg-indigo-600";
      case "evening":
        return "bg-indigo-600 hover:bg-indigo-500";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getButtonHoverColor = () => {
    switch (theme) {
      case "dark":
        return "hover:bg-gray-700";
      case "evening":
        return "hover:bg-indigo-700";
      default:
        return "hover:bg-gray-100";
    }
  };

  return (
    <div
      className={`w-full p-4 md:p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start bg-transparent">
          <TabsTrigger
            value="text"
            className={`${getTextColor()} data-[state=active]:${getTabsActiveColor()} data-[state=active]:text-white`}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Text to Image
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className={`${getTextColor()} data-[state=active]:${getTabsActiveColor()} data-[state=active]:text-white`}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Image to Image
          </TabsTrigger>
          <TabsTrigger
            value="inpaint"
            className={`${getTextColor()} data-[state=active]:${getTabsActiveColor()} data-[state=active]:text-white`}
          >
            <Palette className="h-4 w-4 mr-2" />
            Inpainting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <h2 className={`text-xl font-semibold ${getTextColor()}`}>
            Enter Your Prompt
          </h2>

          <div className="relative">
            <textarea
              id="prompt"
              className={`w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputBgColor()} ${getTextColor()} placeholder:${getMutedTextColor()}`}
              placeholder="Describe your image here..."
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
            />

            <div className="absolute right-2 bottom-2 flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearPrompt}
                      className={`rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300`}
                    >
                      <Eraser className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={startVoiceRecording}
                      className={`rounded-full ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"} text-gray-300`}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voice input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onEnhancePrompt}
                      className={`rounded-full ${getTabsActiveColor()} text-white`}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enhance prompt with AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Recent prompts section is hidden for image-to-image mode */}
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <h2 className={`text-xl font-semibold ${getTextColor()}`}>
            Upload Reference Image
          </h2>

          <div
            className={`border-2 border-dashed ${theme === "light" ? "border-gray-300" : "border-gray-700"} rounded-lg p-8 text-center`}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Upload className={`h-8 w-8 ${getMutedTextColor()}`} />
              </div>
              <div>
                <p className={getTextColor()}>Drag & drop an image here</p>
                <p className={getMutedTextColor()}>or</p>
              </div>
              <label className="cursor-pointer">
                <span
                  className={`px-4 py-2 ${getTabsActiveColor()} text-white rounded-md transition-colors`}
                >
                  Browse Files
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
              <p className={`text-xs ${getMutedTextColor()}`}>
                Supported formats: PNG, JPG, WEBP (Max 5MB)
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className={`text-lg font-medium mb-3 ${getTextColor()}`}>
              Additional Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${getTextColor()}`}
                >
                  Prompt Guidance
                </label>
                <textarea
                  className={`w-full h-20 p-3 border rounded-md ${getInputBgColor()} ${getTextColor()}`}
                  placeholder="Add text to guide the transformation..."
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${getTextColor()}`}
                >
                  Transformation Strength
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${getMutedTextColor()}`}>
                    Subtle
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="70"
                    className="w-full"
                  />
                  <span className={`text-xs ${getMutedTextColor()}`}>
                    Strong
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inpaint" className="space-y-4">
          <h2 className={`text-xl font-semibold ${getTextColor()}`}>
            Inpainting
          </h2>
          <p className={getMutedTextColor()}>
            Upload an image and paint over the areas you want to modify
          </p>

          <div
            className={`border-2 border-dashed ${theme === "light" ? "border-gray-300" : "border-gray-700"} rounded-lg p-8 text-center`}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Camera className={`h-8 w-8 ${getMutedTextColor()}`} />
              </div>
              <p className={getTextColor()}>
                Upload an image to start inpainting
              </p>
              <label className="cursor-pointer">
                <span
                  className={`px-4 py-2 ${getTabsActiveColor()} text-white rounded-md transition-colors`}
                >
                  Upload Image
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div className="mt-4">
            <p className={`text-sm ${getMutedTextColor()}`}>
              After uploading, you'll be able to paint areas to modify and
              provide a text prompt for the changes.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptInputSection;
