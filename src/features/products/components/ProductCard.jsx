import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Zap, Tag } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const ProductCard = ({ product, onDeleteClick }) => {
  const { isSystemAdmin } = useAdmin();

  const primaryImage =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || amount === '') return 'N/A';
    return `LKR ${Number(amount).toLocaleString()}`;
  };

  const screenSize =
    product.screenSize ??
    product.specifications?.screenSize ??
    product.specifications?.['Screen Size'] ??
    '';
  const isTelevision = product.category?.toLowerCase() === 'televisions';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Top Badges & Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {isTelevision && screenSize && (
            <div className="absolute bottom-3 left-3 bg-[#D2042D] backdrop-blur-xs text-white px-3.5 py-2 rounded-xl border border-white/30 shadow-lg">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-cyan-300">Screen Size</span>
              <span className="text-3xl leading-none font-black tracking-tight">{screenSize}&quot;</span>
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute top-2.5 right-2.5">
            {product.stock > 0 ? (
              <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="bg-rose-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <span className="font-extrabold text-cyan-700 uppercase tracking-wide truncate">
              {product.brand || 'Generic'}
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
              {product.category}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-cyan-700 transition-colors">
            {product.name}
          </h3>

          {/* Technology / Power consumption highlights */}
          <div className="flex flex-wrap gap-1.5 my-2.5 min-h-[26px]">
            {product.technology && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cyan-50 text-cyan-800 px-2.5 py-0.5 rounded-md border border-cyan-200">
                <Tag className="w-3 h-3 text-cyan-600" />
                {product.technology}
              </span>
            )}
            {product.category !== 'Televisions' && product.powerConsumption && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-md border border-amber-200">
                <Zap className="w-3 h-3 text-amber-600" />
                {product.powerConsumption} {product.powerConsumptionUnit || 'W'}
              </span>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="mt-3 pt-3 border border-slate-100 bg-slate-50 p-2.5 rounded-2xl">
            {product.prices?.discount !== undefined && product.prices?.discount !== null ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center">
                <span className="block text-[10px] text-amber-700 uppercase font-black tracking-wider">Sale Price</span>
                <span className="text-base sm:text-lg font-black text-amber-600 block truncate">{formatPrice(product.prices.discount)}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Cash Price
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-950 block truncate">
                    {formatPrice(product.prices?.cash)}
                  </span>
                </div>
                <div className="pl-2 border-l border-slate-200">
                  <span className="block text-[10px] text-cyan-800 uppercase font-bold tracking-wider">
                    Hire Purchase
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-cyan-600 block truncate">
                    {formatPrice(product.prices?.hire)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons with Minimum 44px Touch Targets */}
      <div className="p-4 pt-0 mt-2">
        {isSystemAdmin ? (
          <div className="grid grid-cols-3 gap-1.5">
            <Link
              to={`/products/${product._id || product.id}`}
              className="min-h-[44px] flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 rounded-xl text-xs transition-colors"
              title="View Details"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              More
            </Link>
            <Link
              to={`/products/${product._id || product.id}/edit`}
              className="min-h-[44px] flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-2 rounded-xl text-xs border border-amber-200 transition-colors"
              title="Edit Product"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onDeleteClick(product)}
              className="min-h-[44px] flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 rounded-xl text-xs border border-rose-200 transition-colors cursor-pointer"
              title="Delete Product"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Delete
            </button>
          </div>
        ) : (
          <Link
            to={`/products/${product._id || product.id}`}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold px-4 rounded-2xl text-sm transition-all shadow-xs border border-slate-800 group-hover:border-cyan-500/50"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            More Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
