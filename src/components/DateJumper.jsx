import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DATA } from '../data/constants';

const DateJumper = ({ isOpen, onClose, onJump, lang, darkMode }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const t = DATA[lang] || DATA['en'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
      <div 
        className={`rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-pop-in ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute top-4 right-4 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}>
          <X size={20} />
        </button>
        
        <h3 className={`text-xl font-bold mb-6 ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
          {t.ui.jumpToDate}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.ui.selectMonth}</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}
            >
              {t.months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.ui.selectYear}</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedYear(y => y - 1)}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <ChevronLeft size={16} />
              </button>
              <input 
                type="number" 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={`flex-1 p-3 text-center border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 font-medium ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              />
              <button 
                onClick={() => setSelectedYear(y => y + 1)}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
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
            className={`w-full py-3 bg-orange-600 text-white rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition-all active:scale-95 mt-4 ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}
          >
            {t.ui.go}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateJumper;