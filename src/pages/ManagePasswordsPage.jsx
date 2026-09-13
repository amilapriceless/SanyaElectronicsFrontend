import React, { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { changeRolePassword } from '../services/auth.api';

const ManagePasswordsPage = () => {
  const { isSystemAdmin } = useAdmin();
  const [role, setRole] = useState('officer');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isSystemAdmin) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await changeRolePassword(role, password);
      setPassword('');
      setConfirmation('');
      setMessage(`${role === 'officer' ? 'Officer' : 'System admin'} password updated successfully.`);
    } catch (saveError) {
      setError(saveError.message || 'Could not update password.');
    }
  };

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-14" aria-labelledby="password-heading">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3"><KeyRound className="h-7 w-7 text-rose-600" /><h1 id="password-heading" className="text-2xl font-black text-slate-950">Manage Passwords</h1></div>
        <p className="mt-2 text-sm text-slate-500">Update role passwords. Passwords are hashed before they are stored.</p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="block text-sm font-bold text-slate-700">Account
            <select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-rose-500">
              <option value="officer">Officer</option>
              <option value="systemAdmin">System Admin</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-700">New password
            <input type="password" minLength="8" maxLength="128" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-rose-500" />
          </label>
          <label className="block text-sm font-bold text-slate-700">Confirm password
            <input type="password" minLength="8" maxLength="128" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-rose-500" />
          </label>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
          {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p>}
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700"><Save className="h-4 w-4" /> Save password</button>
        </form>
      </div>
    </section>
  );
};

export default ManagePasswordsPage;