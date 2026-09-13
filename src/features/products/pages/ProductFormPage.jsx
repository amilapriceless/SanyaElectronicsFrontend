import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../product.api';
import ProductForm from '../components/ProductForm';

// Normalise the validation formats returned by Zod, Mongoose, and API wrappers
// into the dot-notation paths used by ProductForm data-field-path attributes.
const extractValidationErrors = (responseData) => {
  const fieldErrors = {};
  const add = (path, message) => {
    const field = Array.isArray(path) ? path.join('.') : String(path || '');
    if (field && message && !fieldErrors[field]) fieldErrors[field] = String(message);
  };
  const visit = (value, path = []) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item?.path && item?.message) add(item.path, item.message);
        else if (item?.field && item?.message) add(item.field, item.message);
        else visit(item, path);
      });
      return;
    }
    if (typeof value !== 'object') return;
    if (value.path && value.message) add(value.path, value.message);
    if (value.properties?.path && value.message) add(value.properties.path, value.message);
    if (value.message && path.length) add(path, value.message);
    Object.entries(value).forEach(([key, child]) => {
      if (['message', 'path', 'name', 'stack', 'status', 'statusCode'].includes(key)) return;
      if (typeof child === 'string') add([...path, key], child);
      else visit(child, [...path, key]);
    });
  };

  // `fields` is the current backend contract. The remaining keys support
  // common Zod, Mongoose, and API-wrapper response shapes.
  ['fields', 'fieldErrors', 'issues', 'errors', 'validationErrors', 'details', 'error'].forEach((key) => visit(responseData?.[key]));
  return fieldErrors;
};

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        setLoading(true);
        setError('');
        try {
          const data = await getProductById(id);
          setInitialData(data);
        } catch (err) {
          setError(`Could not fetch product details: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError('');
    setApiError(null);

    try {
      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/products');
    } catch (err) {
      setApiError({
        message: err.message || 'Server validation failed. Please check form parameters.',
        fieldErrors: extractValidationErrors(err.response?.data || err.data),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading form parameters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Product Entry' : 'Create New Product Entry'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isEditMode
              ? `Updating specification and pricing fields for product ID #${id}`
              : 'Add a new electronic appliance with dynamic category specifications'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          apiError={apiError}
        />
      </div>
    </div>
  );
};

export default ProductFormPage;
