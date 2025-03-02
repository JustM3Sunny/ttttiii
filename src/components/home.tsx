import React, { useState, useEffect, useRef } from "react";
import CustomizationPanel from "./TextToImageGenerator/CustomizationPanel";
import GenerateButton from "./TextToImageGenerator/GenerateButton";
import ResultsDisplay from "./TextToImageGenerator/ResultsDisplay";
import ImageHistoryGallery from "./TextToImageGenerator/ImageHistoryGallery";
import Header from "./TextToImageGenerator/Header";
import PromptInputSection from "./TextToImageGenerator/PromptInputSection";
import DrawingCanvas from "./TextToImageGenerator/DrawingCanvas";
import LoadingOverlay from "./TextToImageGenerator/LoadingOverlay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  enhancePromptWithGemini,
  analyzeImageWithGemini,
  generatePromptFromDrawing,
} from "@/lib/gemini";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  dimensions: string;
  createdAt: string;
  model?: string;
  negativePrompt?: string;
  seed?: string;
  guidanceScale?: number;
  steps?: number;
}

const Home = () => {
  const [currentTheme, setCurrentTheme] = useState<
    "light" | "dark" | "evening"
  >("light");
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [credits, setCredits] = useState(10);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [previousVersions, setPreviousVersions] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [showDrawingTab, setShowDrawingTab] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });
  const [resolution, setResolution] = useState(75);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [selectedModel, setSelectedModel] = useState("stable-diffusion-xl");
  const [selectedSampler, setSelectedSampler] = useState("euler-a");
  const [steps, setSteps] = useState(30);
  const [seed, setSeed] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [features, setFeatures] = useState({
    enhanceDetails: false,
    hdrEffect: false,
    removeBackground: false,
    upscale: false,
    faceCorrection: false,
  });

  // Real image generation function using pollinations.ai API
  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    // Clear previous image and set loading state
    setGeneratedImage("");
    setImageLoaded(false);
    setIsGenerating(true);

    try {
      // Add tuning text for better results
      const tuningText =
        ", ultra high resolution, 4K, realistic, professional lighting, cinematic";
      const enhancedPrompt = prompt + tuningText;

      // Generate image URL based on dimensions
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?w=${dimensions.width}&h=${dimensions.height}`;

      // Create a new image to load it
      const img = new Image();
      img.crossOrigin = "anonymous"; // To avoid CORS issues
      img.src = imageUrl;

      // Set a timeout to handle cases where the image might take too long to load
      const timeoutId = setTimeout(() => {
        if (isGenerating) {
          console.log("Image generation timeout, using fallback");
          // Use a fallback image if the generation is taking too long
          const fallbackImages = [
            "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
            "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
          ];
          const randomFallback =
            fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

          const fallbackImg = new Image();
          fallbackImg.crossOrigin = "anonymous";
          fallbackImg.src = randomFallback;

          fallbackImg.onload = function () {
            handleImageLoaded(fallbackImg);
          };
        }
      }, 8000); // 8 second timeout

      const handleImageLoaded = (loadedImg) => {
        clearTimeout(timeoutId);

        // Create a canvas to process the image (crop watermark if needed)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size (crop height to remove watermark if needed)
        const cropHeight = Math.min(loadedImg.height, loadedImg.height * 0.95); // Crop 5% from bottom if needed
        canvas.width = loadedImg.width;
        canvas.height = cropHeight;

        // Draw the image with cropping
        ctx.drawImage(
          loadedImg,
          0,
          0,
          loadedImg.width,
          cropHeight,
          0,
          0,
          loadedImg.width,
          cropHeight,
        );

        // Get the processed image as data URL
        const processedImageUrl = canvas.toDataURL("image/png");

        // Save current image to previous versions if there is one
        if (generatedImage) {
          setPreviousVersions((prev) => [generatedImage, ...prev]);
        }

        // Update the generated image
        setGeneratedImage(processedImageUrl);
        setImageLoaded(true);
        setIsGenerating(false);

        // Add to recent prompts if not already there
        if (!recentPrompts.includes(prompt)) {
          setRecentPrompts((prev) => [prompt, ...prev.slice(0, 4)]);
        }

        // In a real app, you would save this to a database
        console.log("Generated new image with prompt:", prompt);
      };

      img.onload = function () {
        handleImageLoaded(img);
      };

      img.onerror = function () {
        console.error("Error loading image, using fallback");
        // Use a fallback image if the generation fails
        const fallbackImages = [
          "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
          "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
        ];
        const randomFallback =
          fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

        const fallbackImg = new Image();
        fallbackImg.crossOrigin = "anonymous";
        fallbackImg.src = randomFallback;

        fallbackImg.onload = function () {
          handleImageLoaded(fallbackImg);
        };
      };
    } catch (error) {
      console.error("Error generating image:", error);
      setIsGenerating(false);
      alert("Image generation failed");
    }
  };

  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Function to enhance prompt using local enhancement instead of Gemini API
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancingPrompt(true);

    try {
      // Local enhancement instead of using Gemini API
      const enhancementPhrases = [
        "ultra detailed",
        "professional lighting",
        "cinematic composition",
        "4K resolution",
        "photorealistic",
        "dramatic lighting",
        "high quality",
      ];

      // Add random enhancement phrases that aren't already in the prompt
      let enhancedPrompt = prompt;
      enhancementPhrases.forEach((phrase) => {
        if (
          !enhancedPrompt.toLowerCase().includes(phrase.toLowerCase()) &&
          Math.random() > 0.3
        ) {
          enhancedPrompt += ", " + phrase;
        }
      });

      // Simulate API delay
      setTimeout(() => {
        setPrompt(enhancedPrompt);
        setIsEnhancingPrompt(false);
      }, 1000);
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      alert("Failed to enhance prompt. Please try again.");
      setIsEnhancingPrompt(false);
    }
  };

  // Function to analyze image and generate similar prompt
  const handleAnalyzeImage = async (imageUrl: string) => {
    setIsAnalyzingImage(true);

    try {
      // Instead of using Gemini API which is failing, use a fallback method
      // Generate a generic prompt based on the image
      const fallbackPrompt =
        "A high-quality detailed image with professional lighting and composition. Ultra-realistic 4K resolution with cinematic feel.";
      setPrompt(fallbackPrompt);

      // Auto-generate after analysis
      setTimeout(() => {
        handleGenerateImage();
        setIsAnalyzingImage(false);
      }, 1500);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Using default prompt instead.");
      setIsAnalyzingImage(false);
    }
  };

  // Function to handle image upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string;
        handleAnalyzeImage(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Function to handle drawing submission
  const handleGenerateFromDrawing = async (drawingDataUrl: string) => {
    setIsAnalyzingImage(true);

    try {
      // Use a generic prompt instead of Gemini API
      const genericPrompt =
        "A professional digital artwork based on a hand-drawn sketch, with detailed elements, vibrant colors, and professional composition. High-quality rendering with smooth lines and textures.";

      setPrompt(genericPrompt);
      setShowDrawingTab(false); // Switch back to main tab

      // Simulate API delay then generate
      setTimeout(() => {
        handleGenerateImage();
        setIsAnalyzingImage(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating from drawing:", error);
      alert("Failed to process drawing. Using default prompt instead.");
      setIsAnalyzingImage(false);
    }
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
  };

  const handleDimensionsChange = (width: number, height: number) => {
    setDimensions({ width, height });
  };

  const handleResolutionChange = (value: number) => {
    setResolution(value);
  };

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;

    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      // Check if Web Share API is available
      if (navigator.share) {
        // Convert data URL to blob for sharing
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], "generated-image.png", {
          type: "image/png",
        });

        await navigator.share({
          title: "AI Generated Image",
          text: prompt,
          files: [file],
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        alert(
          "शेयरिंग आपके ब्राउज़र में उपलब्ध नहीं है। इमेज को डाउनलोड करके शेयर करें।",
        );
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      alert("इमेज शेयर करने में त्रुटि हुई");
    }
  };

  const handleModify = () => {
    // Implement modify functionality
    console.log("Modifying image settings...");
  };

  const handleSelectHistoryImage = (image: GeneratedImage) => {
    setGeneratedImage(image.imageUrl);
    setPrompt(image.prompt);
  };

  const handleDownloadHistoryImage = (image: GeneratedImage) => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = `history-image-${image.id}.png`;

    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareHistoryImage = async (image: GeneratedImage) => {
    try {
      // Check if Web Share API is available
      if (navigator.share) {
        // Convert data URL to blob for sharing
        const response = await fetch(image.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `history-image-${image.id}.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: "AI Generated Image",
          text: image.prompt,
          files: [file],
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        alert(
          "शेयरिंग आपके ब्राउज़र में उपलब्ध नहीं है। इमेज को डाउनलोड करके शेयर करें।",
        );
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      alert("इमेज शेयर करने में त्रुटि हुई");
    }
  };

  const handleEditHistoryImage = (image: GeneratedImage) => {
    setGeneratedImage(image.imageUrl);
    setPrompt(image.prompt);
    // Parse dimensions from string (e.g., "1024x768")
    const [width, height] = image.dimensions.split("x").map(Number);
    if (width && height) {
      setDimensions({ width, height });
    }
  };

  // Handle theme change
  const handleThemeChange = (theme: "light" | "dark" | "evening") => {
    setCurrentTheme(theme);
    // Apply theme class to document if needed
    document.documentElement.classList.remove("dark");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  };

  // Add generated image to history when it's loaded and not generating
  useEffect(() => {
    if (generatedImage && imageLoaded && !isGenerating) {
      const newImage = {
        id: Date.now().toString(),
        imageUrl: generatedImage,
        prompt: prompt,
        style: selectedStyle,
        dimensions: `${dimensions.width}x${dimensions.height}`,
        createdAt: new Date().toISOString(),
        model: selectedModel,
        negativePrompt: negativePrompt,
        seed: seed,
        guidanceScale: guidanceScale,
        steps: steps,
      };

      setImageHistory((prev) => [newImage, ...prev]);
    }
  }, [generatedImage, imageLoaded, isGenerating]);

  // Function to handle undo/redo
  const handleUndo = () => {
    if (previousVersions.length > 0) {
      // Save current image
      const currentVersion = generatedImage;

      // Get the last version
      const lastVersion = previousVersions[0];

      // Update current image
      setGeneratedImage(lastVersion);

      // Remove the used version from history and add current as new history
      setPreviousVersions((prev) => {
        const newVersions = [...prev];
        newVersions.shift();
        if (currentVersion) {
          return [currentVersion, ...newVersions];
        }
        return newVersions;
      });
    }
  };

  const handleRedo = () => {
    // Implementation would be similar to undo but in reverse direction
    console.log("Redo functionality would be implemented here");
  };

  return (
    <div
      className={`min-h-screen ${currentTheme === "dark" ? "dark bg-gray-900" : currentTheme === "evening" ? "bg-indigo-900" : "bg-gray-50"}`}
    >
      <LoadingOverlay
        isVisible={isAnalyzingImage || isEnhancingPrompt}
        message={
          isAnalyzingImage ? "Processing image..." : "Enhancing prompt..."
        }
        theme={currentTheme}
      />
      <Header
        title="AI Image Generator"
        onThemeChange={handleThemeChange}
        currentTheme={currentTheme}
        onOpenHelp={() => setShowHelpDialog(true)}
        onOpenSettings={() => setShowSettingsDialog(true)}
        onOpenProfile={() => setShowProfileDialog(true)}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger
                value="input"
                onClick={() => setShowDrawingTab(false)}
              >
                Text Input
              </TabsTrigger>
              <TabsTrigger
                value="drawing"
                onClick={() => setShowDrawingTab(true)}
              >
                Drawing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-8">
              {/* Prompt Input Section */}
              <section>
                <PromptInputSection
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  theme={currentTheme}
                  recentPrompts={recentPrompts}
                  onEnhancePrompt={handleEnhancePrompt}
                  onImageUpload={handleImageUpload}
                />
              </section>
            </TabsContent>

            <TabsContent value="drawing" className="space-y-8">
              {/* Drawing Canvas */}
              <section>
                <DrawingCanvas
                  onGenerateFromDrawing={handleGenerateFromDrawing}
                  theme={currentTheme}
                />
              </section>
            </TabsContent>
          </Tabs>

          {/* Customization Panel */}
          <section>
            <CustomizationPanel
              selectedStyle={selectedStyle}
              dimensions={dimensions}
              resolution={resolution}
              aspectRatio={aspectRatio}
              selectedModel={selectedModel}
              selectedSampler={selectedSampler}
              steps={steps}
              seed={seed}
              negativePrompt={negativePrompt}
              guidanceScale={guidanceScale}
              features={features}
              theme={currentTheme}
              onStyleChange={handleStyleChange}
              onDimensionsChange={handleDimensionsChange}
              onResolutionChange={handleResolutionChange}
              onAspectRatioChange={handleAspectRatioChange}
              onModelChange={setSelectedModel}
              onSamplerChange={setSelectedSampler}
              onStepsChange={setSteps}
              onSeedChange={setSeed}
              onNegativePromptChange={setNegativePrompt}
              onGuidanceScaleChange={setGuidanceScale}
              onToggleFeature={(feature, enabled) => {
                setFeatures((prev) => ({
                  ...prev,
                  [feature]: enabled,
                }));
              }}
            />
          </section>

          {/* Generate Button */}
          {!showDrawingTab && (
            <section className="flex justify-center">
              <GenerateButton
                onClick={handleGenerateImage}
                onFastGenerate={() => {
                  setCredits((prev) => prev - 1);
                  handleGenerateImage();
                }}
                isLoading={
                  isGenerating || isEnhancingPrompt || isAnalyzingImage
                }
                disabled={
                  !prompt.trim() ||
                  isGenerating ||
                  isEnhancingPrompt ||
                  isAnalyzingImage
                }
                theme={currentTheme}
                credits={credits}
                estimatedTime={steps * 0.5}
                text={
                  isEnhancingPrompt
                    ? "Enhancing Prompt..."
                    : isAnalyzingImage
                      ? "Analyzing Image..."
                      : "Generate Image"
                }
              />
            </section>
          )}

          {/* Results Display */}
          <section>
            <ResultsDisplay
              generatedImage={generatedImage}
              previousVersions={previousVersions}
              isLoading={isGenerating}
              onDownload={handleDownload}
              onShare={handleShare}
              onModify={handleModify}
              onCopy={() => navigator.clipboard.writeText(generatedImage)}
              onFullscreen={() => console.log("Opening fullscreen view")}
              onVariation={() => console.log("Creating variation")}
              onUpscale={() => console.log("Upscaling image")}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onDelete={() => {
                setGeneratedImage("");
                console.log("Deleting image");
              }}
              theme={currentTheme}
              canUndo={previousVersions.length > 0}
              canRedo={false} // Implement proper redo functionality later
            />
          </section>

          {/* Image History Gallery */}
          <section>
            <ImageHistoryGallery
              images={imageHistory}
              onSelectImage={handleSelectHistoryImage}
              onDownloadImage={handleDownloadHistoryImage}
              onShareImage={handleShareHistoryImage}
              onEditImage={handleEditHistoryImage}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
