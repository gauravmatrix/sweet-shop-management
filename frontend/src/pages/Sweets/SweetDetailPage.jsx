import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSweet, usePurchaseSweet } from '../../hooks/useSweets';
import { useAuth } from '../../hooks/useAuth';
import { 
  ArrowLeft, ShoppingCart, Package, DollarSign, 
  Tag, Calendar, TrendingUp, AlertCircle 
} from 'lucide-react';
import { formatPrice, formatDate, getCategoryInfo, getStockStatus } from '../../utils/helpers';
import Loading from '../../components/Common/Loading';
import Error from '../../components/Common/Error';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';

const SweetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: sweet, isLoading, error } = useSweet(id);
  const purchaseMutation = usePurchaseSweet();
  
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (isLoading) return <Loading text="Loading sweet details..." />;
  if (error) return <Error message="Failed to load sweet details" />;
  if (!sweet) return <Error message="Sweet not found" />;

  const categoryInfo = getCategoryInfo(sweet.category);
  const stockStatus = getStockStatus(sweet.quantity);
  const isAdmin = user?.is_admin;

  const handlePurchase = async () => {
    try {
      await purchaseMutation.mutateAsync({ id: sweet.id, quantity: purchaseQuantity });
      setShowPurchaseModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const maxPurchaseQuantity = Math.min(sweet.quantity, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sweet-light to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/sweets')}
          className="flex items-center space-x-2 text-sweet-dark hover:text-sweet-primary mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Sweets</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image & Basic Info */}
          <div className="space-y-6">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-sweet-light to-white flex items-center justify-center">
                {sweet.image ? (
                  <img 
                    src={sweet.image} 
                    alt={sweet.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <span className="text-8xl">{categoryInfo.icon}</span>
                    <p className="mt-4 text-sweet-dark/70">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sweet-dark/70">Stock Status</p>
                    <p className={`text-lg font-bold ${stockStatus.color}`}>
                      {stockStatus.label}
                    </p>
                  </div>
                  <Package className="text-sweet-primary" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sweet-dark/70">Total Value</p>
                    <p className="text-lg font-bold text-sweet-dark">
                      {formatPrice(sweet.price * sweet.quantity)}
                    </p>
                  </div>
                  <TrendingUp className="text-sweet-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold`}
                      style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}>
                      {categoryInfo.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      sweet.quantity > 10 ? 'bg-green-100 text-green-800' :
                      sweet.quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sweet.quantity} units
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-sweet-dark mb-2">{sweet.name}</h1>
                  <p className="text-sweet-dark/70">{sweet.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-sweet-primary">
                    {formatPrice(sweet.price)}
                  </p>
                  <p className="text-sm text-sweet-dark/70">per unit</p>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-sweet-dark mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Tag className="text-sweet-dark/50" size={20} />
                  <div>
                    <p className="text-sm text-sweet-dark/70">Category</p>
                    <p className="font-medium">{categoryInfo.label}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="text-sweet-dark/50" size={20} />
                  <div>
                    <p className="text-sm text-sweet-dark/70">Price</p>
                    <p className="font-medium">{formatPrice(sweet.price)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package className="text-sweet-dark/50" size={20} />
                  <div>
                    <p className="text-sm text-sweet-dark/70">Available Quantity</p>
                    <p className="font-medium">{sweet.quantity} units</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="text-sweet-dark/50" size={20} />
                  <div>
                    <p className="text-sm text-sweet-dark/70">Added On</p>
                    <p className="font-medium">{formatDate(sweet.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-sweet-dark mb-4">Actions</h2>
              <div className="flex flex-wrap gap-4">
                {sweet.quantity > 0 ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowPurchaseModal(true)}
                    className="flex-1"
                  >
                    <ShoppingCart className="mr-2" size={20} />
                    Purchase Sweet
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg w-full">
                    <AlertCircle size={20} />
                    <span>This sweet is currently out of stock</span>
                  </div>
                )}
                
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/admin/sweets/edit/${sweet.id}`)}
                    >
                      Edit Sweet
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/admin/sweets/restock/${sweet.id}`)}
                    >
                      Restock
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Purchase Sweet"
      >
        <div className="space-y-6">
          <div className="bg-sweet-light/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{sweet.name}</span>
              <span className="font-bold">{formatPrice(sweet.price)}</span>
            </div>
            <p className="text-sm text-sweet-dark/70">Available: {sweet.quantity} units</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-sweet-dark mb-2">
              Quantity to Purchase
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max={maxPurchaseQuantity}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPurchaseQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-sweet-light rounded-lg"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{purchaseQuantity}</span>
                <button
                  onClick={() => setPurchaseQuantity(prev => Math.min(maxPurchaseQuantity, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center bg-sweet-light rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sweet-dark/70">Total Price:</span>
              <span className="text-2xl font-bold text-sweet-primary">
                {formatPrice(sweet.price * purchaseQuantity)}
              </span>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePurchase}
                loading={purchaseMutation.isLoading}
                className="flex-1"
              >
                Confirm Purchase
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Purchase Successful!"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
          <h3 className="text-xl font-bold text-sweet-dark">
            Enjoy your {sweet.name}!
          </h3>
          <p className="text-sweet-dark/70">
            You have successfully purchased {purchaseQuantity} unit(s) of {sweet.name}.
          </p>
          <div className="bg-sweet-light/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-sweet-dark/70">Item</p>
                <p className="font-medium">{sweet.name}</p>
              </div>
              <div>
                <p className="text-sweet-dark/70">Quantity</p>
                <p className="font-medium">{purchaseQuantity}</p>
              </div>
              <div>
                <p className="text-sweet-dark/70">Unit Price</p>
                <p className="font-medium">{formatPrice(sweet.price)}</p>
              </div>
              <div>
                <p className="text-sweet-dark/70">Total</p>
                <p className="font-bold text-sweet-primary">
                  {formatPrice(sweet.price * purchaseQuantity)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSuccessModal(false)}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SweetDetailPage;