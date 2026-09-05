import api from '../../services/api';

const unwrapProductList = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.products,
    payload?.data?.products,
    payload?.data,
    payload?.data?.data,
    payload?.items,
    payload?.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

export const getProducts = async (params = {}) => {
  const response = await api.get('/api/products', {
    params: Object.keys(params || {}).length ? params : undefined,
  });

  return unwrapProductList(response.data);
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  const payload = response.data;

  // The API returns { success: true, data: product }, while older endpoints
  // may return { product } or the product itself. Callers should always get
  // the actual product object rather than an API envelope.
  return payload?.data ?? payload?.product ?? payload;
};

export const createProduct = async (productData) => {
  const response = await api.post('/api/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/api/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};
