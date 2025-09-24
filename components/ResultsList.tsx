import React, { useRef, useEffect } from 'react';
import type { HappyHourSpecial, GroundingChunk } from '../types';
import { ResultCard, ResultCardSkeleton } from './ResultCard';

interface ResultsListProps {
  specials: HappyHourSpecial[];
  sources: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
  activeSearch: string;
  selectedSpecialId: string | null;
  onSelectSpecial: (id: string | null) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({ 
  specials, 
  sources, 
  isLoading, 
  error, 
  activeSearch,
  selectedSpecialId,
  onSelectSpecial
}) => {
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
        {sources.length > 0 && !isLoading && (
            <div className="p-4 mt-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-300 mb-2">Sources</h4>
                <ul className="space-y-1 text-sm">
                    {sources.map((source, index) => (
                        <li key={index}>
                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline truncate block">
                                {source.web.title || source.web.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};