import React from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  handedness: 'right' | 'left';
  setHandedness: (v: 'right' | 'left') => void;
  sensitivity: 1 | 2 | 3;
  setSensitivity: (v: 1 | 2 | 3) => void;
  autoPlay: boolean;
  setAutoPlay: (v: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose, handedness, setHandedness, sensitivity, setSensitivity, autoPlay, setAutoPlay
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF8F5]">
          <h2 className="text-lg font-bold text-[#5C4B41]">自定义设置</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#E5E0D8] text-[#A89F91] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-6">
          {/* Handedness */}
          <div>
            <label className="block text-sm font-bold text-[#5C4B41] mb-2">排版习惯</label>
            <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D8]">
              <button 
                onClick={() => setHandedness('right')} 
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${handedness === 'right' ? 'bg-[#F4A261] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'}`}
              >
                右排版
              </button>
              <button 
                onClick={() => setHandedness('left')} 
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${handedness === 'left' ? 'bg-[#F4A261] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'}`}
              >
                左排版
              </button>
            </div>
          </div>
          
          {/* Sensitivity */}
          <div>
            <label className="block text-sm font-bold text-[#5C4B41] mb-2">刮刮乐触控灵敏度</label>
            <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D8]">
              <button 
                onClick={() => setSensitivity(1)} 
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${sensitivity === 1 ? 'bg-[#F4A261] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'}`}
              >
                轻搓
              </button>
              <button 
                onClick={() => setSensitivity(2)} 
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${sensitivity === 2 ? 'bg-[#F4A261] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'}`}
              >
                中搓
              </button>
              <button 
                onClick={() => setSensitivity(3)} 
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${sensitivity === 3 ? 'bg-[#F4A261] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'}`}
              >
                用力搓！
              </button>
            </div>
          </div>
          
          {/* AutoPlay */}
          <div>
            <label className="block text-sm font-bold text-[#5C4B41] mb-2">刮开时自动发音</label>
            <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D8]">
              <button 
                onClick={() => setAutoPlay(true)} 
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${autoPlay ? 'bg-[#F4A261] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'}`}
              >
                是
              </button>
              <button 
                onClick={() => setAutoPlay(false)} 
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${!autoPlay ? 'bg-[#F4A261] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'}`}
              >
                否
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
