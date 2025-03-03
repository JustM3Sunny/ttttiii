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

  // This would normally use Three.js to render a 3D model
  // For this demo, we'll simulate it with a placeholder
  useEffect(() => {
    if (!containerRef.current) return;

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Auto-rotate to show the model is working
      setAutoRotate(true);
    }, 1500);

    // In a real implementation, we would initialize Three.js here
    // Example code (commented out):
    /*
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      scene.add(gltf.scene);
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.x = -center.x;
      gltf.scene.position.y = -center.y;
      gltf.scene.position.z = -center.z;
    });
    
    camera.position.z = 5;
    
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    */

    return () => clearTimeout(timer);
  }, []);

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
              {/* This would be a Three.js canvas in a real implementation */}
              <div
                className="w-64 h-64 relative"
                style={{
                  transform: `rotateY(${rotation}deg) scale(${zoom})`,
                  transition: autoRotate ? "none" : "transform 0.3s ease",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Box
                    className={`h-full w-full ${theme === "luxury" ? "text-amber-500" : theme === "neon" ? "text-pink-500" : theme === "evening" ? "text-indigo-500" : "text-blue-500"}`}
                  />
                </div>
              </div>
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
                variant="outline"
                onClick={() => {
                  // Simulate code export based on the selected format
                  let codeContent = "";
                  let fileName = "";

                  if (exportFormat === "glb" || exportFormat === "gltf") {
                    codeContent = `// Three.js code for this model\nimport * as THREE from 'three';\nimport { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';\nimport { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';\n\n// Initialize scene, camera, and renderer\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias: true });\nrenderer.setSize(window.innerWidth, window.innerHeight);\nrenderer.setClearColor(0x000000);\nrenderer.shadowMap.enabled = true;\ndocument.body.appendChild(renderer.domElement);\n\n// Add lighting\nconst ambientLight = new THREE.AmbientLight(0xffffff, 0.5);\nscene.add(ambientLight);\n\nconst directionalLight = new THREE.DirectionalLight(0xffffff, 1);\ndirectionalLight.position.set(5, 10, 7.5);\ndirectionalLight.castShadow = true;\nscene.add(directionalLight);\n\n// Add orbit controls\nconst controls = new OrbitControls(camera, renderer.domElement);\ncontrols.enableDamping = true;\ncontrols.dampingFactor = 0.05;\n\n// Load the model\nconst loader = new GLTFLoader();\nloader.load('model.${exportFormat}', function(gltf) {\n  // Center the model\n  const box = new THREE.Box3().setFromObject(gltf.scene);\n  const center = box.getCenter(new THREE.Vector3());\n  gltf.scene.position.x = -center.x;\n  gltf.scene.position.y = -center.y;\n  gltf.scene.position.z = -center.z;\n  \n  // Add the model to the scene\n  scene.add(gltf.scene);\n});\n\n// Position camera\ncamera.position.z = 5;\n\n// Animation loop\nfunction animate() {\n  requestAnimationFrame(animate);\n  controls.update();\n  renderer.render(scene, camera);\n}\nanimate();`;
                    fileName = `three_js_${exportFormat}_viewer.js`;
                  } else if (exportFormat === "obj") {
                    codeContent = `// Three.js code for this model\nimport * as THREE from 'three';\nimport { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';\nimport { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';\nimport { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';\n\n// Initialize scene, camera, and renderer\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias: true });\nrenderer.setSize(window.innerWidth, window.innerHeight);\nrenderer.setClearColor(0x000000);\nrenderer.shadowMap.enabled = true;\ndocument.body.appendChild(renderer.domElement);\n\n// Add lighting\nconst ambientLight = new THREE.AmbientLight(0xffffff, 0.5);\nscene.add(ambientLight);\n\nconst directionalLight = new THREE.DirectionalLight(0xffffff, 1);\ndirectionalLight.position.set(5, 10, 7.5);\ndirectionalLight.castShadow = true;\nscene.add(directionalLight);\n\n// Add orbit controls\nconst controls = new OrbitControls(camera, renderer.domElement);\ncontrols.enableDamping = true;\ncontrols.dampingFactor = 0.05;\n\n// Load the model\nconst mtlLoader = new MTLLoader();\nmtlLoader.load('model.mtl', function(materials) {\n  materials.preload();\n  \n  const objLoader = new OBJLoader();\n  objLoader.setMaterials(materials);\n  objLoader.load('model.obj', function(object) {\n    // Center the model\n    const box = new THREE.Box3().setFromObject(object);\n    const center = box.getCenter(new THREE.Vector3());\n    object.position.x = -center.x;\n    object.position.y = -center.y;\n    object.position.z = -center.z;\n    \n    // Add the model to the scene\n    scene.add(object);\n  });\n});\n\n// Position camera\ncamera.position.z = 5;\n\n// Animation loop\nfunction animate() {\n  requestAnimationFrame(animate);\n  controls.update();\n  renderer.render(scene, camera);\n}\nanimate();`;
                    fileName = "three_js_obj_viewer.js";
                  } else if (exportFormat === "usdz") {
                    codeContent = `// AR Quick Look code for iOS\n// This is a simple HTML file that will display your USDZ model in AR on iOS devices\n\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>AR Model Viewer</title>\n  <style>\n    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; text-align: center; }\n    .ar-button { display: inline-block; padding: 12px 24px; background: #007AFF; color: white; \n                 border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }\n    .model-preview { max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }\n  </style>\n</head>\n<body>\n  <h1>View in AR</h1>\n  <p>Click the button below to view the 3D model in AR on your iOS device</p>\n  \n  <img src="model_preview.jpg" alt="Model Preview" class="model-preview">\n  \n  <a rel="ar" href="model.usdz" class="ar-button">\n    View in AR\n  </a>\n  \n  <p><small>Requires iOS 12+ with ARKit support</small></p>\n</body>\n</html>`;
                    fileName = "ar_viewer.html";
                  }

                  const blob = new Blob([codeContent], {
                    type: "text/javascript",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = fileName;
                  link.click();
                }}
                className="flex items-center gap-1"
              >
                <Code className="h-4 w-4" />
                <span>Export Code</span>
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
