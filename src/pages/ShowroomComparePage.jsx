import React, { useEffect, useState } from 'react';
import { ArrowLeft, GitCompare } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { showrooms } from './showroomData';
import { getShowroomArrears, getShowroomTarget } from '../features/showrooms/showroomTarget.api';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const years = Array.from({ length: 11 }, (_, index) => 2026 + index);
const formatAmount = (value) => `LKR ${Number(value || 0).toLocaleString('en-US')}`;
const getAchievedPercentage = (target) => {
  const targetAmount = Number(target?.target || 0);
  const achievedAmount = Number(target?.achieved || 0);
  return targetAmount > 0 ? `${Math.round((achievedAmount / targetAmount) * 100)}%` : '0%';
};

const ShowroomComparePage = () => {
  const { isAdmin } = useAdmin();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState('January');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all(showrooms.map(async (showroom) => {
      const [target, arrears] = await Promise.all([
        getShowroomTarget(showroom.slug, month.toLowerCase(), year),
        getShowroomArrears(showroom.slug, year),
      ]);
      return { showroom, target, arrears };
    }))
      .then((nextRows) => { if (active) setRows(nextRows); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [month, year]);

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Link to="/statistics" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to showrooms
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <GitCompare className="w-8 h-8 text-cyan-600" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950">Compare showrooms</h1>
            <p className="text-slate-500 mt-2">Review key statistics across every showroom.</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-end">
          <label className="text-sm font-bold text-slate-700">Year
            <select value={year} onChange={(event) => setYear(Number(event.target.value))} className="mt-2 block min-w-36 rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-cyan-500">
              {years.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700">Month
            <select value={month} onChange={(event) => setMonth(event.target.value)} className="mt-2 block min-w-44 rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-cyan-500">
              {months.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <p className="text-sm text-slate-500 sm:pb-3">Showing saved database details for {month} {year}.</p>
        </div>
        {loading && <p className="mb-4 text-sm font-bold text-cyan-700">Loading showroom comparison...</p>}
        {error && <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="px-5 py-4 text-xs uppercase tracking-wider">Showroom</th>
                <th className="px-5 py-4 text-xs uppercase tracking-wider">Sales</th>
                <th className="px-5 py-4 text-xs uppercase tracking-wider">Achieved sales target</th>
                <th className="px-5 py-4 text-xs uppercase tracking-wider">Achieved sales %</th>
                <th className="px-5 py-4 text-xs uppercase tracking-wider">Total arrears</th>
              </tr>
            </thead>
                  <td className="px-5 py-4 font-black text-cyan-700">{getAchievedPercentage(target)}</td>
            <tbody>
              {rows.map(({ showroom, target, arrears }) => (
                <tr key={showroom.slug} className="border-b border-slate-100 last:border-0 hover:bg-cyan-50/40">
                  <td className="px-5 py-4">
                    <Link to={`/statistics/showrooms/${showroom.slug}`} className="font-black text-cyan-700 hover:text-cyan-900">{showroom.name}</Link>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700">{formatAmount(target?.achieved)}</td>
                  <td className="px-5 py-4 font-bold text-cyan-700">{formatAmount(target?.target)}</td>
                  <td className="px-5 py-4 font-bold text-rose-600">{formatAmount(arrears?.outstanding)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowroomComparePage;
