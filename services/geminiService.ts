
import { GoogleGenAI } from "@google/genai";
import type { Filters, HappyHourSpecial, GroundingChunk } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
    if (!apiKey) {
        throw new Error("API_KEY environment variable is not set.");
    }
    ai = new GoogleGenAI({ apiKey });
    return ai;
}

const buildPrompt = (query: string, filters: Filters): string => {
  let prompt = `Find up-to-date happy hour specials for bars and restaurants in ${query}. `;
  prompt += `The current day is ${filters.day}. Focus on specials available today. `;
  
  if (filters.cuisine.length > 0) {
    prompt += `Filter by the following cuisines: ${filters.cuisine.join(', ')}. `;
  }
  if (filters.price.length > 0) {
    prompt += `Filter by the following price ranges: ${filters.price.join(', ')}. `;
  }

  prompt += "Scrape bar and restaurant websites, menus, and gastronomy sites like Eater.com to find the most current information. ";
  prompt += "Return a list of the top 5-10 places. ";
  prompt += 'The entire response MUST be a single, valid JSON array of objects. Do not include any text, explanation, or markdown formatting (like ```json) before or after the JSON array. ';
  prompt += 'Each object in the array must have the following keys: "name" (string), "address" (string), "details" (string), "website" (string), "cuisine" (string), "price_range" (string), "latitude" (number), and "longitude" (number).';
  return prompt;
};

// Define a raw type for the expected API response, allowing for flexibility from the LLM
type RawSpecial = Omit<HappyHourSpecial, 'id' | 'position' | 'cuisine' | 'price_range'> & { 
    latitude: number; 
    longitude: number;
    cuisine: string | string[];
    price_range: string | string[];
};

export const findHappyHourSpecials = async (
  query: string,
  filters: Filters
): Promise<{ specials: HappyHourSpecial[]; sources: GroundingChunk[] } | null> => {
  try {
    const prompt = buildPrompt(query, filters);
    const client = getAiClient();
    
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    const text = response.text.trim();

    if (!text) {
        console.warn("Gemini API returned an empty text response.");
        return null;
    }
    
    // FIX: Per Gemini API guidelines, when using Google Search grounding, the response text
    // may not be a perfect JSON string. It can be surrounded by other text or markdown.
    // This extracts the JSON array from the response to parse it robustly.
    const startIndex = text.indexOf('[');
    const endIndex = text.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        console.error("Could not find a valid JSON array in the Gemini response.", { text });
        throw new Error("Response did not contain a JSON array.");
    }
    
    const jsonString = text.substring(startIndex, endIndex + 1);
    const rawSpecials: RawSpecial[] = JSON.parse(jsonString);

    // Process and sanitize the raw data to fit the HappyHourSpecial type
    const specials: HappyHourSpecial[] = rawSpecials.map((special, index) => {
      // Sanitize data that might not conform to the expected string type from the LLM.
      // If the model returns an array, join it. Otherwise, cast to string.
      const cuisine = Array.isArray(special.cuisine) ? special.cuisine.join(', ') : String(special.cuisine ?? 'N/A');
      const price_range = Array.isArray(special.price_range) ? special.price_range.join(', ') : String(special.price_range ?? 'N/A');

      return {
        // Spread the original special but override the sanitized fields.
        ...special,
        id: `${special.name}-${index}`,
        cuisine,
        price_range,
        position: {
          lat: special.latitude,
          lng: special.longitude,
        },
      };
    });

    return { specials, sources };

  } catch (error) {
    console.error("Error fetching or parsing happy hour specials:", error);
    if (error instanceof Error && error.message.startsWith("API_KEY")) {
        throw error;
    }
    throw new Error("Failed to communicate with the AI service.");
  }
};