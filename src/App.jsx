import React, { useState } from 'react';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AppRoutes from './routes/AppRoutes';
import AdminPasscodeModal from './features/products/components/AdminPasscodeModal';
import { ShieldAlert, ShieldCheck, LogOut, Store, Home, Menu, X } from 'lucide-react';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVdZuPse8heT6_uklpyF6Jczs_Kl9-wM-k82b9-FKvg&s=10';

const NavigationHeader = () => {
  const { isAdmin, openAdminModal, logout } = useAdmin();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className="bg-slate-950 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-3 group min-h-[44px]">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 shadow-sm border border-cyan-500/30 group-hover:scale-105 transition-transform">
              <img
                src={LOGO_URL}
                alt="Sanya Electronics Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Sanya <span className="text-cyan-400 font-extrabold">Electronics</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-medium -mt-1">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <Link
              to="/"
              className={`flex items-center gap-2 py-2 min-h-[44px] transition-colors relative ${
                isActivePath('/')
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400 after:rounded-full'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/products"
              className={`flex items-center gap-2 py-2 min-h-[44px] transition-colors relative ${
                isActivePath('/products')
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400 after:rounded-full'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              Products Store
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-full font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Active
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="min-h-[44px] px-3.5 flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                  title="Exit Admin Mode"
                >
                  <LogOut className="w-4 h-4" />
                  Exit Admin
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAdminModal}
                className="min-h-[44px] px-4 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-md transition-all cursor-pointer text-xs"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 min-h-[44px] rounded-xl text-sm font-bold transition-colors ${
                isActivePath('/') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 min-h-[44px] rounded-xl text-sm font-bold transition-colors ${
                isActivePath('/products') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Store className="w-4 h-4" />
              Products Store
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <AdminProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
          <NavigationHeader />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <AdminPasscodeModal />

          {/* Footer */}
          <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img
                  src={LOGO_URL}
                  alt="Sanya Electronics Logo"
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <p className="text-white font-bold text-sm">Sanya Electronics</p>
                  <p className="text-[11px] text-slate-400">
                    &copy; {new Date().getFullYear()} Sanya Electronics Store. All rights reserved.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium text-slate-400">
                <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-cyan-400">
                  Tech Navy & Electric Cyan Theme
                </span>
                <span>•</span>
                <span>Vite + React 18</span>
                <span>•</span>
                <span>Backend Port 5000</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
