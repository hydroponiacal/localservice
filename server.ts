import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/gemini/top-services", async (req, res) => {
    try {
      const { category = "Plumbers" } = req.body || {};
      const ai = getGenAI();
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Find the top 5 highly-rated ${category} businesses within a 20-mile radius of Boston, MA for 2026. Return details including name, address, and a short friendly description.`,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: { latitude: 42.3601, longitude: -71.0589 }
              }
            }
          }
        });
      } catch (mapsErr) {
        console.warn("Maps grounding call failed, falling back to text prompt:", mapsErr);
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Find the top 5 highly-rated ${category} businesses within a 20-mile radius of Boston, MA for 2026. Return details including name, address, and a short friendly description.`
        });
      }

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.maps?.title || chunk.web?.title || "Google Source",
          uri: chunk.maps?.uri || chunk.web?.uri || "#"
        })) || [];

      res.json({
        text: response.text || "No recommendations found in the area.",
        sources
      });
    } catch (error: any) {
      console.error("Error in top-services:", error);
      res.status(500).json({
        error: error.message || "Failed to fetch top service providers",
        text: "We encountered an issue fetching recommendations for Boston. Please try again in a moment.",
        sources: []
      });
    }
  });

  app.post("/api/gemini/trending", async (req, res) => {
    try {
      const ai = getGenAI();
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: "What are the top 5 predicted trending home services for homeowners in 2026 in major US cities like Boston?",
          config: {
            tools: [{ googleSearch: {} }],
          },
        });
      } catch (searchErr) {
        console.warn("Search grounding call failed, falling back to text prompt:", searchErr);
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: "What are the top 5 predicted trending home services for homeowners in 2026 in major US cities like Boston?"
        });
      }

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.web?.title || "Search Result",
          uri: chunk.web?.uri || "#"
        })) || [];

      res.json({ text: response.text || "", sources });
    } catch (error: any) {
      console.error("Error in trending:", error);
      res.status(500).json({
        error: error.message || "Failed to fetch trending services",
        text: "Smart home upgrades, heat pump conversions, and drought-resistant landscaping are leading the way this year.",
        sources: []
      });
    }
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { history = [] } = req.body || {};
      const ai = getGenAI();
      const chat = ai.chats.create({
        model: "gemini-3.6-flash",
        config: {
          systemInstruction: "You are a friendly, helpful local neighbor from Boston named 'Mo'. You help people find home services like plumbers or electricians. Be professional but very warm and homey. Keep responses concise.",
        },
      });

      const lastMsg = history.length > 0 ? history[history.length - 1]?.parts?.[0]?.text : "Hello";
      const response = await chat.sendMessage({ message: lastMsg || "Hello" });
      res.json({ text: response.text || "I'm sorry, I'm having trouble thinking clearly right now." });
    } catch (error: any) {
      console.error("Error in chat:", error);
      res.status(500).json({
        error: error.message || "Failed to respond",
        text: "Sorry, neighbor! My brain's a bit foggy today. Try asking again in a moment."
      });
    }
  });

  app.post("/api/gemini/generate-image", async (req, res) => {
    try {
      const { prompt, size = "1K" } = req.body || {};
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [{ text: `A warm, neighborly, high-quality photograph of ${prompt}, Boston area aesthetic, homey feel.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: size
          }
        },
      });

      let imageUrl = "";
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }
      res.json({ imageUrl });
    } catch (error: any) {
      console.error("Error in generate-image:", error);
      res.status(500).json({
        error: error.message || "Failed to generate image"
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
