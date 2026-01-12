import React, { useMemo } from 'react';
import { DATA } from '../data/constants';
import { calculatePanchang, getHindiMonthIndex, getDayTheme } from '../utils/helpers';

const DayCell = ({ date, isCurrentMonth, isSelected, isToday, events, onClick, lang, darkMode }) => {
  const panchang = useMemo(() => calculatePanchang(date), [date]);
  const monthIdx = getHindiMonthIndex(date);
  const theme = useMemo(() => getDayTheme(date, panchang, monthIdx, lang), [date, panchang, monthIdx, lang]);
  
  const t = DATA[lang] || DATA['en'];
  const tithiName = t.tithis[panchang.tithiDisplayIndex];

  // FIXED: Manual Logic to Prevent System Dark Mode Interference
  let bgClass = "";
  let textClass = "";

  if (!isCurrentMonth) {
    bgClass = darkMode ? "bg-gray-800/40" : "bg-gray-50/60";
    textClass = darkMode ? "text-gray-600" : "text-gray-400";
  } else if (theme) {
    bgClass = `theme-${theme.type}`;
    // Fallback for themes without heavy backgrounds
    if (!['national', 'holi', 'diwali', 'newyear', 'eid', 'bakrid', 'christmas', 'shivratri', 'janmashtami', 'amavasya', 'purnima'].includes(theme.type)) {
       bgClass = darkMode ? "bg-gray-800" : "bg-orange-50"; 
    }
    textClass = "text-inherit"; 
  } else if (isSelected) {
    bgClass = darkMode ? "bg-gray-700 ring-2 ring-orange-500" : "bg-orange-50 ring-2 ring-orange-500";
    textClass = darkMode ? "text-white" : "text-gray-900";
  } else {
    // STANDARD DAY - Manually set colors
    bgClass = darkMode ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-orange-50/50";
    textClass = darkMode ? "text-gray-300" : "text-gray-700";
  }

  const isSunday = date.getDay() === 0;

  return (
    <div onClick={() => onClick(date)} className={`relative flex flex-col justify-between p-2 h-[110px] md:h-[120px] border-b border-r transition-all duration-300 group overflow-hidden cursor-pointer ${darkMode ? 'border-gray-800' : 'border-gray-100'} ${bgClass} ${textClass}`}>
      <div className="flex justify-between items-start z-10">
        <span className={`text-sm md:text-lg font-bold w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-red-600 text-white shadow-md animate-pulse-custom' : isSunday ? (darkMode ? 'text-red-400' : 'text-red-500') : ''}`}>
          {date.getDate()}
        </span>
        {theme && <span className="text-lg filter drop-shadow-sm transform group-hover:scale-110 transition-transform">{theme.icon}</span>}
      </div>
      <div className="flex gap-1 mt-1 pl-1">
        {events && events.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
        ))}
      </div>
      <div className={`mt-auto text-right z-10 ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
        {theme && theme.type !== 'purnima' && theme.type !== 'amavasya' && (
          <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate ${theme.type === 'national' ? 'text-blue-800' : (darkMode ? 'text-orange-300' : 'text-orange-700')} ${theme ? '!text-inherit' : ''}`}>
            {theme.name}
          </div>
        )}
        <div className={`text-[10px] md:text-[11px] font-medium truncate ${isCurrentMonth ? (theme ? 'opacity-90' : (darkMode ? 'text-gray-400' : 'text-gray-500')) : (darkMode ? 'text-gray-600' : 'text-gray-300')}`}>
          {tithiName}
        </div>
      </div>
    </div>
  );
};

export default DayCell;