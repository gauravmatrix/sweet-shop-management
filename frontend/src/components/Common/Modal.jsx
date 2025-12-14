import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`${sizes[size]} w-full bg-white rounded-2xl shadow-2xl animate-modal-in`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sweet-light">
          <h3 className="text-xl font-bold text-sweet-dark">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-sweet-light rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;