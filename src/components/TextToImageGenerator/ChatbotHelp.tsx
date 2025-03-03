import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, X, Sparkles, Image as ImageIcon } from "lucide-react";
import { enhancePromptWithGemini } from "@/lib/gemini";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotHelpProps {
  onClose: () => void;
  theme?: "light" | "dark" | "evening";
}

const ChatbotHelp = ({ onClose, theme = "dark" }: ChatbotHelpProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm here to help you with the AI Image Generator. What kind of image would you like to create?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateBotResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase();

    try {
      // Use Google Gemini AI to generate a more intelligent response
      const geminiPrompt = `You are an AI assistant helping with an AI image generator application. 
      The user has asked: "${userInput}". 
      Provide a helpful, concise response about this topic related to AI image generation. 
      Include specific tips, examples, or best practices if relevant. 
      Keep your response under 150 words and make it conversational.`;

      try {
        const response = await enhancePromptWithGemini(geminiPrompt);
        return response;
      } catch (error) {
        console.error(
          "Error using Gemini API, falling back to predefined responses",
          error,
        );
        // Fall back to predefined responses if API fails
        if (input.includes("prompt")) {
          return "Photorealistic, cartoon, oil painting, dramatic lighting, soft lighting, close-up, landscape, portrait are all great prompt styles to try. Be specific and detailed in your prompts for better results.";
        } else if (input.includes("style")) {
          return "You can try realistic, artistic, cartoon, abstract, cinematic, fantasy, anime, digital art, oil painting, watercolor, 3D render, pixel art, neon, cyberpunk, or steampunk styles.";
        } else if (input.includes("dimension") || input.includes("size")) {
          return "Available sizes: Small (512×512), Medium (768×768), Large (1024×1024), XL (1536×1536), HD (1280×720), Full HD (1920×1080). Larger sizes take more time to generate.";
        } else if (input.includes("model")) {
          return "We support Stable Diffusion XL, Stable Diffusion 3, Midjourney Style, Realistic Vision, Dreamshaper, Openjourney, and DALL-E 3 models. Each has different strengths for various types of images.";
        } else if (input.includes("drawing")) {
          return "In the drawing tab, you can create sketches with advanced drawing tools including shapes, text, and various brush styles. Your drawings can be converted to AI-generated images.";
        } else if (input.includes("history")) {
          return "The image history gallery shows all your generated images. You can download, share, or edit any previous creation.";
        } else if (input.includes("adjust")) {
          return "You can adjust brightness, contrast, saturation, hue, blur, sepia, grayscale, and invert settings to fine-tune your images.";
        } else if (input.includes("variation")) {
          return "Variations use the same prompt with different seeds to create similar but unique images.";
        } else if (input.includes("upscale")) {
          return "Upscaling increases resolution, doubles dimensions, and maintains details for higher quality output.";
        } else if (input.includes("seed")) {
          return "Seeds control image generation. Using the same seed and prompt will produce the same image, allowing for consistent results.";
        } else if (input.includes("negative prompt")) {
          return "Negative prompts tell the AI what to avoid: 'blurry, low quality, distorted faces, bad anatomy, extra limbs, deformed' are common examples.";
        } else if (input.includes("guidance scale")) {
          return "Lower values (1-7) are more creative, higher values (7-20) are more precise and follow your prompt more closely.";
        } else if (input.includes("steps")) {
          return "30-50 steps work well for most purposes. More steps create more detailed images but take longer to generate.";
        } else if (input.includes("sampler")) {
          return "Different samplers like Euler Ancestral, DPM Solver++, and DDIM produce different results. Experiment to find what works best for your image.";
        } else if (input.includes("thank") || input.includes("thanks")) {
          return "You're welcome! Feel free to ask if you need any more help.";
        } else if (input.includes("hello") || input.includes("hi")) {
          return "Hello! I'm here to help you with the AI Image Generator. What would you like to know?";
        } else if (input.includes("edit") || input.includes("editing")) {
          return "The Image Editor includes filters, effects, brush tools, text, shapes, and variants to enhance your generated images.";
        } else if (
          input.includes("advanced drawing") ||
          input.includes("drawing tools")
        ) {
          return "Advanced drawing tools include pencil, brush, pen, highlighter, eraser, shapes, text, color picker, brush size adjustment, and opacity controls.";
        } else {
          return "I can help with prompts, styles, dimensions, models, drawing, editing, variations, upscaling, seeds, and negative prompts. What specific aspect are you interested in?";
        }
      }
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm sorry, I encountered an error processing your request. Please try asking something else about the image generator.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Add a temporary "thinking" message
    const thinkingId = (Date.now() + 1).toString();
    const thinkingMessage: Message = {
      id: thinkingId,
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      // Generate response using Gemini AI
      const botResponse = await generateBotResponse(inputValue);

      // Replace the thinking message with the actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId ? { ...msg, content: botResponse } : msg,
        ),
      );
    } catch (error) {
      console.error("Error in chat response:", error);
      // Replace thinking message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId
            ? {
                ...msg,
                content: "I'm sorry, I encountered an error. Please try again.",
              }
            : msg,
        ),
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900";
      case "evening":
        return "bg-gradient-to-br from-indigo-900 to-purple-900";
      default:
        return "bg-white";
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

  const getInputBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 border-gray-700";
      case "evening":
        return "bg-indigo-800/80 border-indigo-700";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div
      className={`flex flex-col h-full ${getBackgroundColor()} ${getTextColor()} rounded-lg overflow-hidden`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-bold">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                      ? "bg-gray-800 text-white"
                      : theme === "evening"
                        ? "bg-indigo-800 text-white"
                        : "bg-gray-200 text-gray-900"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === "bot" && (
                    <Sparkles className="h-5 w-5 mt-1 text-purple-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            className={`resize-none min-h-[60px] ${getInputBgColor()} ${getTextColor()}`}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`h-[60px] aspect-square ${theme === "evening" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs opacity-70 text-center">
          <p>
            Suggested questions: How to write good prompts? | What styles are
            available? | How to create variations?
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotHelp;
