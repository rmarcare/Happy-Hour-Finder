import { GoogleGenAI, Type } from "@google/genai";
import type { Filters, HappyHourSpecial } from '../types';

let ai: GoogleGenAI | null = null;

// This function ensures the AI client is initialized only once.
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

// The schema defines the exact structure of the JSON we expect from the Gemini API.
const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the bar or restaurant." },
            address: { type: Type.STRING, description: "The full street address." },
            details: { type: Type.STRING, description: "A summary of the happy hour specials." },
            website: { type: Type.STRING, description: "The URL for the official website. Use an empty string if not found." },
            cuisine: { type: Type.STRING, description: "The primary type of cuisine served." },
            price_range: { type: Type.STRING, description: "A price rating, e.g., '$$'." },
            latitude: { type: Type.NUMBER, description: "The geographic latitude. This is a required field." },
            longitude: { type: Type.NUMBER, description: "The geographic longitude. This is a required field." },
        },
        // All properties are required to ensure data consistency.
        required: ["name", "address", "details", "website", "cuisine", "price_range", "latitude", "longitude"]
    }
};

// This function constructs the detailed prompt for the Gemini API.
const buildPrompt = (query: string, filters: Filters): string => {
    let prompt = `Find happy hour specials for bars and restaurants in ${query}. `;
    prompt += `The current day is ${filters.day}. Focus on specials available specifically on this day. `;
  
    if (filters.cuisine.length > 0) {
        prompt += `Filter by the following cuisines: ${filters.cuisine.join(', ')}. `;
    }
    if (filters.price.length > 0) {
        prompt += `Filter by the following price ranges: ${filters.price.join(', ')}. `;
    }

    prompt += "Return a list of the top 5-10 places. ";
    prompt += 'The response must be a JSON array of objects matching the provided schema. ';
    prompt += 'Crucially, every location must include valid and accurate latitude and longitude coordinates.';
    return prompt;
};

// The main function that communicates with the Gemini API.
export const findHappyHourSpecials = async (
  query: string,
  filters: Filters
): Promise<HappyHourSpecial[] | null> => {
  try {
    const prompt = buildPrompt(query, filters);
    const client = getAiClient();
    
    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            // The system instruction primes the model for the specific task.
            systemInstruction: "You are an expert local guide API. Your purpose is to find real, verifiable happy hour specials. You must return valid JSON that adheres strictly to the provided schema. Every field, especially geographic coordinates, is mandatory for every entry. Do not return entries without valid coordinates.",
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const text = response.text.trim();

    if (!text) {
        console.warn("Gemini API returned an empty text response.");
        return null;
    }
    
    let rawSpecials: any;
    try {
        // Attempt to parse the JSON response.
        rawSpecials = JSON.parse(text);
    } catch(parseError) {
        console.error("Failed to parse JSON from Gemini response:", parseError);
        console.error("Raw text response from API:", text);
        throw new Error("Received malformed data from the AI service. The response was not valid JSON.");
    }

    // Validate that the response is an array, as expected from the schema.
    if (!Array.isArray(rawSpecials)) {
      console.warn("Gemini response was not a JSON array as expected.", rawSpecials);
      return [];
    }
    
    // Map and validate each item from the API response.
    const specials: HappyHourSpecial[] = rawSpecials
      .map((item: any, index: number): HappyHourSpecial | null => {
        if (typeof item !== 'object' || item === null) {
          console.warn(`Item at index ${index} is not an object. Skipping.`, item);
          return null;
        }

        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);

        // Filter out any entries with invalid or missing coordinates.
        if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
            console.warn(`Invalid or missing coordinates for item at index ${index}. Skipping.`, item);
            return null;
        }

        // Construct the final object, ensuring all properties are strings to prevent React errors.
        return {
          id: `${item.name || `Unnamed Place ${index}`}-${lat}-${lng}`, // More unique ID
          name: String(item.name || 'Unnamed Place'),
          address: String(item.address || 'No address provided'),
          details: String(item.details || 'No details provided'),
          website: String(item.website || ''),
          cuisine: String(item.cuisine || 'Not specified'),
          price_range: String(item.price_range || 'N/A'),
          position: {
            lat: lat,
            lng: lng,
          },
        };
      })
      .filter((special): special is HappyHourSpecial => special !== null);

    return specials;

  } catch (error) {
    console.error("Error fetching or parsing happy hour specials:", error);
    // Propagate specific, actionable errors to the UI.
    if (error instanceof Error && error.message.includes("API_KEY")) {
        throw error;
    }
    if (error instanceof Error && error.message.includes("malformed data")) {
        throw error;
    }
    // Generic fallback error.
    throw new Error("Failed to communicate with the AI service. Please try again later.");
  }
};