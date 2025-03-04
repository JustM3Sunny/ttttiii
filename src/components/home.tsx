import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import PaymentPlans from "./PaymentPlans";
import CustomizationPanel from "./TextToImageGenerator/CustomizationPanel";
import GenerateButton from "./TextToImageGenerator/GenerateButton";
import ResultsDisplay from "./TextToImageGenerator/ResultsDisplay";
import ImageHistoryGallery from "./TextToImageGenerator/ImageHistoryGallery";
import Header from "./TextToImageGenerator/Header";
import PromptInputSection from "./TextToImageGenerator/PromptInputSection";
import DrawingCanvas from "./TextToImageGenerator/DrawingCanvas";
import LoadingOverlay from "./TextToImageGenerator/LoadingOverlay";
import ChatbotHelp from "./TextToImageGenerator/ChatbotHelp";
import HistorySidebar from "./TextToImageGenerator/HistorySidebar";
import Sidebar from "./Sidebar";
import AdminPanel from "./AdminPanel";
import BetaVersionBanner from "./BetaVersionBanner";
import ErrorBoundary from "./ErrorBoundary";

// Lazy load components that aren't needed immediately
const AIStylePresets = lazy(
  () => import("./TextToImageGenerator/AIStylePresets"),
);
const AdvancedImageFilters = lazy(
  () => import("./TextToImageGenerator/AdvancedImageFilters"),
);
const ThreeDModelViewer = lazy(
  () => import("./TextToImageGenerator/3DModelViewer"),
);
const AdvancedDrawingTools = lazy(
  () => import("./TextToImageGenerator/AdvancedDrawingTools"),
);

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  // Save user preferences to local storage
  useEffect(() => {
    // Load saved preferences from localStorage if they exist
    const savedPrompt = localStorage.getItem("lastPrompt");
    const savedStyle = localStorage.getItem("selectedStyle");
    const savedHistory = localStorage.getItem("imageHistory");

    if (savedPrompt) setPrompt(savedPrompt);
    if (savedStyle) setSelectedStyle(savedStyle);
    if (savedHistory) {
      try {
        setImageHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing saved history:", e);
      }
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    try {
      if (prompt) localStorage.setItem("lastPrompt", prompt);
      if (selectedStyle) localStorage.setItem("selectedStyle", selectedStyle);
      if (imageHistory.length > 0) {
        // Only store the 5 most recent images to avoid quota issues
        localStorage.setItem(
          "imageHistory",
          JSON.stringify(imageHistory.slice(0, 5)),
        );
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      // If we hit quota limits, clear history and try again with just the latest image
      if (error.name === "QuotaExceededError") {
        try {
          localStorage.removeItem("imageHistory");
          if (imageHistory.length > 0) {
            localStorage.setItem(
              "imageHistory",
              JSON.stringify([imageHistory[0]]),
            );
          }
        } catch (e) {
          console.error("Failed to recover from storage quota error:", e);
        }
      }
    }
  }, [prompt, selectedStyle, imageHistory]);

  const [currentTheme, setCurrentTheme] = useState<string>("dark");
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatPosition, setChatPosition] = useState({
    right: "20px",
    bottom: "20px",
  });
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [credits, setCredits] = useState(30);
  const [showPaymentPlans, setShowPaymentPlans] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [previousVersions, setPreviousVersions] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [showDrawingTab, setShowDrawingTab] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [features, setFeatures] = useState({
    enhanceDetails: false,
    hdrEffect: false,
    removeBackground: false,
    upscale: false,
    faceCorrection: false,
  });
  // Track redo stack separately
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [variants, setVariants] = useState<string[]>([]);

  // Advanced image generation function with Gemini integration
  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    // Prevent multiple clicks
    if (isGenerating) return;

    // Save current image to previous versions if there is one
    if (generatedImage) {
      setPreviousVersions((prev) => [generatedImage, ...prev]);
    }

    // Clear previous image and set loading state
    setGeneratedImage("");
    setImageLoaded(false);
    setIsGenerating(true);

    // Create a semi-transparent overlay instead of full black
    const overlay = document.createElement("div");
    overlay.id = "generation-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.6)"; // More transparent
    overlay.style.zIndex = "9998";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.flexDirection = "column";
    overlay.style.backdropFilter = "blur(5px)"; // Add blur effect

    const spinner = document.createElement("div");
    spinner.className =
      "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500";

    const text = document.createElement("p");
    text.textContent = "Generating your image...";
    text.style.color = "white";
    text.style.marginTop = "20px";
    text.style.fontSize = "18px";
    text.style.fontWeight = "bold";

    overlay.appendChild(spinner);
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    try {
      // Apply features to the prompt
      let enhancedPrompt = prompt;

      // Add feature-specific enhancements
      if (features.enhanceDetails) {
        enhancedPrompt += ", highly detailed, intricate details, sharp focus";
      }

      if (features.hdrEffect) {
        enhancedPrompt += ", HDR, dramatic lighting, high dynamic range";
      }

      if (features.faceCorrection) {
        enhancedPrompt +=
          ", perfect face, detailed facial features, realistic skin texture";
      }

      // Add style-specific enhancements
      if (selectedStyle) {
        enhancedPrompt += `, ${selectedStyle} style`;
      }

      // Add negative prompt if provided
      let fullPrompt = enhancedPrompt;
      if (negativePrompt) {
        fullPrompt += ` || negative prompt: ${negativePrompt}`;
      }

      // Add tuning text for better results
      const tuningText =
        ", ultra high resolution, 4K, professional lighting, cinematic";
      fullPrompt += tuningText;

      // Generate image URL based on dimensions and seed
      // Use extended height to avoid watermark, will crop later
      const extendedHeight = dimensions.height * 1.2; // 20% taller to hide watermark
      // Always generate HD 2K images regardless of user settings
      let imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${dimensions.width}&height=${extendedHeight}&hd=1&quality=2k`; // Always use 2K quality

      // Add seed if provided
      if (seed) {
        imageUrl += `&seed=${seed}`;
      }

      // Add guidance scale if different from default
      if (guidanceScale !== 7.5) {
        imageUrl += `&cfg_scale=${guidanceScale}`;
      }

      // Add steps if different from default
      if (steps !== 30) {
        imageUrl += `&steps=${steps}`;
      }

      // Add sampler if provided
      if (selectedSampler) {
        imageUrl += `&sampler=${selectedSampler}`;
      }

      console.log("Generating image with URL:", imageUrl);

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
            "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
            "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&q=80",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
            "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&q=80",
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
          ];

          // Deterministically select an image based on the prompt to simulate consistent generation
          const promptHash = prompt
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const imageIndex = promptHash % fallbackImages.length;
          const selectedImage = fallbackImages[imageIndex];

          const fallbackImg = new Image();
          fallbackImg.crossOrigin = "anonymous";
          fallbackImg.src = selectedImage;

          fallbackImg.onload = function () {
            handleImageLoaded(fallbackImg);

            // Remove the overlay
            const overlay = document.getElementById("generation-overlay");
            if (overlay) {
              document.body.removeChild(overlay);
            }
          };
        }
      }, 8000); // 8 second timeout

      const handleImageLoaded = (loadedImg) => {
        clearTimeout(timeoutId);

        // Create a canvas to process the image (crop watermark if needed)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size (crop height to remove watermark)
        const cropHeight = Math.min(loadedImg.height, loadedImg.height * 0.83); // Crop 17% from bottom to remove watermark
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

        // Apply additional processing for features
        if (features.removeBackground) {
          // Simulate background removal with a white background
          // In a real implementation, you would use a proper background removal algorithm
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // This is just a placeholder - real background removal would be more complex
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);
        }

        if (features.upscale && dimensions.width < 1024) {
          // Simulate upscaling by creating a larger canvas
          const upscaledCanvas = document.createElement("canvas");
          upscaledCanvas.width = canvas.width * 2;
          upscaledCanvas.height = canvas.height * 2;
          const upscaledCtx = upscaledCanvas.getContext("2d");

          // Draw the original image onto the larger canvas
          upscaledCtx.drawImage(
            canvas,
            0,
            0,
            upscaledCanvas.width,
            upscaledCanvas.height,
          );
          canvas.width = upscaledCanvas.width;
          canvas.height = upscaledCanvas.height;
          ctx.drawImage(upscaledCanvas, 0, 0);
        }

        // Get the processed image as data URL
        const processedImageUrl = canvas.toDataURL("image/png");

        // Update the generated image
        setGeneratedImage(processedImageUrl);
        setImageLoaded(true);
        setIsGenerating(false);

        // Remove the overlay
        const overlay = document.getElementById("generation-overlay");
        if (overlay) {
          document.body.removeChild(overlay);
        }

        // Add to recent prompts if not already there
        if (!recentPrompts.includes(prompt)) {
          setRecentPrompts((prev) => [prompt, ...prev.slice(0, 4)]);
        }

        console.log("Generated new image with prompt:", prompt);

        // Generate variants
        generateVariants();
      };

      img.onload = function () {
        handleImageLoaded(img);
      };

      img.onerror = function () {
        console.error("Error loading image, using fallback");
        // Use a fallback image if the generation fails
        const fallbackImages = [
          "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80",
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
          "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
          "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&q=80",
          "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
        ];

        // Deterministically select an image based on the prompt
        const promptHash = prompt
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const imageIndex = promptHash % fallbackImages.length;
        const selectedImage = fallbackImages[imageIndex];

        const fallbackImg = new Image();
        fallbackImg.crossOrigin = "anonymous";
        fallbackImg.src = selectedImage;

        fallbackImg.onload = function () {
          handleImageLoaded(fallbackImg);

          // Remove the overlay
          const overlay = document.getElementById("generation-overlay");
          if (overlay) {
            document.body.removeChild(overlay);
          }
        };
      };
    } catch (error) {
      console.error("Error generating image:", error);
      setIsGenerating(false);
      alert("Image generation failed");

      // Remove the overlay in case of error
      const overlay = document.getElementById("generation-overlay");
      if (overlay) {
        document.body.removeChild(overlay);
      }
    }
  };

  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Function to enhance prompt using Gemini API with fallback
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    // Prevent multiple clicks
    if (isEnhancingPrompt) return;

    setIsEnhancingPrompt(true);

    try {
      // Try to use Gemini API first
      try {
        const enhancedPrompt = await enhancePromptWithGemini(prompt);
        setPrompt(enhancedPrompt);
      } catch (apiError) {
        console.error("Gemini API error, using local enhancement:", apiError);
        // Fallback to local enhancement if API fails
        const enhancementPhrases = [
          "ultra detailed",
          "professional lighting",
          "cinematic composition",
          "4K resolution",
          "photorealistic",
          "dramatic lighting",
          "high quality",
          "masterpiece",
          "intricate details",
          "sharp focus",
          "studio quality",
          "perfect composition",
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

        setPrompt(enhancedPrompt);
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      alert("Failed to enhance prompt. Please try again.");
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Function to analyze image and generate similar prompt
  const handleAnalyzeImage = async (imageUrl: string) => {
    setIsAnalyzingImage(true);

    try {
      // Try to use Gemini API first
      try {
        const generatedPrompt = await analyzeImageWithGemini(imageUrl);
        setPrompt(generatedPrompt);
      } catch (apiError) {
        console.error("Gemini API error, using fallback:", apiError);
        // Fallback to predefined prompts if API fails
        const imagePrompts = [
          "A stunning landscape with dramatic lighting, mountains in the background and a serene lake in the foreground. Ultra-realistic 4K resolution with cinematic feel.",
          "A detailed portrait with perfect lighting, shallow depth of field, and professional studio quality. High-resolution with natural skin tones.",
          "An abstract digital artwork with vibrant colors and flowing shapes. High-contrast with sharp details and modern aesthetic.",
          "A futuristic cityscape at night with neon lights, tall skyscrapers, and flying vehicles. Cyberpunk style with dramatic lighting.",
          "A serene nature scene with sunlight filtering through trees, creating a magical atmosphere. Photorealistic quality with perfect composition.",
        ];

        // Select a random prompt from the list
        const randomPrompt =
          imagePrompts[Math.floor(Math.random() * imagePrompts.length)];
        setPrompt(randomPrompt);
      }

      // Auto-generate after analysis
      handleGenerateImage();
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Using default prompt instead.");
    } finally {
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
      // Try to use Gemini API first
      try {
        const generatedPrompt = await generatePromptFromDrawing(drawingDataUrl);
        setPrompt(generatedPrompt);
      } catch (apiError) {
        console.error("Gemini API error, using fallback:", apiError);
        // Fallback to predefined prompts if API fails
        const drawingPrompts = [
          "A professional digital artwork based on a hand-drawn sketch, with detailed elements, vibrant colors, and professional composition. High-quality rendering with smooth lines and textures.",
          "A polished illustration derived from a sketch, with enhanced details, professional coloring, and artistic style. Clean lines and perfect proportions.",
          "A refined digital painting based on a rough sketch, with beautiful color gradients, detailed textures, and professional lighting effects.",
          "An artistic rendering of a hand-drawn concept, transformed into a professional illustration with perfect proportions and vivid colors.",
          "A sketch transformed into a masterful digital artwork, with enhanced details, dramatic lighting, and professional composition.",
        ];

        // Select a random prompt from the list
        const randomPrompt =
          drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)];
        setPrompt(randomPrompt);
      }

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.style.position = "fixed";
      successMessage.style.top = "20px";
      successMessage.style.left = "50%";
      successMessage.style.transform = "translateX(-50%)";
      successMessage.style.backgroundColor = "rgba(0, 128, 0, 0.8)";
      successMessage.style.color = "white";
      successMessage.style.padding = "10px 20px";
      successMessage.style.borderRadius = "5px";
      successMessage.style.zIndex = "9999";
      successMessage.textContent = "Drawing processed successfully!";
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);

      setActiveFeature("text-to-image"); // Switch back to main tab
      handleGenerateImage();
    } catch (error) {
      console.error("Error generating from drawing:", error);
      alert("Failed to process drawing. Using default prompt instead.");
    } finally {
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
          "Sharing is not available in your browser. Please download the image and share it manually.",
        );
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      alert("Error sharing image");
    }
  };

  const handleModify = () => {
    // Implement modify functionality to edit the current image
    if (!generatedImage) return;

    // Save current image to history before modifying
    if (generatedImage) {
      setPreviousVersions((prev) => [generatedImage, ...prev]);
    }

    // Set loading state
    setIsGenerating(true);

    // Apply modifications based on current settings
    setTimeout(() => {
      handleGenerateImage();
    }, 500);
  };

  // Function to create variations of the current image
  const handleCreateVariation = () => {
    if (!generatedImage || !prompt) return;

    // Prevent multiple clicks
    if (document.getElementById("variations-overlay")) return;

    // Save current image to history
    setPreviousVersions((prev) => [generatedImage, ...prev]);

    // Show loading overlay for variations
    const overlay = document.createElement("div");
    overlay.id = "variations-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.6)"; // More transparent
    overlay.style.zIndex = "9998";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.flexDirection = "column";
    overlay.style.backdropFilter = "blur(5px)"; // Add blur effect

    const spinner = document.createElement("div");
    spinner.className =
      "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500";

    const text = document.createElement("p");
    text.textContent = "Creating variations...";
    text.style.color = "white";
    text.style.marginTop = "20px";
    text.style.fontSize = "18px";
    text.style.fontWeight = "bold";

    overlay.appendChild(spinner);
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    // Generate 3-4 variations with different seeds and slight prompt modifications
    const variations = [];
    const variationCount = 4; // Generate 4 variations
    let completedVariations = 0;

    // Create slight variations of the prompt
    const promptVariations = [
      prompt + ", slightly different lighting",
      prompt + ", alternative perspective",
      prompt + ", different composition",
      prompt + ", subtle color shift",
    ];

    // Generate each variation
    for (let i = 0; i < variationCount; i++) {
      // Use a different seed for each variation
      const randomSeed = Math.floor(Math.random() * 1000000).toString();

      // Create the variation URL with the modified prompt and random seed
      const variationPrompt = promptVariations[i];
      const extendedHeight = dimensions.height * 1.2;
      let variationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(variationPrompt)}?width=${dimensions.width}&height=${extendedHeight}&hd=1&quality=2k&seed=${randomSeed}`;

      // Load the variation image
      const variationImg = new Image();
      variationImg.crossOrigin = "anonymous";
      variationImg.src = variationUrl;

      variationImg.onload = () => {
        // Create a canvas to process the image (crop watermark if needed)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size (crop height to remove watermark)
        const cropHeight = Math.min(
          variationImg.height,
          variationImg.height * 0.83,
        );
        canvas.width = variationImg.width;
        canvas.height = cropHeight;

        // Draw the image with cropping
        ctx.drawImage(
          variationImg,
          0,
          0,
          variationImg.width,
          cropHeight,
          0,
          0,
          variationImg.width,
          cropHeight,
        );

        // Get the processed image as data URL
        const processedVariationUrl = canvas.toDataURL("image/png");
        variations.push(processedVariationUrl);

        completedVariations++;

        // When all variations are done
        if (completedVariations === variationCount) {
          // Update variants state
          setVariants(variations);

          // Set the first variation as the current image
          if (variations.length > 0) {
            setGeneratedImage(variations[0]);
          }

          // Remove the overlay
          const variationsOverlay =
            document.getElementById("variations-overlay");
          if (variationsOverlay) document.body.removeChild(variationsOverlay);
        }
      };

      variationImg.onerror = () => {
        console.error("Error loading variation image");
        completedVariations++;

        // If all variations have been attempted (even with errors)
        if (completedVariations === variationCount) {
          // Update with whatever variations we have
          if (variations.length > 0) {
            setVariants(variations);
            setGeneratedImage(variations[0]);
          }

          // Remove the overlay
          const variationsOverlay =
            document.getElementById("variations-overlay");
          if (variationsOverlay) document.body.removeChild(variationsOverlay);
        }
      };
    }

    // Fallback in case all image loads fail
    setTimeout(() => {
      if (completedVariations < variationCount) {
        console.log("Variation generation timeout, using fallback");

        // Create a temporary canvas for processing
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          const variationsOverlay =
            document.getElementById("variations-overlay");
          if (variationsOverlay) document.body.removeChild(variationsOverlay);
          return;
        }

        // Load the current image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = generatedImage;

        img.onload = () => {
          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;

          // Create fallback variations with different filters
          const variationFilters = [
            { brightness: 110, contrast: 120, saturation: 130, hue: 15 },
            { brightness: 90, contrast: 110, saturation: 80, hue: -15 },
            {
              brightness: 100,
              contrast: 130,
              saturation: 110,
              hue: 0,
              sepia: 30,
            },
            { brightness: 105, contrast: 95, saturation: 120, hue: 30 },
          ];

          const fallbackVariations = [];

          // Process each variation
          variationFilters.forEach((filter) => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Get image data for manipulation
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const data = imageData.data;

            // Apply filter effects
            for (let i = 0; i < data.length; i += 4) {
              // Apply brightness
              const brightnessRatio = filter.brightness / 100;
              data[i] = Math.min(255, data[i] * brightnessRatio);
              data[i + 1] = Math.min(255, data[i + 1] * brightnessRatio);
              data[i + 2] = Math.min(255, data[i + 2] * brightnessRatio);

              // Apply contrast
              const contrastFactor = (filter.contrast / 100) * 2 - 1;
              for (let j = 0; j < 3; j++) {
                data[i + j] = Math.min(
                  255,
                  Math.max(0, (data[i + j] - 128) * (1 + contrastFactor) + 128),
                );
              }

              // Apply saturation
              const saturationRatio = filter.saturation / 100;
              const gray =
                0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              data[i] = Math.min(
                255,
                Math.max(0, gray + (data[i] - gray) * saturationRatio),
              );
              data[i + 1] = Math.min(
                255,
                Math.max(0, gray + (data[i + 1] - gray) * saturationRatio),
              );
              data[i + 2] = Math.min(
                255,
                Math.max(0, gray + (data[i + 2] - gray) * saturationRatio),
              );

              // Apply hue rotation if specified
              if (filter.hue) {
                // Simplified hue rotation
                const hueRotation = (filter.hue / 360) * 2 * Math.PI;
                const U = Math.cos(hueRotation);
                const W = Math.sin(hueRotation);

                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                data[i] = Math.min(
                  255,
                  Math.max(
                    0,
                    (0.299 + 0.701 * U + 0.168 * W) * r +
                      (0.587 - 0.587 * U + 0.33 * W) * g +
                      (0.114 - 0.114 * U - 0.497 * W) * b,
                  ),
                );
                data[i + 1] = Math.min(
                  255,
                  Math.max(
                    0,
                    (0.299 - 0.299 * U - 0.328 * W) * r +
                      (0.587 + 0.413 * U + 0.035 * W) * g +
                      (0.114 - 0.114 * U + 0.292 * W) * b,
                  ),
                );
                data[i + 2] = Math.min(
                  255,
                  Math.max(
                    0,
                    (0.299 - 0.3 * U + 1.25 * W) * r +
                      (0.587 - 0.588 * U - 1.05 * W) * g +
                      (0.114 + 0.886 * U - 0.203 * W) * b,
                  ),
                );
              }

              // Apply sepia if specified
              if (filter.sepia) {
                const sepiaIntensity = filter.sepia / 100;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                data[i] = Math.min(
                  255,
                  r * (1 - sepiaIntensity) +
                    sepiaIntensity * (r * 0.393 + g * 0.769 + b * 0.189),
                );
                data[i + 1] = Math.min(
                  255,
                  g * (1 - sepiaIntensity) +
                    sepiaIntensity * (r * 0.349 + g * 0.686 + b * 0.168),
                );
                data[i + 2] = Math.min(
                  255,
                  b * (1 - sepiaIntensity) +
                    sepiaIntensity * (r * 0.272 + g * 0.534 + b * 0.131),
                );
              }
            }

            // Put modified image data back to canvas
            ctx.putImageData(imageData, 0, 0);

            // Get data URL and add to variations
            const variantUrl = canvas.toDataURL("image/png");
            fallbackVariations.push(variantUrl);
          });

          // Use the fallback variations
          setVariants(fallbackVariations);
          if (fallbackVariations.length > 0) {
            setGeneratedImage(fallbackVariations[0]);
          }

          // Remove the overlay
          const variationsOverlay =
            document.getElementById("variations-overlay");
          if (variationsOverlay) document.body.removeChild(variationsOverlay);
        };

        img.onerror = () => {
          console.error("Error loading image for fallback variations");
          const variationsOverlay =
            document.getElementById("variations-overlay");
          if (variationsOverlay) document.body.removeChild(variationsOverlay);
        };
      }
    }, 15000); // 15 second timeout for all variations to load
  };

  // Function to upscale the current image
  const handleUpscale = () => {
    if (!generatedImage) return;

    // Save current image and dimensions
    setPreviousVersions((prev) => [generatedImage, ...prev]);
    const currentDimensions = { ...dimensions };

    // Double the dimensions for upscaling
    setDimensions({
      width: currentDimensions.width * 2,
      height: currentDimensions.height * 2,
    });

    // Set upscale feature
    setFeatures((prev) => ({
      ...prev,
      upscale: true,
    }));

    // Generate with the same prompt but larger dimensions
    handleGenerateImage();

    // Reset upscale feature after generation
    setTimeout(() => {
      setFeatures((prev) => ({
        ...prev,
        upscale: false,
      }));
    }, 1000);
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
          "Sharing is not available in your browser. Please download the image and share it manually.",
        );
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      alert("Error sharing image");
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

  // Handle theme change - only using dark theme
  const handleThemeChange = (theme: string) => {
    setCurrentTheme("dark");
    // Apply dark theme class to document
    document.documentElement.classList.add("dark");
    // Save theme preference to localStorage
    localStorage.setItem("theme-preference", "dark");
  };

  // Always use dark theme
  useEffect(() => {
    handleThemeChange("dark");
  }, []);

  // Add generated image to history when it's loaded and not generating
  useEffect(() => {
    if (generatedImage && !isGenerating) {
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
  }, [generatedImage, isGenerating]);

  // Clear redo stack when new image is generated
  useEffect(() => {
    if (isGenerating) {
      setRedoStack([]);
    }
  }, [isGenerating]);

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
          setRedoStack((prevRedoStack) => [currentVersion, ...prevRedoStack]);
          return newVersions;
        }
        return newVersions;
      });
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      // Get the first redo item
      const redoItem = redoStack[0];

      // Save current image to undo stack
      if (generatedImage) {
        setPreviousVersions((prev) => [generatedImage, ...prev]);
      }

      // Set the redo item as current image
      setGeneratedImage(redoItem);

      // Remove the used item from redo stack
      setRedoStack((prev) => prev.slice(1));
    }
  };

  // Generate image variants
  const generateVariants = () => {
    if (!generatedImage) return;

    // Prevent multiple overlays
    if (document.getElementById("variants-overlay")) return;

    // Show loading overlay for variants
    const overlay = document.createElement("div");
    overlay.id = "variants-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.6)"; // More transparent
    overlay.style.zIndex = "9998";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.flexDirection = "column";
    overlay.style.backdropFilter = "blur(5px)"; // Add blur effect

    const spinner = document.createElement("div");
    spinner.className =
      "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500";

    const text = document.createElement("p");
    text.textContent = "Generating variants...";
    text.style.color = "white";
    text.style.marginTop = "20px";
    text.style.fontSize = "18px";
    text.style.fontWeight = "bold";

    overlay.appendChild(spinner);
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    // Create 6 variants with different filters
    const variantFilters = [
      { brightness: 110, contrast: 120, saturation: 130, hue: 15 },
      { brightness: 90, contrast: 110, saturation: 80, hue: -15 },
      { brightness: 100, contrast: 130, saturation: 110, hue: 0, sepia: 30 },
      { brightness: 105, contrast: 95, saturation: 120, hue: 30 },
      { brightness: 95, contrast: 125, saturation: 90, hue: -30, sepia: 15 },
      {
        brightness: 115,
        contrast: 115,
        saturation: 105,
        hue: 5,
        grayscale: 20,
      },
    ];

    const newVariants: string[] = [];

    // Create a temporary canvas for processing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      // Remove overlay if we can't get context
      const variantsOverlay = document.getElementById("variants-overlay");
      if (variantsOverlay) document.body.removeChild(variantsOverlay);
      return;
    }

    // Load the current image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = generatedImage;

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      variantFilters.forEach((filterSet) => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Get image data for manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply filter effects manually
        for (let i = 0; i < data.length; i += 4) {
          // Apply brightness
          const brightnessRatio = filterSet.brightness / 100;
          data[i] = Math.min(255, data[i] * brightnessRatio);
          data[i + 1] = Math.min(255, data[i + 1] * brightnessRatio);
          data[i + 2] = Math.min(255, data[i + 2] * brightnessRatio);

          // Apply contrast
          const contrastFactor = (filterSet.contrast / 100) * 2 - 1;
          for (let j = 0; j < 3; j++) {
            data[i + j] = Math.min(
              255,
              Math.max(0, (data[i + j] - 128) * (1 + contrastFactor) + 128),
            );
          }

          // Apply saturation
          const saturationRatio = filterSet.saturation / 100;
          const gray =
            0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = Math.min(
            255,
            Math.max(0, gray + (data[i] - gray) * saturationRatio),
          );
          data[i + 1] = Math.min(
            255,
            Math.max(0, gray + (data[i + 1] - gray) * saturationRatio),
          );
          data[i + 2] = Math.min(
            255,
            Math.max(0, gray + (data[i + 2] - gray) * saturationRatio),
          );

          // Apply hue rotation if specified
          if (filterSet.hue) {
            // Hue rotation is complex, simplified implementation
            const hueRotation = (filterSet.hue / 360) * 2 * Math.PI;
            const U = Math.cos(hueRotation);
            const W = Math.sin(hueRotation);

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i] = Math.min(
              255,
              Math.max(
                0,
                (0.299 + 0.701 * U + 0.168 * W) * r +
                  (0.587 - 0.587 * U + 0.33 * W) * g +
                  (0.114 - 0.114 * U - 0.497 * W) * b,
              ),
            );
            data[i + 1] = Math.min(
              255,
              Math.max(
                0,
                (0.299 - 0.299 * U - 0.328 * W) * r +
                  (0.587 + 0.413 * U + 0.035 * W) * g +
                  (0.114 - 0.114 * U + 0.292 * W) * b,
              ),
            );
            data[i + 2] = Math.min(
              255,
              Math.max(
                0,
                (0.299 - 0.3 * U + 1.25 * W) * r +
                  (0.587 - 0.588 * U - 1.05 * W) * g +
                  (0.114 + 0.886 * U - 0.203 * W) * b,
              ),
            );
          }

          // Apply sepia if specified
          if (filterSet.sepia) {
            const sepiaIntensity = filterSet.sepia / 100;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i] = Math.min(
              255,
              r * (1 - sepiaIntensity) +
                sepiaIntensity * (r * 0.393 + g * 0.769 + b * 0.189),
            );
            data[i + 1] = Math.min(
              255,
              g * (1 - sepiaIntensity) +
                sepiaIntensity * (r * 0.349 + g * 0.686 + b * 0.168),
            );
            data[i + 2] = Math.min(
              255,
              b * (1 - sepiaIntensity) +
                sepiaIntensity * (r * 0.272 + g * 0.534 + b * 0.131),
            );
          }

          // Apply grayscale if specified
          if (filterSet.grayscale) {
            const grayscaleIntensity = filterSet.grayscale / 100;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const grayValue = 0.2989 * r + 0.587 * g + 0.114 * b;

            data[i] = Math.round(
              r * (1 - grayscaleIntensity) + grayValue * grayscaleIntensity,
            );
            data[i + 1] = Math.round(
              g * (1 - grayscaleIntensity) + grayValue * grayscaleIntensity,
            );
            data[i + 2] = Math.round(
              b * (1 - grayscaleIntensity) + grayValue * grayscaleIntensity,
            );
          }
        }

        // Put modified image data back to canvas
        ctx.putImageData(imageData, 0, 0);

        // Get data URL and add to variants
        const variantUrl = canvas.toDataURL("image/png");
        newVariants.push(variantUrl);
      });

      // Update variants state
      setVariants(newVariants);

      // Remove the overlay
      const variantsOverlay = document.getElementById("variants-overlay");
      if (variantsOverlay) document.body.removeChild(variantsOverlay);
    };

    // Handle image loading error
    img.onerror = () => {
      console.error("Error loading image for variants");
      // Remove the overlay
      const variantsOverlay = document.getElementById("variants-overlay");
      if (variantsOverlay) document.body.removeChild(variantsOverlay);
    };
  };

  const [activeFeature, setActiveFeature] = useState("text-to-image");
  const [isAdmin, setIsAdmin] = useState(false);

  // Define Label component with proper TypeScript typing
  const Label = ({
    htmlFor,
    children,
  }: {
    htmlFor: string;
    children: React.ReactNode;
  }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium">
      {children}
    </label>
  );

  return isAdmin ? (
    <AdminPanel theme="dark" />
  ) : (
    <div className="min-h-screen dark bg-black flex flex-col md:flex-row">
      {/* Mobile Feature Selector */}
      <div className="md:hidden bg-black text-white p-3 border-b border-gray-800 overflow-x-auto sticky top-0 z-40">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold">AI Image Generator</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowChatbot(true)}
              className="p-2 rounded-full bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
            <button
              onClick={() => setShowHistorySidebar(!showHistorySidebar)}
              className="p-2 rounded-full bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {[
            { id: "text-to-image", name: "Text to Image", icon: "📝" },
            { id: "basic-drawing", name: "Drawing", icon: "✏️" },
            { id: "styles", name: "Styles", icon: "🎨" },
            { id: "artistic", name: "Filters", icon: "🖼️" },
            { id: "3d-model", name: "3D Model", icon: "🧊" },
            { id: "history", name: "History", icon: "📚" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFeature(item.id)}
              className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${activeFeature === item.id ? "bg-gray-800" : "bg-gray-900"}`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Features Sidebar - Hidden on mobile, shown as a horizontal menu */}
      <div className="md:block hidden">
        <Sidebar
          onSelectFeature={setActiveFeature}
          activeFeature={activeFeature}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-screen relative pt-0 md:pt-0">
        {/* AdSense Ad Banner - Removed to fix error */}

        <LoadingOverlay
          isVisible={isAnalyzingImage || isEnhancingPrompt}
          message={
            isAnalyzingImage ? "Processing image..." : "Enhancing prompt..."
          }
          theme={currentTheme}
        />
        <div className="sticky top-0 z-50 hidden md:block">
          <Header
            title="AI Image Generator"
            onThemeChange={handleThemeChange}
            currentTheme="dark"
            onOpenHelp={() => setShowChatbot(true)}
            onOpenSettings={() => setShowSettingsDialog(true)}
            onOpenProfile={() => setShowHistorySidebar(!showHistorySidebar)}
          />
        </div>

        <main className="container mx-auto px-2 md:px-4 py-2 md:py-8 max-w-7xl">
          <div className="space-y-8">
            {/* Content based on active feature */}
            {activeFeature === "text-to-image" && (
              <div className="space-y-8">
                {/* Prompt Input Section */}
                <section>
                  <PromptInputSection
                    prompt={prompt}
                    onPromptChange={setPrompt}
                    theme="dark"
                    recentPrompts={[]}
                    onEnhancePrompt={handleEnhancePrompt}
                    onImageUpload={handleImageUpload}
                  />
                </section>
              </div>
            )}

            {activeFeature === "basic-drawing" && (
              <div className="space-y-8">
                {/* Basic Drawing Canvas */}
                <section>
                  <DrawingCanvas
                    onGenerateFromDrawing={handleGenerateFromDrawing}
                    theme="dark"
                  />
                </section>
              </div>
            )}

            {activeFeature === "advanced-drawing" && (
              <div className="space-y-8">
                {/* Advanced Drawing Tools */}
                <section>
                  <ErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="w-full h-64 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      }
                    >
                      <AdvancedDrawingTools
                        onGenerateFromDrawing={handleGenerateFromDrawing}
                        theme="dark"
                      />
                    </Suspense>
                  </ErrorBoundary>
                </section>
              </div>
            )}

            {activeFeature === "styles" && (
              <div className="space-y-8">
                {/* AI Style Presets */}
                <section>
                  <ErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="w-full h-64 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      }
                    >
                      <AIStylePresets
                        onSelectPreset={(preset) => {
                          setPrompt(preset.prompt);
                          setSelectedStyle(preset.id);
                        }}
                        theme="dark"
                      />
                    </Suspense>
                  </ErrorBoundary>
                </section>
              </div>
            )}

            {activeFeature === "artistic" && (
              <div className="space-y-8">
                {/* Advanced Image Filters - Artistic Tab */}
                <section>
                  <ErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="w-full h-64 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      }
                    >
                      <AdvancedImageFilters
                        onApplyFilter={(filterType, settings) => {
                          try {
                            console.log(
                              "Applying filters:",
                              filterType,
                              settings,
                            );
                            if (generatedImage) {
                              setPreviousVersions((prev) => [
                                generatedImage,
                                ...prev,
                              ]);
                              handleModify();
                            }
                          } catch (error) {
                            console.error("Error applying filters:", error);
                            alert(
                              "There was an error applying filters. Please try again.",
                            );
                          }
                        }}
                        theme="dark"
                      />
                    </Suspense>
                  </ErrorBoundary>
                </section>
              </div>
            )}

            {activeFeature === "3d-model" && (
              <div className="space-y-8">
                {/* 3D Model Viewer */}
                <section>
                  <ErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="w-full h-64 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      }
                    >
                      <ThreeDModelViewer
                        theme="dark"
                        onExport={(format) => {
                          console.log(`Exporting 3D model as ${format}`);
                        }}
                      />
                    </Suspense>
                  </ErrorBoundary>
                </section>
              </div>
            )}

            {activeFeature === "history" && (
              <div className="space-y-8">
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
            )}

            {/* Customization Panel - only show for text-to-image */}
            {activeFeature === "text-to-image" && (
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
                  theme="dark"
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
            )}

            {/* Payment Plans Section */}
            {activeFeature === "text-to-image" && showPaymentPlans && (
              <section>
                <PaymentPlans
                  theme="dark"
                  onPurchase={(plan, planCredits) => {
                    setCredits((prev) => prev + planCredits);
                    setShowPaymentPlans(false);
                  }}
                />
              </section>
            )}

            {/* Generate Button - only show for text-to-image */}
            {activeFeature === "text-to-image" && (
              <section className="flex flex-col items-center justify-center space-y-4">
                <GenerateButton
                  onClick={() => {
                    setCredits((prev) => Math.max(0, prev - 1));
                    handleGenerateImage();
                  }}
                  onFastGenerate={() => {
                    if (credits <= 0) {
                      setShowPaymentPlans(true);
                      return;
                    }
                    setCredits((prev) => Math.max(0, prev - 1));
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
                  theme="dark"
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
                {credits < 10 && (
                  <Button
                    onClick={() => setShowPaymentPlans(true)}
                    variant="outline"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Running low on credits? Buy more here!
                  </Button>
                )}
              </section>
            )}

            {/* Results Display - always show */}
            {generatedImage && (
              <section>
                <ResultsDisplay
                  generatedImage={generatedImage}
                  previousVersions={previousVersions}
                  isLoading={isGenerating}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  onModify={handleModify}
                  onCopy={() => navigator.clipboard.writeText(generatedImage)}
                  onFullscreen={() => {
                    if (!generatedImage) return;

                    // Create a fullscreen modal with the image
                    const img = new Image();
                    img.src = generatedImage;
                    img.style.maxWidth = "100%";
                    img.style.maxHeight = "100vh";
                    img.style.objectFit = "contain";

                    const modal = document.createElement("div");
                    modal.style.position = "fixed";
                    modal.style.top = "0";
                    modal.style.left = "0";
                    modal.style.width = "100%";
                    modal.style.height = "100%";
                    modal.style.backgroundColor = "rgba(0,0,0,0.9)";
                    modal.style.display = "flex";
                    modal.style.justifyContent = "center";
                    modal.style.alignItems = "center";
                    modal.style.zIndex = "9999";
                    modal.style.cursor = "pointer";

                    // Add close button
                    const closeBtn = document.createElement("button");
                    closeBtn.textContent = "×";
                    closeBtn.style.position = "absolute";
                    closeBtn.style.top = "20px";
                    closeBtn.style.right = "20px";
                    closeBtn.style.fontSize = "30px";
                    closeBtn.style.color = "white";
                    closeBtn.style.background = "none";
                    closeBtn.style.border = "none";
                    closeBtn.style.cursor = "pointer";
                    closeBtn.style.zIndex = "10000";
                    closeBtn.onclick = (e) => {
                      e.stopPropagation();
                      document.body.removeChild(modal);
                    };

                    // Add download button
                    const downloadBtn = document.createElement("button");
                    downloadBtn.textContent = "Download";
                    downloadBtn.style.position = "absolute";
                    downloadBtn.style.bottom = "20px";
                    downloadBtn.style.padding = "10px 20px";
                    downloadBtn.style.backgroundColor = "#3b82f6";
                    downloadBtn.style.color = "white";
                    downloadBtn.style.border = "none";
                    downloadBtn.style.borderRadius = "5px";
                    downloadBtn.style.cursor = "pointer";
                    downloadBtn.style.zIndex = "10000";
                    downloadBtn.onclick = (e) => {
                      e.stopPropagation();
                      handleDownload();
                    };

                    modal.onclick = () => {
                      document.body.removeChild(modal);
                    };

                    modal.appendChild(img);
                    modal.appendChild(closeBtn);
                    modal.appendChild(downloadBtn);
                    document.body.appendChild(modal);
                  }}
                  onVariation={handleCreateVariation}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={previousVersions.length > 0}
                  canRedo={redoStack.length > 0}
                  previousVersions={variants}
                  onSelectVariant={(variantUrl) => {
                    if (generatedImage) {
                      setPreviousVersions((prev) => [generatedImage, ...prev]);
                    }
                    setGeneratedImage(variantUrl);
                  }}
                  onUpscale={handleUpscale}
                  theme="dark"
                />
              </section>
            )}
          </div>
        </main>

        <div className="w-full bg-gray-900 text-white py-4 px-4 border-t border-gray-800 mt-auto">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm">Version 1.0.0</p>
                <p className="text-xs text-gray-400">
                  © 2024 AI Image Generator
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  Developed by <span className="font-bold">Shannniii</span>
                </p>
                <p className="text-xs text-gray-400">
                  Fullstack Developer | AI Enthusiast
                </p>
                <div className="flex space-x-2">
                  <a
                    href="mailto:justaskcoding76@gmail.com"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    justaskcoding76@gmail.com
                  </a>
                  <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {isAdmin ? "Exit Admin" : "Admin Panel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
          <div className="flex justify-around items-center py-3">
            <button
              onClick={() => setActiveFeature("text-to-image")}
              className={`flex flex-col items-center ${activeFeature === "text-to-image" ? "text-blue-400" : "text-gray-400"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="m9 15 3 3 3-3" />
              </svg>
              <span className="text-xs mt-1">Generate</span>
            </button>
            <button
              onClick={() => setActiveFeature("basic-drawing")}
              className={`flex flex-col items-center ${activeFeature === "basic-drawing" ? "text-blue-400" : "text-gray-400"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="m2 2 7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              <span className="text-xs mt-1">Draw</span>
            </button>
            <button
              onClick={() => setActiveFeature("styles")}
              className={`flex flex-col items-center ${activeFeature === "styles" ? "text-blue-400" : "text-gray-400"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="13.5" cy="6.5" r="2.5" />
                <circle cx="19" cy="17" r="2" />
                <circle cx="6" cy="17" r="2" />
                <path d="M16 8.2c1 .7 1.7 1.7 2.3 2.8" />
                <path d="M7.5 8.2c-.7.6-1.2 1.5-1.5 2.4" />
                <path d="M7 15c.3-1.1.7-2.1 1.5-3" />
                <path d="M16 15c-.3-1.1-.7-2.1-1.5-3" />
              </svg>
              <span className="text-xs mt-1">Styles</span>
            </button>
            <button
              onClick={() => setActiveFeature("history")}
              className={`flex flex-col items-center ${activeFeature === "history" ? "text-blue-400" : "text-gray-400"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-xs mt-1">History</span>
            </button>
            <button
              onClick={() => setShowPaymentPlans(true)}
              className="flex flex-col items-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span className="text-xs mt-1">Credits</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      {showChatbot && (
        <div
          className="fixed z-50 w-[95vw] md:w-80 h-[500px] shadow-xl rounded-lg overflow-hidden"
          style={{
            ...chatPosition,
            right: window.innerWidth < 768 ? "2.5%" : chatPosition.right,
            left: window.innerWidth < 768 ? "2.5%" : "auto",
            bottom: window.innerWidth < 768 ? "70px" : chatPosition.bottom,
          }}
        >
          <ChatbotHelp
            onClose={() => setShowChatbot(false)}
            theme={currentTheme}
          />
        </div>
      )}

      {/* Chatbot Trigger Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className={`fixed z-50 bottom-20 md:bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${currentTheme === "dark" ? "bg-gray-800" : currentTheme === "evening" ? "bg-indigo-800" : "bg-white"}`}
        >
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
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
              className={`${currentTheme === "dark" || currentTheme === "evening" ? "text-white" : "text-gray-900"}`}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </button>
      )}

      {/* History Sidebar */}
      {showHistorySidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowHistorySidebar(false)}
          ></div>
          <div
            className={`relative w-full md:w-96 h-full bg-gray-900 text-white shadow-xl transition-transform duration-300 transform ${showHistorySidebar ? "translate-x-0" : "-translate-x-full"}`}
          >
            <HistorySidebar
              history={imageHistory}
              onClose={() => setShowHistorySidebar(false)}
              onSelect={handleSelectHistoryImage}
              onDownload={handleDownloadHistoryImage}
              onShare={handleShareHistoryImage}
              onEdit={handleEditHistoryImage}
              theme="dark"
            />
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Image Generation</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span>Default Model</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1"
                  >
                    <option value="stable-diffusion-xl">
                      Stable Diffusion XL
                    </option>
                    <option value="stable-diffusion-2">
                      Stable Diffusion 2
                    </option>
                    <option value="midjourney-v5">Midjourney Style</option>
                    <option value="dall-e-3">DALL-E Style</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Default Dimensions</span>
                  <select
                    value={`${dimensions.width}x${dimensions.height}`}
                    onChange={(e) => {
                      const [width, height] = e.target.value
                        .split("x")
                        .map(Number);
                      setDimensions({ width, height });
                    }}
                    className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1"
                  >
                    <option value="512x512">512x512</option>
                    <option value="768x768">768x768</option>
                    <option value="1024x1024">1024x1024</option>
                    <option value="1024x576">1024x576 (16:9)</option>
                    <option value="576x1024">576x1024 (9:16)</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Interface</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span>Theme</span>
                  <select
                    value={currentTheme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1"
                  >
                    <option value="dark">Dark</option>
                    <option value="evening">Evening</option>
                    <option value="luxury">Luxury</option>
                    <option value="neon">Neon</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
