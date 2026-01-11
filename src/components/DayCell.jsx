import React, { useMemo } from 'react';
import { DATA } from '../data/constants';
import { calculatePanchang, getHindiMonthIndex, getDayTheme } from '../utils/helpers';

const DayCell = ({ date, isCurrentMonth, isSelected, isToday, events, onClick, lang }) => {
  const panchang = useMemo(() => calculatePanchang(date), [date]);
  const monthIdx = getHindiMonthIndex(date);
  const theme = useMemo(() => getDayTheme(date, panchang, monthIdx, lang), [date, panchang, monthIdx, lang]);
  
  const t = DATA[lang];
  const tithiName = t.tithis[panchang.tithiDisplayIndex];

  let baseClasses = "relative flex flex-col justify-between p-2 h-[110px] md:h-[120px] border-b border-r border-gray-100 transition-all duration-300 group overflow-hidden cursor-pointer ";
  
  if (!isCurrentMonth) {
    baseClasses += "bg-gray-50/40 text-gray-400 ";
  } else if (theme) {
    baseClasses += `theme-${theme.type} `;
    if (!['tricolor', 'holi', 'diwali', 'sankranti', 'eid', 'bakrid', 'muharram', 'milad', 'christmas', 'shivratri', 'navratri', 'janmashtami', 'valentine', 'ganesh', 'rakhi', 'onam', 'buddha'].includes(theme.type)) {
       baseClasses += "bg-orange-50 "; 
    }
  } else if (isSelected) {
    baseClasses += "bg-orange-50 ring-2 ring-inset ring-orange-500 z-10 ";
  } else {
    baseClasses += "bg-white hover:bg-orange-50/30 ";
  }

  const isSunday = date.getDay() === 0;

  return (
    <div onClick={() => onClick(date)} className={baseClasses}>
      <div className="flex justify-between items-start z-10">
        <span className={`
          text-sm md:text-lg font-bold w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all
          ${isToday ? 'bg-red-600 text-white shadow-md animate-pulse-custom' : isSunday ? 'text-red-500' : 'text-gray-700'}
        `}>
          {date.getDate()}
        </span>
        {theme && <span className="text-lg filter drop-shadow-sm transform group-hover:scale-110 transition-transform">{theme.icon}</span>}
      </div>

      <div className="flex gap-1 mt-1 pl-1">
        {events && events.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-1 ring-white" />
        ))}
      </div>

      <div className={`mt-auto text-right z-10 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
        {theme && theme.type !== 'purnima' && theme.type !== 'amavasya' && (
          <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate ${theme.type === 'national' ? 'text-blue-800' : 'text-orange-700'}`}>
            {theme.name}
          </div>
        )}
        <div className={`text-[10px] md:text-[11px] font-medium truncate ${isCurrentMonth ? 'text-gray-500' : 'text-gray-300'}`}>
          {tithiName}
        </div>
      </div>
    </div>
  );
};

export default DayCell;
