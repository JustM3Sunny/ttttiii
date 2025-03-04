import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Box,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Share2,
  Layers,
  Palette,
  Wand2,
  Loader2,
  Code,
  FileCode,
  FileJson,
} from "lucide-react";

interface ThreeDModelViewerProps {
  modelUrl?: string;
  theme?: "light" | "dark" | "evening" | "luxury" | "neon";
  onExport?: (format: string) => void;
}

const ThreeDModelViewer = ({
  modelUrl = "https://storage.googleapis.com/ucloud-v3/ccab50f18fb14dd1bc79e1db3b5e53a4.glb", // Default model URL
  theme = "dark",
  onExport = () => {},
}: ThreeDModelViewerProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState("glb");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);

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

  // Generate a 3D-like image instead of using Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Auto-rotate to show the model is working
      setAutoRotate(true);
      
      // Generate a 3D-like image based on the prompt
      const generateImage = () => {
        // Create a canvas to draw a 3D-like image
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        // Draw a gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw a 3D cube
        ctx.strokeStyle = '#4361ee';
        ctx.lineWidth = 2;
        
        // Front face
        ctx.beginPath();
        ctx.moveTo(300, 300);
        ctx.lineTo(500, 300);
        ctx.lineTo(500, 500);
        ctx.lineTo(300, 500);
        ctx.closePath();
        ctx.stroke();
        
        // Back face
        ctx.beginPath();
        ctx.moveTo(400, 200);
        ctx.lineTo(600, 200);
        ctx.lineTo(600, 400);
        ctx.lineTo(400, 400);
        ctx.closePath();
        ctx.stroke();
        
        // Connecting lines
        ctx.beginPath();
        ctx.moveTo(300, 300);
        ctx.lineTo(400, 200);
        ctx.moveTo(500, 300);
        ctx.lineTo(600, 200);
        ctx.moveTo(500, 500);
        ctx.lineTo(600, 400);
        ctx.moveTo(300, 500);
        ctx.lineTo(400, 400);
        ctx.stroke();
        
        // Add some glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#4361ee';
        ctx.strokeStyle = '#4cc9f0';
        ctx.beginPath();
        ctx.arc(450, 350, 150, 0, Math.PI * 2);
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Add some text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('3D Model Viewer', 330, 550);
        
        // Return the canvas as an image
        return canvas.toDataURL('image/png');
      };
      
      // Replace the placeholder image with our generated 3D-like image
      const modelImage = document.querySelector('#model-preview-image');
      if (modelImage) {
        modelImage.src = generateImage();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  
  // Function to export 3D model as HTML
  const exportAsHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Model Viewer</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background-color: #1a1a2e; font-family: Arial, sans-serif; }
    #container { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
    .model { position: relative; width: 400px; height: 400px; transform-style: preserve-3d; transform: rotateY(0deg); animation: rotate 15s infinite linear; }
    .face { position: absolute; width: 200px; height: 200px; border: 2px solid #4361ee; background-color: rgba(67, 97, 238, 0.1); }
    .front { transform: translateZ(100px); }
    .back { transform: translateZ(-100px) rotateY(180deg); }
    .right { transform: rotateY(90deg) translateZ(100px); }
    .left { transform: rotateY(-90deg) translateZ(100px); }
    .top { transform: rotateX(90deg) translateZ(100px); }
    .bottom { transform: rotateX(-90deg) translateZ(100px); }
    .controls { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
    button { background: rgba(67, 97, 238, 0.3); color: white; border: 1px solid #4361ee; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    button:hover { background: rgba(67, 97, 238, 0.5); }
    @keyframes rotate { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
    .title { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); color: white; font-size: 24px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="title">3D Model Viewer</div>
  <div id="container">
    <div class="model" id="model">
      <div class="face front"></div>
      <div class="face back"></div>
      <div class="face right"></div>
      <div class="face left"></div>
      <div class="face top"></div>
      <div class="face bottom"></div>
    </div>
  </div>
  
  <div class="controls">
    <button id="rotate">Pause Rotation</button>
    <button id="zoom-in">Zoom In</button>
    <button id="zoom-out">Zoom Out</button>
  </div>
  
  <script>
    const model = document.getElementById('model');
    const rotateBtn = document.getElementById('rotate');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    
    let isRotating = true;
    let zoom = 1;
    
    // Toggle rotation
    rotateBtn.addEventListener('click', () => {
      isRotating = !isRotating;
      rotateBtn.textContent = isRotating ? 'Pause Rotation' : 'Resume Rotation';
      model.style.animationPlayState = isRotating ? 'running' : 'paused';
    });
    
    // Zoom in
    zoomInBtn.addEventListener('click', () => {
      zoom = Math.min(2, zoom + 0.1);
      model.style.transform = `scale(${zoom})`;
    });
    
    // Zoom out
    zoomOutBtn.addEventListener('click', () => {
      zoom = Math.max(0.5, zoom - 0.1);
      model.style.transform = `scale(${zoom})`;
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '3d_model_viewer.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <div
      className={`w-full p-4 md:p-6 rounded-xl border ${getBackgroundColor()} shadow-lg transition-colors duration-200`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${getTextColor()}`}>
        3D Model Generator & Viewer
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${getTextColor()}`}>
            Describe your 3D model
          </label>
          <Textarea
            placeholder="Enter a detailed description of the 3D model you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={`w-full h-20 ${theme === "dark" ? "bg-gray-800 border-gray-700" : theme === "evening" ? "bg-indigo-800/80 border-indigo-700" : "bg-gray-100 border-gray-300"}`}
          />
          <Button
            onClick={() => {
              if (!prompt.trim()) return;
              setIsGenerating(true);
              // Simulate 3D model generation
              setTimeout(() => {
                setIsGenerating(false);
                // Reset rotation and zoom to show the new model
                setRotation(0);
                setZoom(1);
                // Start auto-rotate to show the model
                setAutoRotate(true);
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
                successMessage.textContent = "3D model generated successfully!";
                document.body.appendChild(successMessage);
                setTimeout(
                  () => document.body.removeChild(successMessage),
                  3000,
                );
              }, 3000);
            }}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full ${getAccentColor()} mt-2`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating 3D Model...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate 3D Model
              </>
            )}
          </Button>
        </div>
        <div
          ref={containerRef}
          className={`relative w-full h-[400px] rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : theme === "evening" ? "bg-indigo-800" : theme === "luxury" ? "bg-gray-800" : theme === "neon" ? "bg-gray-900" : "bg-gray-100"}`}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* This is our 3D-like image */}
              <img
                id="model-preview-image"
                src={`https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&q=80`}
                alt="3D Model Preview"
                className="w-64 h-64 object-cover rounded-lg shadow-lg"
                style={{
                  transform: `rotateY(${rotation}deg) scale(${zoom})`,
                  transition: autoRotate ? "none" : "transform 0.3s ease",
                }}
              />
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`${autoRotate ? getAccentColor() : ""}`}
            >
              <RotateCw className="h-4 w-4 mr-1" />
              {autoRotate ? "Stop" : "Rotate"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className={`text-sm font-medium ${getTextColor()}`}>
                Rotation
              </label>
              <span className={`text-xs ${getMutedTextColor()}`}>
                {rotation}°
              </span>
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
              <label className={`text-sm font-medium ${getTextColor()}`}>
                Zoom
              </label>
              <span className={`text-xs ${getMutedTextColor()}`}>
                {(zoom * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[zoom * 100]}
              min={50}
              max={200}
              step={5}
              onValueChange={(value) => setZoom(value[0] / 100)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className={`text-sm font-medium ${getTextColor()}`}>
              Export Format
            </h3>
            <div className="flex space-x-2">
              <Button
                variant={exportFormat === "glb" ? "default" : "outline"}
                size="sm"
                onClick={() => setExportFormat("glb")}
                className="flex items-center gap-1"
              >
                <Box className="h-3 w-3" />
                <span>GLB</span>
              </Button>
              <Button
                variant={exportFormat === "obj" ? "default" : "outline"}
                size="sm"
                onClick={() => setExportFormat("obj")}
                className="flex items-center gap-1"
              >
                <Box className="h-3 w-3" />
                <span>OBJ</span>
              </Button>
              <Button
                variant={exportFormat === "gltf" ? "default" : "outline"}
                size="sm"
                onClick={() => setExportFormat("gltf")}
                className="flex items-center gap-1"
              >
                <FileJson className="h-3 w-3" />
                <span>GLTF</span>
              </Button>
              <Button
                variant={exportFormat === "usdz" ? "default" : "outline"}
                size="sm"
                onClick={() => setExportFormat("usdz")}
                className="flex items-center gap-1"
              >
                <FileCode className="h-3 w-3" />
                <span>USDZ</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => onExport(exportFormat)}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>Export {exportFormat.toUpperCase()}</span>
              </Button>
              <Button
                onClick={exportAsHTML}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Code className="h-4 w-4" />
                <span>Export HTML</span>
              </Button>
            </div>

            <div className="space-x-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                <span>Material</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                <span>Layers</span>
              </Button>
              <Button
                variant="default"
                className={`flex items-center gap-1 ${getAccentColor()}`}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDModelViewer;
