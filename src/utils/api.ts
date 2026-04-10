/**
 * 解决方案：使用 Vercel 反向代理 (Rewrite)
 * 
 * 既然 DNS 记录冲突，我们不再修改域名的 DNS。
 * 我们在项目根目录添加了 vercel.json，让 Vercel 自动将前端发往 /api 的请求
 * 转发到你的腾讯云服务器 (http://118.25.174.171/api)。
 * 
 * 这样做的巨大好处：
 * 1. 完美绕开 DNS 冲突，你的域名依然指向 Vercel。
 * 2. 完美解决 HTTPS 证书问题（Vercel 提供 HTTPS，然后它在后台用 HTTP 访问你的服务器，浏览器不会报 Mixed Content 错误）。
 * 3. 完美解决跨域 (CORS) 问题。
 */

export const API_BASE_URL = '/api';

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
