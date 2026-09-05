import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductListPage from '../features/products/pages/ProductListPage';
import ProductDetailsPage from '../features/products/pages/ProductDetailsPage';
import ProductFormPage from '../features/products/pages/ProductFormPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/new" element={<ProductFormPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/products/:id/edit" element={<ProductFormPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
