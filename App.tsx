import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { findHappyHourSpecials } from './services/geminiService';
import { useGeolocation } from './hooks/useGeolocation';
import type { HappyHourSpecial, Filters } from './types';
import { DEFAULT_FILTERS, NYC_COORDS } from './constants';

const App = () => {
  const [specials, setSpecials] = useState<HappyHourSpecial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [selectedSpecialId, setSelectedSpecialId] = useState<string | null>(null);
  
  const { location, error: locationError, getUserLocation } = useGeolocation();
  
  const handleSearch = useCallback(async (query: string, currentFilters: Filters) => {
    setIsLoading(true);
    setError(null);
    setSpecials([]);
    setActiveSearch(query);
    setSelectedSpecialId(null);

    try {
      const result = await findHappyHourSpecials(query, currentFilters);
      if (result && result.length > 0) {
        setSpecials(result);
      } else {
        setSpecials([]);
        setError("No happy hour specials found. Try a different search.");
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to fetch happy hour data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    setActiveSearch('your current location');
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (location) {
        handleSearch(`my current location (${location.latitude}, ${location.longitude})`, filters);
    } else if (locationError) {
        setError(`Could not get your location: ${locationError}. Please grant location access or search for a city manually.`);
        setIsLoading(false);
        setSpecials([]);
        setActiveSearch('');
    }
  }, [location, locationError, handleSearch, filters]);


  const onSearchSubmit = (query: string) => {
    setSearchQuery(query);
    handleSearch(query, filters);
  };
  
  const onFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    const queryToFilter = searchQuery || (location ? `my current location (${location.latitude}, ${location.longitude})` : activeSearch);
    if (queryToFilter) {
      handleSearch(queryToFilter, newFilters);
    }
  }
  
  const handleSelectSpecial = (id: string | null) => {
    setSelectedSpecialId(id);
  }

  const googleMapsApiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-lg">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="text-gray-200">The API_KEY environment variable is not set. This application cannot function without a valid API key for Google Maps and Gemini.</p>
        </div>
      </div>
    );
  }

  const mapCenter = location ? { lat: location.latitude, lng: location.longitude } : NYC_COORDS;

  return (
    <APIProvider apiKey={googleMapsApiKey}>
      <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
        <Header onSearch={onSearchSubmit} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            specials={specials}
            isLoading={isLoading}
            error={error}
            filters={filters}
            onFilterChange={onFilterChange}
            activeSearch={activeSearch}
            selectedSpecialId={selectedSpecialId}
            onSelectSpecial={handleSelectSpecial}
          />
          <main className="flex-1">
            <MapView 
              specials={specials}
              center={mapCenter}
              userLocation={location ? { lat: location.latitude, lng: location.longitude } : null}
              selectedSpecialId={selectedSpecialId}
              onSelectSpecial={handleSelectSpecial}
            />
          </main>
        </div>
      </div>
    </APIProvider>
  );
};

export default App;