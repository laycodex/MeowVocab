import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-[#E5E0D8] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#5C4B41] focus:outline-none focus:ring-2 focus:ring-[#F4A261] shadow-sm transition-all active:scale-[0.98]"
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89F91]">
          {icon}
        </div>
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 text-[#A89F91] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-[#E5E0D8] rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt, index) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                value === opt.value ? 'bg-[#FAF8F5] text-[#F4A261] font-bold' : 'text-[#5C4B41] hover:bg-[#FAF8F5]'
              } ${index !== options.length - 1 ? 'border-b border-[#E5E0D8]/50' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
