import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit3,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  X,
  Package,
  ExternalLink,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const AdminProductTable = ({ products = [], onDeleteClick }) => {
  // Sort State
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Selected Product for Desktop Side-by-Side Preview Panel
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mobile Collapsible State (map of product ID -> boolean)
  const [expandedCards, setExpandedCards] = useState({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleCardExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'cashPrice') {
        aVal = Number(a.prices?.cash ?? a.price ?? 0);
        bVal = Number(b.prices?.cash ?? b.price ?? 0);
      } else if (sortField === 'hirePrice') {
        aVal = Number(a.prices?.hire ?? 0);
        bVal = Number(b.prices?.hire ?? 0);
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(String(bVal || ''))
          : String(bVal || '').localeCompare(aVal);
      }
      return sortDirection === 'asc'
        ? Number(aVal || 0) - Number(bVal || 0)
        : Number(bVal || 0) - Number(aVal || 0);
    });
  }, [products, sortField, sortDirection]);

  // Paginated products
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || amount === '') return 'N/A';
    return `LKR ${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Desktop Main Table + Side-by-Side Preview Container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table Container */}
        <div className={`flex-1 transition-all duration-300 ${selectedProduct ? 'lg:w-7/12' : 'w-full'}`}>
          {/* Mobile Table Replacement: Collapsible Touch-Friendly Cards */}
          <div className="block md:hidden space-y-3">
            {paginatedProducts.map((product) => {
              const productId = product._id || product.id;
              const isExpanded = Boolean(expandedCards[productId]);
              const primaryImg = product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80';

              return (
                <div
                  key={productId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleCardExpand(productId)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 min-h-[56px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={primaryImg}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-100"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                            {product.productCode || 'N/A'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">
                          {product.name}
                        </h4>
                        <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                          {formatPrice(product.prices?.cash ?? product.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0"
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Mobile Card Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Brand</span>
                          <span className="font-bold text-slate-800">{product.brand || 'Generic'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Stock</span>
                          <span className={`font-bold flex items-center gap-1 ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {product.stock > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {product.stock} units
                          </span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-cyan-700 font-bold uppercase block">Hire Purchase</span>
                          <span className="font-bold text-cyan-800">{formatPrice(product.prices?.hire)}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Tech</span>
                          <span className="font-bold text-slate-800">{product.technology || 'Standard'}</span>
                        </div>
                      </div>

                      {/* Touch-Friendly Action Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <Link
                          to={`/products/${productId}`}
                          className="min-h-[44px] flex items-center justify-center gap-1 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                          View
                        </Link>
                        <Link
                          to={`/products/${productId}/edit`}
                          className="min-h-[44px] flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 shadow-2xs"
                        >
                          <Edit3 className="w-4 h-4 text-amber-700" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDeleteClick(product)}
                          className="min-h-[44px] flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 shadow-2xs cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Data Table */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider">
                    <th className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => toggleSort('productCode')}>
                      <div className="flex items-center gap-1">
                        Code
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => toggleSort('name')}>
                      <div className="flex items-center gap-1">
                        Product
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => toggleSort('category')}>
                      <div className="flex items-center gap-1">
                        Category
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => toggleSort('cashPrice')}>
                      <div className="flex items-center gap-1">
                        Cash Price
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => toggleSort('stock')}>
                      <div className="flex items-center gap-1">
                        Stock
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedProducts.map((product) => {
                    const productId = product._id || product.id;
                    const isSelected = selectedProduct && (selectedProduct._id || selectedProduct.id) === productId;
                    const primaryImg = product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=150&q=80';

                    return (
                      <tr
                        key={productId}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-cyan-50/70 border-l-4 border-l-cyan-500' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedProduct(isSelected ? null : product)}
                      >
                        <td className="py-3 px-4 font-mono text-xs font-bold text-cyan-800">
                          {product.productCode || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={primaryImg}
                              alt={product.name}
                              loading="lazy"
                              decoding="async"
                              className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=150&q=80';
                              }}
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                              <p className="text-xs text-slate-500">{product.brand || 'Generic'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">
                          {formatPrice(product.prices?.cash ?? product.price)}
                        </td>
                        <td className="py-3 px-4">
                          {product.stock > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {product.stock}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-xs bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" />
                              0
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(isSelected ? null : product)}
                              className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                                isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                              title="Quick Preview Panel"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/products/${productId}/edit`}
                              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold border border-amber-200 transition-colors"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => onDeleteClick(product)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Desktop Side-by-Side Quick Edit / Preview Panel */}
        {selectedProduct && (
          <aside className="hidden lg:block lg:w-5/12 bg-white rounded-3xl border border-slate-200 shadow-lg p-6 space-y-6 self-start sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Quick Product Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedProduct.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                    {selectedProduct.productCode}
                  </span>
                  <span className="font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {selectedProduct.category}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">{selectedProduct.name}</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{selectedProduct.brand}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Cash Price</span>
                  <span className="text-base font-black text-slate-950">
                    {formatPrice(selectedProduct.prices?.cash ?? selectedProduct.price)}
                  </span>
                </div>
                <div className="pl-3 border-l border-slate-200">
                  <span className="block text-[10px] text-cyan-700 font-bold uppercase">Hire Purchase</span>
                  <span className="text-base font-extrabold text-cyan-700">
                    {formatPrice(selectedProduct.prices?.hire)}
                  </span>
                </div>
              </div>

              {selectedProduct.description && (
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h5>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{selectedProduct.description}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Link
                  to={`/products/${selectedProduct._id || selectedProduct.id}`}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 bg-slate-900 text-cyan-400 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors"
                >
                  Full Details
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/products/${selectedProduct._id || selectedProduct.id}/edit`}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                  Edit Entry
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold">
            Showing <span className="font-bold text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)}
            </span>{' '}
            of <span className="font-bold text-slate-800">{sortedProducts.length}</span> items
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-extrabold text-slate-800 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductTable;
