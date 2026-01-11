import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Calendar as CalendarIcon, Clock, MapPin, Share2 } from 'lucide-react';
import SunCalc from 'suncalc';
import { DATA, NAKSHATRAS_EN, NAKSHATRAS_HI } from '../data/constants';
import { calculatePanchang, getHindiMonthIndex, getDayTheme, getChoghadiya } from '../utils/helpers';
import Confetti from './Confetti';

// Visual Moon Widget Component (Updated with Translation)
const MoonPhaseVisual = ({ tithiRaw, lang }) => {
  // 0-14: Shukla (Waxing), 15-29: Krishna (Waning)
  const isWaxing = tithiRaw < 15;
  const phase = isWaxing ? tithiRaw / 15 : (30 - tithiRaw) / 15;
  
  const maskX = isWaxing ? -50 + (phase * 100) : 50 - (phase * 100);
  
  // Translation logic for the widget
  const label = lang === 'hi' 
    ? (isWaxing ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष') 
    : (isWaxing ? 'Waxing' : 'Waning');

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-xl text-white">
      <div className="relative w-16 h-16 rounded-full bg-gray-700 overflow-hidden shadow-inner border border-gray-600">
        <div 
          className="absolute inset-0 bg-yellow-100 rounded-full transition-all duration-500"
          style={{ 
            opacity: phase,
            transform: `scale(${0.2 + (phase * 0.8)})` 
          }}
        />
        <div className="absolute top-0 right-0 w-8 h-8 bg-white opacity-20 blur-md rounded-full" />
      </div>
      <span className="text-xs font-medium mt-2 text-gray-300 uppercase tracking-widest">
        {label} • {Math.round(phase * 100)}%
      </span>
    </div>
  );
};

const DetailPanel = ({ date, onClose, events, onAddEvent, lang }) => {
  const t = DATA[lang];
  const panchang = calculatePanchang(date);
  const hindiMonthIdx = getHindiMonthIndex(date);
  const theme = getDayTheme(date, panchang, hindiMonthIdx, lang);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Location State
  const [location, setLocation] = useState(null);
  const [sunTimes, setSunTimes] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  const nakshatraName = lang === 'hi' ? NAKSHATRAS_HI[panchang.nakshatraIndex] : NAKSHATRAS_EN[panchang.nakshatraIndex];
  const monthName = t.hindiMonths[hindiMonthIdx];
  const tithiName = t.tithis[panchang.tithiDisplayIndex];
  const pakshaName = t.paksha[panchang.paksha];
  const choghadiya = getChoghadiya(date, lang);

  // Load Location
  useEffect(() => {
    // Default Fallback (Central India - Indore)
    const defaultLoc = { lat: 22.7196, lng: 75.8577 }; 
    
    if (navigator.geolocation) {
      setLocLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          setSunTimes(SunCalc.getTimes(date, loc.lat, loc.lng));
          setLocLoading(false);
        },
        () => {
          // Denied/Error -> Use Default
          setLocation(null); 
          setSunTimes(SunCalc.getTimes(date, defaultLoc.lat, defaultLoc.lng));
          setLocLoading(false);
        }
      );
    } else {
      setSunTimes(SunCalc.getTimes(date, defaultLoc.lat, defaultLoc.lng));
    }
  }, [date]);

  const formatTime = (dateObj) => {
    if (!dateObj) return "--:--";
    let h = dateObj.getHours();
    const m = dateObj.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const addToGoogleCalendar = () => {
    const title = theme ? theme.name : `Panchang: ${tithiName}`;
    const desc = `${tithiName}, ${pakshaName} Paksha. Nakshatra: ${nakshatraName}.`;
    
    const start = new Date(date);
    start.setHours(9, 0, 0); 
    const end = new Date(date);
    end.setHours(10, 0, 0);

    const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(desc)}`;
    
    window.open(url, '_blank');
  };

  const getRelativeLabel = (targetDate) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t.ui.today;
    if (lang === 'hi') {
      if (diffDays === 1) return "कल (आने वाला)";
      if (diffDays === -1) return "कल (बीता हुआ)";
      if (diffDays > 0) return `${diffDays} दिन बाद`;
      return `${Math.abs(diffDays)} दिन पहले`;
    } else {
      if (diffDays === 1) return "Tomorrow";
      if (diffDays === -1) return "Yesterday";
      if (diffDays > 0) return `In ${diffDays} days`;
      return `${Math.abs(diffDays)} days ago`;
    }
  };

  const relativeLabel = getRelativeLabel(date);
  const isFestive = theme && ['national', 'diwali', 'holi', 'rakhi', 'ganesh', 'onam', 'navratri', 'christmas', 'eid', 'bakrid', 'muharram', 'milad', 'newyear'].includes(theme.type);

  const getHeaderGradient = () => {
    if (!theme) return 'bg-gradient-to-br from-gray-900 to-gray-800';
    switch(theme.type) {
      case 'newyear': return 'bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700';
      case 'national': return 'bg-gradient-to-r from-orange-500 via-white to-green-600';
      case 'holi': return 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';
      case 'ganesh': return 'bg-gradient-to-br from-orange-500 to-red-600';
      case 'rakhi': return 'bg-gradient-to-r from-amber-400 to-red-500';
      case 'onam': return 'bg-gradient-to-r from-emerald-500 to-yellow-400';
      case 'sankranti': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'eid': return 'bg-gradient-to-r from-green-600 to-emerald-800';
      case 'bakrid': return 'bg-gradient-to-r from-green-700 to-yellow-600';
      case 'muharram': return 'bg-gradient-to-r from-gray-700 to-gray-900';
      case 'milad': return 'bg-gradient-to-r from-lime-500 to-green-600';
      case 'christmas': return 'bg-gradient-to-r from-red-600 to-green-700';
      case 'shivratri': return 'bg-gradient-to-br from-indigo-900 to-slate-900';
      case 'navratri': return 'bg-gradient-to-r from-fuchsia-600 to-purple-600';
      case 'janmashtami': return 'bg-gradient-to-br from-teal-500 to-blue-600';
      case 'valentine': return 'bg-gradient-to-r from-pink-400 to-rose-500';
      default: return 'bg-gradient-to-br from-gray-900 to-gray-800';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 animate-slide-in flex flex-col font-sans">
      <div className={`relative p-6 text-white overflow-hidden shrink-0 transition-colors duration-500 ${getHeaderGradient()}`}>
        {isFestive && <Confetti />}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-colors z-20">
          <X size={20} className="text-white" />
        </button>

        <div className={`relative z-10 ${['national', 'sankranti'].includes(theme?.type) ? 'text-gray-900' : 'text-white'}`}>
          <h2 className="text-6xl font-bold tracking-tighter mb-1">{date.getDate()}</h2>
          <p className="text-xl opacity-90 font-medium">{t.months[date.getMonth()]} {date.getFullYear()}</p>
          
          <div className="flex items-center gap-2 mt-4 opacity-80 text-sm uppercase tracking-widest">
            <span>{t.weekdays[date.getDay()]}</span>
            <span>•</span>
            <span className="font-semibold">{theme ? theme.name : relativeLabel}</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-100 bg-white">
        {['overview', 'panchang', 'muhurat'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-3 text-sm font-medium transition-colors relative
              ${activeTab === tab ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-50'}
              ${lang === 'hi' ? 'font-hindi' : 'font-eng'}
            `}
          >
            {t.ui.tabs[tab]}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <Sun size={24} className="text-orange-500 mb-2" />
                   <span className="text-xs text-gray-500 uppercase">{t.ui.sunrise}</span>
                   <span className="font-bold text-gray-800">{sunTimes ? formatTime(sunTimes.sunrise) : '--:--'}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <Moon size={24} className="text-indigo-500 mb-2" />
                   <span className="text-xs text-gray-500 uppercase">{t.ui.sunset}</span>
                   <span className="font-bold text-gray-800">{sunTimes ? formatTime(sunTimes.sunset) : '--:--'}</span>
                </div>
             </div>

             {/* Location Badge (Now Translated) */}
             <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
               <MapPin size={12} />
               {locLoading ? 
                 <span>{lang === 'hi' ? 'स्थान खोज रहा है...' : 'Locating...'}</span> : 
                 location ? 
                   <span>{lang === 'hi' ? 'GPS समय सक्रिय' : 'Using GPS Time'}</span> : 
                   <span>{lang === 'hi' ? 'अनुमानित समय (इंदौर)' : 'Estimated Time (Indore)'}</span>
               }
             </div>

             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-gray-800 font-bold flex items-center gap-2 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
                  <CalendarIcon size={18} className="text-blue-600" /> {t.ui.events}
                </h3>
                <button 
                  onClick={addToGoogleCalendar}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                  title={lang === 'hi' ? "गूगल कैलेंडर में जोड़ें" : "Add to Google Calendar"}
                >
                  <Share2 size={16} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                {events && events.length > 0 ? (
                  events.map((evt, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                      <p className="text-sm text-gray-700 leading-relaxed">{evt}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 italic text-sm py-4">{t.ui.noEvents}</p>
                )}
              </div>
              <div className="flex gap-2 relative group">
                <input 
                  type="text" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.ui.addNote}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && (onAddEvent(note), setNote(''))}
                />
                <button 
                  onClick={() => { if(note.trim()) { onAddEvent(note); setNote(''); }}}
                  className="bg-gray-900 text-white px-4 rounded-lg hover:bg-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'panchang' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className={`text-orange-600 font-bold flex items-center gap-2 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
                <Sun size={18} /> Panchang
              </h3>
            </div>

            {/* Visual Moon Widget (Props updated to pass language) */}
            <MoonPhaseVisual tithiRaw={panchang.tithiRaw} lang={lang} />

            <div className={`space-y-6 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-gray-500 text-sm">{t.ui.tithi}</span>
                <span className="font-semibold text-gray-800 text-lg">{tithiName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-gray-500 text-sm">{t.ui.paksha}</span>
                <span className="font-semibold text-gray-800 text-lg">{pakshaName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-gray-500 text-sm">{t.ui.nakshatra}</span>
                <span className="font-semibold text-gray-800 text-lg">{nakshatraName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-gray-500 text-sm">Hindi Month</span>
                <span className="font-semibold text-gray-800 text-lg">{monthName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">{t.ui.yoga}</span>
                <span className="font-semibold text-gray-800 text-lg">Yoga {panchang.yogaIndex + 1}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'muhurat' && (
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
             <h3 className={`text-purple-600 font-bold mb-4 flex items-center gap-2 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
              <Clock size={18} /> {t.ui.choghadiya}
            </h3>
            <div className="space-y-2">
              {choghadiya.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded px-2 transition-colors">
                  <span className="text-gray-500 font-mono text-xs">{c.time}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>{c.label}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${c.quality === 'good' ? 'bg-green-500' : c.quality === 'bad' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;