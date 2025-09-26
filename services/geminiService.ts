// FIX: Importing types for better type safety
import type { Special, Filters, Source } from '../types';
import { GoogleGenAI } from "@google/genai";

// A real API call to Gemini won't work without its library, which is difficult to load this way.
// We will mock the API response to ensure the UI renders correctly.
// FIX: Changed from global window object to ES modules using export.
export const findHappyHourSpecials = async (
  query: string,
  filters: Filters,
  onChunk: (chunk: string) => void
): Promise<{ specials: Special[]; sources: Source[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt = `Find happy hour specials near "${query}". When searching for information, please prioritize results from reputable sources like Eater.com, thehappiesthour.com, barredindc.com, and Google Search.`;
  if (filters.day !== 'Today') {
    prompt += ` for ${filters.day}`;
  }
  if (filters.specialsType.length > 0) {
    prompt += ` with a focus on ${filters.specialsType.join(' and ')} specials`;
  }
  if (filters.cuisine.length > 0) {
    prompt += ` with cuisine options like ${filters.cuisine.join(', ')}`;
  }
  if (filters.price.length > 0) {
    prompt += ` in the price range of ${filters.price.join(' or ')}`;
  }
  prompt += `. For each special, provide the name, address, a short description of the deal as a bulleted list of strings, website, cuisine type, price range (e.g., $, $$, $$$), and precise geographic coordinates (latitude and longitude).
    
  Return the answer as a JSON array string inside a markdown code block. Each object in the array should have the following fields: "name", "address", "details" (an array of strings), "website", "cuisine", "price_range", and "position" (an object with "lat" and "lng"). Do not include any text outside of the JSON markdown block.`;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let fullResponseText = '';
    let groundingMetadata: any = null;

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullResponseText += text;
        onChunk(text);
      }
      if (chunk.candidates?.[0]?.groundingMetadata) {
        groundingMetadata = chunk.candidates[0].groundingMetadata;
      }
    }
    
    const jsonMatch = fullResponseText.match(/```json\n([\s\S]*?)\n```/);
    
    let parsedSpecials: Omit<Special, 'id'>[] = [];
    if (jsonMatch && jsonMatch[1]) {
        parsedSpecials = JSON.parse(jsonMatch[1]);
    } else if (fullResponseText.trim().startsWith('[')) {
        // Fallback for when the model doesn't use a markdown block
        parsedSpecials = JSON.parse(fullResponseText);
    }

    const specials: Special[] = parsedSpecials.map(s => ({
      ...s,
      id: crypto.randomUUID()
    }));
    
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    const sources: Source[] = groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title,
      }))
      .filter((source: Source) => source.uri && source.title);

    // Deduplicate sources by URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
    
    return { specials, sources: uniqueSources };
  } catch(e) {
    console.error("Error fetching or parsing happy hour data:", e);
    // Return empty arrays on error to prevent app crash
    return { specials: [], sources: [] };
  }
};