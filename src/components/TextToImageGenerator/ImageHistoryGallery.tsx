import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Share2, Edit, Eye, X } from "lucide-react";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  dimensions: string;
  createdAt: string;
}

interface ImageHistoryGalleryProps {
  images?: GeneratedImage[];
  onSelectImage?: (image: GeneratedImage) => void;
  onDownloadImage?: (image: GeneratedImage) => void;
  onShareImage?: (image: GeneratedImage) => void;
  onEditImage?: (image: GeneratedImage) => void;
}

const ImageHistoryGallery = ({
  images = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
      prompt: "सूर्यास्त के समय एक सुंदर समुद्र तट",
      style: "Realistic",
      dimensions: "1024x1024",
      createdAt: "2023-06-15T10:30:00Z",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
      prompt: "एक जादुई जंगल में चमकीले जुगनू",
      style: "Fantasy",
      dimensions: "1024x768",
      createdAt: "2023-06-14T14:45:00Z",
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
      prompt: "हिमालय पर्वत श्रृंखला का दृश्य",
      style: "Photographic",
      dimensions: "1280x720",
      createdAt: "2023-06-13T09:15:00Z",
    },
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
      prompt: "एक साइबरपंक शहर का रात का दृश्य",
      style: "Cyberpunk",
      dimensions: "1920x1080",
      createdAt: "2023-06-12T18:20:00Z",
    },
  ],
  onSelectImage = () => {},
  onDownloadImage = () => {},
  onShareImage = () => {},
  onEditImage = () => {},
}: ImageHistoryGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewImage = (image: GeneratedImage) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleDownload = (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadImage(image);
  };

  const handleShare = (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    onShareImage(image);
  };

  const handleEdit = (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditImage(image);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">पिछली छवियां</h2>
        <p className="text-gray-500">{images.length} छवियां</p>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-lg">
          <p className="text-gray-500 mb-2">कोई पिछली छवि नहीं मिली</p>
          <p className="text-sm text-gray-400">
            अपनी पहली छवि बनाने के लिए ऊपर टेक्स्ट प्रॉम्प्ट दर्ज करें
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewImage(image)}
            >
              <div className="relative aspect-square">
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm truncate">{image.prompt}</p>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {formatDate(image.createdAt)}
                  </div>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleDownload(image, e)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>डाउनलोड करें</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleShare(image, e)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>शेयर करें</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleEdit(image, e)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>संपादित करें</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>छवि विवरण</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    प्रॉम्प्ट
                  </h3>
                  <p className="mt-1">{selectedImage.prompt}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      स्टाइल
                    </h3>
                    <p className="mt-1">{selectedImage.style}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">आयाम</h3>
                    <p className="mt-1">{selectedImage.dimensions}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    बनाया गया
                  </h3>
                  <p className="mt-1">{formatDate(selectedImage.createdAt)}</p>
                </div>

                <DialogFooter className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => onDownloadImage(selectedImage)}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    डाउनलोड करें
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onShareImage(selectedImage)}
                    className="flex items-center"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    शेयर करें
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      onEditImage(selectedImage);
                      setIsDialogOpen(false);
                    }}
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    संपादित करें
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageHistoryGallery;
