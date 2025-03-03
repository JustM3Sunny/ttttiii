import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  ImageIcon,
  LayoutIcon,
  SettingsIcon,
  Sparkles,
  Brush,
  Palette,
  Layers,
  Sliders,
  Cpu,
  Clock,
} from "lucide-react";

interface CustomizationPanelProps {
  onStyleChange?: (style: string) => void;
  onDimensionsChange?: (width: number, height: number) => void;
  onResolutionChange?: (resolution: number) => void;
  onAspectRatioChange?: (ratio: string) => void;
  onModelChange?: (model: string) => void;
  onSamplerChange?: (sampler: string) => void;
  onStepsChange?: (steps: number) => void;
  onSeedChange?: (seed: string) => void;
  onNegativePromptChange?: (prompt: string) => void;
  onGuidanceScaleChange?: (scale: number) => void;
  onToggleFeature?: (feature: string, enabled: boolean) => void;
  selectedStyle?: string;
  dimensions?: { width: number; height: number };
  resolution?: number;
  aspectRatio?: string;
  selectedModel?: string;
  selectedSampler?: string;
  steps?: number;
  seed?: string;
  negativePrompt?: string;
  guidanceScale?: number;
  features?: Record<string, boolean>;
  theme?: "light" | "dark" | "evening";
}

const CustomizationPanel = ({
  onStyleChange = () => {},
  onDimensionsChange = () => {},
  onResolutionChange = () => {},
  onAspectRatioChange = () => {},
  onModelChange = () => {},
  onSamplerChange = () => {},
  onStepsChange = () => {},
  onSeedChange = () => {},
  onNegativePromptChange = () => {},
  onGuidanceScaleChange = () => {},
  onToggleFeature = () => {},
  selectedStyle = "realistic",
  dimensions = { width: 512, height: 512 },
  resolution = 75,
  aspectRatio = "1:1",
  selectedModel = "stable-diffusion-xl",
  selectedSampler = "euler-a",
  steps = 30,
  seed = "",
  negativePrompt = "",
  guidanceScale = 7.5,
  features = {
    enhanceDetails: false,
    hdrEffect: false,
    removeBackground: false,
    upscale: false,
    faceCorrection: false,
  },
  theme = "dark",
}: CustomizationPanelProps) => {
  const stylePresets = [
    { value: "realistic", label: "Realistic" },
    { value: "artistic", label: "Artistic" },
    { value: "cartoon", label: "Cartoon" },
    { value: "abstract", label: "Abstract" },
    { value: "cinematic", label: "Cinematic" },
    { value: "fantasy", label: "Fantasy" },
    { value: "anime", label: "Anime" },
    { value: "digital-art", label: "Digital Art" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
    { value: "3d-render", label: "3D Render" },
    { value: "pixel-art", label: "Pixel Art" },
    { value: "neon", label: "Neon" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "steampunk", label: "Steampunk" },
  ];

  const aspectRatios = [
    { value: "1:1", label: "Square (1:1)" },
    { value: "4:3", label: "Standard (4:3)" },
    { value: "16:9", label: "Widescreen (16:9)" },
    { value: "9:16", label: "Portrait (9:16)" },
    { value: "3:2", label: "Photo (3:2)" },
    { value: "2:3", label: "Vertical Photo (2:3)" },
    { value: "21:9", label: "Ultrawide (21:9)" },
    { value: "4:5", label: "Instagram (4:5)" },
    { value: "5:4", label: "Medium Format (5:4)" },
  ];

  const dimensionPresets = [
    { value: "small", label: "Small (512×512)", width: 512, height: 512 },
    { value: "medium", label: "Medium (768×768)", width: 768, height: 768 },
    { value: "large", label: "Large (1024×1024)", width: 1024, height: 1024 },
    { value: "xl", label: "XL (1536×1536)", width: 1536, height: 1536 },
    { value: "hd", label: "HD (1280×720)", width: 1280, height: 720 },
    {
      value: "fullhd",
      label: "Full HD (1920×1080)",
      width: 1920,
      height: 1080,
    },
  ];

  const aiModels = [
    { value: "stable-diffusion-xl", label: "Stable Diffusion XL" },
    { value: "stable-diffusion-3", label: "Stable Diffusion 3" },
    { value: "midjourney-style", label: "Midjourney Style" },
    { value: "realistic-vision", label: "Realistic Vision" },
    { value: "dreamshaper", label: "Dreamshaper" },
    { value: "openjourney", label: "Openjourney" },
    { value: "dall-e-3", label: "DALL-E 3" },
  ];

  const samplers = [
    { value: "euler-a", label: "Euler Ancestral" },
    { value: "euler", label: "Euler" },
    { value: "ddim", label: "DDIM" },
    { value: "dpm-solver", label: "DPM Solver" },
    { value: "dpm-solver++", label: "DPM Solver++" },
    { value: "dpm-2", label: "DPM 2" },
    { value: "heun", label: "Heun" },
    { value: "lms", label: "LMS" },
    { value: "plms", label: "PLMS" },
  ];

  const handleDimensionPresetChange = (preset: string) => {
    const selected = dimensionPresets.find((d) => d.value === preset);
    if (selected) {
      onDimensionsChange(selected.width, selected.height);
    }
  };

  // Theme-based styling functions
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

  const getTabsColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-700";
      case "evening":
        return "bg-indigo-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div
      className={`w-full p-4 md:p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${getTextColor()}`}>
        Image Customization
      </h2>

      <Tabs defaultValue="style" className="w-full">
        <TabsList
          className={`mb-4 w-full justify-start overflow-x-auto flex-wrap ${getTabsColor()}`}
        >
          <TabsTrigger value="style" className="flex items-center gap-1">
            <Palette size={16} />
            Style
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="flex items-center gap-1">
            <LayoutIcon size={16} />
            Dimensions
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-1">
            <Cpu size={16} />
            AI Model
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Sliders size={16} />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Style Preset
            </label>
            <Select defaultValue={selectedStyle} onValueChange={onStyleChange}>
              <SelectTrigger
                className={`w-full ${getInputBgColor()} ${getTextColor()}`}
              >
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {stylePresets.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Style Strength
            </label>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${getMutedTextColor()}`}>Subtle</span>
              <Slider
                defaultValue={[75]}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className={`text-xs ${getMutedTextColor()}`}>Strong</span>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Negative Prompt
            </label>
            <textarea
              className={`w-full h-20 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputBgColor()} ${getTextColor()}`}
              placeholder="Elements you want to exclude from the image..."
              value={negativePrompt}
              onChange={(e) => onNegativePromptChange(e.target.value)}
            />
            <p className={`text-xs mt-1 ${getMutedTextColor()}`}>
              Specify elements you don't want in your image (e.g., "blurry, low
              quality, distorted faces")
            </p>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.slice(0, 6).map((ratio) => (
                <Button
                  key={ratio.value}
                  variant={aspectRatio === ratio.value ? "default" : "outline"}
                  className="w-full justify-center py-1 px-2"
                  onClick={() => onAspectRatioChange(ratio.value)}
                >
                  {ratio.label}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Dimension Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {dimensionPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    dimensions.width === preset.width &&
                    dimensions.height === preset.height
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleDimensionPresetChange(preset.value)}
                  className="w-full justify-center"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${getTextColor()}`}
              >
                Width (px)
              </label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) =>
                  onDimensionsChange(
                    parseInt(e.target.value),
                    dimensions.height,
                  )
                }
                className={`w-full p-2 border rounded-md ${getInputBgColor()} ${getTextColor()}`}
                min="256"
                max="2048"
                step="64"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${getTextColor()}`}
              >
                Height (px)
              </label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) =>
                  onDimensionsChange(dimensions.width, parseInt(e.target.value))
                }
                className={`w-full p-2 border rounded-md ${getInputBgColor()} ${getTextColor()}`}
                min="256"
                max="2048"
                step="64"
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Output Quality
            </label>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${getMutedTextColor()}`}>Draft</span>
              <Slider
                defaultValue={[resolution]}
                max={100}
                step={5}
                onValueChange={(value) => onResolutionChange(value[0])}
                className="flex-1"
              />
              <span className={`text-xs ${getMutedTextColor()}`}>Ultra HD</span>
            </div>
            <p className={`text-xs mt-1 ${getMutedTextColor()}`}>
              Higher quality takes longer to generate
            </p>
          </div>
        </TabsContent>

        <TabsContent value="model" className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              AI Model
            </label>
            <Select defaultValue={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger
                className={`w-full ${getInputBgColor()} ${getTextColor()}`}
              >
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={`text-xs mt-1 ${getMutedTextColor()}`}>
              Different models excel at different styles and subjects
            </p>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Sampling Method
            </label>
            <Select
              defaultValue={selectedSampler}
              onValueChange={onSamplerChange}
            >
              <SelectTrigger
                className={`w-full ${getInputBgColor()} ${getTextColor()}`}
              >
                <SelectValue placeholder="Select a sampler" />
              </SelectTrigger>
              <SelectContent>
                {samplers.map((sampler) => (
                  <SelectItem key={sampler.value} value={sampler.value}>
                    {sampler.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className={`block text-sm font-medium ${getTextColor()}`}>
                Sampling Steps: {steps}
              </label>
            </div>
            <Slider
              defaultValue={[steps]}
              min={10}
              max={150}
              step={1}
              onValueChange={(value) => onStepsChange(value[0])}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${getMutedTextColor()}`}>
                Faster (less detail)
              </span>
              <span className={`text-xs ${getMutedTextColor()}`}>
                More detail (slower)
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Seed (leave empty for random)
            </label>
            <input
              type="text"
              value={seed}
              onChange={(e) => onSeedChange(e.target.value)}
              className={`w-full p-2 border rounded-md ${getInputBgColor()} ${getTextColor()}`}
              placeholder="Enter a seed number for reproducible results"
            />
            <p className={`text-xs mt-1 ${getMutedTextColor()}`}>
              Use the same seed to create variations of an image
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className={`block text-sm font-medium ${getTextColor()}`}>
                Guidance Scale: {guidanceScale.toFixed(1)}
              </label>
            </div>
            <Slider
              defaultValue={[guidanceScale]}
              min={1}
              max={20}
              step={0.1}
              onValueChange={(value) => onGuidanceScaleChange(value[0])}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${getMutedTextColor()}`}>
                More creative
              </span>
              <span className={`text-xs ${getMutedTextColor()}`}>
                More precise
              </span>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${getTextColor()}`}
            >
              Advanced Features
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="enhance-details" className={getTextColor()}>
                    Enhance Details
                  </Label>
                </div>
                <Switch
                  id="enhance-details"
                  checked={features.enhanceDetails}
                  onCheckedChange={(checked) =>
                    onToggleFeature("enhanceDetails", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-amber-500" />
                  <Label htmlFor="hdr-effect" className={getTextColor()}>
                    HDR Effect
                  </Label>
                </div>
                <Switch
                  id="hdr-effect"
                  checked={features.hdrEffect}
                  onCheckedChange={(checked) =>
                    onToggleFeature("hdrEffect", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  <Label htmlFor="remove-bg" className={getTextColor()}>
                    Remove Background
                  </Label>
                </div>
                <Switch
                  id="remove-bg"
                  checked={features.removeBackground}
                  onCheckedChange={(checked) =>
                    onToggleFeature("removeBackground", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brush className="h-4 w-4 text-purple-500" />
                  <Label htmlFor="face-correction" className={getTextColor()}>
                    Face Enhancement
                  </Label>
                </div>
                <Switch
                  id="face-correction"
                  checked={features.faceCorrection}
                  onCheckedChange={(checked) =>
                    onToggleFeature("faceCorrection", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-red-500" />
                  <Label htmlFor="upscale" className={getTextColor()}>
                    4x Upscaling
                  </Label>
                </div>
                <Switch
                  id="upscale"
                  checked={features.upscale}
                  onCheckedChange={(checked) =>
                    onToggleFeature("upscale", checked)
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomizationPanel;
