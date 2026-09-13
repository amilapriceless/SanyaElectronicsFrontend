import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Refrigerator, Tv, WashingMachine, Zap } from 'lucide-react';
import { showrooms } from './showroomData';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVdZuPse8heT6_uklpyF6Jczs_Kl9-wM-k82b9-FKvg&s=10';
const branchNames = {
  awissawella: 'Avissawella',
  ukwaththa: 'Ukwaththa',
  kiridiwela: 'Kirindiwela',
  dehiowita: 'Dehiowita',
  ruwanwella: 'Ruwanwella',
  eheliyagoda: 'Eheliyagoda',
};
const branchStyles = {
  awissawella: {
    card: 'bg-cyan-50/70 border-cyan-200 hover:border-cyan-400',
    icon: 'bg-cyan-100 text-cyan-700 group-hover:bg-cyan-600',
    link: 'text-cyan-700 group-hover:text-cyan-900',
  },
  ukwaththa: {
    card: 'bg-violet-50/70 border-violet-200 hover:border-violet-400',
    icon: 'bg-violet-100 text-violet-700 group-hover:bg-violet-600',
    link: 'text-violet-700 group-hover:text-violet-900',
  },
  kiridiwela: {
    card: 'bg-amber-50/70 border-amber-200 hover:border-amber-400',
    icon: 'bg-amber-100 text-amber-700 group-hover:bg-amber-500',
    link: 'text-amber-700 group-hover:text-amber-900',
  },
  dehiowita: {
    card: 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400',
    icon: 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600',
    link: 'text-emerald-700 group-hover:text-emerald-900',
  },
  ruwanwella: {
    card: 'bg-rose-50/70 border-rose-200 hover:border-rose-400',
    icon: 'bg-rose-100 text-rose-700 group-hover:bg-rose-600',
    link: 'text-rose-700 group-hover:text-rose-900',
  },
  eheliyagoda: {
    card: 'bg-orange-50/70 border-orange-200 hover:border-orange-400',
    icon: 'bg-orange-100 text-orange-700 group-hover:bg-orange-600',
    link: 'text-orange-700 group-hover:text-orange-900',
  },
};

const HomePage = () => {
  return (
    <div className="bg-rose-50/40 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 text-slate-950 overflow-hidden py-20 lg:py-28 border-b border-rose-200">
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={LOGO_URL}
                alt="Sanya Electronics Logo"
                className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-rose-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="inline-flex items-center gap-2 bg-white/70 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-red-600" /> Sanya Electronics Premium Store
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
              Next-Gen Electronics <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-rose-600 to-orange-600">
                Engineered for Modern Homes
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
              Discover smart inverter refrigerators, 4K UHD smart TVs, automated washing machines, sound buffles, gas cookers, and high performance home appliances.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all text-sm cursor-pointer"
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
            className="group overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-cyan-950">
                <img
                  src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=85"
                  alt="Modern stainless steel refrigerator"
                    loading="lazy"
                    decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
                <div className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-cyan-700 shadow-lg backdrop-blur-sm">
                  <Refrigerator className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  Smart Refrigerators
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Inverter double door, side-by-side, mini bars & energy efficient cooling.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-cyan-700 mx-6 mb-6 group-hover:translate-x-1 transition-transform">
              Explore Refrigerators &rarr;
            </span>
          </Link>

          <Link
            to="/products"
            className="group overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-blue-950">
                <img
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85"
                  alt="Large screen smart television in a living room"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
                <div className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-blue-700 shadow-lg backdrop-blur-sm">
                  <Tv className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Televisions & Display
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  4K UHD Smart TVs, OLED, QLED displays with Android TV & Tizen OS.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-blue-700 mx-6 mb-6 group-hover:translate-x-1 transition-transform">
              Explore Televisions &rarr;
            </span>
          </Link>

          <Link
            to="/products"
            className="group overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=85"
                  alt="White front-load washing machine"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
                <div className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-800 shadow-lg backdrop-blur-sm">
                  <WashingMachine className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  Washing Machines
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Front load & top load automatic washers with steam hygiene wash.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-cyan-700 mx-6 mb-6 group-hover:translate-x-1 transition-transform">
              Explore Washers &rarr;
            </span>
          </Link>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-16" aria-labelledby="branch-chain-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-700 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-[0.18em]">Come say hello</span>
              </div>
              <h2 id="branch-chain-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900">Visit Our Branch Chain</h2>
              <p className="text-sm text-slate-500 mt-2">Find trusted service and smarter home appliances near you.</p>
            </div>
            <Link to="/statistics" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 transition-colors">
              View all showrooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {showrooms.map((showroom) => (
              <article key={showroom.slug} className={`group rounded-2xl border p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${branchStyles[showroom.slug].card}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl group-hover:text-white transition-colors ${branchStyles[showroom.slug].icon}`}>
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    Open Today
                  </span>
                </div>
                <address className="not-italic mt-5">
                  <h3 className="text-lg font-black text-slate-950">{branchNames[showroom.slug]}</h3>
                  <p className="mt-1 text-sm text-slate-500">Sanya Electronics showroom</p>
                </address>
                <Link
                  to={`/statistics/showrooms/${showroom.slug}`}
                  className={`mt-5 inline-flex items-center gap-2 text-sm font-bold transition-colors ${branchStyles[showroom.slug].link}`}
                >
                  View showroom details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
