import api from '../../services/api';

const unwrap = (response) => response.data?.data ?? response.data;

export const getShowroomTargets = async (showroomSlug, year) => {
  const response = await api.get(`/api/showroom-targets/${showroomSlug}`, { params: { year } });
  return unwrap(response);
};

export const getShowroomTarget = async (showroomSlug, month, year) => {
  const response = await api.get(`/api/showroom-targets/${showroomSlug}/${month}`, { params: { year } });
  return unwrap(response);
};

export const saveShowroomTarget = async (showroomSlug, month, year, details) => {
  const response = await api.put(`/api/showroom-targets/${showroomSlug}/${month}`, details, { params: { year } });
  return unwrap(response);
};

export const getShowroomArrears = async (showroomSlug, year) => {
  const response = await api.get(`/api/showroom-arrears/${showroomSlug}`, { params: { year } });
  return unwrap(response);
};

export const saveShowroomArrears = async (showroomSlug, year, details) => {
  const response = await api.put(`/api/showroom-arrears/${showroomSlug}`, details, { params: { year } });
  return unwrap(response);
};