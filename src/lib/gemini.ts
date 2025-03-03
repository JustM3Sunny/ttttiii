// Google Gemini AI integration

const GEMINI_API_KEY = "AIzaSyDc7u7wTVdDG3zP18xnELKs0HX7-hImkmc";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_VISION_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Function to analyze an image and generate a similar prompt
export async function analyzeImageWithGemini(
  imageBase64: string,
): Promise<string> {
  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this image and create a detailed prompt that would generate a similar image using an AI image generator. Be specific about style, colors, composition, and subject matter. Make the prompt detailed enough to recreate a similar image.",
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.split(",")[1], // Remove the data:image/jpeg;base64, part
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(
      `${GEMINI_VISION_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw error;
  }
}

// Function to enhance a prompt using Gemini AI
export async function enhancePromptWithGemini(prompt: string): Promise<string> {
  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Enhance the following prompt for an AI image generator to make it more detailed and likely to produce a high-quality image. Add specific details about lighting, style, composition, and mood,without any explainations or something else just give prompt but maintain the original intent: "${prompt}"`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error enhancing prompt with Gemini:", error);
    throw error;
  }
}

// Function to generate a prompt from a drawing
export async function generatePromptFromDrawing(
  drawingBase64: string,
): Promise<string> {
  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "This is a drawing made by a user. Create a detailed prompt for an AI image generator that would create a polished, professional version of what the user was trying to draw. Be specific and detailed about the subject, style, and composition.",
            },
            {
              inline_data: {
                mime_type: "image/png",
                data: drawingBase64.split(",")[1], // Remove the data:image/png;base64, part
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(
      `${GEMINI_VISION_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating prompt from drawing with Gemini:", error);
    throw error;
  }
}
