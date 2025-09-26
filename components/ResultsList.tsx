// FIX: Changed from global window object to ES modules
import React, { useEffect, useRef } from 'react';
import { ResultCard, ResultCardSkeleton } from './ResultCard';
import type { Special, Source } from '../types';
import { GlobeIcon } from './icons/Icons';

interface ResultsListProps {
  specials: Special[];
  sources: Source[];
  isLoading: boolean;
  error: string | null;
  activeSearch: string;
  selectedSpecialId: string | null;
  onSelectSpecial: (id: string | null) => void;
  streamingResponse: string;
}

const SourcesDisplay = ({ sources }: { sources: Source[] }) => (
  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
    <h3 className="text-md font-semibold text-gray-200 mb-3 flex items-center">
      <GlobeIcon className="w-5 h-5 mr-2 text-pink-400" />
      Data Sources
    </h3>
    <ul className="space-y-2">
      {sources.map((source, index) => (
        <li key={index}>
          <a 
            href={source.uri} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate block"
            title={source.title}
          >
            {source.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const ResultsList = ({ specials, sources, isLoading, error, activeSearch, selectedSpecialId, onSelectSpecial, streamingResponse }: ResultsListProps) => {
  const selectedRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSpecialId]);

  const renderContent = () => {
    if (isLoading) {
      if (streamingResponse) {
        return (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
            <h3 className="text-md font-semibold text-gray-200 mb-2">Generating results...</h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{streamingResponse}</pre>
          </div>
        )
      }
      return Array.from({ length: 5 }).map((_, index) => <ResultCardSkeleton key={index} />);
    }
    if (error) {
      return <div className="p-6 text-center text-red-400">{error}</div>;
    }
    if (specials.length === 0) {
      return <div className="p-6 text-center text-gray-400">No results found.</div>;
    }
    return (
      <>
        <div className="space-y-4">
          {specials.map((special) => {
            const isSelected = special.id === selectedSpecialId;
            return (
              <div key={special.id} ref={isSelected ? selectedRef : null}>
                <ResultCard 
                  special={special} 
                  isSelected={isSelected} 
                  onClick={() => onSelectSpecial(isSelected ? null : special.id)} 
                />
              </div>
            );
          })}
        </div>
        {sources.length > 0 && <SourcesDisplay sources={sources} />}
      </>
    );
  };

  return (
    <div className="px-2">
      {activeSearch && <h2 className="text-xl font-bold text-white mb-4 px-2">Results for <span className="text-pink-400">{activeSearch}</span></h2>}
      {renderContent()}
    </div>
  );
};