import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Calendar as CalendarIcon, MapPin, MessageCircle, CalendarPlus, AlertTriangle } from 'lucide-react';
import SunCalc from 'suncalc';
import { DATA, NAKSHATRAS_EN, NAKSHATRAS_HI, NAKSHATRAS_MR, NAKSHATRAS_GU } from '../data/constants';
import { calculatePanchang, getHindiMonthIndex, getDayTheme, getChoghadiya, getAuspiciousTimes } from '../utils/helpers';
import Confetti from './Confetti';

const MoonPhaseVisual = ({ tithiRaw, lang }) => {
  const isWaxing = tithiRaw < 15;
  const phase = isWaxing ? tithiRaw / 15 : (30 - tithiRaw) / 15;
  const t = DATA[lang] || DATA['en'];
  const label = isWaxing ? t.ui.waxing : t.ui.waning;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-xl text-white shadow-lg border border-gray-700">
      <div className="relative w-16 h-16 rounded-full bg-gray-800 overflow-hidden shadow-inner border border-gray-600">
        <div className="absolute inset-0 bg-yellow-100 rounded-full transition-all duration-500" style={{ opacity: Math.max(0.1, phase), transform: `scale(${0.2 + (phase * 0.8)})` }} />
        <div className="absolute top-0 right-0 w-8 h-8 bg-white opacity-20 blur-md rounded-full" />
      </div>
      <span className="text-xs font-medium mt-2 text-gray-300 uppercase tracking-widest">{label} • {Math.round(phase * 100)}%</span>
    </div>
  );
};

const DetailPanel = ({ date, onClose, events, onAddEvent, lang, darkMode }) => {
  const t = DATA[lang] || DATA['en'];
  const panchang = calculatePanchang(date);
  const hindiMonthIdx = getHindiMonthIndex(date);
  const theme = getDayTheme(date, panchang, hindiMonthIdx, lang);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [location, setLocation] = useState(null);
  const [sunTimes, setSunTimes] = useState(null);
  const [auspicious, setAuspicious] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  let nakshatraList = NAKSHATRAS_EN;
  if (lang === 'hi') nakshatraList = NAKSHATRAS_HI;
  if (lang === 'mr') nakshatraList = NAKSHATRAS_MR;
  if (lang === 'gu') nakshatraList = NAKSHATRAS_GU;
  
  const nakshatraName = nakshatraList[panchang.nakshatraIndex];
  const monthName = t.hindiMonths[hindiMonthIdx];
  const tithiName = t.tithis[panchang.tithiDisplayIndex];
  const pakshaName = t.paksha[panchang.paksha];
  const choghadiya = getChoghadiya(date, lang);

  useEffect(() => {
    const defaultLoc = { lat: 22.7196, lng: 75.8577 }; 
    const calcTimes = (lat, lng) => {
       const times = SunCalc.getTimes(date, lat, lng);
       setSunTimes(times);
       setAuspicious(getAuspiciousTimes(date, times));
    };
    if (navigator.geolocation) {
      setLocLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); calcTimes(pos.coords.latitude, pos.coords.longitude); setLocLoading(false); },
        () => { calcTimes(defaultLoc.lat, defaultLoc.lng); setLocLoading(false); }
      );
    } else { calcTimes(defaultLoc.lat, defaultLoc.lng); }
  }, [date]);

  const formatTime = (dateObj) => {
    if (!dateObj) return "--:--";
    let h = dateObj.getHours();
    const m = dateObj.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; h = h ? h : 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleShare = async () => {
    const title = lang === 'en' ? `📅 Daily Panchang` : `📅 ${t.ui.today} ${t.ui.tabs.panchang}`;
    const text = `${title} • ${date.toDateString()}\n✨ ${theme ? theme.name : ''}\n🌕 ${tithiName}, ${pakshaName}\n🌟 ${nakshatraName}\nCheck: https://yasukikira.github.io/Hindi-calendar/`;
    if (navigator.share) { try { await navigator.share({ title: 'Hindi Calendar', text }); } catch (err) {} } else { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }
  };

  const addToGoogleCalendar = () => {
    const title = theme ? theme.name : `Panchang: ${tithiName}`;
    const desc = `${tithiName}, ${pakshaName} Paksha. Nakshatra: ${nakshatraName}.`;
    const start = new Date(date); start.setHours(9, 0, 0); 
    const end = new Date(date); end.setHours(10, 0, 0);
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
    if (diffDays === 1) return lang === 'en' ? "Tomorrow" : (lang === 'hi' ? "कल (आने वाला)" : (lang === 'mr' ? "उद्या" : "આવતીકાલે"));
    if (diffDays === -1) return lang === 'en' ? "Yesterday" : (lang === 'hi' ? "कल (बीता हुआ)" : (lang === 'mr' ? "काल" : "ગઈકાલે"));
    const dayWord = lang === 'en' ? "days" : (lang === 'hi' ? "दिन" : (lang === 'mr' ? "दिवस" : "દિવસ"));
    return diffDays > 0 ? `${diffDays} ${dayWord}` : `${Math.abs(diffDays)} ${dayWord}`;
  };

  const headerClass = theme ? `theme-${theme.type}` : (darkMode ? 'theme-default-dark' : 'theme-default-light');
  
  // FIX: Force BLACK TEXT for light themes (Purnima, Holi, etc.)
  const isLightTheme = theme && ['purnima', 'national', 'sankranti', 'diwali', 'ganesh', 'rakhi', 'holi', 'festive', 'christmas', 'newyear'].includes(theme.type);
  const textColor = isLightTheme ? 'text-gray-900' : 'text-white';
  const closeBtnColor = isLightTheme ? 'bg-black/10 hover:bg-black/20 text-gray-900' : 'bg-black/20 hover:bg-black/40 text-white';

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] shadow-2xl z-50 animate-slide-in flex flex-col font-sans ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`relative p-6 overflow-hidden shrink-0 transition-colors duration-500 ${headerClass} ${textColor}`}>
        {theme && ['national', 'diwali', 'holi', 'rakhi', 'ganesh', 'onam', 'navratri', 'christmas', 'eid', 'bakrid', 'muharram', 'milad', 'newyear', 'sankranti'].includes(theme.type) && <Confetti />}
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors z-20 ${closeBtnColor}`}><X size={20} /></button>
        <div className="relative z-10">
          <h2 className="text-6xl font-bold tracking-tighter mb-1 drop-shadow-md">{date.getDate()}</h2>
          <p className="text-xl opacity-90 font-medium drop-shadow-sm">{t.months[date.getMonth()]} {date.getFullYear()}</p>
          <div className="flex items-center gap-2 mt-4 opacity-90 text-sm uppercase tracking-widest font-bold">
            <span>{t.weekdays[date.getDay()]}</span><span>•</span><span>{theme ? theme.name : getRelativeLabel(date)}</span>
          </div>
        </div>
      </div>
      <div className={`flex border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {['overview', 'panchang', 'muhurat'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-orange-500 bg-orange-500/10' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'} ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
            {t.ui.tabs[tab]}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />}
          </button>
        ))}
      </div>
      <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50/50 text-gray-800'}`}>
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
             {auspicious && (
               <div className="grid grid-cols-2 gap-3">
                 <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-100'}`}>
                   <div className="flex items-center gap-1 text-red-500 mb-1"><AlertTriangle size={14} /><span className="text-[10px] font-bold uppercase tracking-wider">{t.ui.rahuKaal}</span></div>
                   <span className="font-semibold text-sm">{auspicious.rahu}</span>
                 </div>
                 <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${darkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-100'}`}>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">{t.ui.yamaganda}</span>
                   <span className="font-semibold text-sm">{auspicious.yama}</span>
                 </div>
               </div>
             )}
             <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                   <Sun size={24} className="text-orange-500 mb-2" /><span className="text-xs opacity-70 uppercase">{t.ui.sunrise}</span><span className="font-bold">{sunTimes ? formatTime(sunTimes.sunrise) : '--:--'}</span>
                </div>
                <div className={`p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                   <Moon size={24} className="text-indigo-400 mb-2" /><span className="text-xs opacity-70 uppercase">{t.ui.sunset}</span><span className="font-bold">{sunTimes ? formatTime(sunTimes.sunset) : '--:--'}</span>
                </div>
             </div>
             <div className="flex items-center justify-center gap-2 text-xs opacity-50"><MapPin size={12} />{locLoading ? <span>{t.ui.locating}</span> : location ? <span>{t.ui.usingGPS}</span> : <span>{t.ui.estimated}</span>}</div>
             <div className={`rounded-2xl p-6 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}><CalendarIcon size={18} className="text-blue-500" /> {t.ui.events}</h3>
                <div className="flex gap-2">
                  <button onClick={handleShare} className="text-green-500 hover:bg-green-500/10 p-2 rounded-full transition-colors"><MessageCircle size={18} /></button>
                  <button onClick={addToGoogleCalendar} className="text-blue-500 hover:bg-blue-500/10 p-2 rounded-full transition-colors"><CalendarPlus size={18} /></button>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {events && events.length > 0 ? (events.map((evt, i) => (<div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'}`}><div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" /><p className="text-sm leading-relaxed opacity-90">{evt}</p></div>))) : (<p className="text-center opacity-50 italic text-sm py-4">{t.ui.noEvents}</p>)}
              </div>
              <div className="flex gap-2 relative group">
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.ui.addNote} className={`flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 bg-white'}`} onKeyDown={(e) => e.key === 'Enter' && (onAddEvent(note), setNote(''))} />
                <button onClick={() => { if(note.trim()) { onAddEvent(note); setNote(''); }}} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors">+</button>
              </div>
            </div>
          </div>
        )}
        {activeTab !== 'overview' && (
          <div className={`rounded-2xl p-6 shadow-sm border animate-fade-in space-y-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            {activeTab === 'panchang' ? (
              <>
                 <MoonPhaseVisual tithiRaw={panchang.tithiRaw} lang={lang} />
                 <div className={`space-y-6 ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>
                  {[{ l: t.ui.tithi, v: tithiName }, { l: t.ui.paksha, v: pakshaName }, { l: t.ui.nakshatra, v: nakshatraName }, { l: 'Hindi Month', v: monthName }, { l: t.ui.yoga, v: `Yoga ${panchang.yogaIndex + 1}` }].map((item, i) => (
                    <div key={i} className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}><span className="opacity-60 text-sm">{item.l}</span><span className="font-semibold text-lg">{item.v}</span></div>
                  ))}
                 </div>
              </>
            ) : (
              <div className="space-y-2">
                 {choghadiya.map((c, i) => (
                  <div key={i} className={`flex items-center justify-between text-sm py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}><span className="opacity-60 font-mono text-xs">{c.time}</span><div className="flex items-center gap-2"><span className={`font-medium ${lang !== 'en' ? 'font-hindi' : 'font-eng'}`}>{c.label}</span><div className={`w-2.5 h-2.5 rounded-full ${c.quality === 'good' ? 'bg-green-500' : c.quality === 'bad' ? 'bg-red-500' : 'bg-gray-400'}`}></div></div></div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;