import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ShoppingBag } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-xs text-gray-500 mb-8">
          The requested route does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
