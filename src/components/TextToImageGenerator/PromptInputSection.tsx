import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  Mic,
  Image as ImageIcon,
  Eraser,
  History,
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
  theme = "light",
  recentPrompts = [
    "A futuristic cityscape with flying cars",
    "A serene mountain landscape at sunset",
    "A photorealistic portrait of a cyberpunk character",
  ],
}: PromptInputSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);

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

  const getInputBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-700 border-gray-600";
      case "evening":
        return "bg-indigo-700 border-indigo-600";
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

  return (
    <div
      className={`w-full p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-4 w-full justify-start bg-transparent">
          <TabsTrigger
            value="text"
            className={`${getTextColor()} data-[state=active]:bg-blue-500 data-[state=active]:text-white`}
          >
            Text to Image
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className={`${getTextColor()} data-[state=active]:bg-blue-500 data-[state=active]:text-white`}
          >
            Image to Image
          </TabsTrigger>
          <TabsTrigger
            value="inpaint"
            className={`${getTextColor()} data-[state=active]:bg-blue-500 data-[state=active]:text-white`}
          >
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
              placeholder="Describe the image you want to generate..."
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
                      className="rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
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
                      className={`rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
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
                      className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
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

          <div className={`flex flex-wrap gap-2 ${getMutedTextColor()}`}>
            <span className="text-sm font-medium">Try:</span>
            {recentPrompts.map((text, index) => (
              <button
                key={index}
                onClick={() => useRecentPrompt(text)}
                className={`text-sm px-3 py-1 rounded-full border ${theme === "light" ? "border-gray-300 hover:bg-gray-100" : "border-gray-600 hover:bg-gray-700"}`}
              >
                {text}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <h2 className={`text-xl font-semibold ${getTextColor()}`}>
            Upload Reference Image
          </h2>

          <div
            className={`border-2 border-dashed ${theme === "light" ? "border-gray-300" : "border-gray-600"} rounded-lg p-8 text-center`}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <ImageIcon className={`h-12 w-12 ${getMutedTextColor()}`} />
              <div>
                <p className={getTextColor()}>Drag & drop an image here</p>
                <p className={getMutedTextColor()}>or</p>
              </div>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
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
        </TabsContent>

        <TabsContent value="inpaint" className="space-y-4">
          <h2 className={`text-xl font-semibold ${getTextColor()}`}>
            Inpainting
          </h2>
          <p className={getMutedTextColor()}>
            Upload an image and paint over the areas you want to modify
          </p>

          <div
            className={`border-2 border-dashed ${theme === "light" ? "border-gray-300" : "border-gray-600"} rounded-lg p-8 text-center`}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <ImageIcon className={`h-12 w-12 ${getMutedTextColor()}`} />
              <p className={getTextColor()}>
                Upload an image to start inpainting
              </p>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptInputSection;
