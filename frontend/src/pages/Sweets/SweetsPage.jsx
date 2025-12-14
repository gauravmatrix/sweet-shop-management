import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import sweetService from '../../services/sweetService';
import SweetList from '../../components/Sweets/SweetList';
import { Plus, Filter, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SweetsPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    min_price: '',
    max_price: '',
    available_only: false,
    is_featured: false,
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);

  // Fetch sweets with filters
  const {
    data: sweetsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sweets', filters, searchQuery, sortBy],
    queryFn: () => {
      const params = { ...filters, ordering: sortBy };
      if (searchQuery) params.search = searchQuery;
      return sweetService.getAllSweets(params);
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await sweetService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await sweetService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle sweet update (after purchase/edit)
  const handleSweetUpdate = () => {
    queryClient.invalidateQueries(['sweets']);
    refetch();
  };

  // Handle sweet delete
  const handleSweetDelete = (deletedId) => {
    queryClient.setQueryData(['sweets'], (oldData) => {
      if (!oldData?.results) return oldData;
      return {
        ...oldData,
        results: oldData.results.filter((sweet) => sweet.id !== deletedId),
      };
    });
  };

  // Sort options
  const sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: '-created_at', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: '-name', label: 'Name: Z to A' },
    { value: 'quantity', label: 'Quantity: Low to High' },
    { value: '-quantity', label: 'Quantity: High to Low' },
  ];

  // Get sweets array from data
  const sweets = sweetsData?.results || sweetsData || [];

  return (
    <div className="min-h-screen sweet-background">
      {/* Page Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sweet-primary/5 to-sweet-accent/5" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-sweet-dark mb-4">
              🍬 Our Sweet Collection
            </h1>
            <p className="text-xl text-sweet-dark/70 max-w-3xl mx-auto">
              Discover a wide variety of delicious sweets. From chocolates to traditional Indian sweets, we have something for every sweet tooth!
            </p>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sweet-primary/10 rounded-lg">
                    <Package className="text-sweet-primary" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-sweet-dark/60">Total Sweets</div>
                    <div className="text-2xl font-bold text-sweet-dark">{stats.total_sweets}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-sweet-dark/60">In Stock</div>
                    <div className="text-2xl font-bold text-sweet-dark">{stats.stock_status?.in_stock || 0}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-sweet-dark/60">Low Stock</div>
                    <div className="text-2xl font-bold text-sweet-dark">{stats.stock_status?.low_stock || 0}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sweet-secondary/10 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <div className="text-sm text-sweet-dark/60">Total Value</div>
                    <div className="text-lg font-bold text-sweet-dark">
                      ₹{(stats.total_value || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 sweet-shadow border border-sweet-light">
                <h3 className="text-lg font-bold text-sweet-dark mb-6 flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="sweet-label">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange({ category: e.target.value })}
                    className="sweet-input"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="sweet-label">Price Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.min_price}
                        onChange={(e) => handleFilterChange({ min_price: e.target.value })}
                        className="sweet-input"
                        min="0"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.max_price}
                        onChange={(e) => handleFilterChange({ max_price: e.target.value })}
                        className="sweet-input"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.available_only}
                      onChange={(e) => handleFilterChange({ available_only: e.target.checked })}
                      className="w-5 h-5 rounded border-sweet-light text-sweet-primary focus:ring-sweet-primary/20"
                    />
                    <span className="text-sweet-dark">Show only available</span>
                  </label>
                </div>

                {/* Featured Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.is_featured}
                      onChange={(e) => handleFilterChange({ is_featured: e.target.checked })}
                      className="w-5 h-5 rounded border-sweet-light text-sweet-primary focus:ring-sweet-primary/20"
                    />
                    <span className="text-sweet-dark">Featured only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                {(filters.category || filters.min_price || filters.max_price || filters.available_only || filters.is_featured) && (
                  <button
                    onClick={() => setFilters({
                      category: '',
                      min_price: '',
                      max_price: '',
                      available_only: false,
                      is_featured: false,
                    })}
                    className="w-full py-2 border border-sweet-light text-sweet-dark rounded-lg hover:bg-sweet-light transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Admin Quick Actions */}
              {isAdmin && (
                <div className="mt-6 bg-gradient-to-br from-sweet-primary/5 to-sweet-accent/5 rounded-2xl p-6 sweet-shadow border border-sweet-primary/20">
                  <h3 className="text-lg font-bold text-sweet-dark mb-4">Admin Actions</h3>
                  <button
                    onClick={() => navigate('/admin/sweets/add')}
                    className="w-full sweet-btn-primary flex items-center justify-center gap-2 mb-3"
                  >
                    <Plus size={18} />
                    Add New Sweet
                  </button>
                  <button
                    onClick={() => navigate('/admin/sweets')}
                    className="w-full sweet-btn-outline"
                  >
                    Manage All Sweets
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Sweets List */}
          <div className="lg:w-3/4">
            <SweetList
              sweets={sweets}
              loading={isLoading}
              error={error}
              onSweetUpdate={handleSweetUpdate}
              onSweetDelete={handleSweetDelete}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              sortOptions={sortOptions}
              onSortChange={setSortBy}
              currentSort={sortBy}
            />

            {/* Empty State Illustration */}
            {!isLoading && sweets.length === 0 && (
              <div className="mt-12 text-center">
                <div className="inline-block p-8 bg-gradient-to-br from-sweet-light to-white rounded-3xl sweet-shadow">
                  <div className="text-6xl mb-6">🍭</div>
                  <h3 className="text-2xl font-bold text-sweet-dark mb-3">No Sweets Match Your Search</h3>
                  <p className="text-sweet-dark/70 mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search term to find what you're looking for.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({
                          category: '',
                          min_price: '',
                          max_price: '',
                          available_only: false,
                          is_featured: false,
                        });
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-sweet-primary to-sweet-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Show All Sweets
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => navigate('/admin/sweets/add')}
                        className="px-6 py-2 border border-sweet-primary text-sweet-primary rounded-lg font-semibold hover:bg-sweet-primary hover:text-white transition-colors"
                      >
                        Add First Sweet
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetsPage;