import React, { useRef, useEffect } from 'react';
import type { HappyHourSpecial } from '../types';
import { ResultCard, ResultCardSkeleton } from './ResultCard';

interface ResultsListProps {
  specials: HappyHourSpecial[];
  isLoading: boolean;
  error: string | null;
  activeSearch: string;
  selectedSpecialId: string | null;
  onSelectSpecial: (id: string | null) => void;
}

export const ResultsList = ({ 
  specials, 
  isLoading, 
  error, 
  activeSearch,
  selectedSpecialId,
  onSelectSpecial
}: ResultsListProps) => {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSpecialId]);


  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => <ResultCardSkeleton key={index} />);
    }

    if (error) {
      return <div className="p-6 text-center text-red-400">{error}</div>;
    }

    if (specials.length === 0) {
      return <div className="p-6 text-center text-gray-400">No results found. Try broadening your search.</div>;
    }

    return specials.map((special) => {
        const isSelected = special.id === selectedSpecialId;
        return (
            <div key={special.id} ref={isSelected ? selectedRef : null}>
                 <ResultCard
                    special={special}
                    isSelected={isSelected}
                    onClick={() => onSelectSpecial(isSelected ? null : special.id)}
                />
            </div>
        )
    });
  };

  return (
    <div className="p-4 space-y-4">
        {activeSearch && (
          <h2 className="text-xl font-bold text-white px-2">
              Results for <span className="text-pink-400">{activeSearch}</span>
          </h2>
        )}
        {renderContent()}
    </div>
  );
};