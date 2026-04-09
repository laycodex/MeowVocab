import React, { useState, useEffect } from 'react';
import { WordList } from './components/WordList';
import { Reward } from './components/Reward';
import { SearchBar } from './components/SearchBar';
import { SettingsModal } from './components/SettingsModal';
import { getDailyCount } from './utils/ebbinghaus';
import { BookOpen, Bell, Shuffle, Fish, Settings } from 'lucide-react';

export default function App() {
  const [category, setCategory] = useState<'IELTS' | 'GRE' | 'TOEFL' | 'SAT'>('IELTS');
  const [order, setOrder] = useState<'sequential' | 'random'>('sequential');
  const [handedness, setHandedness] = useState<'right' | 'left'>('right');
  const [mode, setMode] = useState<'new' | 'review' | 'all' | 'favorites'>('all');
  const [sensitivity, setSensitivity] = useState<1 | 2 | 3>(1);
  const [autoPlay, setAutoPlay] = useState(false);
  
  const [dailyCount, setDailyCount] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rewardShownToday, setRewardShownToday] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Pre-load voices for Android TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    const { count } = getDailyCount();
    setDailyCount(count);
    
    const today = new Date().toISOString().split('T')[0];
    const shown = localStorage.getItem('reward_shown_date');
    if (shown === today) {
      setRewardShownToday(true);
    }

    const reminder = localStorage.getItem('reminder_enabled');
    // Removed Notification API setup for reminder, replaced with ICS download

    const savedHand = localStorage.getItem('vocab_handedness');
    if (savedHand) setHandedness(savedHand as 'right' | 'left');
    
    const savedSens = localStorage.getItem('vocab_sensitivity');
    if (savedSens) setSensitivity(Number(savedSens) as 1 | 2 | 3);
    
    const savedAuto = localStorage.getItem('vocab_autoplay');
    if (savedAuto) setAutoPlay(savedAuto === 'true');

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert('请点击浏览器的“分享”或“菜单”按钮，选择“添加到主屏幕”');
    }
  };

  const handleDailyGoalUpdate = (increment: number) => {
    const newCount = dailyCount + increment;
    setDailyCount(newCount);

    if (newCount >= 100 && !rewardShownToday) {
      setShowReward(true);
      setRewardShownToday(true);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('reward_shown_date', today);
    }
  };

  const handleSetHandedness = (v: 'right' | 'left') => {
    setHandedness(v);
    localStorage.setItem('vocab_handedness', v);
  };

  const handleSetSensitivity = (v: 1 | 2 | 3) => {
    setSensitivity(v);
    localStorage.setItem('vocab_sensitivity', v.toString());
  };

  const handleSetAutoPlay = (v: boolean) => {
    setAutoPlay(v);
    localStorage.setItem('vocab_autoplay', v.toString());
  };

  const downloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MeowVocab//CN
BEGIN:VEVENT
SUMMARY:MeowVocab 每日背单词
DESCRIPTION:该背单词啦！快打开 MeowVocab 学习吧~
RRULE:FREQ=DAILY
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:MeowVocab 每日背单词提醒
TRIGGER:-PT0M
END:VALARM
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'meowvocab_reminder.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#5C4B41] font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E0D8] sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F4A261] rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">MeowVocab</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadICS}
              className="p-2 rounded-full transition-colors bg-[#FAF8F5] text-[#A89F91] hover:bg-[#E5E0D8]"
              title="添加到日历提醒"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full transition-colors bg-[#FAF8F5] text-[#A89F91] hover:bg-[#E5E0D8]"
              title="设置"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider">Today</p>
              <p className="text-lg font-bold text-[#F4A261]">{dailyCount} <span className="text-sm text-[#A89F91] font-medium">/ 100</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <SearchBar />

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2 bg-white border border-[#E5E0D8] text-[#5C4B41] py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-transform"
          >
            <Fish className="w-5 h-5 text-[#E9C46A] fill-[#FAF8F5]" />
            添加到桌面
          </button>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-[#E5E0D8] mb-4 shadow-sm overflow-x-auto hide-scrollbar">
          {['IELTS', 'GRE', 'TOEFL', 'SAT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as any)}
              className={`flex-1 min-w-[70px] py-2 rounded-lg font-medium text-sm transition-colors ${
                category === cat ? 'bg-[#5C4B41] text-white' : 'text-[#A89F91] hover:bg-[#FAF8F5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-[#E5E0D8] mb-4 shadow-sm overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setMode('all')}
            className={`flex-1 min-w-[70px] py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === 'all' ? 'bg-[#F4A261] text-white' : 'text-[#A89F91] hover:bg-[#FAF8F5]'
            }`}
          >
            全部 (All)
          </button>
          <button
            onClick={() => setMode('new')}
            className={`flex-1 min-w-[70px] py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === 'new' ? 'bg-[#F4A261] text-white' : 'text-[#A89F91] hover:bg-[#FAF8F5]'
            }`}
          >
            新词 (New)
          </button>
          <button
            onClick={() => setMode('review')}
            className={`flex-1 min-w-[70px] py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === 'review' ? 'bg-[#F4A261] text-white' : 'text-[#A89F91] hover:bg-[#FAF8F5]'
            }`}
          >
            复习 (Review)
          </button>
          <button
            onClick={() => setMode('favorites')}
            className={`flex-1 min-w-[70px] py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === 'favorites' ? 'bg-[#F4A261] text-white' : 'text-[#A89F91] hover:bg-[#FAF8F5]'
            }`}
          >
            收藏 (Fav)
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <select 
              value={order} 
              onChange={e => setOrder(e.target.value as any)} 
              className="w-full appearance-none bg-white border border-[#E5E0D8] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-[#5C4B41] focus:outline-none focus:ring-2 focus:ring-[#F4A261] shadow-sm"
            >
              <option value="sequential">顺序版 (Sequential)</option>
              <option value="random">乱序版 (Random)</option>
            </select>
            <Shuffle className="w-4 h-4 text-[#A89F91] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex justify-between px-4 mb-2 text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
          <div className={handedness === 'left' ? 'order-2 text-right w-1/2' : 'order-1 w-1/2'}>单词英文</div>
          <div className={handedness === 'left' ? 'order-1 w-1/2' : 'order-2 text-right w-1/2'}>中文意思</div>
        </div>

        <WordList 
          category={category} 
          order={order}
          handedness={handedness}
          mode={mode}
          sensitivity={sensitivity}
          autoPlay={autoPlay}
          onDailyGoalUpdate={handleDailyGoalUpdate} 
        />
      </main>

      {/* Reward Modal */}
      {showReward && <Reward onClose={() => setShowReward(false)} />}
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          handedness={handedness}
          setHandedness={handleSetHandedness}
          sensitivity={sensitivity}
          setSensitivity={handleSetSensitivity}
          autoPlay={autoPlay}
          setAutoPlay={handleSetAutoPlay}
        />
      )}
    </div>
  );
}
