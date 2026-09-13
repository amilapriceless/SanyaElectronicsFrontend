import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, GitCompare, Store } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { showrooms } from './showroomData';

const StatisticsPage = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700 mb-2">Admin workspace</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950">Showroom Statistics</h1>
          <p className="text-slate-500 mt-2">Choose a showroom to manage its details and statistics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {showrooms.map((showroom) => (
            <Link
              key={showroom.slug}
              to={`/statistics/showrooms/${showroom.slug}`}
              className="group min-h-44 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-cyan-400 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex p-3 rounded-xl bg-cyan-50 text-cyan-700">
                    <Store className="w-6 h-6" />
                  </span>
                  <h2 className="text-xl font-black text-slate-950 mt-5">{showroom.name}</h2>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
              </div>
              <span className="text-sm font-bold text-cyan-700 mt-6">Open showroom details</span>
            </Link>
          ))}

          <Link
            to="/statistics/compare"
            className="group min-h-44 bg-slate-950 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-white flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex p-3 rounded-xl bg-cyan-400/15 text-cyan-300">
                  <GitCompare className="w-6 h-6" />
                </span>
                <h2 className="text-xl font-black mt-5">Compare Showrooms</h2>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
            </div>
            <span className="text-sm font-bold text-cyan-300 mt-6">View comparison</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default StatisticsPage;