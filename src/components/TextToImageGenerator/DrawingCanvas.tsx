import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Pencil, Trash2, Download, Wand2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

interface DrawingCanvasProps {
  onGenerateFromDrawing?: (drawingDataUrl: string) => void;
  theme?: "light" | "dark" | "evening";
}

const DrawingCanvas = ({
  onGenerateFromDrawing = () => {},
  theme = "light",
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [hasDrawing, setHasDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Get theme-based styling
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

  const getCanvasBgColor = () => {
    switch (theme) {
      case "dark":
        return "#333";
      case "evening":
        return "#2d3748";
      default:
        return "#fff";
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    // Get context
    const context = canvas.getContext("2d");
    if (!context) return;

    // Scale context to account for pixel ratio
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Fill canvas with background color
    context.fillStyle = getCanvasBgColor();
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Update context when tool or color changes
  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle =
      tool === "eraser" ? getCanvasBgColor() : color;
    contextRef.current.lineWidth = brushSize;
  }, [tool, color, brushSize]);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    let clientX, clientY;

    if ("touches" in e) {
      // Touch event
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    let clientX, clientY;

    if ("touches" in e) {
      // Touch event
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.fillStyle = getCanvasBgColor();
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = dataUrl;
    link.click();
  };

  const handleGenerateFromDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    onGenerateFromDrawing(dataUrl);
  };

  return (
    <div
      className={`w-full p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${getTextColor()}`}>
          Draw Your Idea
        </h2>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === "pencil" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTool("pencil")}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pencil</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === "eraser" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTool("eraser")}
                  className="h-8 w-8"
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eraser</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 rounded-md cursor-pointer"
            disabled={tool === "eraser"}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className={`text-sm ${getTextColor()}`}>
            Brush Size: {brushSize}px
          </label>
        </div>
        <Slider
          value={[brushSize]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => setBrushSize(value[0])}
        />
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] rounded-md border-2 border-dashed cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <p
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${getMutedTextColor()} text-center ${hasDrawing ? "hidden" : "block"}`}
        >
          Draw something here...
        </p>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={clearCanvas}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </Button>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={downloadDrawing}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Save</span>
          </Button>

          <Button
            variant="default"
            onClick={handleGenerateFromDrawing}
            disabled={!hasDrawing}
            className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Wand2 className="h-4 w-4" />
            <span>Generate from Drawing</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
