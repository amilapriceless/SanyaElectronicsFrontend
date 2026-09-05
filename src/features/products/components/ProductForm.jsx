import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ImageIcon,
  Shield,
  Sliders,
  DollarSign,
  Package,
  Layers,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES } from './ProductTabs';

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

const ProductForm = ({ initialData = null, onSubmit, isSubmitting = false, apiError = null }) => {
  const navigate = useNavigate();

  // Active Mobile Section Accordion Tab ('basic', 'pricing', 'images', 'warranty', 'specs')
  const [activeTab, setActiveTab] = useState('basic');

  // Fixed fields state
  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    brand: '',
    category: '',
    doorType: '',
    capacity: '',
    capacityUnit: 'L',
    color: '',
    refrigeratorType: '',
    coolingSystem: '',
    refrigerant: 'R600a',
    type: '',
    loadCapacity: '',
    loadCapacityUnit: 'kg',
    loadingType: '',
    spinSpeed: '',
    spinSpeedUnit: 'rpm',
    dimension: '',
    dimensionUnit: 'mm',
    weight: '',
    weightUnit: 'kg',
    description: '',
    powerConsumption: '',
    powerConsumptionUnit: 'W',
    technology: '',
    screenSize: '',
    resolutionStandard: '',
    displayType: '',
    refreshRate: '',
    operatingSystem: '',
    pictureProcessingEngine: '',
    prices: {
      cash: '',
      hire: '',
      discount: '',
    },
    stock: 0,
  });

  // Array of image URL strings
  const [images, setImages] = useState([]);

  // Warranty items
  const [warranties, setWarranties] = useState([
    { coverage: 'Compressor', unit: 'years', period: 1 },
  ]);

  const [specRows, setSpecRows] = useState([]);

  // Inline field-level validation errors state
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  const syncCategorySpecRows = (nextFormData = formData) => {
    const specDefinitions = [];

    setSpecRows((prev) => {
      const normalizeSpecKey = (value) => String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const existingMap = new Map(prev.map((row) => [normalizeSpecKey(row.key), row]));
      const filteredRows = prev.filter(
        (row) => !specDefinitions.some((definition) => normalizeSpecKey(definition.key) === normalizeSpecKey(row.key))
      );

      const rows = [...filteredRows];
      specDefinitions.forEach((definition) => {
        const currentValue = nextFormData?.[definition.valueKey] ?? '';
        const existingRow = existingMap.get(normalizeSpecKey(definition.key));
        rows.push({
          id: existingRow?.id ?? Date.now() + Math.random(),
          key: definition.key,
          value: existingRow?.value ?? String(currentValue ?? ''),
        });
      });

      return rows;
    });
  };

  useEffect(() => {
    if (apiError?.fieldErrors && Object.keys(apiError.fieldErrors).length) {
      setFieldErrors(apiError.fieldErrors);
    }
  }, [apiError]);

  useEffect(() => {
    const controls = [...(formRef.current?.querySelectorAll('[data-field-path]') || [])];
    const invalidField = Object.keys(fieldErrors).find((field) =>
      controls.some((control) => control.dataset.fieldPath === field)
    );
    if (!invalidField) return;
    const element = controls.find((control) => control.dataset.fieldPath === invalidField);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element?.focus({ preventScroll: true });
  }, [fieldErrors]);

  const fieldLabel = (field) => {
    const labels = {
      productCode: 'Product Code',
      name: 'Product Name',
      brand: 'Brand',
      category: 'Category',
      description: 'Description',
      technology: 'Technology',
      powerConsumption: 'Power Consumption',
      powerConsumptionUnit: 'Power Consumption Unit',
      stock: 'Stock Quantity',
      'prices.cash': 'Cash Price',
      'prices.hire': 'Hire Purchase Price',
      'prices.discount': 'Discount Price',
    };
    if (labels[field]) return labels[field];
    if (field.startsWith('specifications.')) return `Specification: ${field.slice('specifications.'.length)}`;
    if (field.startsWith('images.')) return `Image ${Number(field.split('.')[1]) + 1}`;
    if (field.startsWith('warranty.')) {
      const [, index, property] = field.split('.');
      return `Warranty ${Number(index) + 1}${property ? ` ${property.replace(/^./, (letter) => letter.toUpperCase())}` : ''}`;
    }
    return field.replace(/([A-Z])/g, ' $1').replace(/[._]/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
  };

  // Initialize form with initialData if editing
  useEffect(() => {
    if (initialData) {
      const nextFormData = {
        productCode: initialData.productCode || '',
        name: initialData.name || '',
        brand: initialData.brand || '',
        category: initialData.category || '',
        doorType: initialData.specifications?.doorType || initialData.doorType || '',
        capacity: initialData.capacity ?? initialData.specifications?.Capacity ?? initialData.specifications?.capacity ?? '',
        capacityUnit: initialData.capacityUnit || 'L',
        color: initialData.color ?? initialData.specifications?.Color ?? initialData.specifications?.color ?? '',
        refrigeratorType: initialData.refrigeratorType ?? initialData.specifications?.['refrigerator Type'] ?? initialData.specifications?.['Refrigerator Type'] ?? '',
        coolingSystem: initialData.coolingSystem ?? initialData.specifications?.['cooling System'] ?? initialData.specifications?.['Cooling System'] ?? '',
        refrigerant: initialData.refrigerant ?? initialData.specifications?.refrigerant ?? 'R600a',
        type: initialData.type ?? initialData.specifications?.type ?? initialData.specifications?.Type ?? '',
        loadCapacity: initialData.loadCapacity ?? initialData.specifications?.['load capacity'] ?? initialData.specifications?.['Load Capacity'] ?? initialData.specifications?.loadCapacity ?? '',
        loadCapacityUnit: initialData.loadCapacityUnit || 'kg',
        loadingType: initialData.loadingType ?? initialData.specifications?.['Loading Type'] ?? initialData.specifications?.loadingType ?? '',
        spinSpeed: initialData.spinSpeed ?? initialData.specifications?.['spin speed'] ?? initialData.specifications?.['Spin Speed'] ?? initialData.specifications?.spinSpeed ?? '',
        spinSpeedUnit: initialData.spinSpeedUnit || 'rpm',
        dimension: initialData.dimension ?? initialData.specifications?.dimension ?? initialData.specifications?.Dimension ?? '',
        dimensionUnit: initialData.dimensionUnit || 'mm',
        weight: initialData.weight ?? initialData.specifications?.weight ?? '',
        weightUnit: initialData.weightUnit || 'kg',
        description: initialData.description || '',
        powerConsumption: initialData.powerConsumption ?? '',
        powerConsumptionUnit: initialData.powerConsumptionUnit || 'W',
        technology: initialData.technology || '',
        screenSize: initialData.screenSize ?? initialData.specifications?.screenSize ?? '',
        resolutionStandard: initialData.resolutionStandard ?? initialData.specifications?.['Resolution Standard'] ?? initialData.specifications?.resolutionStandard ?? '',
        displayType: initialData.displayType ?? initialData.specifications?.['Display Type'] ?? initialData.specifications?.displayType ?? '',
        refreshRate: initialData.refreshRate ?? initialData.specifications?.['Refresh Rate'] ?? initialData.specifications?.refreshRate ?? '',
        operatingSystem: initialData.operatingSystem ?? initialData.specifications?.['Operating System'] ?? initialData.specifications?.operatingSystem ?? '',
        pictureProcessingEngine: initialData.pictureProcessingEngine ?? initialData.specifications?.['Picture Processing Engine'] ?? initialData.specifications?.pictureProcessingEngine ?? '',
        prices: {
          cash: initialData.prices?.cash ?? initialData.price ?? '',
          hire: initialData.prices?.hire ?? '',
          discount: initialData.prices?.discount ?? '',
        },
        stock: initialData.stock ?? 0,
      };

      setFormData(nextFormData);

      if (Array.isArray(initialData.images) && initialData.images.length > 0) {
        setImages(initialData.images);
      } else {
        setImages([]);
      }

      if (Array.isArray(initialData.warranty) && initialData.warranty.length > 0) {
        setWarranties(
          initialData.warranty.map((warranty) => ({
            coverage: String(warranty.coverage ?? warranty.type ?? ''),
            unit: String(warranty.unit ?? 'years'),
            period: Number.isFinite(Number(warranty.period)) ? Number(warranty.period) : 0,
          }))
        );
      } else {
        setWarranties([{ coverage: 'Compressor', unit: 'years', period: 1 }]);
      }

      if (initialData.specifications && typeof initialData.specifications === 'object') {
        const rows = Object.entries(initialData.specifications).map(([key, value], idx) => ({
          id: Date.now() + idx,
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        }));
        if (rows.length > 0) {
          setSpecRows(rows);
          return;
        }
      }

      if (nextFormData.category === 'Refrigerators' || nextFormData.category === 'Washing Machines') {
        syncCategorySpecRows(nextFormData);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.category === 'Refrigerators' || formData.category === 'Washing Machines') {
      syncCategorySpecRows(formData);
    } else {
      setSpecRows([]);
    }
  }, [formData]);

  const technologyOptions =
    formData.category === 'Washing Machines'
      ? ['Fully Automatic', 'Semi Automatic']
      : formData.category === 'Televisions'
      ? ['LED', 'Smart LED']
      : ['Inverter', 'Non-Inverter'];

  const isSmartLedTv = formData.category === 'Televisions' && formData.technology === 'Smart LED';

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (name.startsWith('prices.')) {
      const priceField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        prices: {
          ...prev.prices,
          [priceField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (index, value) => {
    setFieldErrors((previous) => {
      const updated = { ...previous };
      delete updated[`images.${index}`];
      return updated;
    });
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

  const handleWarrantyChange = (index, field, value) => {
    setFieldErrors((previous) => {
      const updated = { ...previous };
      delete updated[`warranty.${index}.${field}`];
      return updated;
    });
    const updated = [...warranties];
    updated[index] = { ...updated[index], [field]: value };
    setWarranties(updated);
  };

  const addWarrantyRow = () => setWarranties([...warranties, { coverage: '', unit: 'years', period: '' }]);
  const removeWarrantyRow = (index) => setWarranties(warranties.filter((_, i) => i !== index));

  const handleSpecChange = (id, field, value) => {
    const row = specRows.find((item) => item.id === id);
    setFieldErrors((previous) => {
      const updated = { ...previous };
      if (row?.key) delete updated[`specifications.${row.key}`];
      return updated;
    });
    setSpecRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addSpecRow = () => setSpecRows((prev) => [...prev, { id: Date.now(), key: '', value: '' }]);
  const removeSpecRow = (id) => setSpecRows((prev) => prev.filter((row) => row.id !== id));

  const validateForm = () => {
    const errors = {};
    if (!formData.productCode || !String(formData.productCode).trim()) errors.productCode = 'Product Code is required.';
    if (!formData.name || !String(formData.name).trim()) errors.name = 'Product Name is required.';
    if (!formData.brand || !String(formData.brand).trim()) errors.brand = 'Brand name is required.';
    if (!formData.category || !String(formData.category).trim()) errors.category = 'Category selection is required.';
    if (!formData.description || !String(formData.description).trim()) errors.description = 'Description is required.';
    if (!formData.technology || !String(formData.technology).trim()) errors.technology = 'Technology is required.';

    const cashPriceNum = Number(formData.prices?.cash);
    if (formData.prices?.cash === '' || formData.prices?.cash === null || formData.prices?.cash === undefined) {
      errors['prices.cash'] = 'Cash price is required.';
    } else if (isNaN(cashPriceNum) || cashPriceNum < 0) {
      errors['prices.cash'] = 'Cash price must be a valid positive number.';
    }

    if (formData.prices?.discount !== '' && formData.prices?.discount !== null && formData.prices?.discount !== undefined) {
      const discountPriceNum = Number(formData.prices.discount);
      if (isNaN(discountPriceNum) || discountPriceNum < 0) {
        errors['prices.discount'] = 'Discount price must be a valid non-negative number.';
      }
    }

    const stockNum = Number(formData.stock);
    if (formData.stock === '' || formData.stock === null || formData.stock === undefined) {
      errors.stock = 'Stock quantity is required.';
    } else if (isNaN(stockNum) || stockNum < 0) {
      errors.stock = 'Stock must be a non-negative integer.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const stringValue = (value, fallback = '') =>
      value === undefined || value === null ? fallback : String(value).trim();
    const numberValue = (value, fallback = 0) => {
      const number = Number(value);
      return Number.isFinite(number) ? number : fallback;
    };

    const specificationsObj = {};
    specRows.forEach((row) => {
      const key = stringValue(row.key);
      const value = stringValue(row.value);
      if (key && value) specificationsObj[key] = value;
    });

    const cleanedImages = images.filter((img) => typeof img === 'string' && img.trim() !== '').map((img) => img.trim());
    const cleanedWarranties = warranties
      .filter((w) => [w.coverage, w.unit, w.period].some((val) => stringValue(val) !== ''))
      .map((w) => ({
        coverage: stringValue(w.coverage),
        unit: stringValue(w.unit),
        period: numberValue(w.period),
      }));

    const cashPriceNumeric = numberValue(formData.prices.cash);
    const hirePriceNumeric = formData.prices.hire !== '' && formData.prices.hire !== null
      ? numberValue(formData.prices.hire)
      : cashPriceNumeric;
    const discountPriceNumeric = formData.prices.discount !== '' && formData.prices.discount !== null
      ? numberValue(formData.prices.discount)
      : undefined;

    const payload = {
      productCode: stringValue(formData.productCode),
      name: stringValue(formData.name),
      brand: stringValue(formData.brand),
      category: stringValue(formData.category),
      description: stringValue(formData.description),
      powerConsumption: formData.powerConsumption ? numberValue(formData.powerConsumption) : 0,
      powerConsumptionUnit: stringValue(formData.powerConsumptionUnit, 'W'),
      technology: stringValue(formData.technology),
      prices: {
        cash: cashPriceNumeric,
        hire: hirePriceNumeric,
        ...(discountPriceNumeric !== undefined ? { discount: discountPriceNumeric } : {}),
      },
      stock: numberValue(formData.stock),
      images: cleanedImages,
      warranty: cleanedWarranties,
      specifications: specificationsObj,
    };

    onSubmit(payload);
  };

  const errorFields = Object.keys(fieldErrors);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-12">
      {/* API Error Banner */}
      {(apiError || errorFields.length > 0) && (
        <div className="bg-rose-50 border-2 border-rose-200 text-rose-900 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-bold text-rose-900 mb-0.5">Form submission failed</h4>
            <p className="font-semibold text-rose-700">{apiError?.message || 'Please correct highlighted parameters.'}</p>
            {errorFields.length > 0 && (
              <p className="text-[11px] text-rose-600 mt-1">
                Errors in: <span className="font-bold">{errorFields.map(fieldLabel).join(', ')}</span>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Header Back Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-cyan-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </button>

        {/* Desktop Save Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="min-h-[44px] px-5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] flex items-center gap-2 px-6 text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* Mobile Step-by-Step Accordion / Section Navigation Bar */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'basic', label: '1. Basic Info', icon: Sliders },
          { id: 'pricing', label: '2. Pricing & Stock', icon: DollarSign },
          { id: 'images', label: '3. Media', icon: ImageIcon },
          { id: 'warranty', label: '4. Warranty', icon: Shield },
          { id: 'specs', label: '5. Specifications', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] flex items-center gap-2 px-3.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-slate-950 text-cyan-400 border border-slate-800 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Basic Product Details */}
      <div className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 ${activeTab === 'basic' ? 'block' : 'hidden md:block'}`}>
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-5 h-5 text-cyan-600" />
          Basic Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Product Code *
            </label>
            <input
              type="text"
              name="productCode"
              data-field-path="productCode"
              placeholder="e.g. REF-2024-LG"
              value={formData.productCode}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {fieldErrors.productCode && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.productCode}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              data-field-path="name"
              placeholder="e.g. LG Inverter Linear Double Door Refrigerator 335L"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {fieldErrors.name && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              data-field-path="brand"
              placeholder="e.g. LG, Samsung, Sony"
              value={formData.brand}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {fieldErrors.brand && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.brand}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              name="category"
              data-field-path="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.filter((c) => c !== 'All Products').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technology *
            </label>
            <select
              name="technology"
              data-field-path="technology"
              value={formData.technology}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Technology</option>
              {technologyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {fieldErrors.technology && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.technology}
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              data-field-path="description"
              placeholder="Enter comprehensive product features and specifications..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {fieldErrors.description && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Pricing & Stock */}
      <div className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 ${activeTab === 'pricing' ? 'block' : 'hidden md:block'}`}>
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Pricing & Inventory Stock
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cash Price (LKR) *
            </label>
            <input
              type="number"
              name="prices.cash"
              data-field-path="prices.cash"
              placeholder="e.g. 150000"
              value={formData.prices.cash}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-extrabold"
            />
            {fieldErrors['prices.cash'] && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors['prices.cash']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hire Purchase Price (LKR)
            </label>
            <input
              type="number"
              name="prices.hire"
              data-field-path="prices.hire"
              placeholder="e.g. 175000"
              value={formData.prices.hire}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-extrabold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Discount Price (LKR)
            </label>
            <input
              type="number"
              name="prices.discount"
              data-field-path="prices.discount"
              min="0"
              step="0.01"
              placeholder="Optional sale price"
              value={formData.prices.discount}
              onChange={handleChange}
              className={`w-full bg-amber-50 border rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-extrabold ${
                fieldErrors['prices.discount'] ? 'border-rose-500' : 'border-amber-200'
              }`}
            />
            {fieldErrors['prices.discount'] && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors['prices.discount']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Available Stock Units *
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              data-field-path="stock"
              placeholder="e.g. 10"
              value={formData.stock}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold"
            />
            {fieldErrors.stock && (
              <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.stock}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Product Media Gallery */}
      <div className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 ${activeTab === 'images' ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            Product Media Gallery
          </h2>
          <button
            type="button"
            onClick={addImageField}
            className="min-h-[44px] px-3.5 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-600" />
            Add Image URL
          </button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-xs text-slate-500 font-semibold mb-3">No product image URLs added yet.</p>
            <button
              type="button"
              onClick={addImageField}
              className="min-h-[44px] px-4 bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold rounded-xl hover:bg-cyan-100"
            >
              + Add First Image URL
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {images.map((url, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="https://example.com/product-image.jpg"
                  value={url}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                  aria-label="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: Warranty Coverage */}
      <div className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 ${activeTab === 'warranty' ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Warranty Protection Coverage
          </h2>
          <button
            type="button"
            onClick={addWarrantyRow}
            className="min-h-[44px] px-3.5 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            Add Warranty Row
          </button>
        </div>

        <div className="space-y-3">
          {warranties.map((w, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Coverage Type (e.g. Compressor Warranty)"
                  value={w.coverage}
                  onChange={(e) => handleWarrantyChange(idx, 'coverage', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="number"
                  placeholder="Period (e.g. 10)"
                  value={w.period}
                  onChange={(e) => handleWarrantyChange(idx, 'period', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Unit (e.g. years)"
                  value={w.unit}
                  onChange={(e) => handleWarrantyChange(idx, 'unit', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="sm:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => removeWarrantyRow(idx)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-rose-600 hover:bg-rose-100/60 rounded-xl"
                  aria-label="Remove warranty"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Dynamic Specifications */}
      <div className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 ${activeTab === 'specs' ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-600" />
            Dynamic Category Specifications
          </h2>
          <button
            type="button"
            onClick={addSpecRow}
            className="min-h-[44px] px-3.5 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-600" />
            Add Spec Field
          </button>
        </div>

        {specRows.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No custom specifications added for this product.</p>
        ) : (
          <div className="space-y-3">
            {specRows.map((row) => (
              <div key={row.id} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <input
                  type="text"
                  placeholder="Specification Key (e.g. Color)"
                  value={row.key}
                  onChange={(e) => handleSpecChange(row.id, 'key', e.target.value)}
                  className="w-full sm:w-1/2 bg-white border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Specification Value (e.g. Silver)"
                  value={row.value}
                  onChange={(e) => handleSpecChange(row.id, 'value', e.target.value)}
                  className="w-full sm:w-1/2 bg-white border border-slate-300 rounded-xl px-3.5 min-h-[44px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(row.id)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-rose-600 hover:bg-rose-100/60 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ACTION BAR FOR MOBILE ADMIN VIEWPORT */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-40 md:static md:p-0 md:bg-transparent md:border-0 md:shadow-none">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex-1 min-h-[48px] px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors md:hidden"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-2 min-h-[48px] flex items-center justify-center gap-2 px-6 text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 disabled:opacity-50 rounded-2xl shadow-lg transition-all cursor-pointer w-full md:w-auto"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Saving Payload...' : initialData ? 'Update Product Entry' : 'Save & Publish Product'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
