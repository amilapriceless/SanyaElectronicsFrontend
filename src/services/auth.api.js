import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

export const verifyPrimaryPasscode = async (passcode) => {
  const response = await api.post('/api/auth/primary-login', { passcode });
  return unwrap(response);
};

export const loginWithRole = async (role, password) => {
  const response = await api.post('/api/auth/role-login', { role, password });
  return unwrap(response);
};

export const getCurrentSession = async () => {
  const response = await api.get('/api/auth/me');
  return unwrap(response);
};

export const logoutSession = async () => {
  const response = await api.post('/api/auth/logout');
  return unwrap(response);
};

export const changeRolePassword = async (role, password) => {
  const response = await api.put('/api/auth/passwords', { role, password });
  return unwrap(response);
};