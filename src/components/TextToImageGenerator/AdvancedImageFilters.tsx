import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Palette,
  Sliders,
  Layers,
  Wand2,
  Droplet,
  Brush,
  Eraser,
  Pipette,
  Shapes,
  Star,
  Heart,
  Sticker,
  Filter,
  Lightbulb,
  Zap,
  Flame,
  Snowflake,
  Cloud,
  Sun,
  Moon,
  Sunset,
} from "lucide-react";

interface AdvancedImageFiltersProps {
  onApplyFilter: (filterType: string, settings: any) => void;
  theme?: "light" | "dark" | "evening" | "luxury" | "neon";
}

const AdvancedImageFilters = ({
  onApplyFilter = () => {},
  theme = "dark",
}: AdvancedImageFiltersProps) => {
  const [activeTab, setActiveTab] = useState("artistic");
  const [filterSettings, setFilterSettings] = useState({
    artistic: {
      oilPainting: 0,
      watercolor: 0,
      sketch: 0,
      cartoon: 0,
      pixelate: 0,
    },
    color: {
      vibrance: 0,
      hueRotate: 0,
      temperature: 0,
      tint: 0,
      duotone: 0,
    },
    effects: {
      glitch: 0,
      vignette: 0,
      noise: 0,
      blur: 0,
      sharpen: 0,
    },
    atmosphere: {
      fog: 0,
      rain: 0,
      snow: 0,
      sunrays: 0,
      stars: 0,
    },
  });

  // Get theme-based styling
  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 border-gray-800";
      case "evening":
        return "bg-indigo-900/90 backdrop-blur-sm border-indigo-800";
      case "luxury":
        return "bg-gradient-to-br from-gray-900 to-gray-800 border-amber-700";
      case "neon":
        return "bg-black border-pink-600";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case "dark":
      case "evening":
      case "luxury":
      case "neon":
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
      case "luxury":
        return "text-amber-200";
      case "neon":
        return "text-pink-300";
      default:
        return "text-gray-500";
    }
  };

  const getAccentColor = () => {
    switch (theme) {
      case "dark":
        return "bg-blue-600 hover:bg-blue-700";
      case "evening":
        return "bg-indigo-600 hover:bg-indigo-700";
      case "luxury":
        return "bg-amber-600 hover:bg-amber-700";
      case "neon":
        return "bg-pink-600 hover:bg-pink-700";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const handleFilterChange = (category, filter, value) => {
    setFilterSettings({
      ...filterSettings,
      [category]: {
        ...filterSettings[category],
        [filter]: value,
      },
    });
  };

  const applyFilter = (category) => {
    onApplyFilter(category, filterSettings[category]);
  };

  const resetFilters = (category) => {
    const resetValues = {};
    Object.keys(filterSettings[category]).forEach((key) => {
      resetValues[key] = 0;
    });

    setFilterSettings({
      ...filterSettings,
      [category]: resetValues,
    });
  };

  return (
    <div
      className={`w-full p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${getTextColor()}`}>
        Advanced Image Filters
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger
            value="artistic"
            className={`flex items-center gap-1 data-[state=active]:${getAccentColor()} data-[state=active]:text-white`}
          >
            <Palette className="h-4 w-4" />
            Artistic
          </TabsTrigger>
          <TabsTrigger
            value="color"
            className={`flex items-center gap-1 data-[state=active]:${getAccentColor()} data-[state=active]:text-white`}
          >
            <Droplet className="h-4 w-4" />
            Color
          </TabsTrigger>
          <TabsTrigger
            value="effects"
            className={`flex items-center gap-1 data-[state=active]:${getAccentColor()} data-[state=active]:text-white`}
          >
            <Sparkles className="h-4 w-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger
            value="atmosphere"
            className={`flex items-center gap-1 data-[state=active]:${getAccentColor()} data-[state=active]:text-white`}
          >
            <Cloud className="h-4 w-4" />
            Atmosphere
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artistic" className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Oil Painting
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.artistic.oilPainting}%
                </span>
              </div>
              <Slider
                value={[filterSettings.artistic.oilPainting]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("artistic", "oilPainting", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Watercolor
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.artistic.watercolor}%
                </span>
              </div>
              <Slider
                value={[filterSettings.artistic.watercolor]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("artistic", "watercolor", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Sketch
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.artistic.sketch}%
                </span>
              </div>
              <Slider
                value={[filterSettings.artistic.sketch]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("artistic", "sketch", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Cartoon
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.artistic.cartoon}%
                </span>
              </div>
              <Slider
                value={[filterSettings.artistic.cartoon]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("artistic", "cartoon", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Pixelate
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.artistic.pixelate}%
                </span>
              </div>
              <Slider
                value={[filterSettings.artistic.pixelate]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("artistic", "pixelate", value[0])
                }
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => resetFilters("artistic")}
                className={`${theme === "luxury" ? "border-amber-600" : ""}`}
              >
                Reset
              </Button>
              <Button
                onClick={() => applyFilter("artistic")}
                className={getAccentColor()}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="color" className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Vibrance
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.color.vibrance}%
                </span>
              </div>
              <Slider
                value={[filterSettings.color.vibrance]}
                min={-100}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("color", "vibrance", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Hue Rotate
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.color.hueRotate}°
                </span>
              </div>
              <Slider
                value={[filterSettings.color.hueRotate]}
                min={-180}
                max={180}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("color", "hueRotate", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Temperature
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.color.temperature > 0 ? "Warm" : "Cool"}{" "}
                  {Math.abs(filterSettings.color.temperature)}%
                </span>
              </div>
              <Slider
                value={[filterSettings.color.temperature]}
                min={-100}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("color", "temperature", value[0])
                }
              />
              <div className="flex justify-between">
                <span className={`text-xs ${getMutedTextColor()}`}>
                  <Snowflake className="h-3 w-3 inline" /> Cool
                </span>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  Warm <Flame className="h-3 w-3 inline" />
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Tint
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.color.tint}%
                </span>
              </div>
              <Slider
                value={[filterSettings.color.tint]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("color", "tint", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Duotone
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.color.duotone}%
                </span>
              </div>
              <Slider
                value={[filterSettings.color.duotone]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("color", "duotone", value[0])
                }
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => resetFilters("color")}
                className={`${theme === "luxury" ? "border-amber-600" : ""}`}
              >
                Reset
              </Button>
              <Button
                onClick={() => applyFilter("color")}
                className={getAccentColor()}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Glitch
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.effects.glitch}%
                </span>
              </div>
              <Slider
                value={[filterSettings.effects.glitch]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("effects", "glitch", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Vignette
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.effects.vignette}%
                </span>
              </div>
              <Slider
                value={[filterSettings.effects.vignette]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("effects", "vignette", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Noise
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.effects.noise}%
                </span>
              </div>
              <Slider
                value={[filterSettings.effects.noise]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("effects", "noise", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Blur
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.effects.blur}px
                </span>
              </div>
              <Slider
                value={[filterSettings.effects.blur]}
                min={0}
                max={20}
                step={0.5}
                onValueChange={(value) =>
                  handleFilterChange("effects", "blur", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Sharpen
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.effects.sharpen}%
                </span>
              </div>
              <Slider
                value={[filterSettings.effects.sharpen]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("effects", "sharpen", value[0])
                }
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => resetFilters("effects")}
                className={`${theme === "luxury" ? "border-amber-600" : ""}`}
              >
                Reset
              </Button>
              <Button
                onClick={() => applyFilter("effects")}
                className={getAccentColor()}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="atmosphere" className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Fog
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.atmosphere.fog}%
                </span>
              </div>
              <Slider
                value={[filterSettings.atmosphere.fog]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("atmosphere", "fog", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Rain
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.atmosphere.rain}%
                </span>
              </div>
              <Slider
                value={[filterSettings.atmosphere.rain]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("atmosphere", "rain", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Snow
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.atmosphere.snow}%
                </span>
              </div>
              <Slider
                value={[filterSettings.atmosphere.snow]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("atmosphere", "snow", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Sunrays
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.atmosphere.sunrays}%
                </span>
              </div>
              <Slider
                value={[filterSettings.atmosphere.sunrays]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("atmosphere", "sunrays", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${getTextColor()}`}>
                  Stars
                </label>
                <span className={`text-xs ${getMutedTextColor()}`}>
                  {filterSettings.atmosphere.stars}%
                </span>
              </div>
              <Slider
                value={[filterSettings.atmosphere.stars]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("atmosphere", "stars", value[0])
                }
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => resetFilters("atmosphere")}
                className={`${theme === "luxury" ? "border-amber-600" : ""}`}
              >
                Reset
              </Button>
              <Button
                onClick={() => applyFilter("atmosphere")}
                className={getAccentColor()}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedImageFilters;
