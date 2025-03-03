import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StylePreset {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  prompt: string;
}

interface AIStylePresetsProps {
  onSelectPreset: (preset: StylePreset) => void;
  theme?: "light" | "dark" | "evening" | "luxury" | "neon";
}

const AIStylePresets = ({
  onSelectPreset,
  theme = "dark",
}: AIStylePresetsProps) => {
  const presets: StylePreset[] = [
    {
      id: "cinematic",
      name: "सिनेमैटिक",
      description: "फिल्म जैसी विज़ुअल क्वालिटी के साथ ड्रामेटिक लाइटिंग",
      previewUrl:
        "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
      prompt: "cinematic, dramatic lighting, film grain, depth of field",
    },
    {
      id: "anime",
      name: "एनिमे",
      description: "जापानी एनिमेशन शैली में स्टाइलाइज्ड आर्ट",
      previewUrl:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477",
      prompt: "anime style, vibrant colors, clean lines, expressive",
    },
    {
      id: "photorealistic",
      name: "फोटोरियलिस्टिक",
      description: "अत्यधिक विस्तृत और यथार्थवादी छवियां",
      previewUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      prompt: "photorealistic, highly detailed, professional photography, 8k",
    },
    {
      id: "fantasy",
      name: "फैंटेसी",
      description: "जादुई और काल्पनिक दुनिया की छवियां",
      previewUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
      prompt: "fantasy art, magical, ethereal, mystical creatures, enchanted",
    },
    {
      id: "cyberpunk",
      name: "साइबरपंक",
      description: "नियॉन लाइट्स और हाई-टेक फ्यूचरिस्टिक सिटी",
      previewUrl:
        "https://images.unsplash.com/photo-1515630278258-407f66498911",
      prompt: "cyberpunk, neon lights, futuristic city, high tech, dystopian",
    },
    {
      id: "watercolor",
      name: "वॉटरकलर",
      description: "सॉफ्ट, फ्लोइंग वॉटरकलर पेंटिंग स्टाइल",
      previewUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
      prompt: "watercolor painting, soft edges, flowing colors, artistic",
    },
    {
      id: "oilpainting",
      name: "ऑयल पेंटिंग",
      description: "क्लासिक ऑयल पेंटिंग टेक्निक",
      previewUrl:
        "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4",
      prompt: "oil painting, textured, classical art style, rich colors",
    },
    {
      id: "3drender",
      name: "3D रेंडर",
      description: "फोटोरियलिस्टिक 3D रेंडरिंग",
      previewUrl:
        "https://images.unsplash.com/photo-1633621533308-8d9cc8a0ea0d",
      prompt: "3D render, octane render, photorealistic, detailed textures",
    },
    {
      id: "pixelart",
      name: "पिक्सेल आर्ट",
      description: "रेट्रो गेमिंग स्टाइल पिक्सेल आर्ट",
      previewUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      prompt: "pixel art, retro gaming style, 8-bit, low resolution",
    },
    {
      id: "abstract",
      name: "एब्स्ट्रैक्ट",
      description: "अमूर्त आकृतियों और रंगों के साथ कलात्मक",
      previewUrl:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
      prompt:
        "abstract art, non-representational, geometric shapes, vibrant colors",
    },
    {
      id: "minimalist",
      name: "मिनिमलिस्ट",
      description: "सिंपल, क्लीन और मिनिमल डिज़ाइन",
      previewUrl: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f",
      prompt: "minimalist, clean lines, simple composition, negative space",
    },
    {
      id: "steampunk",
      name: "स्टीमपंक",
      description: "विक्टोरियन-इंस्पायर्ड फ्यूचरिस्टिक टेक्नोलॉजी",
      previewUrl:
        "https://images.unsplash.com/photo-1569251304839-7aea4b5f9c12",
      prompt:
        "steampunk, victorian era, brass, mechanical, gears, steam-powered",
    },
  ];

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

  const getCardBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 hover:bg-gray-700";
      case "evening":
        return "bg-indigo-800/80 hover:bg-indigo-700/80";
      case "luxury":
        return "bg-gray-800/90 hover:bg-gray-700/90 border-amber-600/30";
      case "neon":
        return "bg-gray-900 hover:bg-gray-800 border-pink-500/30";
      default:
        return "bg-gray-100 hover:bg-gray-200";
    }
  };

  return (
    <div
      className={`w-full p-4 md:p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${getTextColor()}`}>
        AI स्टाइल प्रीसेट्स
      </h2>
      <p className={`mb-4 ${getMutedTextColor()}`}>
        अपनी इमेज के लिए प्रोफेशनल स्टाइल चुनें
      </p>

      <ScrollArea className="h-[320px] pr-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {presets.map((preset) => (
            <TooltipProvider key={preset.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 border ${getCardBgColor()}`}
                    onClick={() => onSelectPreset(preset)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={preset.previewUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className={`font-medium text-sm ${getTextColor()}`}>
                        {preset.name}
                      </h3>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="max-w-xs">
                    <p className="font-bold">{preset.name}</p>
                    <p className="text-sm">{preset.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AIStylePresets;
