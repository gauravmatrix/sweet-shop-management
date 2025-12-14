import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { sweetAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Components
import AdminPanel from '../../components/Admin/AdminPanel';
import SweetForm from '../../components/Sweets/SweetForm';
import SweetCard from '../../components/Sweets/SweetCard';
import Loading from '../../components/Common/Loading';
import Error from '../../components/Common/Error';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import SearchBar from '../../components/Common/SearchBar';

// Icons
import { Plus, Search, Filter, Trash2, Edit, Package, BarChart3, Download, Upload } from 'lucide-react';

const ManageSweetsPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedSweets, setSelectedSweets] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkQuantity, setBulkQuantity] = useState(10);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      toast.error('Admin access required');
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Fetch sweets
  const { data: sweets, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-sweets'],
    queryFn: () => sweetAPI.getAll(),
    enabled: isAdmin,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => sweetAPI.delete(id),
    onSuccess: () => {
      toast.success('Sweet deleted successfully');
      queryClient.invalidateQueries(['admin-sweets']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete sweet');
    },
  });

  // Bulk operations mutation
  const bulkMutation = useMutation({
    mutationFn: (data) => sweetAPI.bulkOperations(data),
    onSuccess: () => {
      toast.success('Bulk operation completed');
      queryClient.invalidateQueries(['admin-sweets']);
      setShowBulkModal(false);
      setSelectedSweets([]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Bulk operation failed');
    },
  });

  // Filter sweets
  const filteredSweets = sweets?.filter(sweet => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === 'all' || sweet.category === categoryFilter;

    // Stock filter
    let matchesStock = true;
    if (stockFilter === 'in_stock') matchesStock = sweet.quantity > 10;
    if (stockFilter === 'low_stock') matchesStock = sweet.quantity > 0 && sweet.quantity <= 10;
    if (stockFilter === 'out_of_stock') matchesStock = sweet.quantity === 0;

    return matchesSearch && matchesCategory && matchesStock;
  }) || [];

  // Statistics
  const stats = {
    total: sweets?.length || 0,
    inStock: sweets?.filter(s => s.quantity > 10).length || 0,
    lowStock: sweets?.filter(s => s.quantity > 0 && s.quantity <= 10).length || 0,
    outOfStock: sweets?.filter(s => s.quantity === 0).length || 0,
    totalValue: sweets?.reduce((sum, s) => sum + (s.price * s.quantity), 0) || 0,
  };

  // Handle actions
  const handleEdit = (sweet) => {
    setSelectedSweet(sweet);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkAction = () => {
    if (selectedSweets.length === 0) {
      toast.error('Please select sweets first');
      return;
    }

    if (bulkAction === '') {
      toast.error('Please select an action');
      return;
    }

    const data = {
      operation: bulkAction,
      sweet_ids: selectedSweets,
      quantity: bulkQuantity
    };

    bulkMutation.mutate(data);
  };

  const handleSelectAll = () => {
    if (selectedSweets.length === filteredSweets.length) {
      setSelectedSweets([]);
    } else {
      setSelectedSweets(filteredSweets.map(s => s.id));
    }
  };

  const handleSelectSweet = (id) => {
    setSelectedSweets(prev => 
      prev.includes(id) 
        ? prev.filter(sweetId => sweetId !== id)
        : [...prev, id]
    );
  };

  if (isLoading) return <Loading message="Loading sweets..." />;
  if (error) return <Error message="Failed to load sweets" onRetry={refetch} />;

  return (
    <AdminPanel title="Manage Sweets" subtitle="Add, edit, and manage your sweet inventory">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Sweets</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Package size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">In Stock</p>
              <p className="text-3xl font-bold">{stats.inStock}</p>
            </div>
            <BarChart3 size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Low Stock</p>
              <p className="text-3xl font-bold">{stats.lowStock}</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Value</p>
              <p className="text-3xl font-bold">₹{stats.totalValue.toFixed(2)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search sweets..."
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-sweet-dark" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-sweet-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-primary"
              >
                <option value="all">All Categories</option>
                <option value="chocolate">Chocolate</option>
                <option value="candy">Candy</option>
                <option value="cake">Cake</option>
                <option value="cookie">Cookie</option>
                <option value="dessert">Dessert</option>
                <option value="indian">Indian</option>
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-sweet-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-primary"
              >
                <option value="all">All Stock</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <Button
              onClick={() => setShowBulkModal(true)}
              variant="secondary"
              disabled={selectedSweets.length === 0}
              className="flex items-center gap-2"
            >
              <Package size={18} />
              Bulk Actions ({selectedSweets.length})
            </Button>

            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Sweet
            </Button>
          </div>
        </div>

        {/* Bulk Selection */}
        {selectedSweets.length > 0 && (
          <div className="mt-4 p-4 bg-sweet-light rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedSweets.length === filteredSweets.length}
                onChange={handleSelectAll}
                className="h-5 w-5 rounded border-sweet-primary text-sweet-primary focus:ring-sweet-primary"
              />
              <span className="font-semibold text-sweet-dark">
                {selectedSweets.length} sweet(s) selected
              </span>
            </div>
            <button
              onClick={() => setSelectedSweets([])}
              className="text-sm text-sweet-primary hover:text-sweet-accent"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Sweets Grid */}
      {filteredSweets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">🍬</div>
          <h3 className="text-xl font-semibold text-sweet-dark mb-2">No sweets found</h3>
          <p className="text-sweet-dark/70 mb-6">
            {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
              ? 'Try changing your filters'
              : 'Add your first sweet to get started'}
          </p>
          <Button onClick={() => setShowAddModal(true)} variant="primary">
            <Plus size={18} className="mr-2" />
            Add First Sweet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map(sweet => (
            <div key={sweet.id} className="relative">
              <input
                type="checkbox"
                checked={selectedSweets.includes(sweet.id)}
                onChange={() => handleSelectSweet(sweet.id)}
                className="absolute top-4 left-4 h-5 w-5 rounded border-sweet-primary text-sweet-primary focus:ring-sweet-primary z-10"
              />
              <SweetCard
                sweet={sweet}
                showAdminControls={true}
                onEdit={() => handleEdit(sweet)}
                onDelete={() => handleDelete(sweet.id)}
                className="hover:border-sweet-primary"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Sweet Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Sweet"
        size="lg"
      >
        <SweetForm
          mode="create"
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Sweet Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSweet(null);
        }}
        title="Edit Sweet"
        size="lg"
      >
        {selectedSweet && (
          <SweetForm
            mode="edit"
            sweet={selectedSweet}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedSweet(null);
              refetch();
            }}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedSweet(null);
            }}
          />
        )}
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Operations"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-sweet-dark mb-2">
              Action
            </label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sweet-light focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
            >
              <option value="">Select action</option>
              <option value="restock">Restock</option>
              <option value="clear_stock">Clear Stock</option>
              <option value="delete">Delete (Zero Stock Only)</option>
            </select>
          </div>

          {bulkAction === 'restock' && (
            <div>
              <label className="block text-sm font-semibold text-sweet-dark mb-2">
                Quantity to add to each sweet
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={bulkQuantity}
                onChange={(e) => setBulkQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-sweet-light focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
              />
            </div>
          )}

          <div className="bg-sweet-light/50 p-4 rounded-lg">
            <p className="text-sm text-sweet-dark">
              This action will affect <strong>{selectedSweets.length}</strong> selected sweet(s).
            </p>
            {bulkAction === 'delete' && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Only sweets with zero stock will be deleted. Others will be skipped.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowBulkModal(false)}
              disabled={bulkMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBulkAction}
              disabled={!bulkAction || bulkMutation.isPending}
              loading={bulkMutation.isPending}
            >
              Execute Bulk Action
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPanel>
  );
};

export default ManageSweetsPage;