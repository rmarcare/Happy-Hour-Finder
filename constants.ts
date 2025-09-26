// FIX: Changed from global window object to ES modules using export.
export const NYC_COORDS = { lat: 40.7128, lng: -74.0060 };

export const DEFAULT_FILTERS = {
  cuisine: [],
  price: [],
  day: 'Today',
  specialsType: []
};

export const SPECIAL_TYPE_OPTIONS = ["drinks", "food", "late night"];
export const CUISINE_OPTIONS = ["American", "Mexican", "Italian", "Japanese", "Chinese", "Indian", "Thai", "French", "Spanish", "Greek"];
export const PRICE_OPTIONS = ["$", "$$", "$$$", "$$$$"];
export const DAY_OPTIONS = ["Today", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];