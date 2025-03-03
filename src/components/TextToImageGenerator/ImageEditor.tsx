import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sliders,
  Palette,
  Layers,
  Type,
  Image as ImageIcon,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo2,
  Redo2,
  Save,
  Download,
  Sparkles,
  Brush,
  Eraser,
  Square,
  Circle,
  Triangle,
  Scissors,
  Wand2,
  Droplet,
  Pipette,
  Stamp,
  Sticker,
  Filter,
} from "lucide-react";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
  theme?: "light" | "dark" | "evening";
}

const ImageEditor = ({
  imageUrl,
  onSave,
  onCancel,
  theme = "dark",
}: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState("adjust");
  const [activeTool, setActiveTool] = useState<string>("brush");
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0,
    sepia: 0,
    grayscale: 0,
    invert: 0,
  });
  const [textOptions, setTextOptions] = useState({
    text: "Sample Text",
    font: "Arial",
    size: 24,
    color: "#ffffff",
    bold: false,
    italic: false,
    underline: false,
  });
  const [selectedEffect, setSelectedEffect] = useState("none");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Initialize canvas and load image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Save original image data for undo
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack([imageData]);

      // Store original image for reapplying filters
      originalImageRef.current = img;
      setImageLoaded(true);

      // Generate variants
      generateVariants();
    };
  }, [imageUrl]);

  // Apply filters when they change
  useEffect(() => {
    if (
      !imageLoaded ||
      !originalImageRef.current ||
      !canvasRef.current ||
      !ctxRef.current
    )
      return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = originalImageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply rotation and scale if needed
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    const scaleValue = scale / 100;
    ctx.scale(scaleValue, scaleValue);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Apply filters using CSS filter property
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Copy the current canvas to temp canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Clear main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      blur(${filters.blur}px) 
      hue-rotate(${filters.hue}deg) 
      sepia(${filters.sepia}%) 
      grayscale(${filters.grayscale}%) 
      invert(${filters.invert}%)
    `;

    // Draw filtered image back to main canvas
    ctx.drawImage(tempCanvas, 0, 0);

    // Reset filter
    ctx.filter = "none";

    // Apply selected preset filter if not "none"
    if (selectedFilter !== "none") {
      applyPresetFilter(selectedFilter);
    }

    // Apply selected effect if not "none"
    if (selectedEffect !== "none") {
      applyEffect(selectedEffect);
    }
  }, [filters, rotation, scale, selectedEffect, selectedFilter, imageLoaded]);

  // Save current state before making changes
  const saveState = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, currentState]);
    setRedoStack([]);
  };

  // Undo last action
  const handleUndo = () => {
    if (undoStack.length <= 1) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Get current state for redo
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack((prev) => [...prev, currentState]);

    // Pop the last state from undo stack
    const newUndoStack = [...undoStack];
    newUndoStack.pop();
    setUndoStack(newUndoStack);

    // Apply the previous state
    const prevState = newUndoStack[newUndoStack.length - 1];
    ctx.putImageData(prevState, 0, 0);
  };

  // Redo last undone action
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Get the last state from redo stack
    const newRedoStack = [...redoStack];
    const redoState = newRedoStack.pop();
    setRedoStack(newRedoStack);

    if (!redoState) return;

    // Get current state for undo
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, currentState]);

    // Apply the redo state
    ctx.putImageData(redoState, 0, 0);
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // Save current state for undo
    saveState();

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set drawing properties based on active tool
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }

    // Start new path
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    // Handle shape tools
    if (
      activeTool === "square" ||
      activeTool === "circle" ||
      activeTool === "triangle"
    ) {
      // For shapes, we'll just store the starting point
      // and draw the shape on mouse up
      ctx.startX = x;
      ctx.startY = y;
    }
  };

  // Draw while mouse is moving
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // Get mouse position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // For brush and eraser, continue the path
    if (activeTool === "brush" || activeTool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  // Stop drawing
  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // For brush and eraser, just end the path
    if (activeTool === "brush" || activeTool === "eraser") {
      ctx.closePath();
    }

    // For shape tools, draw the shape
    if (
      activeTool === "square" ||
      activeTool === "circle" ||
      activeTool === "triangle"
    ) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Reset composite operation to normal
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = brushColor;

      if (activeTool === "square") {
        const width = x - ctx.startX;
        const height = y - ctx.startY;
        ctx.fillRect(ctx.startX, ctx.startY, width, height);
      } else if (activeTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - ctx.startX, 2) + Math.pow(y - ctx.startY, 2),
        );
        ctx.beginPath();
        ctx.arc(ctx.startX, ctx.startY, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeTool === "triangle") {
        ctx.beginPath();
        ctx.moveTo(ctx.startX, ctx.startY);
        ctx.lineTo(x, y);
        ctx.lineTo(ctx.startX - (x - ctx.startX), y);
        ctx.closePath();
        ctx.fill();
      }
    }

    setIsDrawing(false);
  };

  // Add text to canvas
  const addText = () => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // Save current state for undo
    saveState();

    // Set text properties
    let fontString = `${textOptions.size}px ${textOptions.font}`;
    if (textOptions.bold) fontString = `bold ${fontString}`;
    if (textOptions.italic) fontString = `italic ${fontString}`;

    ctx.font = fontString;
    ctx.fillStyle = textOptions.color;
    ctx.textBaseline = "middle";

    // Draw text in center of canvas
    const textWidth = ctx.measureText(textOptions.text).width;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2;

    ctx.fillText(textOptions.text, x, y);

    // Add underline if selected
    if (textOptions.underline) {
      const metrics = ctx.measureText(textOptions.text);
      const lineY = y + metrics.actualBoundingBoxDescent + 2;
      ctx.beginPath();
      ctx.moveTo(x, lineY);
      ctx.lineTo(x + textWidth, lineY);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  // Apply preset filter
  const applyPresetFilter = (filter: string) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply filter based on selection
    switch (filter) {
      case "vintage":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Sepia-like effect
          data[i] = Math.min(255, r * 0.9 + g * 0.1 + b * 0.1);
          data[i + 1] = Math.min(255, r * 0.3 + g * 0.8 + b * 0.1);
          data[i + 2] = Math.min(255, r * 0.2 + g * 0.1 + b * 0.7);
        }
        break;

      case "noir":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Convert to grayscale with high contrast
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const contrast = 1.5; // Increase contrast
          const value = Math.min(
            255,
            Math.max(0, (gray - 128) * contrast + 128),
          );

          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
        }
        break;

      case "cyberpunk":
        for (let i = 0; i < data.length; i += 4) {
          // Enhance blues and pinks
          data[i] = Math.min(255, data[i] * 0.8 + 50); // Red
          data[i + 2] = Math.min(255, data[i + 2] * 1.2 + 30); // Blue
        }
        break;

      case "dreamy":
        for (let i = 0; i < data.length; i += 4) {
          // Soft, dreamy effect
          data[i] = Math.min(255, data[i] * 0.9 + 25); // Red
          data[i + 1] = Math.min(255, data[i + 1] * 0.9 + 25); // Green
          data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 10); // Blue
        }
        break;

      case "dramatic":
        for (let i = 0; i < data.length; i += 4) {
          // High contrast dramatic look
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          data[i] = Math.min(255, r * 1.1);
          data[i + 1] = Math.min(255, g * 0.9);
          data[i + 2] = Math.min(255, b * 0.9);
        }
        break;
    }

    // Put modified image data back to canvas
    ctx.putImageData(imageData, 0, 0);
  };

  // Apply special effect
  const applyEffect = (effect: string) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply effect based on selection
    switch (effect) {
      case "pixelate":
        const pixelSize = Math.max(8, Math.floor(canvas.width / 50));

        for (let y = 0; y < canvas.height; y += pixelSize) {
          for (let x = 0; x < canvas.width; x += pixelSize) {
            // Get the color of the first pixel in the block
            const pixelIndex = (y * canvas.width + x) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];

            // Apply this color to all pixels in the block
            for (
              let blockY = 0;
              blockY < pixelSize && y + blockY < canvas.height;
              blockY++
            ) {
              for (
                let blockX = 0;
                blockX < pixelSize && x + blockX < canvas.width;
                blockX++
              ) {
                const blockIndex =
                  ((y + blockY) * canvas.width + (x + blockX)) * 4;
                data[blockIndex] = r;
                data[blockIndex + 1] = g;
                data[blockIndex + 2] = b;
              }
            }
          }
        }
        break;

      case "glitch":
        // Simple glitch effect - shift color channels
        for (let y = 0; y < canvas.height; y++) {
          if (Math.random() < 0.05) {
            // 5% chance of glitching a line
            const shiftAmount = Math.floor(Math.random() * 20) - 10;

            for (let x = 0; x < canvas.width; x++) {
              const sourceIndex = (y * canvas.width + x) * 4;
              const targetIndex =
                (y * canvas.width +
                  Math.min(canvas.width - 1, Math.max(0, x + shiftAmount))) *
                4;

              // Shift red channel
              data[targetIndex] = data[sourceIndex];
            }
          }
        }
        break;

      case "vignette":
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;

            // Calculate distance from center
            const distX = centerX - x;
            const distY = centerY - y;
            const dist = Math.sqrt(distX * distX + distY * distY);

            // Calculate vignette factor (1 at center, 0 at edges)
            const factor = Math.max(0, 1 - (dist / maxDist) * 1.5);

            // Apply darkening based on distance
            data[index] = data[index] * factor;
            data[index + 1] = data[index + 1] * factor;
            data[index + 2] = data[index + 2] * factor;
          }
        }
        break;

      case "duotone":
        // Duotone effect (purple and teal)
        const color1 = { r: 102, g: 51, b: 153 }; // Purple
        const color2 = { r: 0, g: 128, b: 128 }; // Teal

        for (let i = 0; i < data.length; i += 4) {
          const gray =
            0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const normalized = gray / 255;

          // Interpolate between the two colors
          data[i] = color1.r * (1 - normalized) + color2.r * normalized;
          data[i + 1] = color1.g * (1 - normalized) + color2.g * normalized;
          data[i + 2] = color1.b * (1 - normalized) + color2.b * normalized;
        }
        break;

      case "oil":
        // Simple oil painting effect
        const radius = 4;
        const intensityLevels = 20;
        const tempData = new Uint8ClampedArray(data);

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const intensityCounts = new Array(intensityLevels).fill(0);
            const intensityR = new Array(intensityLevels).fill(0);
            const intensityG = new Array(intensityLevels).fill(0);
            const intensityB = new Array(intensityLevels).fill(0);

            // Sample the surrounding pixels
            for (let offsetY = -radius; offsetY <= radius; offsetY++) {
              const sampleY = Math.min(
                Math.max(0, y + offsetY),
                canvas.height - 1,
              );

              for (let offsetX = -radius; offsetX <= radius; offsetX++) {
                const sampleX = Math.min(
                  Math.max(0, x + offsetX),
                  canvas.width - 1,
                );
                const sampleIndex = (sampleY * canvas.width + sampleX) * 4;

                const r = tempData[sampleIndex];
                const g = tempData[sampleIndex + 1];
                const b = tempData[sampleIndex + 2];

                // Calculate intensity level
                const intensity = Math.floor(
                  (((r + g + b) / 3) * intensityLevels) / 255,
                );

                intensityCounts[intensity]++;
                intensityR[intensity] += r;
                intensityG[intensity] += g;
                intensityB[intensity] += b;
              }
            }

            // Find the most common intensity level
            let maxIntensity = 0;
            let maxIndex = 0;
            for (let i = 0; i < intensityLevels; i++) {
              if (intensityCounts[i] > maxIntensity) {
                maxIntensity = intensityCounts[i];
                maxIndex = i;
              }
            }

            // Set the pixel to the average color of the most common intensity level
            const destIndex = (y * canvas.width + x) * 4;
            if (maxIntensity > 0) {
              data[destIndex] = Math.round(intensityR[maxIndex] / maxIntensity);
              data[destIndex + 1] = Math.round(
                intensityG[maxIndex] / maxIntensity,
              );
              data[destIndex + 2] = Math.round(
                intensityB[maxIndex] / maxIntensity,
              );
            }
          }
        }
        break;
    }

    // Put modified image data back to canvas
    ctx.putImageData(imageData, 0, 0);
  };

  // Generate image variants
  const generateVariants = () => {
    if (!canvasRef.current || !ctxRef.current || !originalImageRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = originalImageRef.current;

    // Create 3 variants with different filters
    const variantFilters = [
      { brightness: 110, contrast: 120, saturation: 130, hue: 15 },
      { brightness: 90, contrast: 110, saturation: 80, hue: -15 },
      { brightness: 100, contrast: 130, saturation: 110, hue: 0, sepia: 30 },
    ];

    const newVariants: string[] = [];

    variantFilters.forEach((filterSet) => {
      // Create a temporary canvas for this variant
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Draw original image
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

      // Apply filter
      tempCtx.filter = `
        brightness(${filterSet.brightness}%) 
        contrast(${filterSet.contrast}%) 
        saturate(${filterSet.saturation}%) 
        hue-rotate(${filterSet.hue || 0}deg) 
        sepia(${filterSet.sepia || 0}%)
      `;

      // Draw filtered image
      tempCtx.drawImage(tempCanvas, 0, 0);
      tempCtx.filter = "none";

      // Get data URL and add to variants
      const variantUrl = tempCanvas.toDataURL("image/png");
      newVariants.push(variantUrl);
    });

    setVariants(newVariants);
  };

  // Save edited image
  const handleSave = () => {
    if (!canvasRef.current) return;
    const editedImageUrl = canvasRef.current.toDataURL("image/png");
    onSave(editedImageUrl);
  };

  // Download edited image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const editedImageUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `edited-image-${Date.now()}.png`;
    link.href = editedImageUrl;
    link.click();
  };

  // Apply variant
  const applyVariant = (variantUrl: string) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // Save current state for undo
    saveState();

    // Load variant image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = variantUrl;

    img.onload = () => {
      // Clear canvas and draw variant
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

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

  return (
    <div
      className={`w-full h-full flex flex-col ${getBackgroundColor()} ${getTextColor()}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Image Editor</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Tools */}
        <div className="w-16 border-r border-gray-700 p-2 flex flex-col items-center space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === "brush" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setActiveTool("brush")}
                  className="w-10 h-10"
                >
                  <Brush className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Brush</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === "eraser" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setActiveTool("eraser")}
                  className="w-10 h-10"
                >
                  <Eraser className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Eraser</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === "square" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setActiveTool("square")}
                  className="w-10 h-10"
                >
                  <Square className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Square</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === "circle" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setActiveTool("circle")}
                  className="w-10 h-10"
                >
                  <Circle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Circle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === "triangle" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setActiveTool("triangle")}
                  className="w-10 h-10"
                >
                  <Triangle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Triangle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="border-t border-gray-700 w-full my-2"></div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  disabled={undoStack.length <= 1}
                  className="w-10 h-10"
                >
                  <Undo2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
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
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="w-10 h-10"
                >
                  <Redo2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="border-t border-gray-700 w-full my-2"></div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="w-10 h-10"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-950 overflow-auto p-4">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full border border-gray-700 cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Right sidebar - Settings */}
        <div className="w-64 border-l border-gray-700 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start">
              <TabsTrigger value="adjust" className="flex items-center gap-1">
                <Sliders className="h-4 w-4" />
                Adjust
              </TabsTrigger>
              <TabsTrigger value="effects" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Effects
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-1">
                <Type className="h-4 w-4" />
                Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="adjust" className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Brightness</label>
                  <span className="text-xs">{filters.brightness}%</span>
                </div>
                <Slider
                  value={[filters.brightness]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, brightness: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Contrast</label>
                  <span className="text-xs">{filters.contrast}%</span>
                </div>
                <Slider
                  value={[filters.contrast]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, contrast: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Saturation</label>
                  <span className="text-xs">{filters.saturation}%</span>
                </div>
                <Slider
                  value={[filters.saturation]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, saturation: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Hue Rotate</label>
                  <span className="text-xs">{filters.hue}°</span>
                </div>
                <Slider
                  value={[filters.hue]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, hue: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Blur</label>
                  <span className="text-xs">{filters.blur}px</span>
                </div>
                <Slider
                  value={[filters.blur]}
                  min={0}
                  max={20}
                  step={0.1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, blur: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Sepia</label>
                  <span className="text-xs">{filters.sepia}%</span>
                </div>
                <Slider
                  value={[filters.sepia]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, sepia: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Grayscale</label>
                  <span className="text-xs">{filters.grayscale}%</span>
                </div>
                <Slider
                  value={[filters.grayscale]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, grayscale: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Invert</label>
                  <span className="text-xs">{filters.invert}%</span>
                </div>
                <Slider
                  value={[filters.invert]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    setFilters({ ...filters, invert: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Rotation</label>
                  <span className="text-xs">{rotation}°</span>
                </div>
                <Slider
                  value={[rotation]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => setRotation(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Scale</label>
                  <span className="text-xs">{scale}%</span>
                </div>
                <Slider
                  value={[scale]}
                  min={50}
                  max={150}
                  step={1}
                  onValueChange={(value) => setScale(value[0])}
                />
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setFilters({
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    blur: 0,
                    hue: 0,
                    sepia: 0,
                    grayscale: 0,
                    invert: 0,
                  });
                  setRotation(0);
                  setScale(100);
                }}
              >
                Reset All
              </Button>
            </TabsContent>

            <TabsContent value="effects" className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brush Size</label>
                <Slider
                  value={[brushSize]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setBrushSize(value[0])}
                />
                <div className="flex justify-between">
                  <span className="text-xs">1px</span>
                  <span className="text-xs">{brushSize}px</span>
                  <span className="text-xs">50px</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brush Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-xs">{brushColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preset Filters</label>
                <Select
                  value={selectedFilter}
                  onValueChange={setSelectedFilter}
                >
                  <SelectTrigger className={`w-full ${getInputBgColor()}`}>
                    <SelectValue placeholder="Select a filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="noir">Noir</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="dreamy">Dreamy</SelectItem>
                    <SelectItem value="dramatic">Dramatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Special Effects</label>
                <Select
                  value={selectedEffect}
                  onValueChange={setSelectedEffect}
                >
                  <SelectTrigger className={`w-full ${getInputBgColor()}`}>
                    <SelectValue placeholder="Select an effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="pixelate">Pixelate</SelectItem>
                    <SelectItem value="glitch">Glitch</SelectItem>
                    <SelectItem value="vignette">Vignette</SelectItem>
                    <SelectItem value="duotone">Duotone</SelectItem>
                    <SelectItem value="oil">Oil Painting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="text" className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text</label>
                <textarea
                  value={textOptions.text}
                  onChange={(e) =>
                    setTextOptions({ ...textOptions, text: e.target.value })
                  }
                  className={`w-full h-20 p-2 rounded ${getInputBgColor()}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Font</label>
                <Select
                  value={textOptions.font}
                  onValueChange={(value) =>
                    setTextOptions({ ...textOptions, font: value })
                  }
                >
                  <SelectTrigger className={`w-full ${getInputBgColor()}`}>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">
                      Times New Roman
                    </SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                    <SelectItem value="Impact">Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Slider
                  value={[textOptions.size]}
                  min={8}
                  max={72}
                  step={1}
                  onValueChange={(value) =>
                    setTextOptions({ ...textOptions, size: value[0] })
                  }
                />
                <div className="flex justify-between">
                  <span className="text-xs">8px</span>
                  <span className="text-xs">{textOptions.size}px</span>
                  <span className="text-xs">72px</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={textOptions.color}
                    onChange={(e) =>
                      setTextOptions({ ...textOptions, color: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-xs">{textOptions.color}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={textOptions.bold ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setTextOptions({ ...textOptions, bold: !textOptions.bold })
                  }
                  className="flex-1"
                >
                  Bold
                </Button>
                <Button
                  variant={textOptions.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setTextOptions({
                      ...textOptions,
                      italic: !textOptions.italic,
                    })
                  }
                  className="flex-1"
                >
                  Italic
                </Button>
                <Button
                  variant={textOptions.underline ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setTextOptions({
                      ...textOptions,
                      underline: !textOptions.underline,
                    })
                  }
                  className="flex-1"
                >
                  Underline
                </Button>
              </div>

              <Button
                variant="default"
                className="w-full mt-4"
                onClick={addText}
              >
                Add Text
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Variants section */}
      {variants.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <h3 className="text-sm font-medium mb-2">Variants</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {variants.map((variant, index) => (
              <div key={index} className="relative group">
                <img
                  src={variant}
                  alt={`Variant ${index + 1}`}
                  className="h-20 w-auto rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => applyVariant(variant)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={() => applyVariant(variant)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
