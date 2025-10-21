'use client';

import { THEME } from '~/common/constants';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  items: string[];
  selectedItems: string[];
  onItemChange: (item: string) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isOpen,
  onToggle,
  items,
  selectedItems,
  onItemChange,
}) => {
  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 border-2 rounded-md hover:bg-${THEME.ACCENT_LIGHT} transition-colors text-sm`}
        style={{
          borderColor: THEME.ACCENT_BORDER,
          color: THEME.PRIMARY_TEXT_COLOR,
        }}
      >
        <span className="font-medium">{title}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: THEME.ACCENT_COLOR }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 pl-2 text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.length === 0}
              onChange={() => onItemChange('All')}
              className={`mr-2 rounded`}
              style={{
                accentColor: THEME.ACCENT_COLOR,
              }}
            />
            <span style={{ color: THEME.PRIMARY_TEXT_COLOR }}>All</span>
          </label>
          {items.map((item) => (
            <label key={item} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={() => onItemChange(item)}
                className={`mr-2 rounded`}
                style={{
                  accentColor: THEME.ACCENT_COLOR,
                }}
              />
              <span style={{ color: THEME.PRIMARY_TEXT_COLOR }}>{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
