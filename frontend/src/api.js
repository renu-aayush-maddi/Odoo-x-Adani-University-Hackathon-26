import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
});

export const endpoints = {
  teams: '/teams/',
  users: '/users/',
  equipment: '/equipment/',
  requests: '/requests/',
  updateStage: (id, data) => api.put(`/requests/${id}/stage`, data),
  equipmentStats: (id) => api.get(`/equipment/${id}/stats`),
};
