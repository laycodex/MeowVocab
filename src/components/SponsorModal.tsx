import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SponsorModalProps {
  onClose: () => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ onClose }) => {
  const [method, setMethod] = useState<'wechat' | 'alipay'>('wechat');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF8F5]">
          <h2 className="text-lg font-bold text-[#5C4B41]">赞助猫粮 🐱</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#E5E0D8] text-[#A89F91] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center text-center">
          <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D8] mb-4 w-full">
            <button
              onClick={() => setMethod('wechat')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                method === 'wechat' ? 'bg-[#07C160] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'
              }`}
            >
              微信支付
            </button>
            <button
              onClick={() => setMethod('alipay')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                method === 'alipay' ? 'bg-[#1677FF] text-white shadow-sm' : 'text-[#A89F91] hover:bg-white'
              }`}
            >
              支付宝
            </button>
          </div>

          <div className="w-48 h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden border-2 border-[#E9C46A] p-2 relative">
            <img 
              src={method === 'wechat' ? "/wechat.jpg?v=1" : "/alipay.jpg?v=1"} 
              alt={method === 'wechat' ? "微信收款码" : "支付宝收款码"} 
              className="w-full h-full object-contain select-auto"
              style={{ WebkitTouchCallout: 'default' }}
            />
          </div>
          
          <div className="bg-[#FAF8F5] w-full py-3 rounded-lg mb-4 border border-[#E5E0D8]">
            <p className="text-xs font-semibold text-[#A89F91] mb-1">长按上方图片保存或识别二维码</p>
            <p className="text-lg font-bold text-[#F4A261] tracking-wider">HKD FPS：53165094</p>
          </div>
          
          <p className="text-sm text-[#A89F91] leading-relaxed font-medium">
            该捐款将百分百用于喂猫<br/>十分感谢(*ෆ´ ˘ `ෆ*)♡
          </p>
        </div>
      </div>
    </div>
  );
};
