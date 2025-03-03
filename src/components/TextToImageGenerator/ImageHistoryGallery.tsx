import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Share2,
  Edit,
  Info,
  X,
  Calendar,
  Clock,
  Maximize2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  dimensions: string;
  createdAt: string;
}

interface ImageHistoryGalleryProps {
  images: GeneratedImage[];
  onSelectImage: (image: GeneratedImage) => void;
  onDownloadImage: (image: GeneratedImage) => void;
  onShareImage: (image: GeneratedImage) => void;
  onEditImage: (image: GeneratedImage) => void;
}

const ImageHistoryGallery = ({
  images = [],
  onSelectImage,
  onDownloadImage,
  onShareImage,
  onEditImage,
}: ImageHistoryGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    onSelectImage(image);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Previous Images
        </h2>
        <p className="text-gray-500 dark:text-gray-300">
          {images.length} images
        </p>
      </div>

      {images.length === 0 ? (
        <div className="p-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Clock className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-300 mb-2">
            No previous images found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-400">
            Enter a text prompt above to create your first image
          </p>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => handleImageClick(image)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-sm line-clamp-2 mb-2">
                  {image.prompt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">
                    {formatDate(image.createdAt)}
                  </span>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/70 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadImage(image);
                            }}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/70 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShareImage(image);
                            }}
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/70 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditImage(image);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <Button
            variant="outline"
            onClick={() => setShowDetails(true)}
            className="mx-auto mb-6 flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            <span>Image Details</span>
          </Button>

          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => {
                    // Open image in new tab
                    window.open(selectedImage.imageUrl, "_blank");
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Prompt
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedImage.prompt}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Style
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedImage.style}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Dimensions
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedImage.dimensions}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(selectedImage.createdAt)} at{" "}
                    {formatTime(selectedImage.createdAt)}
                  </p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => onDownloadImage(selectedImage)}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onShareImage(selectedImage)}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      onEditImage(selectedImage);
                      setShowDetails(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ImageHistoryGallery;
