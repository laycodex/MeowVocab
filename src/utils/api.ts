/**
 * DNS 注意事项：
 * 当前 www.meowvocab.site DNS 仍指向 Vercel，需要改到腾讯云服务器 IP 118.25.174.171，否则 API 访问不到。
 * 需要修改 A 记录：
 * @  → 118.25.174.171
 * www → 118.25.174.171
 */

export const API_BASE_URL = 'https://www.meowvocab.site/api';
// 若 HTTPS 证书问题，请临时切换为：
// export const API_BASE_URL = 'http://www.meowvocab.site/api';

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
    request('/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: (username: string, password: string) => 
    request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  syncUp: (progressData: any) => 
    request('/sync', { method: 'POST', body: JSON.stringify({ data: progressData }) }),
  syncDown: () => 
    request('/sync', { method: 'GET' }),
};
