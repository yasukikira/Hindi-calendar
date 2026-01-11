import React, { useState, useEffect, useCallback } from 'react';
import CustomStyles from './styles/CustomStyles';
import CalendarHeader from './components/CalendarHeader';
import DayCell from './components/DayCell';
import DateJumper from './components/DateJumper';
import DetailPanel from './components/DetailPanel';
import { DATA } from './data/constants';

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('hindiCalendarLang') || 'en';
    } catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem('hindiCalendarLang', lang); } catch (e) {}
  }, [lang]);

  const handleTransition = (callback) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsAnimating(false), 300);
    }, 100);
  };

  const toggleLang = () => handleTransition(() => setLang(l => l === 'en' ? 'hi' : 'en'));
  const changeMonth = (delta) => handleTransition(() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)));
  const handleDateJump = (newDate) => handleTransition(() => {
     setCurrentDate(newDate);
     setSelectedDate(newDate);
  });
  const goToToday = () => handleTransition(() => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  });

  const t = DATA[lang];

  const getDays = useCallback(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();
    
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ d: new Date(y, m - 1, daysInPrev - i), current: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ d: new Date(y, m, i), current: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ d: new Date(y, m + 1, i), current: false });
    }
    return days;
  }, [currentDate]);

  const handleAddEvent = (txt) => {
    if (!selectedDate || !txt.trim()) return;
    const key = selectedDate.toDateString();
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), txt] }));
  };

  return (
    <div className={`min-h-screen bg-[#f8f9fa] text-gray-900 selection:bg-orange-100 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
      <CustomStyles />

      <div className="max-w-6xl mx-auto min-h-screen flex flex-col bg-white shadow-2xl border-x border-gray-100 relative">
        <CalendarHeader 
          date={currentDate} 
          lang={lang}
          onPrev={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
          onToday={goToToday}
          toggleLang={toggleLang}
          onOpenJump={() => setShowJumpModal(true)}
        />

        <div className="grid grid-cols-7 bg-white border-b border-gray-100">
          {t.weekdays.map((day, i) => (
            <div key={i} className={`py-4 text-center font-bold text-xs md:text-sm uppercase tracking-widest ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className={`
          flex-1 grid grid-cols-7 grid-rows-6 bg-gray-100 gap-[1px] border-b border-gray-200 
          transition-content ${isAnimating ? 'content-hidden' : 'content-visible'}
        `}>
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
              />
            );
          })}
        </div>
        
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-200 uppercase tracking-widest flex items-center justify-center gap-2">
           <span>Digital Panchang</span>
           <span>•</span>
           <span>Made with ❤️ in India</span>
        </div>
      </div>

      <DateJumper 
        isOpen={showJumpModal}
        onClose={() => setShowJumpModal(false)}
        onJump={handleDateJump}
        lang={lang}
      />

      {selectedDate && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setSelectedDate(null)}
          />
          <DetailPanel 
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
            events={events[selectedDate.toDateString()] || []}
            onAddEvent={handleAddEvent}
            lang={lang}
          />
        </>
      )}

    </div>
  );
};

export default App;