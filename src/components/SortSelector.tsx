'use client';

import { useState } from 'react';
import { FiChevronDown, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { CharacterSortOption, SortDirection } from '@/lib/api/superhero';

type SortByOption = CharacterSortOption | 'date' | 'title' | 'issue';
type EntityType = 'character' | 'comic';

type SortSelectorProps = {
  entityType: EntityType;
  sortBy: SortByOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortByOption, sortDirection: SortDirection) => void;
  className?: string;
};

export default function SortSelector({
  entityType,
  sortBy,
  sortDirection,
  onSortChange,
  className = ''
}: SortSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Define available sort options based on entity type
  const sortOptions: { value: SortByOption; label: string }[] = 
    entityType === 'character' 
      ? [
          { value: 'name', label: 'Name' },
          { value: 'power', label: 'Power' },
          { value: 'intelligence', label: 'Intelligence' },
          { value: 'publisher', label: 'Publisher' },
          { value: 'alignment', label: 'Alignment' }
        ]
      : [
          { value: 'title', label: 'Title' },
          { value: 'date', label: 'Release Date' },
          { value: 'issue', label: 'Issue Number' }
        ];

  const toggleDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newDirection);
  };

  const handleSortChange = (option: SortByOption) => {
    onSortChange(option, sortDirection);
    setIsOpen(false);
  };

  // Get current sort option label
  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Sort by';

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-secondary border-theme px-3 py-2 rounded-l-md flex items-center justify-between min-w-36 relative group"
        >
          <span className="text-primary">{currentSortLabel}</span>
          <FiChevronDown className={`ml-2 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <button
          onClick={toggleDirection}
          className="bg-secondary border-theme border-l-0 px-3 py-2 rounded-r-md"
          aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
        >
          {sortDirection === 'asc' ? (
            <FiArrowUp className="text-accent" />
          ) : (
            <FiArrowDown className="text-accent" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-secondary border border-theme rounded-md shadow-lg">
          <ul className="py-1">
            {sortOptions.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2 hover:bg-tertiary ${
                    sortBy === option.value ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 