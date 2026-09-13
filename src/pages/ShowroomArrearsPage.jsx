import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { showrooms } from './showroomData';
import { getShowroomArrears, saveShowroomArrears } from '../features/showrooms/showroomTarget.api';

const ShowroomArrearsPage = () => {
  const { isAdmin } = useAdmin();
  const { showroomSlug } = useParams();
  const [searchParams] = useSearchParams();
  const year = Number(searchParams.get('year')) || 2026;
  const showroom = showrooms.find((item) => item.slug === showroomSlug);
  const [arrearsDetails, setArrearsDetails] = useState({ outstanding: '', overdueAccounts: '', nextReview: '', notes: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getShowroomArrears(showroomSlug, year)
      .then((record) => {
        if (active && record) setArrearsDetails({
          outstanding: String(record.outstanding ?? ''),
          overdueAccounts: String(record.overdueAccounts ?? ''),
          nextReview: record.nextReview ?? '',
          notes: record.notes ?? '',
        });
      })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showroomSlug, year]);

  if (!isAdmin) return <Navigate to="/" replace />;
  if (!showroom) return <Navigate to="/statistics" replace />;

  const updateDetails = (event) => {
    const { name, value } = event.target;
    setSaved(false);
    setArrearsDetails((current) => ({ ...current, [name]: value }));
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await saveShowroomArrears(showroomSlug, year, {
        year,
        outstanding: Number(String(arrearsDetails.outstanding).replace(/[^0-9.-]/g, '')) || 0,
        overdueAccounts: Number(arrearsDetails.overdueAccounts) || 0,
        nextReview: arrearsDetails.nextReview,
        notes: arrearsDetails.notes,
      });
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Link to={`/statistics/showrooms/${showroom.slug}?year=${year}`} className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to {showroom.name}
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-600 mb-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Collections workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950">Arrears</h1>
            <p className="text-slate-500 mt-2">{showroom.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            ['Outstanding amount', arrearsDetails.outstanding ? `LKR ${Number(arrearsDetails.outstanding).toLocaleString('en-US')}` : 'LKR 0'],
            ['Orders to review', showroom.orders],
            ['Collection status', 'Needs review'],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
              <p className="text-2xl font-black text-slate-950 mt-2">{value}</p>
            </div>
          ))}
        </div>

        <form onSubmit={saveDetails} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-950">Arrears details</h2>
              <p className="text-sm text-slate-500 mt-1">Record collection information for this showroom.</p>
              {loading && <p className="text-sm font-bold text-cyan-700 mt-2">Loading saved arrears...</p>}
              {error && <p className="text-sm font-bold text-rose-600 mt-2">{error}</p>}
            </div>
            <button type="submit" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <Save className="w-4 h-4" /> Save arrears
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="text-sm font-bold text-slate-700">
              Total arrears
              <input name="outstanding" value={arrearsDetails.outstanding} onChange={updateDetails} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-rose-500" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Overdue accounts
              <input type="number" min="0" name="overdueAccounts" value={arrearsDetails.overdueAccounts} onChange={updateDetails} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-rose-500" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Next review date
              <input type="date" name="nextReview" value={arrearsDetails.nextReview} onChange={updateDetails} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-rose-500" />
            </label>
            <label className="text-sm font-bold text-slate-700 sm:col-span-2">
              Collection notes
              <textarea name="notes" value={arrearsDetails.notes} onChange={updateDetails} rows="4" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-rose-500" />
            </label>
          </div>
          {saved && <p className="text-sm font-bold text-emerald-600 mt-5">Arrears details saved for this session.</p>}
        </form>
      </div>
    </div>
  );
};

export default ShowroomArrearsPage;
