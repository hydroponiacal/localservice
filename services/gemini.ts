import { GroundingSource, ImageSize } from "../types";

export const BOSTON_COORDS = { latitude: 42.3601, longitude: -71.0589 };

export async function getTopServiceProviders(category: string): Promise<{ text: string, sources: GroundingSource[] }> {
  const res = await fetch("/api/gemini/top-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch top service providers");
  }

  return await res.json();
}

export async function getTrendingServices(): Promise<{ text: string, sources: GroundingSource[] }> {
  const res = await fetch("/api/gemini/trending", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch trending services");
  }

  return await res.json();
}

export async function chatWithGemini(history: { role: string, parts: { text: string }[] }[]): Promise<string> {
  const res = await fetch("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to chat with Gemini");
  }

  const data = await res.json();
  return data.text || "I'm sorry, I'm having trouble thinking clearly right now.";
}

export async function generateServiceImage(prompt: string, size: ImageSize): Promise<string> {
  const res = await fetch("/api/gemini/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, size })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate service image");
  }

  const data = await res.json();
  return data.imageUrl || "";
}
