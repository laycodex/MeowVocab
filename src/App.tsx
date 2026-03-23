import React, { useState, useEffect } from 'react';
import { WordList } from './components/WordList';
import { Reward } from './components/Reward';
import { SponsorModal } from './components/SponsorModal';
import { SearchBar } from './components/SearchBar';
import { getDailyCount } from './utils/ebbinghaus';
import { BookOpen, Bell, ArrowLeftRight, Shuffle, Fish, ShoppingBag } from 'lucide-react';
import catImg from './assets/cat.jpg';

export default function App() {
  const [category, setCategory] = useState<'IELTS' | 'GRE' | 'TOEFL' | 'SAT'>('IELTS');
  const [order, setOrder] = useState<'sequential' | 'random'>('sequential');
  const [handedness, setHandedness] = useState<'right' | 'left'>('right');
  const [mode, setMode] = useState<'new' | 'review' | 'all' | 'favorites'>('all');
  const [dailyCount, setDailyCount] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardShownToday, setRewardShownToday] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);
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
    if (reminder === 'true') {
      setReminderEnabled(true);
      setupReminder();
    }

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

  const toggleReminder = async () => {
    if (!reminderEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setReminderEnabled(true);
          localStorage.setItem('reminder_enabled', 'true');
          setupReminder();
        } else {
          alert('Please enable notifications in your browser settings.');
        }
      }
    } else {
      setReminderEnabled(false);
      localStorage.setItem('reminder_enabled', 'false');
    }
  };

  const setupReminder = () => {
    // Simple check every minute
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('MeowVocab Time!', {
            body: 'It\'s 8 PM! Time to review your daily vocabulary.',
            icon: '/favicon.ico'
          });
        }
      }
    }, 60000);
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
              onClick={toggleReminder}
              className={`p-2 rounded-full transition-colors ${reminderEnabled ? 'bg-[#E9C46A] text-white' : 'bg-[#FAF8F5] text-[#A89F91] hover:bg-[#E5E0D8]'}`}
              title="Daily 8 PM Reminder"
            >
              <Bell className="w-5 h-5" />
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
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E5E0D8] text-[#5C4B41] py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-transform"
          >
            <Fish className="w-5 h-5 text-[#E9C46A] fill-[#FAF8F5]" />
            添加到桌面
          </button>
          <button 
            onClick={() => setShowSponsor(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F4A261] text-white py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-transform"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
              <img 
                src={catImg} 
                alt="cat" 
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full object-cover border border-[#F4A261]" 
                referrerPolicy="no-referrer"
              />
            </div>
            赞助猫粮
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
          
          <div className="flex-1 relative">
            <select 
              value={handedness} 
              onChange={e => setHandedness(e.target.value as any)} 
              className="w-full appearance-none bg-white border border-[#E5E0D8] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-[#5C4B41] focus:outline-none focus:ring-2 focus:ring-[#F4A261] shadow-sm"
            >
              <option value="right">右排版 (Right-handed)</option>
              <option value="left">左排版 (Left-handed)</option>
            </select>
            <ArrowLeftRight className="w-4 h-4 text-[#A89F91] absolute left-3 top-1/2 -translate-y-1/2" />
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
          onDailyGoalUpdate={handleDailyGoalUpdate} 
        />
      </main>

      {/* Reward Modal */}
      {showReward && <Reward onClose={() => setShowReward(false)} />}
      
      {/* Sponsor Modal */}
      {showSponsor && <SponsorModal onClose={() => setShowSponsor(false)} />}
    </div>
  );
}
