// FIX: Changed from global window object to ES modules
import React from 'react';
import { DAY_OPTIONS, PRICE_OPTIONS, CUISINE_OPTIONS, SPECIAL_TYPE_OPTIONS } from '../constants';
import type { Filters } from '../types';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
  <button 
    onClick={onClick} 
    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 capitalize ${isActive ? 'bg-pink-500 text-white font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
  >
    {label}
  </button>
);

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  sortBy: 'relevance' | 'distance';
  onSortChange: (sortBy: 'relevance' | 'distance') => void;
  isSortByDistanceEnabled: boolean;
}

export const FilterPanel = ({ filters, onFilterChange, sortBy, onSortChange, isSortByDistanceEnabled }: FilterPanelProps) => {
  const handleCuisineChange = (cuisine: string) => {
    const newCuisine = filters.cuisine.includes(cuisine) 
      ? filters.cuisine.filter(c => c !== cuisine) 
      : [...filters.cuisine, cuisine];
    onFilterChange({ ...filters, cuisine: newCuisine });
  };

  const handlePriceChange = (price: string) => {
    const newPrice = filters.price.includes(price) 
      ? filters.price.filter(p => p !== price) 
      : [...filters.price, price];
    onFilterChange({ ...filters, price: newPrice });
  };
  
  const handleSpecialsTypeChange = (type: string) => {
    const newSpecialsType = filters.specialsType.includes(type) 
      ? filters.specialsType.filter(t => t !== type) 
      : [...filters.specialsType, type];
    onFilterChange({ ...filters, specialsType: newSpecialsType });
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange({ ...filters, day: e.target.value });

  return (
    <div className="p-4 border-b border-gray-700 bg-gray-900">
      <h3 className="text-lg font-semibold mb-3 text-white">Filters</h3>
      <div className="space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => onSortChange(e.target.value as 'relevance' | 'distance')} 
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white disabled:opacity-50"
            >
              <option value="relevance">Relevance</option>
              <option value="distance" disabled={!isSortByDistanceEnabled}>Distance</option>
            </select>
            {!isSortByDistanceEnabled && <p className="text-xs text-gray-400 mt-1">Enable location to sort by distance.</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Day</label>
          <select value={filters.day} onChange={handleDayChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white">
            {DAY_OPTIONS.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Special Type</label>
          <div className="flex flex-wrap gap-2">
            {SPECIAL_TYPE_OPTIONS.map(type => <FilterButton key={type} label={type} isActive={filters.specialsType.includes(type)} onClick={() => handleSpecialsTypeChange(type)} />)}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Price Range</label>
          <div className="flex flex-wrap gap-2">
            {PRICE_OPTIONS.map(price => <FilterButton key={price} label={price} isActive={filters.price.includes(price)} onClick={() => handlePriceChange(price)} />)}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Cuisine</label>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {CUISINE_OPTIONS.map(cuisine => <FilterButton key={cuisine} label={cuisine} isActive={filters.cuisine.includes(cuisine)} onClick={() => handleCuisineChange(cuisine)} />)}
          </div>
        </div>
      </div>
    </div>
  );
};