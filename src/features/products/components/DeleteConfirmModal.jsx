import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, isDeleting = false }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-3 bg-rose-100 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Confirm Product Deletion</h3>
            <p className="text-xs text-gray-500">This action cannot be undone.</p>
          </div>
        </div>

        <div className="bg-rose-50/50 border border-rose-100 p-3.5 rounded-xl mb-6 text-sm text-gray-700 space-y-1">
          <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
          <p className="text-xs text-gray-500 font-mono">
            Code: {product.productCode || 'N/A'} | Brand: {product.brand || 'Generic'}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
