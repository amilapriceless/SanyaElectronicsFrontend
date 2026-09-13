import React, { useEffect, useState } from 'react';
import { ArrowLeft, BarChart3, Save, Target } from 'lucide-react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { showrooms } from './showroomData';
import { getShowroomTarget, saveShowroomTarget } from '../features/showrooms/showroomTarget.api';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getAmount = (value) => Number(String(value).replace(/[^0-9.-]/g, '')) || 0;
const formatAmount = (value) => `LKR ${Math.max(0, value).toLocaleString('en-US')}`;
const getDailyTarget = (target, achieved, updateDate, monthIndex) => {
  if (!updateDate) return 0;
  const date = new Date(`${updateDate}T00:00:00`);
  const daysInMonth = new Date(date.getFullYear(), monthIndex + 1, 0).getDate();
  const remainingDays = Math.max(daysInMonth - date.getDate() + 1, 1);
  return Math.max(0, target - achieved) / remainingDays;
};

const ShowroomMonthlyTargetPage = () => {
  const { isAdmin } = useAdmin();
  const { showroomSlug, month: monthSlug } = useParams();
  const [searchParams] = useSearchParams();
  const year = Number(searchParams.get('year')) || 2026;
  const showroom = showrooms.find((item) => item.slug === showroomSlug);
  const month = months.find((item) => item.toLowerCase() === monthSlug);
  const [details, setDetails] = useState({
    target: showroom?.target || '',
    updateDate: '',
    achieved: showroom?.sales || '',
    lastYearAchievement: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      try {
        const record = await getShowroomTarget(showroomSlug, monthSlug, year);
        if (active && record) {
          setDetails({
            target: String(record.target ?? ''),
            updateDate: record.updateDate ?? '',
            achieved: String(record.achieved ?? ''),
            lastYearAchievement: String(record.lastYearAchievement ?? ''),
          });
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDetails();
    return () => { active = false; };
  }, [monthSlug, showroomSlug, year]);

  if (!isAdmin) return <Navigate to="/" replace />;
  if (!showroom || !month) return <Navigate to={`/statistics/showrooms/${showroomSlug}/sales-targets`} replace />;

  const updateDetails = (event) => {
    const { name, value } = event.target;
    setSaved(false);
    setDetails((current) => ({ ...current, [name]: value }));
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await saveShowroomTarget(showroomSlug, monthSlug, year, {
        year,
        target: getAmount(details.target),
        updateDate: details.updateDate,
        achieved: getAmount(details.achieved),
        lastYearAchievement: getAmount(details.lastYearAchievement),
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const target = getAmount(details.target);
  const achieved = getAmount(details.achieved);
  const achievedPercentage = target > 0 ? Math.round((achieved / target) * 100) : 0;
  const monthIndex = months.indexOf(month);
  const dailyTarget = getDailyTarget(target, achieved, details.updateDate, monthIndex);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Link to={`/statistics/showrooms/${showroom.slug}/sales-targets`} className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to monthly targets
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-700 mb-3">
              <Target className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Monthly target details</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950">{month}</h1>
            <p className="text-slate-500 mt-2">{showroom.name}</p>
            {loading && <p className="text-sm font-bold text-cyan-700 mt-3">Loading saved details...</p>}
            {error && <p className="text-sm font-bold text-rose-600 mt-3">{error}</p>}
          </div>
          <BarChart3 className="w-9 h-9 text-cyan-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Achieved sales %</p>
            <p className="text-2xl font-black text-cyan-700 mt-2">{achievedPercentage}%</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Remaining balance</p>
            <p className="text-2xl font-black text-rose-600 mt-2">{formatAmount(target - achieved)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Last year achievement</p>
            <p className="text-2xl font-black text-slate-950 mt-2">{formatAmount(getAmount(details.lastYearAchievement))}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily target</p>
            <p className="text-2xl font-black text-amber-600 mt-2">{formatAmount(dailyTarget)}</p>
          </div>
        </div>

        <form onSubmit={saveDetails} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-950">{month} details</h2>
              <p className="text-sm text-slate-500 mt-1">Update the figures for this showroom month.</p>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <Save className="w-4 h-4" /> Save details
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="text-sm font-bold text-slate-700">
              Sales target
              <input name="target" value={details.target} onChange={updateDetails} placeholder="LKR 0" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-cyan-500" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Update date
              <input type="date" name="updateDate" value={details.updateDate} onChange={updateDetails} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-cyan-500" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Achieved sales
              <input name="achieved" value={details.achieved} onChange={updateDetails} placeholder="LKR 0" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-cyan-500" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Last year achievement
              <input name="lastYearAchievement" value={details.lastYearAchievement} onChange={updateDetails} placeholder="LKR 0" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-cyan-500" />
            </label>
          </div>
          {saved && (
            <div className="mt-6 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 border-t border-slate-200 px-5 py-4 sm:px-6 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">Successfully saved</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ShowroomMonthlyTargetPage;
