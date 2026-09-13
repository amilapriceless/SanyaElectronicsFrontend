import React from 'react';
import { ArrowLeft, ArrowRight, BarChart3, ReceiptText, Store, Target } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { showrooms } from './showroomData';

const ShowroomPage = () => {
  const { isAdmin } = useAdmin();
  const { showroomSlug } = useParams();
  const showroom = showrooms.find((item) => item.slug === showroomSlug);

  if (!isAdmin) return <Navigate to="/" replace />;
  if (!showroom) return <Navigate to="/statistics" replace />;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Link to="/statistics" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to showrooms
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-700 mb-3">
              <Store className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Showroom workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950">{showroom.name}</h1>
            <p className="text-slate-500 mt-2">Manage showroom details and review performance statistics.</p>
          </div>
          <BarChart3 className="w-9 h-9 text-cyan-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Link
            to={`/statistics/showrooms/${showroom.slug}/sales-targets`}
            className="group min-h-40 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-white flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">Performance planning</p>
                <h2 className="text-2xl font-black mt-2">Sales Targets</h2>
              </div>
              <Target className="w-8 h-8 text-cyan-100 shrink-0" />
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-cyan-100 group-hover:text-white transition-colors">
              Manage sales targets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            to={`/statistics/showrooms/${showroom.slug}/arrears`}
            className="group min-h-40 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-white flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-100">Collections</p>
                <h2 className="text-2xl font-black mt-2">Arrears</h2>
              </div>
              <ReceiptText className="w-8 h-8 text-rose-100 shrink-0" />
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-rose-100 group-hover:text-white transition-colors">
              Review arrears <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ShowroomPage;
