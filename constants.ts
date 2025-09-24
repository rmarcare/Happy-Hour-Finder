import type { Filters } from './types';

export const INITIAL_LOCATION = "New York, NY";
export const NYC_COORDS = { lat: 40.7128, lng: -74.0060 };

export const DEFAULT_FILTERS: Filters = {
  cuisine: [],
  price: [],
  day: 'Today'
};

export const CUISINE_OPTIONS = [
  "American", "Mexican", "Italian", "Japanese", "Chinese", "Indian", "Thai", "French", "Spanish", "Greek"
];

export const PRICE_OPTIONS = ["$", "$$", "$$$", "$$$$"];

export const DAY_OPTIONS = ["Today", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];