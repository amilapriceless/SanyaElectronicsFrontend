import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductListPage from '../features/products/pages/ProductListPage';
import ProductDetailsPage from '../features/products/pages/ProductDetailsPage';
import ProductFormPage from '../features/products/pages/ProductFormPage';
import StatisticsPage from '../pages/StatisticsPage';
import ShowroomPage from '../pages/ShowroomPage';
import ShowroomComparePage from '../pages/ShowroomComparePage';
import ShowroomSalesTargetsPage from '../pages/ShowroomSalesTargetsPage';
import ShowroomArrearsPage from '../pages/ShowroomArrearsPage';
import ShowroomMonthlyTargetPage from '../pages/ShowroomMonthlyTargetPage';
import AdminRoleSelectionPage from '../pages/AdminRoleSelectionPage';
import ManagePasswordsPage from '../pages/ManagePasswordsPage';

const RequireAuth = ({ children }) => {
  const { isAdmin, isLoading } = useAdmin();
  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-slate-500">Checking secure session...</div>;
  return isAdmin ? children : <Navigate to="/" replace />;
};

const RequireSystemAdmin = ({ children }) => {
  const { isSystemAdmin, isLoading } = useAdmin();
  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-slate-500">Checking secure session...</div>;
  return isSystemAdmin ? children : <Navigate to="/products" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/new" element={<RequireSystemAdmin><ProductFormPage /></RequireSystemAdmin>} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/products/:id/edit" element={<RequireSystemAdmin><ProductFormPage /></RequireSystemAdmin>} />
      <Route path="/admin/roles" element={<AdminRoleSelectionPage />} />
      <Route path="/admin/passwords" element={<RequireSystemAdmin><ManagePasswordsPage /></RequireSystemAdmin>} />
      <Route path="/statistics" element={<RequireAuth><StatisticsPage /></RequireAuth>} />
      <Route path="/statistics/compare" element={<RequireAuth><ShowroomComparePage /></RequireAuth>} />
      <Route path="/statistics/showrooms/:showroomSlug/sales-targets" element={<RequireAuth><ShowroomSalesTargetsPage /></RequireAuth>} />
      <Route path="/statistics/showrooms/:showroomSlug/sales-targets/:month" element={<RequireAuth><ShowroomMonthlyTargetPage /></RequireAuth>} />
      <Route path="/statistics/showrooms/:showroomSlug/arrears" element={<RequireAuth><ShowroomArrearsPage /></RequireAuth>} />
      <Route path="/statistics/showrooms/:showroomSlug" element={<RequireAuth><ShowroomPage /></RequireAuth>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
