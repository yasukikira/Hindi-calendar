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
    <div className="flex flex-col p-4 md:p-6 bg-white border-b border-gray-100 shadow-sm z-20 gap-4 transition-colors duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Date Display */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg items-center justify-center text-white font-bold text-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            {date.getDate()}
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
              {t.months[date.getMonth()]} <span className="font-light text-gray-400">{date.getFullYear()}</span>
            </h1>
            <p className="text-orange-600 font-medium text-xs md:text-sm flex items-center gap-1">
              <Sun size={14} /> {t.ui.samvat} {date.getFullYear() + 57}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
           
           {/* Dark Mode Toggle */}
           <button 
            onClick={toggleDarkMode}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

           <button 
            onClick={onOpenJump}
            className="p-2.5 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-600 rounded-xl transition-colors"
            title={t.ui.jumpToDate}
          >
            <Search size={20} />
          </button>

          {/* Language Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-md text-sm font-medium"
            >
              <Globe size={16} />
              <span className="uppercase">{lang}</span>
            </button>
            
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left"
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

      {/* Navigation */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 w-fit">
        <button onClick={onPrev} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
          <ChevronLeft size={20} />
        </button>
        <button onClick={onToday} className={`px-4 py-1.5 text-sm font-semibold rounded-lg hover:bg-white hover:shadow-sm transition-all min-w-[80px] ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
          {t.ui.today}
        </button>
        <button onClick={onNext} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;