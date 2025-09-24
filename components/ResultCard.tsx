import React from 'react';
import type { HappyHourSpecial } from '../types';
import { PinIcon, LinkIcon, PriceIcon, CuisineIcon } from './icons/Icons';

interface ResultCardProps {
  special: HappyHourSpecial;
  isSelected: boolean;
  onClick: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ special, isSelected, onClick }) => {
  const borderColor = isSelected ? 'border-pink-500' : 'border-gray-700 hover:border-pink-500';

  return (
    <div 
      className={`bg-gray-800 rounded-lg p-4 border ${borderColor} transition-all duration-300 shadow-md cursor-pointer`}
      onClick={onClick}
    >
      <h3 className="text-lg font-bold text-pink-400">{special.name}</h3>
      <div className="flex items-center text-sm text-gray-400 mt-1">
        <PinIcon className="h-4 w-4 mr-2" />
        <span>{special.address}</span>
      </div>
      <p className="text-gray-200 my-3">{special.details}</p>
      <div className="flex flex-wrap gap-2 text-sm mt-2">
        <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
            <CuisineIcon className="h-4 w-4 mr-1 text-gray-300" />
            <span className="text-gray-300">{special.cuisine}</span>
        </div>
        <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
            <PriceIcon className="h-4 w-4 mr-1 text-gray-300" />
            <span className="text-gray-300">{special.price_range}</span>
        </div>
        {special.website && (
            <a 
                href={special.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-full transition-colors"
            >
                <LinkIcon className="h-4 w-4 mr-1 text-white" />
                <span className="text-white">Website</span>
            </a>
        )}
      </div>
    </div>
  );
};

export const ResultCardSkeleton: React.FC = () => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-4/6 mb-3"></div>
    <div className="flex gap-2">
        <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
    </div>
  </div>
);