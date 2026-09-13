import React, { useEffect, useState } from 'react';
import { ArrowLeft, Target } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { showrooms } from './showroomData';
import { getShowroomTargets } from '../features/showrooms/showroomTarget.api';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const targetYears = Array.from({ length: 11 }, (_, index) => 2026 + index);
const createMonthlyDetails = (showroom) => months.map((month) => ({
  month,
  target: showroom?.target || '',
  updateDate: '',
  achieved: showroom?.sales || '',
  lastYearAchievement: '',
  notes: '',
}));

const getAmount = (value) => Number(String(value).replace(/[^0-9.-]/g, '')) || 0;
const formatAmount = (value) => `LKR ${Math.max(0, value).toLocaleString('en-US')}`;
const getDailyTarget = (target, achieved, updateDate, monthIndex) => {
  if (!updateDate) return 0;
  const date = new Date(`${updateDate}T00:00:00`);
  const daysInMonth = new Date(date.getFullYear(), monthIndex + 1, 0).getDate();
  const remainingDays = Math.max(daysInMonth - date.getDate() + 1, 1);
  return Math.max(0, target - achieved) / remainingDays;
};

const ShowroomSalesTargetsPage = () => {
  const { isAdmin } = useAdmin();
  const { showroomSlug } = useParams();
  const showroom = showrooms.find((item) => item.slug === showroomSlug);
  const [year, setYear] = useState(2026);
  const [monthlyDetails, setMonthlyDetails] = useState(() => createMonthlyDetails(showroom));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadTargets = async () => {
      try {
        setMonthlyDetails(createMonthlyDetails(showroom));
        const records = await getShowroomTargets(showroomSlug, year);
        if (active) {
          const recordsByMonth = Object.fromEntries(records.map((record) => [record.month, record]));
          setMonthlyDetails((current) => current.map((month) => {
            const record = recordsByMonth[month.month.toLowerCase()];
            return record ? {
              ...month,
              target: String(record.target ?? ''),
              updateDate: record.updateDate ?? '',
              achieved: String(record.achieved ?? ''),
              lastYearAchievement: String(record.lastYearAchievement ?? ''),
              notes: record.notes ?? '',
            } : month;
          }));
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTargets();
    return () => { active = false; };
  }, [showroomSlug, year]);

  if (!isAdmin) return <Navigate to="/" replace />;
  if (!showroom) return <Navigate to="/statistics" replace />;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Link to={`/statistics/showrooms/${showroom.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to {showroom.name}
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-700 mb-3">
              <Target className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Sales target workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950">Sales Targets</h1>
            <p className="text-slate-500 mt-2">{showroom.name}</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-slate-200">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-black text-slate-950">12-month sales plan</h2>
                <label className="sr-only" htmlFor="target-year">Target year</label>
                <select
                  id="target-year"
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-cyan-500"
                >
                  {targetYears.map((targetYear) => <option key={targetYear} value={targetYear}>{targetYear}</option>)}
                </select>
              </div>
              <p className="text-sm text-slate-500 mt-1">View saved details. Click a month name to edit its figures.</p>
              {loading && <p className="text-sm font-bold text-cyan-700 mt-2">Loading saved targets...</p>}
              {error && <p className="text-sm font-bold text-rose-600 mt-2">{error}</p>}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-4 py-4 text-xs uppercase tracking-wider">Month</th>
                  <th className="px-4 py-4 text-xs uppercase tracking-wider">Sales target</th>
                  <th className="px-4 py-4 text-xs uppercase tracking-wider">Achieved sales</th>
                  <th className="px-4 py-4 text-xs uppercase tracking-wider">Achieved sales %</th>
                  <th className="px-4 py-4 text-xs uppercase tracking-wider">Last year achievement</th>
                  <th className="px-4 py-4 text-xs uppercase tracking-wider">Remaining balance</th>
                  <th className="px-4 py-4 text-xs uppercase tracking-wider">Daily target</th>
                </tr>
              </thead>
              <tbody>
                {monthlyDetails.map((month, monthIndex) => (
                  <tr key={month.month} className="border-b border-slate-100 last:border-0 align-top">
                    <td className="px-4 py-4">
                      <Link
                        to={`/statistics/showrooms/${showroom.slug}/sales-targets/${month.month.toLowerCase()}?year=${year}`}
                        className="inline-flex items-center rounded-lg bg-cyan-50 px-3 py-2 font-black text-cyan-700 hover:bg-cyan-100 hover:text-cyan-900 transition-colors"
                      >
                        {month.month}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-700">{month.target || 'LKR 0'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-700">{month.achieved || 'LKR 0'}</span>
                    </td>
                    <td className="px-4 py-4 font-black text-cyan-700">
                      {getAmount(month.target) > 0 ? `${Math.round((getAmount(month.achieved) / getAmount(month.target)) * 100)}%` : '0%'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-700">{formatAmount(getAmount(month.lastYearAchievement))}</span>
                    </td>
                    <td className="px-4 py-4 font-black text-rose-600">
                      {formatAmount(getAmount(month.target) - getAmount(month.achieved))}
                    </td>
                    <td className="px-4 py-4 font-black text-amber-600">
                      {formatAmount(getDailyTarget(getAmount(month.target), getAmount(month.achieved), month.updateDate, months.indexOf(month.month)))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShowroomSalesTargetsPage;
