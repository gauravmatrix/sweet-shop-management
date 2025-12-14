import React from 'react';
import SweetCard from './SweetCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Package, Search, Filter } from 'lucide-react';

const SweetList = ({ 
  sweets, 
  loading, 
  error, 
  onSweetUpdate, 
  onSweetDelete,
  searchQuery = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  categories = [],
  sortOptions = [],
  onSortChange,
  currentSort = 'created_at'
}) => {
  const getEmptyStateMessage = () => {
    if (searchQuery) return `No sweets found for "${searchQuery}"`;
    if (filters.category) return `No sweets in "${filters.category}" category`;
    if (filters.min_price || filters.max_price) return 'No sweets in this price range';
    if (filters.available_only) return 'No available sweets at the moment';
    return 'No sweets available in the shop';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="sweet-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="sweet-card p-6">
            <Skeleton height={200} className="mb-4 rounded-xl" />
            <Skeleton height={24} className="mb-2" width="80%" />
            <Skeleton height={16} className="mb-4" count={2} />
            <Skeleton height={40} className="rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">😔</div>
        <h3 className="empty-state-title">Something went wrong</h3>
        <p className="empty-state-description">
          We couldn't load the sweets. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-sweet-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!sweets || sweets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Package size={64} />
        </div>
        <h3 className="empty-state-title">No Sweets Found</h3>
        <p className="empty-state-description">{getEmptyStateMessage()}</p>
        
        {(searchQuery || Object.keys(filters).length > 0) && (
          <button
            onClick={() => {
              onSearchChange?.('');
              onFilterChange?.({});
            }}
            className="mt-4 px-6 py-2 border border-sweet-primary text-sweet-primary rounded-lg hover:bg-sweet-primary hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Search Bar */}
      <div className="mb-8 glass-effect rounded-2xl p-6 sweet-shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/40" size={20} />
              <input
                type="text"
                placeholder="Search sweets by name, category, or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-sweet-light bg-white focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          {sortOptions.length > 0 && (
            <div className="w-full md:w-auto">
              <select
                value={currentSort}
                onChange={(e) => onSortChange?.(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-sweet-light bg-white focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} className="text-sweet-dark/60" />
              <span className="text-sm font-medium text-sweet-dark/60">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange?.({ ...filters, category: undefined })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !filters.category
                    ? 'bg-gradient-to-r from-sweet-primary to-sweet-accent text-white'
                    : 'bg-sweet-light text-sweet-dark hover:bg-sweet-light/80'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onFilterChange?.({ ...filters, category: category.value })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.category === category.value
                      ? 'bg-gradient-to-r from-sweet-primary to-sweet-accent text-white'
                      : 'bg-sweet-light text-sweet-dark hover:bg-sweet-light/80'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-sweet-primary/10 to-sweet-accent/10 p-4 rounded-xl">
          <div className="text-sm text-sweet-dark/60 mb-1">Total Sweets</div>
          <div className="text-2xl font-bold text-sweet-dark">{sweets.length}</div>
        </div>
        <div className="bg-gradient-to-br from-sweet-secondary/10 to-emerald-400/10 p-4 rounded-xl">
          <div className="text-sm text-sweet-dark/60 mb-1">Available</div>
          <div className="text-2xl font-bold text-sweet-dark">
            {sweets.filter(s => s.quantity > 0).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-xl">
          <div className="text-sm text-sweet-dark/60 mb-1">Featured</div>
          <div className="text-2xl font-bold text-sweet-dark">
            {sweets.filter(s => s.is_featured).length}
          </div>
        </div>
      </div>

      {/* Sweets Grid */}
      <div className="sweet-grid">
        {sweets.map((sweet) => (
          <SweetCard
            key={sweet.id}
            sweet={sweet}
            onUpdate={onSweetUpdate}
            onDelete={onSweetDelete}
            showActions={true}
          />
        ))}
      </div>

      {/* Pagination Info */}
      {sweets.length >= 20 && (
        <div className="mt-8 text-center text-sweet-dark/60">
          Showing {sweets.length} sweets
        </div>
      )}
    </div>
  );
};

export default SweetList;