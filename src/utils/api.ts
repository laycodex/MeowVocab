/**
 * 前后端分离架构配置
 * 前端：部署在 Vercel (www.meowvocab.site)
 * 后端：部署在腾讯云 (api.meowvocab.site)
 */

export const API_BASE_URL = 'https://api.meowvocab.site';

export const getToken = () => localStorage.getItem('vocab_token');
export const setToken = (token: string) => localStorage.setItem('vocab_token', token);
export const removeToken = () => localStorage.removeItem('vocab_token');

export const getUsername = () => localStorage.getItem('vocab_username');
export const setUsername = (username: string) => localStorage.setItem('vocab_username', username);
export const removeUsername = () => localStorage.removeItem('vocab_username');

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || '请求失败');
  }

  return data;
};

export const api = {
  register: (username: string, password: string) => 
    request('/api/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: (username: string, password: string) => 
    request('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => 
    request('/api/logout', { method: 'POST' }),
  syncUp: (progressData: any) => 
    request('/api/sync', { method: 'POST', body: JSON.stringify({ data: progressData }) }),
  syncDown: () => 
    request('/api/sync', { method: 'GET' }),
};
