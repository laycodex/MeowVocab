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
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
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
              className="w-full h-full object-contain select-auto"
              style={{ WebkitTouchCallout: 'default' }}
            />
          </div>
          
          <p className="text-xs font-semibold text-[#A89F91] mb-4 shrink-0">长按上方图片保存或识别二维码</p>

          <div className="bg-[#FAF8F5] w-full p-3 rounded-xl mb-4 border border-[#E5E0D8] text-left space-y-3 shrink-0">
            <div>
              <p className="text-xs text-[#A89F91] mb-1 font-medium">账户转账（支持支付宝）</p>
              <div className="flex items-center justify-between bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm">
                <span className="text-sm font-bold text-[#5C4B41] tracking-wider">6214 8321 7367 1012</span>
                <button onClick={() => handleCopy('6214832173671012', 'account')} className="text-[#F4A261] hover:text-[#E9C46A] p-1 transition-colors bg-[#FAF8F5] rounded-md border border-[#E5E0D8]">
                  {copiedField === 'account' ? <Check className="w-4 h-4 text-[#07C160]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-xs text-[#A89F91] mb-1 font-medium">收款人</p>
                <div className="flex items-center justify-between bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm">
                  <span className="text-sm font-bold text-[#5C4B41]">陈正昊</span>
                  <button onClick={() => handleCopy('陈正昊', 'name')} className="text-[#F4A261] hover:text-[#E9C46A] p-1 transition-colors bg-[#FAF8F5] rounded-md border border-[#E5E0D8]">
                    {copiedField === 'name' ? <Check className="w-4 h-4 text-[#07C160]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xs text-[#A89F91] mb-1 font-medium">HKD FPS</p>
                <div className="flex items-center justify-between bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm">
                  <span className="text-sm font-bold text-[#5C4B41] tracking-wider">53165094</span>
                  <button onClick={() => handleCopy('53165094', 'fps')} className="text-[#F4A261] hover:text-[#E9C46A] p-1 transition-colors bg-[#FAF8F5] rounded-md border border-[#E5E0D8]">
                    {copiedField === 'fps' ? <Check className="w-4 h-4 text-[#07C160]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-[#A89F91] leading-relaxed font-medium shrink-0">
            该捐款将百分百用于喂猫<br/>十分感谢(*ෆ´ ˘ `ෆ*)♡
          </p>
        </div>
      </div>
    </div>
  );
};
