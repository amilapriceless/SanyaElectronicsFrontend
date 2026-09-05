import React, { useMemo, useState } from 'react';
import { ChevronDown, RotateCcw, X, Check } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between text-left text-xs font-extrabold uppercase tracking-wider text-slate-700 min-h-[44px]"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="mt-2 space-y-2">{children}</div>}
    </section>
  );
};

const ProductFilters = ({
  activeCategory,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCategory,
  categories = [],
  categoryCounts = {},
  products = [],
  availableBrands = [],
  onClose,
}) => {
  const handleFilterChange = (field, value) => onFilterChange({ ...filters, [field]: value });

  const getSpecificationValue = (product, key) => {
    const specKeyNormalizer = (value) => String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const specs = product?.specifications || {};
    if (specs[key] !== undefined && specs[key] !== null) return specs[key];

    const matchingSpec = Object.entries(specs).find(([specKey]) =>
      specKeyNormalizer(specKey) === specKeyNormalizer(key)
    );

    return matchingSpec ? matchingSpec[1] : undefined;
  };

  const activeProducts = useMemo(
    () =>
      activeCategory === 'All Products' || activeCategory === 'All'
        ? products
        : products.filter((product) => product.category === activeCategory),
    [products, activeCategory]
  );

  const getUniqueValues = (fieldName) =>
    [
      ...new Set(
        activeProducts.flatMap((product) =>
          [product?.[fieldName], getSpecificationValue(product, fieldName)].filter(Boolean).map(String)
        )
      ),
    ].sort((a, b) => a.localeCompare(b));

  const getCandidateValues = (product, keys) => [
    ...new Set(
      keys.flatMap((key) => {
        const value = product?.[key] ?? getSpecificationValue(product, key);
        return value !== undefined && value !== null && value !== '' ? [String(value).trim()] : [];
      })
    ),
  ];

  const brandOptions = useMemo(
    () =>
      (availableBrands.length
        ? availableBrands
        : [...new Set(activeProducts.map((product) => product.brand).filter(Boolean))]
      ).sort((a, b) => a.localeCompare(b)),
    [activeProducts, availableBrands]
  );

  const brandCounts = useMemo(
    () =>
      activeProducts.reduce(
        (counts, product) => ({
          ...counts,
          ...(product.brand ? { [product.brand]: (counts[product.brand] || 0) + 1 } : {}),
        }),
        {}
      ),
    [activeProducts]
  );

  const selectedBrands = Array.isArray(filters.brand) ? filters.brand : filters.brand ? [filters.brand] : [];

  const technologyOptions =
    activeCategory === 'Washing Machines'
      ? ['Fully Automatic', 'Semi Automatic']
      : activeCategory === 'Refrigerators'
      ? ['Inverter', 'Non-Inverter']
      : getUniqueValues('technology');

  const tvCategoryOptions = useMemo(
    () =>
      [
        ...new Set(
          activeProducts.flatMap((product) =>
            getCandidateValues(product, ['technology', 'Technology', 'tvCategory', 'TV Category'])
          )
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [activeProducts]
  );

  const refrigeratorDoorOptions = ['Single Door', 'Double Door', 'Side by Side'];

  const washingMachineTypeOptions = useMemo(
    () => [...new Set(activeProducts.flatMap((product) => getCandidateValues(product, ['type', 'Type'])))].sort((a, b) => a.localeCompare(b)),
    [activeProducts]
  );

  const washingMachineLoadingTypeOptions = useMemo(
    () => [...new Set(activeProducts.flatMap((product) => getCandidateValues(product, ['loadingType', 'Loading Type'])))].sort((a, b) => a.localeCompare(b)),
    [activeProducts]
  );

  const washingMachineCapacityOptions = useMemo(
    () =>
      [
        ...new Set(
          activeProducts
            .flatMap((product) => getCandidateValues(product, ['loadCapacity', 'load capacity', 'capacity', 'Capacity']))
            .map((value) => String(value).trim().replace(/[^0-9.]/g, ''))
            .filter(Boolean)
        ),
      ].sort((a, b) => Number(a) - Number(b)),
    [activeProducts]
  );

  const washingMachineColorOptions = useMemo(
    () => [...new Set(activeProducts.flatMap((product) => getCandidateValues(product, ['color', 'Color'])))].sort((a, b) => a.localeCompare(b)),
    [activeProducts]
  );

  const availableColors = useMemo(() => {
    const normalizedValue = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');
    const categoryItems =
      activeCategory === 'All Products' || activeCategory === 'All'
        ? products
        : products.filter((product) => product.category === activeCategory);

    const uniqueColors = new Map();
    categoryItems.forEach((product) => {
      const colorValue = getSpecificationValue(product, 'color');
      if (!colorValue) return;

      const normalizedColor = normalizedValue(colorValue).toLowerCase();
      if (!normalizedColor || uniqueColors.has(normalizedColor)) return;

      uniqueColors.set(normalizedColor, normalizedValue(colorValue));
    });

    return [...uniqueColors.values()].sort((a, b) => a.localeCompare(b));
  }, [products, activeCategory]);

  const availableCapacities = useMemo(() => {
    const categoryItems =
      activeCategory === 'All Products' || activeCategory === 'All'
        ? products
        : products.filter((product) => product.category === activeCategory);

    const capacities = categoryItems
      .map((product) => getSpecificationValue(product, 'capacity'))
      .filter(Boolean)
      .map((capacity) => String(capacity).trim().replace(/[^0-9.]/g, ''))
      .filter(Boolean);

    return [...new Set(capacities)].sort((a, b) => Number(a) - Number(b));
  }, [products, activeCategory]);

  const renderSelect = (label, fieldName, options, emptyLabel) => (
    <div key={fieldName} className="space-y-1">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
      <select
        value={filters[fieldName] || ''}
        onChange={(event) => handleFilterChange(fieldName, event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 min-h-[44px] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const renderRadioOptions = (fieldName, options, clearLabel, formatLabel = (value) => value) => (
    <div className="space-y-1.5" key={fieldName}>
      {options.map((option) => {
        const normalizedOption = String(option).trim();
        const isChecked = String(filters[fieldName] ?? '').trim() === normalizedOption;
        return (
          <label
            key={normalizedOption}
            className="flex cursor-pointer items-center justify-between min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name={fieldName}
                checked={isChecked}
                onChange={() => handleFilterChange(fieldName, normalizedOption)}
                className="h-5 w-5 border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm font-semibold text-slate-800">{formatLabel(normalizedOption)}</span>
            </div>
          </label>
        );
      })}
      {filters[fieldName] && (
        <button
          type="button"
          onClick={() => handleFilterChange(fieldName, '')}
          className="pt-1 text-xs font-bold text-cyan-700 hover:text-cyan-900 min-h-[44px] flex items-center"
        >
          Clear {clearLabel}
        </button>
      )}
    </div>
  );

  const renderDynamicFilters = () => {
    switch (activeCategory) {
      case 'Refrigerators':
        return (
          <>
            <FilterSection title="Door Type">{renderRadioOptions('doorType', refrigeratorDoorOptions, 'door type')}</FilterSection>
            {availableCapacities.length > 0 && (
              <FilterSection title="Capacity (L)">
                {renderRadioOptions('capacity', availableCapacities, 'capacity', (value) => `${String(value).trim()} L`)}
              </FilterSection>
            )}
            {availableColors.length > 0 && (
              <FilterSection title="Color">{renderRadioOptions('color', availableColors, 'color')}</FilterSection>
            )}
          </>
        );
      case 'Televisions':
        return (
          <>
            {renderSelect('TV Category', 'tvCategory', tvCategoryOptions, 'All TV Categories')}
            {renderSelect('Screen Size', 'screenSize', getUniqueValues('screenSize'), 'All Screen Sizes')}
            {renderSelect('Display Type', 'displayType', getUniqueValues('displayType'), 'All Display Types')}
            {renderSelect('Operating System', 'os', getUniqueValues('operatingSystem'), 'All OS')}
          </>
        );
      case 'Washing Machines':
        return (
          <>
            {renderSelect('Type', 'type', washingMachineTypeOptions, 'All Types')}
            {renderSelect('Loading Type', 'loadingType', washingMachineLoadingTypeOptions, 'All Loading Types')}
            {renderSelect('Capacity', 'capacity', washingMachineCapacityOptions, 'All Capacities')}
            {renderSelect('Color', 'color', washingMachineColorOptions, 'All Colors')}
          </>
        );
      case 'Buffle':
        return renderSelect('Sub-type', 'subType', getUniqueValues('subType'), 'All Sub-types');
      case 'Water Motors':
        return renderSelect('Motor Type', 'motorType', getUniqueValues('motorType'), 'All Motor Types');
      case 'Gas Cookers':
        return renderSelect('Cooker Type', 'cookerType', getUniqueValues('cookerType'), 'All Types');
      case 'Furniture Items':
        return renderSelect('Sub-category', 'subCategory', getUniqueValues('subCategory'), 'All Sub-categories');
      case 'Cleaners':
        return renderSelect('Cleaner Type', 'cleanerType', getUniqueValues('cleanerType'), 'All Cleaner Types');
      case 'Blenders':
        return renderSelect('Wattage Category', 'wattageCategory', getUniqueValues('wattageCategory'), 'All Wattages');
      case 'Accessory Items':
        return renderSelect('Item Type', 'itemType', getUniqueValues('itemType'), 'All Item Types');
      default:
        return null;
    }
  };

  const dynamicFilters = renderDynamicFilters();
  const toggleBrand = (brand) =>
    handleFilterChange(
      'brand',
      selectedBrands.includes(brand) ? selectedBrands.filter((item) => item !== brand) : [...selectedBrands, brand]
    );

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Filter Products</h2>
          <p className="text-xs text-slate-500">Refine catalog search parameters</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/60"
            aria-label="Close filters drawer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <button
          type="button"
          onClick={onResetFilters}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 min-h-[44px] text-xs font-bold text-slate-700 transition-colors hover:bg-cyan-50 hover:text-cyan-800"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All Filters
        </button>

        {/* Categories Section */}
        <FilterSection title="Categories">
          <div className="space-y-1.5">
            {categories.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center justify-between min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory === category}
                    onChange={() => onSelectCategory(category)}
                    className="h-5 w-5 border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm font-semibold text-slate-800">{category}</span>
                </span>
                <span className="rounded-full bg-slate-200/60 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {categoryCounts[category] || 0}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brands Section */}
        <FilterSection title="Brands">
          <div className="space-y-1.5">
            {brandOptions.length ? (
              brandOptions.map((brand) => (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center justify-between min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-semibold text-slate-800">{brand}</span>
                  </span>
                  <span className="rounded-full bg-slate-200/60 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    {brandCounts[brand] || 0}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-xs text-slate-400 p-2">No brands available.</p>
            )}
          </div>
        </FilterSection>

        {/* Technology / Variations Section */}
        {technologyOptions.length > 0 && (
          <FilterSection title="Technology / Variation">
            <div className="space-y-1.5">
              {technologyOptions.map((technology) => (
                <label
                  key={technology}
                  className="flex cursor-pointer items-center justify-between min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="technology"
                      checked={filters.technology === technology}
                      onChange={() => handleFilterChange('technology', technology)}
                      className="h-5 w-5 border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-semibold text-slate-800">{technology}</span>
                  </span>
                </label>
              ))}
              {filters.technology && (
                <button
                  type="button"
                  onClick={() => handleFilterChange('technology', '')}
                  className="pt-1 text-xs font-bold text-cyan-700 hover:text-cyan-900 min-h-[44px] flex items-center"
                >
                  Clear technology
                </button>
              )}
            </div>
          </FilterSection>
        )}

        {/* Price & Availability Section */}
        <FilterSection title="Price & Availability">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition-colors">
              <span className="text-sm font-semibold text-slate-800">In Stock Only</span>
              <input
                type="checkbox"
                checked={Boolean(filters.inStockOnly)}
                onChange={(event) => handleFilterChange('inStockOnly', event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
            </label>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Maximum Price (LKR)
              </label>
              <input
                type="number"
                min="0"
                placeholder="No maximum limit"
                value={filters.maxPrice || ''}
                onChange={(event) => handleFilterChange('maxPrice', event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </FilterSection>

        {/* Dynamic Specifications Filters */}
        {activeCategory === 'Refrigerators' ? (
          dynamicFilters
        ) : (
          dynamicFilters && <FilterSection title="Category Parameters">{dynamicFilters}</FilterSection>
        )}
      </div>

      {/* Sticky Bottom Actions Bar for Mobile Drawer */}
      {onClose && (
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-2 min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black text-sm shadow-md hover:from-cyan-400 hover:to-cyan-500"
          >
            <Check className="w-5 h-5" />
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
