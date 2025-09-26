// This file is intentionally left blank.
// TypeScript interfaces are design-time constructs and do not exist at runtime.
// They are used by Babel for type-checking during in-browser transpilation.
// FIX: Added type definitions for the application entities.

export interface Position {
  lat: number;
  lng: number;
}

export interface Special {
  id: string;
  name: string;
  address: string;
  details: string[];
  website: string;
  cuisine: string;
  price_range: string;
  position: Position;
  distance?: number;
}

export interface Filters {
  cuisine: string[];
  price: string[];
  day: string;
  specialsType: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Source {
  uri: string;
  title: string;
}