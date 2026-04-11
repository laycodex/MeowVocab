import React, { useState } from 'react';
import { X, User, Lock, Loader2, CloudUpload, CloudDownload, LogOut } from 'lucide-react';
import { api, setToken, setUsername, removeToken, removeUsername } from '../utils/api';
import { exportAllData, importAllData } from '../utils/ebbinghaus';

interface AuthModalProps {
  onClose: () => void;
  currentUser: string | null;
  onAuthChange: (username: string | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, currentUser, onAuthChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const extractToken = (res: any) => {
    return res?.data?.token || res?.token || res?.access_token || res?.data?.data?.token;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login(usernameInput, passwordInput);
        const token = extractToken(res);
        if (token) {
          setToken(token);
          setUsername(usernameInput);
          onAuthChange(usernameInput);
        } else {
          throw new Error('未获取到 Token');
        }
      } else {
        await api.register(usernameInput, passwordInput);
        const res = await api.login(usernameInput, passwordInput);
        const token = extractToken(res);
        if (token) {
          setToken(token);
          setUsername(usernameInput);
          onAuthChange(usernameInput);
        } else {
          throw new Error('未获取到 Token');
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      removeToken();
      removeUsername();
      onAuthChange(null);
    }
  };

  const handleSyncUp = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const data = exportAllData();
      await api.syncUp(data);
      setSuccessMsg('进度上传成功！');
    } catch (err: any) {
      setError('上传失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncDown = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.syncDown();
      if (res.data) {
        importAllData(res.data);
        setSuccessMsg('进度下载成功！页面即将刷新...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError('云端暂无数据');
      }
    } catch (err: any) {
      setError('下载失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF8F5]">
          <h2 className="text-lg font-bold text-[#5C4B41]">{currentUser ? '账号与云同步' : (isLogin ? '登录' : '注册')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#E5E0D8] text-[#A89F91] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {currentUser ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#F4A261] rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#5C4B41]">{currentUser}</h3>
                <p className="text-sm text-[#A89F91]">已登录</p>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
              {successMsg && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">{successMsg}</div>}

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleSyncUp}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 py-4 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl hover:bg-[#E5E0D8] transition-colors disabled:opacity-50"
                >
                  <CloudUpload className="w-6 h-6 text-[#07C160]" />
                  <span className="text-sm font-medium text-[#5C4B41]">上传进度</span>
                </button>
                <button 
                  onClick={handleSyncDown}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 py-4 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl hover:bg-[#E5E0D8] transition-colors disabled:opacity-50"
                >
                  <CloudDownload className="w-6 h-6 text-[#1677FF]" />
                  <span className="text-sm font-medium text-[#5C4B41]">下载进度</span>
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-3 mt-4 bg-white border border-[#E5E0D8] text-[#EF4444] rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                退出登录
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
              
              <div>
                <label className="block text-sm font-bold text-[#5C4B41] mb-1">用户名</label>
                <div className="relative">
                  <User className="w-5 h-5 text-[#A89F91] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    required
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#5C4B41] focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                    placeholder="请输入用户名"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#5C4B41] mb-1">密码</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#A89F91] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    required
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#5C4B41] focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                    placeholder="请输入密码"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#F4A261] text-white rounded-xl font-bold text-lg hover:bg-[#E79453] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLogin ? '登录' : '注册'}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-sm text-[#A89F91] hover:text-[#F4A261] transition-colors"
                >
                  {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
