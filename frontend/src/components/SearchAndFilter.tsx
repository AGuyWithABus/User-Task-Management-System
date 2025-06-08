import React, { useState, useEffect } from 'react';

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  placeholder?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchValue,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  sortOptions,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  placeholder = "Search..."
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="search-filter-container">
      {/* Search Input */}
      <div className="search-input-container">
        <div className="relative">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={placeholder}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="form-input-compact search-input"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="filter-group-compact">
        <label className="filter-label">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="form-select-compact"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="filter-group-compact">
        <label className="filter-label">
          Order
        </label>
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value)}
          className="form-select-compact"
        >
          <option value="DESC">↓ Newest</option>
          <option value="ASC">↑ Oldest</option>
        </select>
      </div>

      {/* Status Filter (for tasks) */}
      {statusOptions && onStatusFilterChange && (
        <div className="filter-group-compact">
          <label className="filter-label">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="form-select-compact"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear Filters */}
      <button
        type="button"
        onClick={() => {
          setLocalSearch('');
          onSearchChange('');
          onSortByChange(sortOptions[0]?.value || '');
          onSortOrderChange('DESC');
          if (onStatusFilterChange) {
            onStatusFilterChange('all');
          }
        }}
        className="btn btn-secondary btn-sm"
      >
        🗑️ Clear
      </button>
    </div>
  );
};

export default SearchAndFilter;
