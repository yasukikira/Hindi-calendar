import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DATA } from '../data/constants';

const DateJumper = ({ isOpen, onClose, onJump, lang }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const t = DATA[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-pop-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
          <X size={20} />
        </button>
        
        <h3 className={`text-xl font-bold text-gray-800 mb-6 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
          {t.ui.jumpToDate}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t.ui.selectMonth}</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}
            >
              {t.months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t.ui.selectYear}</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedYear(y => y - 1)}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ChevronLeft size={16} />
              </button>
              <input 
                type="number" 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="flex-1 p-3 text-center bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
              <button 
                onClick={() => setSelectedYear(y => y + 1)}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => {
              onJump(new Date(selectedYear, selectedMonth, 1));
              onClose();
            }}
            className={`w-full py-3 bg-orange-600 text-white rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition-all active:scale-95 mt-4 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}
          >
            {t.ui.go}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateJumper;
