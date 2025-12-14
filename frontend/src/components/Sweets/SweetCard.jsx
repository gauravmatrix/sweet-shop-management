import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import sweetService from '../../services/sweetService';
import toast from 'react-hot-toast';
import { 
  ShoppingBag, Plus, Minus, Trash2, Edit, Package, 
  Star, AlertCircle, IndianRupee, BarChart3 
} from 'lucide-react';

const SweetCard = ({ sweet, onUpdate, onDelete, showActions = true }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const categoryColors = {
    chocolate: 'bg-amber-900/10 text-amber-900 border-amber-900/20',
    candy: 'bg-pink-500/10 text-pink-700 border-pink-500/20',
    cake: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    cookie: 'bg-amber-700/10 text-amber-800 border-amber-700/20',
    dessert: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    indian: 'bg-red-500/10 text-red-700 border-red-500/20',
  };

  const stockColors = {
    available: 'bg-green-500/10 text-green-700 border-green-500/20',
    low: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    out: 'bg-red-500/10 text-red-700 border-red-500/20',
  };

  const getStockStatus = () => {
    if (sweet.quantity === 0) return { status: 'out', label: 'Out of Stock', color: stockColors.out };
    if (sweet.quantity <= 10) return { status: 'low', label: 'Low Stock', color: stockColors.low };
    return { status: 'available', label: 'In Stock', color: stockColors.available };
  };

  const stockStatus = getStockStatus();

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    if (purchaseQuantity > sweet.quantity) {
      toast.error(`Only ${sweet.quantity} items available`);
      return;
    }

    setLoading(true);
    try {
      await sweetService.purchaseSweet(sweet.id, purchaseQuantity);
      setShowPurchaseModal(false);
      setPurchaseQuantity(1);
      onUpdate?.(); // Refresh the list
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${sweet.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await sweetService.deleteSweet(sweet.id);
      toast.success('Sweet deleted successfully');
      onDelete?.(sweet.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/sweets/edit/${sweet.id}`);
  };

  const handleViewDetails = () => {
    navigate(`/sweets/${sweet.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const totalValue = sweet.price * sweet.quantity;

  return (
    <>
      <div className="sweet-card overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300">
        {/* Header with category and featured badge */}
        <div className="p-4 border-b border-sweet-light flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[sweet.category] || 'bg-gray-100 text-gray-700'}`}>
              {sweet.category_display || sweet.category}
            </span>
            {sweet.is_featured && (
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Star size={10} /> Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${stockStatus.color}`}>
              {stockStatus.label}
            </span>
            {sweet.quantity <= 10 && sweet.quantity > 0 && (
              <AlertCircle size={14} className="text-yellow-500" />
            )}
          </div>
        </div>

        {/* Sweet Image/Icon */}
        <div className="p-6 flex justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sweet-primary/20 to-sweet-accent/20 flex items-center justify-center">
            <div className="text-4xl">
              {sweet.category === 'chocolate' && '🍫'}
              {sweet.category === 'candy' && '🍬'}
              {sweet.category === 'cake' && '🍰'}
              {sweet.category === 'cookie' && '🍪'}
              {sweet.category === 'dessert' && '🍨'}
              {sweet.category === 'indian' && '🥠'}
              {!['chocolate', 'candy', 'cake', 'cookie', 'dessert', 'indian'].includes(sweet.category) && '🍭'}
            </div>
          </div>
        </div>

        {/* Sweet Details */}
        <div className="p-6 pt-0">
          <h3 className="text-xl font-bold text-sweet-dark mb-2 line-clamp-1">
            {sweet.name}
          </h3>
          
          <p className="text-sweet-dark/70 text-sm mb-4 line-clamp-2 min-h-[40px]">
            {sweet.description || 'No description available'}
          </p>

          {/* Price and Stock Info */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sweet-dark/60 text-sm">Price:</span>
              <span className="text-xl font-bold text-sweet-primary flex items-center">
                <IndianRupee size={18} className="mr-1" />
                {formatPrice(sweet.price)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sweet-dark/60 text-sm">In Stock:</span>
              <span className="font-semibold text-sweet-dark">{sweet.quantity} units</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sweet-dark/60 text-sm">Total Value:</span>
              <span className="font-semibold text-sweet-secondary flex items-center">
                <BarChart3 size={14} className="mr-1" />
                {formatPrice(totalValue)}
              </span>
            </div>
          </div>

          {/* Stock Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-sweet-dark/60 mb-1">
              <span>Stock Level</span>
              <span>{sweet.quantity} units</span>
            </div>
            <div className="h-2 bg-sweet-light rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  sweet.quantity === 0 ? 'bg-red-500' :
                  sweet.quantity <= 10 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (sweet.quantity / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex flex-col gap-3">
              {/* Purchase Button for Users */}
              {!isAdmin && sweet.quantity > 0 && (
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  disabled={loading || sweet.quantity === 0}
                  className="w-full sweet-btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} />
                  {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                </button>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleEdit}
                    className="sweet-btn-outline flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}

              {/* View Details Button */}
              <button
                onClick={handleViewDetails}
                className="text-sweet-primary hover:text-sweet-primary/80 font-medium text-sm flex items-center justify-center gap-1"
              >
                View Details →
              </button>
            </div>
          )}
        </div>

        {/* Calories (if available) */}
        {sweet.calories && (
          <div className="px-6 py-3 border-t border-sweet-light bg-sweet-light/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sweet-dark/60">Calories:</span>
              <span className="font-medium text-sweet-dark">{sweet.calories} kcal</span>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 sweet-shadow-lg">
            <h3 className="text-xl font-bold text-sweet-dark mb-2">Purchase {sweet.name}</h3>
            <p className="text-sweet-dark/70 mb-6">
              How many would you like to purchase?
            </p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sweet-dark">Available: {sweet.quantity} units</span>
                <span className="text-sweet-primary font-bold">
                  {formatPrice(sweet.price)} each
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setPurchaseQuantity(prev => Math.max(1, prev - 1))}
                  disabled={purchaseQuantity <= 1}
                  className="w-10 h-10 rounded-full bg-sweet-light flex items-center justify-center text-sweet-dark hover:bg-sweet-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  <Minus size={20} />
                </button>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-sweet-primary">{purchaseQuantity}</div>
                  <div className="text-sm text-sweet-dark/60">units</div>
                </div>

                <button
                  onClick={() => setPurchaseQuantity(prev => Math.min(sweet.quantity, prev + 1))}
                  disabled={purchaseQuantity >= sweet.quantity}
                  className="w-10 h-10 rounded-full bg-sweet-light flex items-center justify-center text-sweet-dark hover:bg-sweet-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-sm text-sweet-dark/60 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-sweet-primary">
                  {formatPrice(sweet.price * purchaseQuantity)}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 py-3 border border-sweet-light text-sweet-dark rounded-lg hover:bg-sweet-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={loading || purchaseQuantity > sweet.quantity}
                className="flex-1 py-3 bg-gradient-to-r from-sweet-primary to-sweet-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Confirm Purchase'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SweetCard;