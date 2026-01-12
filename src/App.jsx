import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar as CalIcon } from 'lucide-react'; // Added icons for new UI
import CustomStyles from './styles/CustomStyles';
import CalendarHeader from './components/CalendarHeader';
import DayCell from './components/DayCell';
import DateJumper from './components/DateJumper';
import DetailPanel from './components/DetailPanel';
import GalaxyBackground from './components/GalaxyBackground'; 
import { DATA, MUHURAT_CATEGORIES, MUHURAT_DATES } from './data/constants';

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // 1. PERSISTENCE FIX: Load from LocalStorage
  const [events, setEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hindiCalendarEvents') || '{}');
    } catch {
      return {};
    }
  });

  const [showJumpModal, setShowJumpModal] = useState(false);
  const [showMuhuratModal, setShowMuhuratModal] = useState(false);
  const [muhuratCategory, setMuhuratCategory] = useState(null); // New State for Modal UI
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [lang, setLang] = useState(() => localStorage.getItem('hindiCalendarLang') || 'en');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('hindiCalendarTheme') === 'dark');

  // 2. PERSISTENCE FIX: Save to LocalStorage whenever events change
  useEffect(() => {
    localStorage.setItem('hindiCalendarEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => { localStorage.setItem('hindiCalendarLang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('hindiCalendarTheme', darkMode ? 'dark' : 'light'); }, [darkMode]);

  // 3. NOTIFICATION SYSTEM: Check for today's notes on load
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
      
      const todayKey = new Date().toDateString();
      if (events[todayKey] && events[todayKey].length > 0 && Notification.permission === "granted") {
        new Notification("📅 Today's Notes", {
          body: `You have ${events[todayKey].length} note(s) for today:\n${events[todayKey][0]}...`,
          icon: "/pwa-192x192.png" // Assumes you have PWA icons
        });
      }
    }
  }, []); // Runs once on mount

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleTransition = (callback) => {
    setIsAnimating(true);
    setTimeout(() => { callback(); setTimeout(() => setIsAnimating(false), 300); }, 100);
  };
  const handleLangChange = (newLang) => handleTransition(() => setLang(newLang));
  const changeMonth = (delta) => handleTransition(() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)));
  const handleDateJump = (newDate) => handleTransition(() => { setCurrentDate(newDate); setSelectedDate(newDate); });
  const goToToday = () => handleTransition(() => { const now = new Date(); setCurrentDate(now); setSelectedDate(now); });
  
  const handleAddEvent = (txt) => {
    if (!selectedDate || !txt.trim()) return;
    const key = selectedDate.toDateString();
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), txt] }));
  };

  // 4. MANAGEMENT FIX: Delete Event Handler
  const handleDeleteEvent = (index) => {
    if (!selectedDate) return;
    const key = selectedDate.toDateString();
    setEvents(prev => {
      const newEvents = [...(prev[key] || [])];
      newEvents.splice(index, 1);
      if (newEvents.length === 0) {
        const { [key]: deleted, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newEvents };
    });
  };

  const t = DATA[lang] || DATA['en'];

  const getDays = useCallback(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ d: new Date(y, m - 1, daysInPrev - i), current: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ d: new Date(y, m, i), current: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ d: new Date(y, m + 1, i), current: false });
    return days;
  }, [currentDate]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark-mode' : 'bg-[#f8f9fa] text-gray-900'} ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
      <CustomStyles />
      {darkMode && <GalaxyBackground />}

      <div className={`max-w-6xl mx-auto min-h-screen flex flex-col shadow-2xl border-x ${darkMode ? 'border-gray-800 bg-gray-900/80 backdrop-blur-sm' : 'border-gray-100 bg-white'} relative z-10`}>
        <CalendarHeader 
          date={currentDate} 
          lang={lang} 
          setLang={handleLangChange} 
          onPrev={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
          onToday={goToToday}
          onOpenJump={() => setShowJumpModal(true)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className={`px-4 py-2 border-b ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-orange-50'} flex justify-between items-center`}>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">{t.ui.muhuratFor || "Muhurats"} 2026</span>
          <button onClick={() => { setShowMuhuratModal(true); setMuhuratCategory(null); }} className="text-xs font-bold underline decoration-orange-400 decoration-2 underline-offset-4 hover:text-orange-600">
            {t.ui.find || "Find Dates"} →
          </button>
        </div>

        <div className={`grid grid-cols-7 border-b ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white'}`}>
          {t.weekdays.map((day, i) => (
            <div key={i} className={`py-4 text-center font-bold text-xs md:text-sm uppercase tracking-widest ${i === 0 ? 'text-red-500' : (darkMode ? 'text-gray-400' : 'text-gray-400')}`}>
              {day}
            </div>
          ))}
        </div>

        <div className={`flex-1 grid grid-cols-7 grid-rows-6 gap-[1px] border-b ${darkMode ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-100 border-gray-200'} transition-content ${isAnimating ? 'content-hidden' : 'content-visible'}`}>
          {getDays().map((item, idx) => {
            const isToday = item.d.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && item.d.toDateString() === selectedDate.toDateString();
            return (
              <DayCell 
                key={idx}
                date={item.d}
                isCurrentMonth={item.current}
                isToday={isToday}
                isSelected={isSelected}
                events={events[item.d.toDateString()]}
                onClick={setSelectedDate}
                lang={lang}
                darkMode={darkMode}
              />
            );
          })}
        </div>
        
        <div className={`p-4 text-center text-xs border-t uppercase tracking-widest flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-900/50 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
           <span>Digital Panchang</span>
           <span>•</span>
           <span>Made with ❤️ in India</span>
        </div>
      </div>

      <DateJumper isOpen={showJumpModal} onClose={() => setShowJumpModal(false)} onJump={handleDateJump} lang={lang} darkMode={darkMode} />

      {/* 5. NEW 2-STEP MUHURAT UI */}
      {showMuhuratModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowMuhuratModal(false)}>
          <div className={`w-full max-w-md rounded-2xl p-6 relative h-[500px] flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} animate-pop-in`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowMuhuratModal(false)} className="absolute top-4 right-4 p-2 bg-black/10 rounded-full hover:bg-black/20 z-10">✕</button>
            
            {!muhuratCategory ? (
              // STEP 1: Categories
              <>
                <h2 className="text-xl font-bold mb-6">{t.ui.finder || "Muhurat Finder"}</h2>
                <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                  {MUHURAT_CATEGORIES.map((cat) => (
                    <div key={cat.id} className={`p-4 rounded-xl border cursor-pointer hover:border-orange-500 transition-all ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
                      onClick={() => setMuhuratCategory(cat)}
                    >
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <div className="font-medium text-sm">{cat.label[lang] || cat.label['en']}</div>
                      <div className="text-xs opacity-60 mt-1">{MUHURAT_DATES[cat.id].length} Dates</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // STEP 2: List of Dates
              <>
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setMuhuratCategory(null)} className="p-2 rounded-full hover:bg-black/10"><ArrowLeft size={20} /></button>
                  <h2 className="text-xl font-bold flex items-center gap-2">{muhuratCategory.icon} {muhuratCategory.label[lang] || muhuratCategory.label['en']}</h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {MUHURAT_DATES[muhuratCategory.id].map((dateStr, i) => {
                    const d = new Date(dateStr);
                    return (
                      <div key={i} onClick={() => { handleDateJump(d); setShowMuhuratModal(false); }}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:border-orange-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <CalIcon size={16} className="text-orange-500"/>
                          <span className="font-medium">{d.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <span className="text-xs opacity-50">Go →</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedDate && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={() => setSelectedDate(null)} />
          <DetailPanel 
            date={selectedDate} 
            onClose={() => setSelectedDate(null)} 
            events={events[selectedDate.toDateString()] || []} 
            onAddEvent={handleAddEvent} 
            onDeleteEvent={handleDeleteEvent} // Pass delete handler
            lang={lang} 
            darkMode={darkMode} 
          />
        </>
      )}
    </div>
  );
};

export default App;