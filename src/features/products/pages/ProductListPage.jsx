import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  PackageX,
  RefreshCw,
  AlertCircle,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  X,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { getProducts, deleteProduct } from '../product.api';
import { CATEGORIES } from '../components/ProductTabs';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';
import AdminProductTable from '../components/AdminProductTable';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ACCalculator from '../components/ACCalculator';

const ProductListPage = () => {
  const { isAdmin } = useAdmin();

  // View state for Admin mode (grid vs table)
  const [viewMode, setViewMode] = useState('grid');

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Category & Filter State
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [filters, setFilters] = useState({
    searchQuery: '',
    brand: '',
    inStockOnly: false,
    maxPrice: '',
    technology: '',
    doorType: '',
    capacity: '',
    color: '',
    tvCategory: '',
    screenSize: '',
    displayType: '',
    os: '',
    type: '',
    loadingType: '',
    subType: '',
    motorType: '',
    cookerType: '',
    subCategory: '',
    cleanerType: '',
    wattageCategory: '',
    itemType: '',
  });

  // Delete Modal State
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = activeCategory === 'All Products' ? {} : { category: activeCategory };
      const responseData = await getProducts(queryParams);
      console.log('📦 API GET /api/products response:', responseData);

      setProducts(Array.isArray(responseData) ? responseData : []);
      setIsUsingFallback(false);
    } catch (err) {
      console.error('❌ Backend API connection error:', err.message);
      setError(`Backend server at http://localhost:5000 unavailable or returned error (${err.message}).`);
      setProducts([]);
      setIsUsingFallback(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { 'All Products': products.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All Products') {
        counts[cat] = products.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [products]);

  const getSpecificationValue = (product, key) => {
    const specKeyNormalizer = (value) => String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const specs = product?.specifications || {};
    if (specs[key] !== undefined && specs[key] !== null) return specs[key];

    const matchingSpec = Object.entries(specs).find(([specKey]) =>
      specKeyNormalizer(specKey) === specKeyNormalizer(key)
    );

    return matchingSpec ? matchingSpec[1] : undefined;
  };

  // Compute unique brands for filter options
  const availableBrands = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const filteredProducts = activeCategory === 'All Products'
      ? products
      : products.filter((p) => p.category === activeCategory);

    return [...new Set(filteredProducts.map((p) => p.brand).filter(Boolean))].sort();
  }, [products, activeCategory]);

  // Filter products client-side based on active category & dynamic filter values
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((p) => {
      // 1. Category tab filter
      if (activeCategory !== 'All Products' && p.category?.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }

      // 2. Search Query filter (matches name, code, brand, description, tech)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesCode = p.productCode?.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesTech = p.technology?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesBrand && !matchesDesc && !matchesTech) {
          return false;
        }
      }

      // 3. Brand filter (supports selecting multiple sidebar brands)
      const selectedBrands = Array.isArray(filters.brand)
        ? filters.brand
        : filters.brand ? [filters.brand] : [];
      if (selectedBrands.length && !selectedBrands.some((brand) => p.brand?.toLowerCase() === brand.toLowerCase())) {
        return false;
      }

      // 4. In Stock filter
      if (filters.inStockOnly && (!p.stock || p.stock <= 0)) {
        return false;
      }

      // 5. Max Price filter
      if (filters.maxPrice) {
        const maxP = Number(filters.maxPrice);
        const cashP = p.prices?.cash ?? p.price;
        if (cashP > maxP) return false;
      }

      // 6. Category Specific Specs Filters
      const specs = p.specifications || {};

      // Technology
      if (filters.technology && p.technology?.toLowerCase() !== filters.technology.toLowerCase() && specs.technology?.toLowerCase() !== filters.technology.toLowerCase()) {
        return false;
      }

      // Refrigerators
      const normalizeValue = (value) => {
        const stringValue = String(value ?? '').trim();
        if (/\d/.test(stringValue)) {
          return stringValue.replace(/[^0-9.]/g, '').toLowerCase();
        }
        return stringValue.toLowerCase();
      };
      const selectedDoorType = filters.doorType;
      const doorTypeCandidates = [
        getSpecificationValue(p, 'doorType'),
        getSpecificationValue(p, 'Door type'),
        p.doorType,
        p.specifications?.doorType,
        p.specifications?.['Door type'],
      ].filter((value) => value !== undefined && value !== null && value !== '');
      const matchesDoorType = !selectedDoorType || doorTypeCandidates.some(
        (doorTypeValue) => normalizeValue(doorTypeValue) === normalizeValue(selectedDoorType)
      );
      if (selectedDoorType && !matchesDoorType) return false;

      const selectedCapacity = filters.capacity;
      const capacityCandidates = [
        getSpecificationValue(p, 'capacity'),
        getSpecificationValue(p, 'Capacity'),
        getSpecificationValue(p, 'loadCapacity'),
        getSpecificationValue(p, 'load capacity'),
        p.capacity,
        p.loadCapacity,
        p.specifications?.capacity,
        p.specifications?.Capacity,
        p.specifications?.loadCapacity,
        p.specifications?.['load capacity'],
      ].filter((value) => value !== undefined && value !== null && value !== '');
      const matchesCapacity = !selectedCapacity || capacityCandidates.some(
        (capacityValue) => normalizeValue(capacityValue) === normalizeValue(selectedCapacity)
      );
      if (selectedCapacity && !matchesCapacity) return false;

      const selectedColor = filters.color;
      const colorCandidates = [
        getSpecificationValue(p, 'color'),
        getSpecificationValue(p, 'Color'),
        p.color,
        p.specifications?.color,
        p.specifications?.Color,
      ].filter((value) => value !== undefined && value !== null && value !== '');
      const matchesColor = !selectedColor || colorCandidates.some(
        (colorValue) => normalizeValue(colorValue) === normalizeValue(selectedColor)
      );
      if (selectedColor && !matchesColor) return false;

      // Televisions
      const normalizeFilterValue = (value) => String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const tvCategoryCandidates = [
        getSpecificationValue(p, 'tvCategory'),
        getSpecificationValue(p, 'TV Category'),
        getSpecificationValue(p, 'technology'),
        getSpecificationValue(p, 'Technology'),
        p.tvCategory,
        p.technology,
        p.specifications?.tvCategory,
        p.specifications?.['TV Category'],
        p.specifications?.technology,
        p.specifications?.Technology,
      ].filter((value) => value !== undefined && value !== null && String(value).trim() !== '');
      const matchesTvCategory = !filters.tvCategory || tvCategoryCandidates.some(
        (value) => normalizeFilterValue(value) === normalizeFilterValue(filters.tvCategory)
      );
      if (filters.tvCategory && !matchesTvCategory) return false;

      const screenSizeCandidates = [
        getSpecificationValue(p, 'screenSize'),
        getSpecificationValue(p, 'Screen Size'),
        p.screenSize,
        p.specifications?.screenSize,
        p.specifications?.['Screen Size'],
      ].filter((value) => value !== undefined && value !== null && String(value).trim() !== '');
      const matchesScreenSize = !filters.screenSize || screenSizeCandidates.some(
        (value) => normalizeFilterValue(value) === normalizeFilterValue(filters.screenSize)
      );
      if (filters.screenSize && !matchesScreenSize) return false;

      const displayTypeCandidates = [
        getSpecificationValue(p, 'displayType'),
        getSpecificationValue(p, 'Display Type'),
        p.displayType,
        p.specifications?.displayType,
        p.specifications?.['Display Type'],
      ].filter((value) => value !== undefined && value !== null && String(value).trim() !== '');
      const matchesDisplayType = !filters.displayType || displayTypeCandidates.some(
        (value) => normalizeFilterValue(value) === normalizeFilterValue(filters.displayType)
      );
      if (filters.displayType && !matchesDisplayType) return false;

      const operatingSystemCandidates = [
        getSpecificationValue(p, 'operatingSystem'),
        getSpecificationValue(p, 'Operating System'),
        getSpecificationValue(p, 'os'),
        getSpecificationValue(p, 'OS'),
        p.operatingSystem,
        p.os,
        p.specifications?.operatingSystem,
        p.specifications?.['Operating System'],
        p.specifications?.os,
        p.specifications?.OS,
      ].filter((value) => value !== undefined && value !== null && String(value).trim() !== '');
      const matchesOperatingSystem = !filters.os || operatingSystemCandidates.some(
        (value) => normalizeFilterValue(value) === normalizeFilterValue(filters.os)
      );
      if (filters.os && !matchesOperatingSystem) return false;

      // Washing Machines
      const selectedType = filters.type;
      const typeCandidates = [
        getSpecificationValue(p, 'type'),
        getSpecificationValue(p, 'Type'),
        p.type,
        p.specifications?.type,
        p.specifications?.Type,
      ].filter((value) => value !== undefined && value !== null && value !== '');
      const matchesType = !selectedType || typeCandidates.some((value) => normalizeValue(value) === normalizeValue(selectedType));
      if (selectedType && !matchesType) return false;

      const selectedLoadingType = filters.loadingType;
      const loadingTypeCandidates = [
        getSpecificationValue(p, 'loadingType'),
        getSpecificationValue(p, 'Loading Type'),
        p.loadingType,
        p.specifications?.loadingType,
        p.specifications?.['Loading Type'],
      ].filter((value) => value !== undefined && value !== null && value !== '');
      const matchesLoadingType = !selectedLoadingType || loadingTypeCandidates.some((value) => normalizeValue(value) === normalizeValue(selectedLoadingType));
      if (selectedLoadingType && !matchesLoadingType) return false;

      const selectedWashingCapacity = filters.capacity;
      const washingCapacityCandidates = [
        getSpecificationValue(p, 'capacity'),
        getSpecificationValue(p, 'Capacity'),
        getSpecificationValue(p, 'loadCapacity'),
        getSpecificationValue(p, 'load capacity'),
        p.capacity,
        p.loadCapacity,
        p.specifications?.capacity,
        p.specifications?.Capacity,
        p.specifications?.loadCapacity,
        p.specifications?.['load capacity'],
      ].filter((value) => value !== undefined && value !== null && value !== '');
      const matchesWashingCapacity = !selectedWashingCapacity || washingCapacityCandidates.some((value) => normalizeValue(value) === normalizeValue(selectedWashingCapacity));
      if (selectedWashingCapacity && !matchesWashingCapacity) return false;

      const selectedWashingColor = filters.color;
      const washingColorCandidates = [
        getSpecificationValue(p, 'color'),
        getSpecificationValue(p, 'Color'),
        p.color,
        p.specifications?.color,
        p.specifications?.Color,
      ].filter((value) => value !== undefined && value !== null && value !== '');
      const matchesWashingColor = !selectedWashingColor || washingColorCandidates.some((value) => normalizeValue(value) === normalizeValue(selectedWashingColor));
      if (selectedWashingColor && !matchesWashingColor) return false;

      // Buffle
      if (filters.subType && specs.subType?.toLowerCase() !== filters.subType.toLowerCase()) return false;

      // Water Motors
      if (filters.motorType && specs.motorType?.toLowerCase() !== filters.motorType.toLowerCase()) return false;

      // Gas Cookers
      if (filters.cookerType && specs.cookerType?.toLowerCase() !== filters.cookerType.toLowerCase()) return false;

      // Furniture
      if (filters.subCategory && specs.subCategory?.toLowerCase() !== filters.subCategory.toLowerCase()) return false;

      // Cleaners
      if (filters.cleanerType && specs.cleanerType?.toLowerCase() !== filters.cleanerType.toLowerCase()) return false;

      // Blenders
      if (filters.wattageCategory && specs.wattageCategory?.toLowerCase() !== filters.wattageCategory.toLowerCase()) return false;

      // Accessory Items
      if (filters.itemType && specs.itemType?.toLowerCase() !== filters.itemType.toLowerCase()) return false;

      return true;
    });
  }, [products, activeCategory, filters]);

  const displayedProducts = useMemo(() => {
    const getPrice = (product) => Number(product.prices?.cash ?? product.price ?? 0);
    return [...filteredProducts].sort((first, second) => {
      if (sortBy === 'price-low') return getPrice(first) - getPrice(second);
      if (sortBy === 'price-high') return getPrice(second) - getPrice(first);
      if (sortBy === 'name') return String(first.name || '').localeCompare(String(second.name || ''));
      return 0;
    });
  }, [filteredProducts, sortBy]);

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      brand: '',
      inStockOnly: false,
      maxPrice: '',
      technology: '',
      doorType: '',
      capacity: '',
      color: '',
      tvCategory: '',
      screenSize: '',
      displayType: '',
      os: '',
      type: '',
      loadingType: '',
      subType: '',
      motorType: '',
      cookerType: '',
      subCategory: '',
      cleanerType: '',
      wattageCategory: '',
      itemType: '',
    });
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!selectedProductToDelete) return;
    setIsDeleting(true);
    try {
      if (!isUsingFallback) {
        await deleteProduct(selectedProductToDelete._id || selectedProductToDelete.id);
        await fetchProducts();
      } else {
        setProducts((prev) =>
          prev.filter(
            (item) => (item._id || item.id) !== (selectedProductToDelete._id || selectedProductToDelete.id)
          )
        );
      }
      setSelectedProductToDelete(null);
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    handleResetFilters();
  };

  const filterProps = {
    activeCategory,
    filters,
    onFilterChange: setFilters,
    onResetFilters: handleResetFilters,
    onSelectCategory: handleCategorySelect,
    categories: CATEGORIES,
    categoryCounts,
    products,
    availableBrands,
  };

  const isAcCategory = activeCategory === 'AC' || activeCategory === 'Air Conditioners';

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Connection Notice / Warning */}
        {error && (
          <div className="mb-4 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchProducts}
              className="min-h-[44px] flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl font-bold text-amber-900 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry API
            </button>
          </div>
        )}

        {/* Header: Title, Search, Sorting & Admin Controls */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeCategory}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> of <span className="font-bold text-slate-800">{products.length}</span> products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-0 sm:w-64">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search products..."
                value={filters.searchQuery || ''}
                onChange={(event) =>
                  setFilters((previous) => ({ ...previous, searchQuery: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 bg-white min-h-[44px] pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white min-h-[44px] px-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Sort products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Admin View Mode Switcher */}
            {isAdmin && (
              <div className="flex items-center rounded-2xl border border-slate-300 bg-white p-1 min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 min-h-[36px] rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-cyan-500 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 min-h-[36px] rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'table'
                      ? 'bg-cyan-500 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Data Table View"
                >
                  <TableIcon className="w-4 h-4" />
                  Table
                </button>
              </div>
            )}

            {/* Admin Create Button */}
            {isAdmin && (
              <Link
                to="/products/new"
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-5 text-sm font-bold text-cyan-400 shadow-md transition-all hover:bg-slate-800"
              >
                <Plus className="h-5 w-5 text-cyan-400" />
                + Create Product
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sticky Left Sidebar Filter */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <ProductFilters {...filterProps} />
          </aside>

          {/* Main Product Display (Grid or Admin Table) */}
          <main className="min-w-0 flex-1 space-y-6">
            {/* Conditional AC Sizing & Electricity Calculator Component */}
            {isAcCategory && <ACCalculator />}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-slate-500">Fetching catalog products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
                <p className="text-xs text-slate-500 mb-6">
                  No product matches the selected filter parameters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="min-h-[44px] px-6 bg-slate-100 hover:bg-slate-200 text-cyan-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : isAdmin && viewMode === 'table' ? (
              /* Admin Responsive Data Table View */
              <AdminProductTable
                products={displayedProducts}
                onDeleteClick={(p) => setSelectedProductToDelete(p)}
              />
            ) : (
              /* Multi-Column Responsive Grid View (1 to 2 col mobile, 3 md, 4 lg, 5 xl) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onDeleteClick={(p) => setSelectedProductToDelete(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating / Sticky "Filters & Sort" Action Bar at Bottom Viewport for Mobile (< 1024px) */}
      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden pointer-events-none">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="pointer-events-auto w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-slate-950/95 backdrop-blur-md text-cyan-400 font-black text-sm shadow-xl border border-slate-800 hover:bg-slate-900 transition-all active:scale-[0.98]"
        >
          <SlidersHorizontal className="h-5 w-5 text-cyan-400" />
          <span>Filters & Sort</span>
          <span className="ml-1 bg-cyan-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-extrabold">
            {filteredProducts.length}
          </span>
        </button>
      </div>

      {/* Full-Screen / Bottom-Sheet Drawer Modal for Mobile Filters */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters modal"
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative z-10 w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
            {/* Drawer Drag Bar Handle */}
            <div className="py-2.5 flex justify-center bg-slate-100 border-b border-slate-200">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto">
              <ProductFilters
                {...filterProps}
                onClose={() => setIsMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(selectedProductToDelete)}
        product={selectedProductToDelete}
        onClose={() => setSelectedProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProductListPage;
