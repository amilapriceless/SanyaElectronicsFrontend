import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, ArrowRight, Tv, Refrigerator, WashingMachine } from 'lucide-react';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVdZuPse8heT6_uklpyF6Jczs_Kl9-wM-k82b9-FKvg&s=10';

const HomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-20 lg:py-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={LOGO_URL}
                alt="Sanya Electronics Logo"
                className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-cyan-400/30"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5" /> Sanya Electronics Premium Store
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
              Next-Gen Electronics <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                Engineered for Modern Homes
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              Discover smart inverter refrigerators, 4K UHD smart TVs, automated washing machines, sound buffles, gas cookers, and high performance home appliances.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold px-8 py-4 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all text-sm cursor-pointer"
              >
                Browse Storefront Catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Category Quick Shortcuts */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Categories</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">Explore high performance appliances by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/products"
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-cyan-500/30 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Refrigerator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Smart Refrigerators
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Inverter double door, side-by-side, mini bars & energy efficient cooling.
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-cyan-700 mt-4 group-hover:translate-x-1 transition-transform">
              Explore Refrigerators &rarr;
            </span>
          </Link>

          <Link
            to="/products"
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-cyan-500/30 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Televisions & Display
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                4K UHD Smart TVs, OLED, QLED displays with Android TV & Tizen OS.
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-blue-700 mt-4 group-hover:translate-x-1 transition-transform">
              Explore Televisions &rarr;
            </span>
          </Link>

          <Link
            to="/products"
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-cyan-500/30 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <WashingMachine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Washing Machines
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Front load & top load automatic washers with steam hygiene wash.
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-cyan-700 mt-4 group-hover:translate-x-1 transition-transform">
              Explore Washers &rarr;
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
