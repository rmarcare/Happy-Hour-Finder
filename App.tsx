// FIX: Changed from global window object to ES modules
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Destructure components and hooks from the global window object
// FIX: Import components and hooks from their respective files
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useGeolocation } from './hooks/useGeolocation';
import { findHappyHourSpecials } from './services/geminiService';
import { DEFAULT_FILTERS } from './constants';
import type { Special, Filters, Source, Position } from './types';

// Haversine formula to calculate distance between two points in miles
const haversineDistance = (coords1: Position, coords2: Position): number => {
  const R = 3958.8; // Radius of Earth in miles
  const r_lat1 = coords1.lat * (Math.PI / 180);
  const r_lat2 = coords2.lat * (Math.PI / 180);
  const d_lat = (coords2.lat - coords1.lat) * (Math.PI / 180);
  const d_lng = (coords2.lng - coords1.lng) * (Math.PI / 180);

  const a = Math.sin(d_lat / 2) * Math.sin(d_lat / 2) +
            Math.cos(r_lat1) * Math.cos(r_lat2) *
            Math.sin(d_lng / 2) * Math.sin(d_lng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const App = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedSpecialId, setSelectedSpecialId] = useState<string | null>(null);
  const { location, error: locationError, getUserLocation } = useGeolocation();
  const [sortBy, setSortBy] = useState<'relevance' | 'distance'>('relevance');
  const [streamingResponse, setStreamingResponse] = useState('');

  const handleSearch = useCallback(async (query: string, currentFilters: Filters) => {
    setIsLoading(true);
    setError(null);
    setSpecials([]);
    setSources([]);
    setActiveSearch(query);
    setSelectedSpecialId(null);
    setStreamingResponse('');

    try {
      const onChunk = (chunk: string) => {
        setStreamingResponse(prev => prev + chunk);
      };

      const { specials: resultSpecials, sources: resultSources } = await findHappyHourSpecials(query, currentFilters, onChunk);

      let specialsWithDistance = resultSpecials || [];
      if (location) {
          specialsWithDistance = specialsWithDistance.map(special => ({
              ...special,
              distance: haversineDistance({ lat: location.latitude, lng: location.longitude }, special.position)
          }));
      }

      setSpecials(specialsWithDistance);
      setSources(resultSources || []);

      if (!resultSpecials || resultSpecials.length === 0) {
        setError("No happy hour specials found. Try a different search.");
      }
    // FIX: The catch block had a syntax error (missing braces). This caused the parser to fail and resulted in numerous scope-related errors.
    } catch (e: any) {
      setError(`Failed to fetch happy hour data: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    setActiveSearch('your current location');
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (location) {
      handleSearch(`my current location (${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)})`, filters);
    } else if (locationError) {
      setError(`Could not get location: ${locationError}. Searching default location.`);
      handleSearch('New York, NY', filters); // Fallback search
    }
  }, [location, locationError, handleSearch]);

  const onSearchSubmit = (query: string) => handleSearch(query, filters);

  const onFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    const queryToFilter = activeSearch || 'New York, NY';
    handleSearch(queryToFilter, newFilters);
  };

  const handleSelectSpecial = (id: string | null) => setSelectedSpecialId(id);

  const sortedSpecials = useMemo(() => {
    if (sortBy === 'distance') {
      return [...specials].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }
    return specials;
  }, [specials, sortBy]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onSearch={onSearchSubmit} />
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4">
        <Sidebar 
          specials={sortedSpecials} 
          sources={sources}
          isLoading={isLoading} 
          error={error} 
          filters={filters} 
          onFilterChange={onFilterChange} 
          activeSearch={activeSearch} 
          selectedSpecialId={selectedSpecialId} 
          onSelectSpecial={handleSelectSpecial}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isSortByDistanceEnabled={!!location}
          streamingResponse={streamingResponse}
        />
      </div>
    </div>
  );
};
