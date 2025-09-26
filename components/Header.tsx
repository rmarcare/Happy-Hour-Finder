import React, { useState } from 'react';
import { SearchIcon, GlassIcon } from './icons/Icons';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 shadow-lg z-10">
      <div className="flex items-center space-x-3">
        <GlassIcon className="h-8 w-8 text-pink-400" />
        <h1 className="text-2xl font-bold tracking-tight text-white">Happy Hour Finder</h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any city or neighborhood..."
            className="w-full bg-gray-800 border border-gray-600 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </form>
    </header>
  );
};