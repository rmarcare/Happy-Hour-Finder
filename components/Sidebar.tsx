import React from 'react';
import type { HappyHourSpecial, Filters } from '../types';
import { FilterPanel } from './FilterPanel';
import { ResultsList } from './ResultsList';

interface SidebarProps {
  specials: HappyHourSpecial[];
  isLoading: boolean;
  error: string | null;
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  activeSearch: string;
  selectedSpecialId: string | null;
  onSelectSpecial: (id: string | null) => void;
}

export const Sidebar = ({
  specials,
  isLoading,
  error,
  filters,
  onFilterChange,
  activeSearch,
  selectedSpecialId,
  onSelectSpecial,
}: SidebarProps) => {
  return (
    <aside className="w-1/3 max-w-lg bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col">
      <FilterPanel filters={filters} onFilterChange={onFilterChange} />
      <div className="flex-1 overflow-y-auto">
        <ResultsList
          specials={specials}
          isLoading={isLoading}
          error={error}
          activeSearch={activeSearch}
          selectedSpecialId={selectedSpecialId}
          onSelectSpecial={onSelectSpecial}
        />
      </div>
    </aside>
  );
};