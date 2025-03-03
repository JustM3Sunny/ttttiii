import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Download,
  Share2,
  Edit,
  Loader2,
  Copy,
  Maximize2,
  ImagePlus,
  Wand2,
  Undo2,
  Redo2,
  Trash2,
  Layers,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Slider } from "../ui/slider";

interface ResultsDisplayProps {
  generatedImage?: string;
  previousVersions?: string[];
  isLoading?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
  onModify?: () => void;
  onCopy?: () => void;
  onFullscreen?: () => void;
  onVariation?: () => void;
  onUpscale?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  theme?: "light" | "dark" | "evening";
  canUndo?: boolean;
  canRedo?: boolean;
}

const ResultsDisplay = ({
  generatedImage = "",
  previousVersions = [],
  isLoading = false,
  onDownload = () => {},
  onShare = () => {},
  onModify = () => {},
  onCopy = () => {},
  onFullscreen = () => {},
  onVariation = () => {},
  onUpscale = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onDelete = () => {},
  theme = "light",
  canUndo = false,
  canRedo = false,
}: ResultsDisplayProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Get theme-based styling
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

  const getCardBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-950";
      case "evening":
        return "bg-indigo-950";
      default:
        return "bg-gray-50";
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

  const getLoadingBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800";
      case "evening":
        return "bg-indigo-800";
      default:
        return "bg-gray-100";
    }
  };

  const getImageStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    };
  };

  return (
    <div
      className={`w-full max-w-[1400px] mx-auto p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${getTextColor()}`}>
          Generated Image
        </h2>

        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="h-8 w-8 rounded-full"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="h-8 w-8 rounded-full"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger
            value="preview"
            className={`flex items-center gap-1 data-[state=active]:${theme === "evening" ? "bg-indigo-600" : "bg-blue-500"} data-[state=active]:text-white`}
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="adjust"
            className={`flex items-center gap-1 data-[state=active]:${theme === "evening" ? "bg-indigo-600" : "bg-blue-500"} data-[state=active]:text-white`}
          >
            Adjust
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className={`flex items-center gap-1 data-[state=active]:${theme === "evening" ? "bg-indigo-600" : "bg-blue-500"} data-[state=active]:text-white`}
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card
            className={`w-full overflow-hidden border-0 ${getCardBgColor()}`}
          >
            <CardContent className="p-0">
              {isLoading ? (
                <div
                  className={`flex flex-col items-center justify-center h-[500px] ${getLoadingBgColor()}`}
                >
                  <Loader2
                    className={`h-12 w-12 animate-spin ${getMutedTextColor()} mb-4`}
                  />
                  <p className={`${getTextColor()} font-medium`}>
                    Generating your image...
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="relative">
                  <img
                    src={generatedImage}
                    alt="Generated AI image"
                    style={getImageStyle()}
                    className={cn(
                      "w-full h-auto max-h-[500px] object-contain transition-opacity duration-300",
                      imageLoaded ? "opacity-100" : "opacity-0",
                    )}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${getLoadingBgColor()}`}
                    >
                      <Loader2
                        className={`h-8 w-8 animate-spin ${getMutedTextColor()}`}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center h-[500px] ${getLoadingBgColor()}`}
                >
                  <p className={`${getMutedTextColor()} mb-2`}>
                    No image generated yet
                  </p>
                  <p className={`${getMutedTextColor()} text-sm`}>
                    Enter a prompt and click Generate to create an image
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjust">
          <Card
            className={`w-full overflow-hidden border-0 ${getCardBgColor()}`}
          >
            <CardContent className="p-4">
              {generatedImage ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <img
                        src={generatedImage}
                        alt="Generated AI image for adjustment"
                        style={getImageStyle()}
                        className="w-full h-auto max-h-[400px] object-contain rounded-md"
                      />
                    </div>

                    <div className="w-full md:w-64 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label
                            className={`text-sm font-medium ${getTextColor()}`}
                          >
                            Brightness
                          </label>
                          <span className={`text-xs ${getMutedTextColor()}`}>
                            {brightness}%
                          </span>
                        </div>
                        <Slider
                          defaultValue={[brightness]}
                          min={0}
                          max={200}
                          step={1}
                          onValueChange={(value) => setBrightness(value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label
                            className={`text-sm font-medium ${getTextColor()}`}
                          >
                            Contrast
                          </label>
                          <span className={`text-xs ${getMutedTextColor()}`}>
                            {contrast}%
                          </span>
                        </div>
                        <Slider
                          defaultValue={[contrast]}
                          min={0}
                          max={200}
                          step={1}
                          onValueChange={(value) => setContrast(value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label
                            className={`text-sm font-medium ${getTextColor()}`}
                          >
                            Saturation
                          </label>
                          <span className={`text-xs ${getMutedTextColor()}`}>
                            {saturation}%
                          </span>
                        </div>
                        <Slider
                          defaultValue={[saturation]}
                          min={0}
                          max={200}
                          step={1}
                          onValueChange={(value) => setSaturation(value[0])}
                        />
                      </div>

                      <Button
                        variant="outline"
                        className={`w-full ${theme === "evening" ? "hover:bg-indigo-700 hover:text-white" : ""}`}
                        onClick={() => {
                          setBrightness(100);
                          setContrast(100);
                          setSaturation(100);
                        }}
                      >
                        Reset Adjustments
                      </Button>

                      <Button
                        variant="default"
                        className={`w-full mt-4 ${theme === "evening" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-500 hover:bg-blue-600"}`}
                        onClick={onModify}
                      >
                        Apply Adjustments
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center h-[400px] ${getLoadingBgColor()}`}
                >
                  <p className={`${getMutedTextColor()} mb-2`}>
                    No image to adjust
                  </p>
                  <p className={`${getMutedTextColor()} text-sm`}>
                    Generate an image first to use adjustment tools
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card
            className={`w-full overflow-hidden border-0 ${getCardBgColor()}`}
          >
            <CardContent className="p-4">
              {previousVersions.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previousVersions.map((img, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer rounded-md overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Version ${index + 1}`}
                        className="w-full h-auto aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white"
                            onClick={() => {
                              setGeneratedImage(img);
                              setActiveTab("preview");
                            }}
                          >
                            <Layers className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white"
                            onClick={() => onVariation()}
                          >
                            <Wand2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center h-[400px] ${getLoadingBgColor()}`}
                >
                  <p className={`${getMutedTextColor()} mb-2`}>
                    No version history
                  </p>
                  <p className={`${getMutedTextColor()} text-sm`}>
                    Previous versions will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {generatedImage && (
        <div
          className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start"
          style={{ maxWidth: "100%", overflowX: "auto", padding: "4px" }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onDownload}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 ${theme === "evening" ? "border-indigo-400 hover:bg-indigo-700 hover:text-white" : ""}`}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Download</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onShare}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 ${theme === "evening" ? "border-indigo-400 hover:bg-indigo-700 hover:text-white" : ""}`}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onCopy}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 ${theme === "evening" ? "border-indigo-400 hover:bg-indigo-700 hover:text-white" : ""}`}
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Copy</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onFullscreen}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 ${theme === "evening" ? "border-indigo-400 hover:bg-indigo-700 hover:text-white" : ""}`}
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Fullscreen</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View in fullscreen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onVariation}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 ${theme === "evening" ? "border-indigo-400 hover:bg-indigo-700 hover:text-white" : ""}`}
                >
                  <Wand2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Variation</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create variation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onUpscale}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 ${theme === "evening" ? "border-indigo-400 hover:bg-indigo-700 hover:text-white" : ""}`}
                >
                  <ImagePlus className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Upscale</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upscale image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onModify}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 ${theme === "evening" ? "border-indigo-400 hover:bg-indigo-700 hover:text-white" : ""}`}
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit generation settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onDelete}
                  variant="outline"
                  className={`flex items-center gap-1 h-9 text-red-500 hover:text-red-600 ${theme === "evening" ? "border-red-400 hover:bg-red-700 hover:text-white" : ""}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
