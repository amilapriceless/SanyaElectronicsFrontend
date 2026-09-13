import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Tag,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  ListFilter,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { getProductById, deleteProduct } from '../product.api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const SPECIFICATION_UNITS = {
  capacity: 'L',
  volume: 'L',
  weight: 'kg',
  screensize: 'inch',
  refreshrate: 'Hz',
  spinspeed: 'rpm',
  power: 'W',
  powerconsumption: 'W',
  height: 'cm',
  width: 'cm',
  depth: 'cm',
};

const getSpecificationUnit = (key) =>
  SPECIFICATION_UNITS[String(key || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')];

const formatSpecificationValue = (key, value) => {
  const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  const unit = getSpecificationUnit(key);
  if (!unit || !formattedValue.trim()) return formattedValue;

  const escapedUnit = unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hasUnit = new RegExp(`(?:^|\\s|\\d)${escapedUnit}(?:\\b|$)`, 'i').test(formattedValue)
    || (unit === 'L' && /\blit(?:er|re)s?\b/i.test(formattedValue));

  return hasUnit ? formattedValue : `${formattedValue} ${unit}`;
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSystemAdmin } = useAdmin();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProductById(id);
        const productData = response?.data || response?.product || response;
        setProduct(productData);
      } catch (err) {
        setError(err.message || 'Product could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl border border-rose-100 mb-6">
          <h3 className="text-lg font-bold mb-1">Product Not Found</h3>
          <p className="text-xs">{error || 'The requested product could not be loaded.'}</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-slate-900 text-cyan-400 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Storefront
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'
  ];

  const cashPrice = product?.prices?.cash ?? product?.cashPrice ?? product?.price ?? 'N/A';
  const hirePrice = product?.prices?.hire ?? product?.hirePrice ?? 'N/A';
  const discountPrice = product?.prices?.discount;
  const hasDiscountPrice = discountPrice !== undefined && discountPrice !== null;
  const hasSpecs = Boolean(product?.specifications && Object.keys(product.specifications).length > 0);
  const formatPrice = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? `LKR ${numericValue.toLocaleString()}` : 'N/A';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Navigation & Admin Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-cyan-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Storefront
          </button>

          {isSystemAdmin && (
            <div className="flex items-center gap-3">
              <Link
                to={`/products/${id}/edit`}
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-4 py-2 rounded-xl text-sm border border-amber-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Product
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl text-sm border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete Product
              </button>
            </div>
          )}
        </div>

        {/* Product Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs aspect-[4/3] flex items-center justify-center p-6">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Meta & Pricing */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                  {product.brand}
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 ml-auto">
                  Code: {product.productCode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 text-xs">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Out of Stock
                  </span>
                )}

                {product.technology && (
                  <span className="flex items-center gap-1 text-cyan-800 font-bold bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">
                    <Tag className="w-3.5 h-3.5 text-cyan-600" />
                    {product.technology}
                  </span>
                )}

                {product.category !== 'Televisions' && product.powerConsumption && (
                  <span className="flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    {product.powerConsumption} {product.powerConsumptionUnit || 'W'}
                  </span>
                )}
              </div>
            </div>

            {/* Price Box with Tech Navy & Cyan Accent */}
            <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 grid grid-cols-1 ${hasDiscountPrice ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cash Purchase Price
                </span>
                <span className={`text-3xl font-black ${hasDiscountPrice ? 'text-slate-400 line-through' : 'text-cyan-400'}`}>
                  {formatPrice(cashPrice)}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Full upfront payment rate</p>
              </div>

              <div className="sm:border-l sm:border-slate-800 sm:pl-6">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Hire Purchase Price
                </span>
                <span className={`text-3xl font-extrabold ${hasDiscountPrice ? 'text-slate-400 line-through' : 'text-white'}`}>
                  {formatPrice(hirePrice)}
                </span>
                <p className="text-[11px] text-cyan-300 mt-1">Easy monthly installment options</p>
              </div>

              {hasDiscountPrice && (
                <div className="sm:border-l sm:border-amber-500/40 sm:pl-6 rounded-2xl bg-amber-400/10 p-3 -my-1">
                  <span className="block text-xs font-black text-amber-300 uppercase tracking-wider">
                    Discount Price
                  </span>
                  <span className="text-3xl font-black text-amber-300">
                    {formatPrice(discountPrice)}
                  </span>
                  <p className="text-[11px] text-amber-200 mt-1">Limited-time special offer</p>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Product Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{product.description}</p>
              </div>
            )}

            {/* Warranty Overview */}
            {product.warranty && product.warranty.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Warranty Protection Coverage
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.warranty.map((w, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{w.coverage ?? w.type}</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {w.period}{w.unit ? ` ${w.unit}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Specification Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 lg:p-8">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
            <ListFilter className="w-6 h-6 text-cyan-600" />
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Technical Specifications</h2>
              <p className="text-xs text-slate-500">Dynamic category features and parameters</p>
            </div>
          </div>

          {hasSpecs ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-1/3">Specification Key</th>
                    <th className="py-3.5 px-4 w-2/3">Value / Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/50' : 'bg-slate-50/40 hover:bg-slate-50/50'}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                      <td className="py-3.5 px-4 text-slate-900 font-medium">
                        {formatSpecificationValue(key, value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm italic">
              No technical specifications recorded for this product.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        product={product}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProductDetailsPage;
