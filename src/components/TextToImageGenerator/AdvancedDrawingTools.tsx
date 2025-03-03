import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  Brush,
  Eraser,
  Square,
  Circle,
  Triangle,
  Undo2,
  Redo2,
  Download,
  Trash2,
  Pipette,
  Palette,
  Wand2,
  Layers,
  Type,
  Droplet,
  Pencil,
  Pen,
  Highlighter,
  Shapes,
  Star,
  Heart,
  Sticker,
} from "lucide-react";

interface AdvancedDrawingToolsProps {
  onGenerateFromDrawing?: (drawingDataUrl: string) => void;
  theme?: "light" | "dark" | "evening";
}

const AdvancedDrawingTools = ({
  onGenerateFromDrawing = () => {},
  theme = "dark",
}: AdvancedDrawingToolsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<string>("pencil");
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(100);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [textOptions, setTextOptions] = useState({
    text: "Sample Text",
    font: "Arial",
    size: 24,
    color: "#ffffff",
  });
  const [showTextInput, setShowTextInput] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [fillShape, setFillShape] = useState(true);
  const [brushStyle, setBrushStyle] = useState("solid");
  const [backgroundType, setBackgroundType] = useState("transparent");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [colorHistory, setColorHistory] = useState<string[]>([
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
  ]);

  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

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

  const getCanvasBgColor = () => {
    if (backgroundType === "transparent") {
      return "transparent";
    }
    return backgroundColor;
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
    context.globalAlpha = opacity / 100;
    contextRef.current = context;

    // Fill canvas with background color
    context.fillStyle = getCanvasBgColor();
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state for undo
    const initialState = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setUndoStack([initialState]);

    // Fix for touch events on mobile devices
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [backgroundColor, backgroundType]); // Added dependencies to fix canvas background

  // Touch event handlers to ensure drawing works on mobile
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !contextRef.current) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Save current state for undo
    saveState();

    setStartX(x);
    setStartY(y);

    if (tool === "text") {
      setShowTextInput(true);
      return;
    }

    if (tool === "eyedropper") {
      const pixel = contextRef.current.getImageData(x, y, 1, 1).data;
      const hexColor = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1].toString(16).padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
      setColor(hexColor);
      if (!colorHistory.includes(hexColor)) {
        setColorHistory((prev) => [hexColor, ...prev.slice(0, 4)]);
      }
      return;
    }

    if (tool !== "shapes") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (tool === "shapes") {
      // For shapes, we'll preview the shape as the user drags
      const context = contextRef.current;

      // Clear the canvas to the last saved state
      const lastState = undoStack[undoStack.length - 1];
      context.putImageData(lastState, 0, 0);

      // Draw the shape preview
      context.strokeStyle = color;
      context.fillStyle = color;

      if (selectedShape === "rectangle") {
        if (fillShape) {
          context.fillRect(startX, startY, x - startX, y - startY);
        } else {
          context.strokeRect(startX, startY, x - startX, y - startY);
        }
      } else if (selectedShape === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startX, 2) + Math.pow(y - startY, 2),
        );
        context.beginPath();
        context.arc(startX, startY, radius, 0, Math.PI * 2);
        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
      } else if (selectedShape === "triangle") {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.lineTo(startX - (x - startX), y);
        context.closePath();
        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
      } else if (selectedShape === "star") {
        drawStar(context, startX, startY, x, y);
      } else if (selectedShape === "heart") {
        drawHeart(context, startX, startY, x, y);
      }
      return;
    }

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    setHasDrawing(true);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (!contextRef.current) return;

    if (tool === "shapes") {
      setHasDrawing(true);
    } else if (tool !== "text" && tool !== "eyedropper") {
      contextRef.current.closePath();
    }

    setIsDrawing(false);
  };

  // Helper functions for drawing complex shapes
  const drawStar = (
    context: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    x: number,
    y: number,
  ) => {
    const outerRadius = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    const innerRadius = outerRadius / 2;
    const spikes = 5;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    context.beginPath();
    context.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      context.lineTo(
        cx + Math.cos(rot) * outerRadius,
        cy + Math.sin(rot) * outerRadius,
      );
      rot += step;
      context.lineTo(
        cx + Math.cos(rot) * innerRadius,
        cy + Math.sin(rot) * innerRadius,
      );
      rot += step;
    }

    context.lineTo(cx, cy - outerRadius);
    context.closePath();

    if (fillShape) {
      context.fill();
    } else {
      context.stroke();
    }
  };

  const drawHeart = (
    context: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    x: number,
    y: number,
  ) => {
    const size = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));

    context.beginPath();
    context.moveTo(cx, cy - size / 4);
    context.bezierCurveTo(
      cx - size / 2,
      cy - size / 2,
      cx - size,
      cy,
      cx,
      cy + size / 2,
    );
    context.bezierCurveTo(
      cx + size,
      cy,
      cx + size / 2,
      cy - size / 2,
      cx,
      cy - size / 4,
    );
    context.closePath();

    if (fillShape) {
      context.fill();
    } else {
      context.stroke();
    }
  };

  // Update context when tool or color changes
  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle =
      tool === "eraser" ? getCanvasBgColor() : color;
    contextRef.current.lineWidth = brushSize;
    contextRef.current.globalAlpha = opacity / 100;

    // Set brush style
    if (brushStyle === "dashed") {
      contextRef.current.setLineDash([brushSize * 2, brushSize]);
    } else if (brushStyle === "dotted") {
      contextRef.current.setLineDash([brushSize, brushSize * 2]);
    } else {
      contextRef.current.setLineDash([]);
    }
  }, [tool, color, brushSize, opacity, brushStyle]);

  // Update background when it changes
  useEffect(() => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;

    // Save current drawing
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Fill with new background
    context.fillStyle = getCanvasBgColor();
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Restore drawing
    context.putImageData(imageData, 0, 0);
  }, [backgroundType, backgroundColor]);

  // Save current state before making changes
  const saveState = () => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;

    const currentState = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setUndoStack((prev) => [...prev, currentState]);
    setRedoStack([]);
  };

  // Undo last action
  const handleUndo = () => {
    if (undoStack.length <= 1) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Get current state for redo
    const currentState = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setRedoStack((prev) => [...prev, currentState]);

    // Pop the last state from undo stack
    const newUndoStack = [...undoStack];
    newUndoStack.pop();
    setUndoStack(newUndoStack);

    // Apply the previous state
    const prevState = newUndoStack[newUndoStack.length - 1];
    context.putImageData(prevState, 0, 0);
  };

  // Redo last undone action
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Get the last state from redo stack
    const newRedoStack = [...redoStack];
    const redoState = newRedoStack.pop();
    setRedoStack(newRedoStack);

    if (!redoState) return;

    // Get current state for undo
    const currentState = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setUndoStack((prev) => [...prev, currentState]);

    // Apply the redo state
    context.putImageData(redoState, 0, 0);
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    // Save current state for undo
    saveState();

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

    setStartX(x);
    setStartY(y);

    if (tool === "text") {
      // For text tool, show text input at click position
      setShowTextInput(true);
      return;
    }

    if (tool === "eyedropper") {
      // For eyedropper, get color at click position
      const pixel = contextRef.current.getImageData(x, y, 1, 1).data;
      const hexColor = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1].toString(16).padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
      setColor(hexColor);
      // Add to color history if not already there
      if (!colorHistory.includes(hexColor)) {
        setColorHistory((prev) => [hexColor, ...prev.slice(0, 4)]);
      }
      return;
    }

    if (tool === "shapes") {
      // For shapes, just store the starting point
      return;
    }

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

    if (tool === "shapes") {
      // For shapes, we'll preview the shape as the user drags
      const canvas = canvasRef.current;
      const context = contextRef.current;

      // Clear the canvas to the last saved state
      const lastState = undoStack[undoStack.length - 1];
      context.putImageData(lastState, 0, 0);

      // Draw the shape preview
      context.strokeStyle = color;
      context.fillStyle = color;

      if (selectedShape === "rectangle") {
        if (fillShape) {
          context.fillRect(startX, startY, x - startX, y - startY);
        } else {
          context.strokeRect(startX, startY, x - startX, y - startY);
        }
      } else if (selectedShape === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startX, 2) + Math.pow(y - startY, 2),
        );
        context.beginPath();
        context.arc(startX, startY, radius, 0, Math.PI * 2);
        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
      } else if (selectedShape === "triangle") {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.lineTo(startX - (x - startX), y);
        context.closePath();
        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
      } else if (selectedShape === "star") {
        const outerRadius = Math.sqrt(
          Math.pow(x - startX, 2) + Math.pow(y - startY, 2),
        );
        const innerRadius = outerRadius / 2;
        const spikes = 5;
        const cx = startX;
        const cy = startY;

        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;

        context.beginPath();
        context.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
          context.lineTo(
            cx + Math.cos(rot) * outerRadius,
            cy + Math.sin(rot) * outerRadius,
          );
          rot += step;
          context.lineTo(
            cx + Math.cos(rot) * innerRadius,
            cy + Math.sin(rot) * innerRadius,
          );
          rot += step;
        }

        context.lineTo(cx, cy - outerRadius);
        context.closePath();

        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
      } else if (selectedShape === "heart") {
        const size = Math.sqrt(
          Math.pow(x - startX, 2) + Math.pow(y - startY, 2),
        );
        const cx = startX;
        const cy = startY;

        context.beginPath();
        context.moveTo(cx, cy - size / 4);
        context.bezierCurveTo(
          cx - size / 2,
          cy - size / 2,
          cx - size,
          cy,
          cx,
          cy + size / 2,
        );
        context.bezierCurveTo(
          cx + size,
          cy,
          cx + size / 2,
          cy - size / 2,
          cx,
          cy - size / 4,
        );
        context.closePath();

        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
      }

      return;
    }

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;

    if (tool === "shapes") {
      // For shapes, the final shape is already drawn in the draw function
      setHasDrawing(true);
    } else if (tool !== "text" && tool !== "eyedropper") {
      contextRef.current.closePath();
    }

    setIsDrawing(false);
  };

  const addText = () => {
    if (!contextRef.current || !canvasRef.current) return;

    // Hide text input
    setShowTextInput(false);

    // Save current state for undo
    saveState();

    // Set text properties
    contextRef.current.font = `${textOptions.size}px ${textOptions.font}`;
    contextRef.current.fillStyle = textOptions.color;
    contextRef.current.textBaseline = "middle";

    // Draw text at click position
    contextRef.current.fillText(textOptions.text, startX, startY);
    setHasDrawing(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Save current state for undo
    saveState();

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

  const predefinedColors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#ff8000",
    "#8000ff",
    "#ff0080",
    "#80ff00",
    "#0080ff",
    "#800000",
    "#008000",
    "#000080",
    "#808080",
    "#c0c0c0",
    "#804000",
    "#408000",
  ];

  return (
    <div
      className={`w-full p-4 md:p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className={`text-xl font-semibold ${getTextColor()}`}>
          Advanced Drawing Tools
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
                  variant={tool === "brush" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTool("brush")}
                  className="h-8 w-8"
                >
                  <Brush className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Brush</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === "pen" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTool("pen")}
                  className="h-8 w-8"
                >
                  <Pen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === "highlighter" ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    setTool("highlighter");
                    setOpacity(50); // Highlighters are semi-transparent
                  }}
                  className="h-8 w-8"
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Highlighter</p>
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === "shapes" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTool("shapes")}
                  className="h-8 w-8"
                >
                  <Shapes className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shapes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === "text" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTool("text")}
                  className="h-8 w-8"
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Text</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === "eyedropper" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTool("eyedropper")}
                  className="h-8 w-8"
                >
                  <Pipette className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Color Picker</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Shape options */}
      {tool === "shapes" && (
        <div className="mb-4 p-2 border border-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${getTextColor()}`}>
              Shape Type:
            </span>
            <div className="flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "rectangle" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("rectangle")}
                      className="h-7 w-7"
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rectangle</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "circle" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("circle")}
                      className="h-7 w-7"
                    >
                      <Circle className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Circle</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "triangle" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("triangle")}
                      className="h-7 w-7"
                    >
                      <Triangle className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Triangle</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedShape === "star" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setSelectedShape("star")}
                      className="h-7 w-7"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Star</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "heart" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("heart")}
                      className="h-7 w-7"
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Heart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${getTextColor()}`}>
              Fill Shape:
            </span>
            <Button
              variant={fillShape ? "default" : "outline"}
              size="sm"
              onClick={() => setFillShape(!fillShape)}
              className="h-7"
            >
              {fillShape ? "Filled" : "Outline"}
            </Button>
          </div>
        </div>
      )}

      {/* Text options */}
      {tool === "text" && (
        <div className="mb-4 p-2 border border-gray-700 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${getTextColor()}`}
              >
                Text
              </label>
              <input
                type="text"
                value={textOptions.text}
                onChange={(e) =>
                  setTextOptions({ ...textOptions, text: e.target.value })
                }
                className="w-full p-1 text-sm bg-gray-800 border border-gray-700 rounded"
              />
            </div>
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${getTextColor()}`}
              >
                Font
              </label>
              <Select
                value={textOptions.font}
                onValueChange={(value) =>
                  setTextOptions({ ...textOptions, font: value })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Font" />
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
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${getTextColor()}`}
              >
                Size
              </label>
              <Select
                value={textOptions.size.toString()}
                onValueChange={(value) =>
                  setTextOptions({ ...textOptions, size: parseInt(value) })
                }
              >
                <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                  <SelectItem value="24">24px</SelectItem>
                  <SelectItem value="32">32px</SelectItem>
                  <SelectItem value="48">48px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${getTextColor()}`}
              >
                Color
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={textOptions.color}
                  onChange={(e) =>
                    setTextOptions({ ...textOptions, color: e.target.value })
                  }
                  className="w-8 h-6 rounded cursor-pointer"
                />
                <span className="text-xs">{textOptions.color}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brush style options */}
      {(tool === "brush" || tool === "pen" || tool === "pencil") && (
        <div className="mb-4 p-2 border border-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${getTextColor()}`}>
              Brush Style:
            </span>
            <div className="flex space-x-1">
              <Button
                variant={brushStyle === "solid" ? "default" : "outline"}
                size="sm"
                onClick={() => setBrushStyle("solid")}
                className="h-7 text-xs"
              >
                Solid
              </Button>
              <Button
                variant={brushStyle === "dashed" ? "default" : "outline"}
                size="sm"
                onClick={() => setBrushStyle("dashed")}
                className="h-7 text-xs"
              >
                Dashed
              </Button>
              <Button
                variant={brushStyle === "dotted" ? "default" : "outline"}
                size="sm"
                onClick={() => setBrushStyle("dotted")}
                className="h-7 text-xs"
              >
                Dotted
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className={`text-sm ${getTextColor()}`}>
            Brush Size: {brushSize}px
          </label>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
              className="h-6 w-6"
            >
              -
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
              className="h-6 w-6"
            >
              +
            </Button>
          </div>
        </div>
        <Slider
          value={[brushSize]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => setBrushSize(value[0])}
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className={`text-sm ${getTextColor()}`}>
            Opacity: {opacity}%
          </label>
        </div>
        <Slider
          value={[opacity]}
          min={10}
          max={100}
          step={1}
          onValueChange={(value) => setOpacity(value[0])}
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className={`text-sm ${getTextColor()}`}>Color</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPalette(!showColorPalette)}
            className="h-7 text-xs"
          >
            {showColorPalette ? "Hide Palette" : "Show Palette"}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              // Add to color history if not already there
              if (!colorHistory.includes(e.target.value)) {
                setColorHistory((prev) => [
                  e.target.value,
                  ...prev.slice(0, 4),
                ]);
              }
            }}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex flex-wrap gap-1 mb-1">
              {colorHistory.map((historyColor, index) => (
                <div
                  key={`history-${index}`}
                  className="w-6 h-6 rounded cursor-pointer border border-gray-700"
                  style={{ backgroundColor: historyColor }}
                  onClick={() => setColor(historyColor)}
                />
              ))}
            </div>
            {showColorPalette && (
              <div className="flex flex-wrap gap-1 mt-2">
                {predefinedColors.map((presetColor, index) => (
                  <div
                    key={`preset-${index}`}
                    className="w-6 h-6 rounded cursor-pointer border border-gray-700"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => setColor(presetColor)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] rounded-md border-2 border-dashed cursor-crosshair touch-none bg-black"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {showTextInput && (
          <div
            className="absolute p-2 bg-gray-800 border border-gray-700 rounded shadow-lg"
            style={{ left: `${startX}px`, top: `${startY + 30}px` }}
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={textOptions.text}
                onChange={(e) =>
                  setTextOptions({ ...textOptions, text: e.target.value })
                }
                className="p-1 text-sm bg-gray-700 border border-gray-600 rounded"
                autoFocus
              />
              <Button size="sm" onClick={addText}>
                Add
              </Button>
            </div>
          </div>
        )}

        <p
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${getMutedTextColor()} text-center ${hasDrawing ? "hidden" : "block"}`}
        >
          Draw something here...
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-4 gap-2">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            className="flex items-center gap-1"
          >
            <Undo2 className="h-4 w-4" />
            <span>Undo</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="flex items-center gap-1"
          >
            <Redo2 className="h-4 w-4" />
            <span>Redo</span>
          </Button>
          <Button
            variant="outline"
            onClick={clearCanvas}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>

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

export default AdvancedDrawingTools;
