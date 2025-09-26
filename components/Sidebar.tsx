// FIX: Changed from global window object to ES modules
import React from 'react';
import { FilterPanel } from './FilterPanel';
import { ResultsList } from './ResultsList';
import type { Special, Filters, Source } from '../types';

interface SidebarProps {
  specials: Special[];
  sources: Source[];
  isLoading: boolean;
  error: string | null;
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  activeSearch: string;
  selectedSpecialId: string | null;
  onSelectSpecial: (id: string | null) => void;
  sortBy: 'relevance' | 'distance';
  onSortChange: (sortBy: 'relevance' | 'distance') => void;
  isSortByDistanceEnabled: boolean;
  streamingResponse: string;
}

export const Sidebar = ({ specials, sources, isLoading, error, filters, onFilterChange, activeSearch, selectedSpecialId, onSelectSpecial, sortBy, onSortChange, isSortByDistanceEnabled, streamingResponse }: SidebarProps) => (
  <aside className="w-full h-full bg-gray-900 flex flex-col">
    <FilterPanel 
      filters={filters} 
      onFilterChange={onFilterChange} 
      sortBy={sortBy}
      onSortChange={onSortChange}
      isSortByDistanceEnabled={isSortByDistanceEnabled}
    />
    <div className="flex-1 overflow-y-auto pt-4">
      <ResultsList 
        specials={specials} 
        sources={sources}
        isLoading={isLoading} 
        error={error} 
        activeSearch={activeSearch} 
        selectedSpecialId={selectedSpecialId} 
        onSelectSpecial={onSelectSpecial}
        streamingResponse={streamingResponse}
      />
    </div>
  </aside>
);