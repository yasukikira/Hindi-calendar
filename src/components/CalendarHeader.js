import React from 'react';
import { ChevronLeft, ChevronRight, Languages, Sun, Quote, Search } from 'lucide-react';
import { DATA } from '../data/constants';

const CalendarHeader = ({ date, onPrev, onNext, onToday, lang, toggleLang, onOpenJump }) => {
  const t = DATA[lang];
  const quoteIndex = (date.getDate() + date.getMonth()) % DATA[lang].quotes.length;
  const quote = DATA[lang].quotes[quoteIndex];

  return (
    <div className="flex flex-col p-4 md:p-6 bg-white border-b border-gray-100 shadow-sm z-20 gap-4">
      {/* Top Row: Date Info & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg items-center justify-center text-white font-bold text-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            {date.getDate()}
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
              {t.months[date.getMonth()]} <span className="font-light text-gray-400">{date.getFullYear()}</span>
            </h1>
            <p className="text-orange-600 font-medium text-xs md:text-sm flex items-center gap-1">
              <Sun size={14} /> {t.ui.samvat} {date.getFullYear() + 57}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
           <button 
            onClick={onOpenJump}
            className="p-2.5 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-600 rounded-xl transition-colors"
            title={t.ui.jumpToDate}
          >
            <Search size={20} />
          </button>

          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-md text-sm font-medium"
          >
            <Languages size={16} />
            <span className="hidden sm:inline">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            <span className="sm:hidden">{lang === 'en' ? 'HI' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Navigation & Quote Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button onClick={onPrev} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <button onClick={onToday} className={`px-4 py-1.5 text-sm font-semibold rounded-lg hover:bg-white hover:shadow-sm transition-all min-w-[80px] ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
            {t.ui.today}
          </button>
          <button onClick={onNext} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-orange-50 border border-orange-100 text-orange-800 px-4 py-2 rounded-xl text-sm max-w-lg">
          <Quote size={18} className="shrink-0 opacity-50" />
          <span className={`italic ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>{quote}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
