import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const roles = [
  { id: 'officer', title: 'Officer Login', description: 'Access products, home, and full statistics without product management controls.', icon: UserRound, accent: 'cyan' },
  { id: 'systemAdmin', title: 'System Admin Login', description: 'Full access to products, statistics, users, and security settings.', icon: ShieldCheck, accent: 'rose' },
];

const AdminRoleSelectionPage = () => {
  const { isAdmin, loginRole } = useAdmin();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('officer');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selected = roles.find((item) => item.id === selectedRole);

  if (isAdmin) return <Navigate to="/statistics" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await loginRole(selectedRole, password);
      navigate('/statistics', { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Invalid role password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-14" aria-labelledby="role-selection-heading">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><LockKeyhole className="h-7 w-7" /></div>
          <h1 id="role-selection-heading" className="text-3xl font-black text-slate-950">Choose your secure login</h1>
          <p className="mt-2 text-sm text-slate-500">Select the role that matches your responsibilities.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {roles.map((roleOption) => {
            const Icon = roleOption.icon;
            const active = selectedRole === roleOption.id;
            const activeClasses = roleOption.accent === 'rose'
              ? 'border-rose-500 bg-rose-50 shadow-rose-100'
              : 'border-cyan-500 bg-cyan-50 shadow-cyan-100';
            return (
              <button
                key={roleOption.id}
                type="button"
                onClick={() => { setSelectedRole(roleOption.id); setError(''); }}
                className={`text-left rounded-2xl border-2 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${active ? activeClasses : 'border-slate-200 bg-white'}`}
                aria-pressed={active}
              >
                <Icon className={`h-8 w-8 ${roleOption.accent === 'rose' ? 'text-rose-600' : 'text-cyan-600'}`} />
                <h2 className="mt-5 text-xl font-black text-slate-950">{roleOption.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{roleOption.description}</p>
              </button>
            );
          })}
        </div>
        <form onSubmit={submit} className="mx-auto mt-7 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="role-password" className="text-sm font-bold text-slate-700">{selected.title} password</label>
          <input id="role-password" type="password" required autoFocus value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500" placeholder="Enter password" />
          {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? 'Signing in...' : `Continue as ${selected.title.replace(' Login', '')}`}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminRoleSelectionPage;