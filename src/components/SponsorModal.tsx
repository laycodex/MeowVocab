import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import wechatImg from '../assets/wechat.png';
import alipayImg from '../assets/alipay.png';

interface SponsorModalProps {
  onClose: () => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ onClose }) => {
  const [method, setMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [copiedField, setCopiedField] = useState<'account' | 'name' | 'fps' | null>(null);

  const handleCopy = (text: string, field: 'account' | 'name' | 'fps') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90dvh]">
        <div className="p-4 border-b border-[#E5E0D8] flex justify-between items-center bg-[#FAF8F5] shrink-0">
          <h2 className="text-lg font-bold text-[#5C4B41]">赞助猫粮 🐱</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#E5E0D8] text-[#A89F91] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 flex flex-col items-center text-center overflow-y-auto hide-scrollbar">
          <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D8] mb-4 w-full shrink-0">
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

          <div className="w-48 h-48 bg-gray-100 rounded-xl mb-3 overflow-hidden border-2 border-[#E9C46A] p-2 relative shrink-0">
            <img 
              src={method === 'wechat' ? wechatImg : alipayImg} 
              alt={method === 'wechat' ? "微信收款码" : "支付宝收款码"} 
              className="w-full h-full object-contain select-auto pointer-events-auto"
              style={{ WebkitTouchCallout: 'default', WebkitUserSelect: 'auto', userSelect: 'auto' }}
            />
          </div>
          
          <p className="text-xs font-semibold text-[#A89F91] mb-4 shrink-0">长按上方图片保存或识别二维码</p>
          
          <p className="text-sm text-[#A89F91] leading-relaxed font-medium shrink-0">
            该捐款将百分百用于喂猫<br/>十分感谢(*ෆ´ ˘ `ෆ*)♡
          </p>
        </div>
      </div>
    </div>
  );
};
