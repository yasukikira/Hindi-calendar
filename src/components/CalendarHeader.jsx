import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Sun, Moon, Globe, Check } from 'lucide-react';
import { DATA } from '../data/constants';

const CalendarHeader = ({ date, onPrev, onNext, onToday, lang, setLang, onOpenJump, darkMode, toggleDarkMode }) => {
  const t = DATA[lang] || DATA['en'];
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'gu', label: 'ગુજરાતી' }
  ];

  return (
    <div className={`flex flex-col p-4 md:p-6 border-b shadow-sm z-20 gap-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg items-center justify-center text-white font-bold text-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            {date.getDate()}
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
              {t.months[date.getMonth()]} <span className={`font-light ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{date.getFullYear()}</span>
            </h1>
            <p className="text-orange-600 font-medium text-xs md:text-sm flex items-center gap-1">
              <Sun size={14} /> {t.ui.samvat} {date.getFullYear() + 57}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
           <button 
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

           <button 
            onClick={onOpenJump}
            className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-gray-800 text-gray-300 hover:text-orange-400' : 'bg-gray-100 text-gray-600 hover:text-orange-600 hover:bg-orange-100'}`}
            title={t.ui.jumpToDate}
          >
            <Search size={20} />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center gap-2 px-3 py-2.5 text-white rounded-xl transition-colors shadow-md text-sm font-medium ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-900'}`}
            >
              <Globe size={16} />
              <span className="uppercase">{lang}</span>
            </button>
            
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                <div className={`absolute right-0 top-full mt-2 w-40 rounded-xl shadow-xl border py-2 z-20 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                      <span className={l.code !== 'en' ? 'font-hindi' : ''}>{l.label}</span>
                      {lang === l.code && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-1 p-1 rounded-xl border w-fit ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <button onClick={onPrev} className={`p-2 rounded-lg transition-all ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={onToday} className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all min-w-[80px] ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'hover:bg-white hover:shadow-sm'} ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
          {t.ui.today}
        </button>
        <button onClick={onNext} className={`p-2 rounded-lg transition-all ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;