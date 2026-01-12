import React, { useMemo } from 'react';
import { DATA } from '../data/constants';
import { calculatePanchang, getHindiMonthIndex, getDayTheme } from '../utils/helpers';

const DayCell = ({ date, isCurrentMonth, isSelected, isToday, events, onClick, lang }) => {
  const panchang = useMemo(() => calculatePanchang(date), [date]);
  const monthIdx = getHindiMonthIndex(date);
  const theme = useMemo(() => getDayTheme(date, panchang, monthIdx, lang), [date, panchang, monthIdx, lang]);
  
  const t = DATA[lang] || DATA['en'];
  const tithiName = t.tithis[panchang.tithiDisplayIndex];

  // Base Class
  let className = "relative flex flex-col justify-between p-2 h-[110px] md:h-[120px] border-b border-r border-gray-100 dark:border-gray-800 transition-all duration-300 group overflow-hidden cursor-pointer ";
  
  // Logic for Background & Colors
  if (!isCurrentMonth) {
    className += "bg-gray-50/40 dark:bg-gray-800/40 text-gray-400 dark:text-gray-600 ";
  } else if (theme) {
    // If a theme exists, apply it (overrides standard dark mode)
    className += `theme-${theme.type} `;
    
    // Add default padding/bg for non-heavy themes
    if (!['national', 'holi', 'diwali', 'newyear', 'eid', 'bakrid', 'christmas', 'shivratri', 'janmashtami', 'amavasya'].includes(theme.type)) {
       className += "bg-orange-50 dark:bg-gray-800 "; // Mild themes get standard background
    }
  } else if (isSelected) {
    className += "bg-orange-50 dark:bg-gray-700 ring-2 ring-inset ring-orange-500 z-10 ";
  } else {
    // Default Day
    className += "bg-white dark:bg-gray-900 hover:bg-orange-50/30 dark:hover:bg-gray-800 ";
  }

  const isSunday = date.getDay() === 0;

  return (
    <div onClick={() => onClick(date)} className={className}>
      <div className="flex justify-between items-start z-10">
        <span className={`
          text-sm md:text-lg font-bold w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all
          ${isToday ? 'bg-red-600 text-white shadow-md animate-pulse-custom' : isSunday ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
          ${theme ? '!text-inherit' : ''} /* Themes inherit their own specific text color */
        `}>
          {date.getDate()}
        </span>
        {theme && <span className="text-lg filter drop-shadow-sm transform group-hover:scale-110 transition-transform">{theme.icon}</span>}
      </div>

      <div className="flex gap-1 mt-1 pl-1">
        {events && events.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-1 ring-white dark:ring-gray-900" />
        ))}
      </div>

      <div className={`mt-auto text-right z-10 ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
        {theme && theme.type !== 'purnima' && theme.type !== 'amavasya' && (
          <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate ${theme.type === 'national' ? 'text-blue-800' : 'text-orange-700 dark:text-orange-400'} ${theme ? '!text-inherit' : ''}`}>
            {theme.name}
          </div>
        )}
        <div className={`text-[10px] md:text-[11px] font-medium truncate ${isCurrentMonth ? (theme ? 'opacity-80' : 'text-gray-500 dark:text-gray-400') : 'text-gray-300 dark:text-gray-600'}`}>
          {tithiName}
        </div>
      </div>
    </div>
  );
};

export default DayCell;