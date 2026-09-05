import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const AdminPasscodeModal = () => {
  const { isAdminModalOpen, closeAdminModal, login } = useAdmin();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(passcode);
    if (success) {
      setPasscode('');
    } else {
      setError('Invalid passcode. Use test passcode: 123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={() => {
            setError('');
            setPasscode('');
            closeAdminModal();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Unlock Admin Mode</h3>
          <p className="text-xs text-gray-500 mt-1">
            Enter admin passcode to reveal product management controls.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode (Test: 123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Hint: Test passcode is <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-bold">123</code></p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeAdminModal}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasscodeModal;
