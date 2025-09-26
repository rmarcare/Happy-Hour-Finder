export interface HappyHourSpecial {
  id: string;
  name: string;
  address: string;
  details: string;
  website: string;
  cuisine: string;
  price_range: string;
  position: {
    lat: number;
    lng: number;
  };
}

export interface Filters {
  cuisine: string[];
  price: string[];
  day: string;
}

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
}
