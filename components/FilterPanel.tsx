
import React from 'react';
import type { Filters } from '../types';
import { CUISINE_OPTIONS, PRICE_OPTIONS, DAY_OPTIONS } from '../constants';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
}

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
      isActive
        ? 'bg-pink-500 text-white font-semibold'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);


export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
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
  
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, day: e.target.value });
  };

  return (
    <div className="p-4 border-b border-gray-700 bg-gray-900">
      <h3 className="text-lg font-semibold mb-3 text-white">Filters</h3>
      <div className="space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Day</label>
            <select 
              value={filters.day}
              onChange={handleDayChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
            >
              {DAY_OPTIONS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Price Range</label>
          <div className="flex flex-wrap gap-2">
            {PRICE_OPTIONS.map(price => (
              <FilterButton
                key={price}
                label={price}
                isActive={filters.price.includes(price)}
                onClick={() => handlePriceChange(price)}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Cuisine</label>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {CUISINE_OPTIONS.map(cuisine => (
              <FilterButton
                key={cuisine}
                label={cuisine}
                isActive={filters.cuisine.includes(cuisine)}
                onClick={() => handleCuisineChange(cuisine)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
