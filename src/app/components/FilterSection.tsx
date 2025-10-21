'use client';

import { FunctionComponent } from 'react';
import { Button } from '~/common/components/ui/Button';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  items: string[];
  selectedItems: string[];
  onItemChange: (item: string) => void;
}

export const FilterSection: FunctionComponent<FilterSectionProps> = ({
  title,
  isOpen,
  onToggle,
  items,
  selectedItems,
  onItemChange,
}) => {
  return (
    <div className="mb-3">
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        fullWidth
        className="justify-between! rounded-md! px-3 py-2 text-sm font-medium border-pink-300 text-navy-700"
        endContent={
          <svg
            className={`h-4 w-4 transition-transform text-pink-500 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        }
      >
        {title}
      </Button>

      {isOpen && (
        <div className="mt-2 space-y-2 pl-2 text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.length === 0}
              onChange={() => onItemChange('All')}
              className="mr-2 rounded accent-pink-500"
            />
            <span className="text-navy-700">All</span>
          </label>
          {items.map((item) => (
            <label key={item} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={() => onItemChange(item)}
                className="mr-2 rounded accent-pink-500"
              />
              <span className="text-navy-700">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
