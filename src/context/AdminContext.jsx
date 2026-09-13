import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentSession,
  loginWithRole,
  logoutSession,
  verifyPrimaryPasscode,
} from '../services/auth.api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    getCurrentSession()
      .then((session) => setRole(session.role || null))
      .catch(() => setRole(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (passcode) => {
    await verifyPrimaryPasscode(passcode);
    setIsAdminModalOpen(false);
    return true;
  };

  const loginRole = async (selectedRole, password) => {
    const session = await loginWithRole(selectedRole, password);
    setRole(session.role || selectedRole);
    return session;
  };

  const logout = async () => {
    await logoutSession();
    setRole(null);
  };

  const openAdminModal = () => {
    setIsAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
  };

  return (
    <AdminContext.Provider
      value={{
        role,
        isAdmin: Boolean(role),
        isSystemAdmin: role === 'systemAdmin',
        isOfficer: role === 'officer',
        isLoading,
        login,
        loginRole,
        logout,
        isAdminModalOpen,
        openAdminModal,
        closeAdminModal,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
