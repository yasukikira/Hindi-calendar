import React, { useState } from 'react';
import { X, Sun, Moon, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { DATA, NAKSHATRAS_EN, NAKSHATRAS_HI } from '../data/constants';
import { calculatePanchang, getHindiMonthIndex, getDayTheme, getChoghadiya } from '../utils/helpers';
import Confetti from './Confetti';

const DetailPanel = ({ date, onClose, events, onAddEvent, lang }) => {
  const t = DATA[lang];
  const panchang = calculatePanchang(date);
  const hindiMonthIdx = getHindiMonthIndex(date);
  const theme = getDayTheme(date, panchang, hindiMonthIdx, lang);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const nakshatraName = lang === 'hi' ? NAKSHATRAS_HI[panchang.nakshatraIndex] : NAKSHATRAS_EN[panchang.nakshatraIndex];
  const monthName = t.hindiMonths[hindiMonthIdx];
  const tithiName = t.tithis[panchang.tithiDisplayIndex];
  const pakshaName = t.paksha[panchang.paksha];

  const choghadiya = getChoghadiya(date, lang);

  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const varMins = -45 * Math.cos((dayOfYear + 10) * 2 * Math.PI / 365);
  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const isFestive = theme && ['national', 'diwali', 'holi', 'rakhi', 'ganesh', 'onam', 'navratri', 'christmas', 'eid', 'bakrid', 'muharram', 'milad'].includes(theme.type);

  // Helper to determine header gradient based on theme
  const getHeaderGradient = () => {
    if (!theme) return 'bg-gradient-to-br from-gray-900 to-gray-800';
    switch(theme.type) {
      case 'national': return 'bg-gradient-to-r from-orange-500 via-white to-green-600';
      case 'holi': return 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';
      case 'ganesh': return 'bg-gradient-to-br from-orange-500 to-red-600';
      case 'rakhi': return 'bg-gradient-to-r from-amber-400 to-red-500';
      case 'onam': return 'bg-gradient-to-r from-emerald-500 to-yellow-400';
      case 'sankranti': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'eid': return 'bg-gradient-to-r from-green-600 to-emerald-800';
      case 'bakrid': return 'bg-gradient-to-r from-green-700 to-yellow-600'; // New
      case 'muharram': return 'bg-gradient-to-r from-gray-700 to-gray-900'; // New
      case 'milad': return 'bg-gradient-to-r from-lime-500 to-green-600'; // New
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
      {/* Header */}
      <div className={`
        relative p-6 text-white overflow-hidden shrink-0 transition-colors duration-500
        ${getHeaderGradient()}
      `}>
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
            <span>{theme ? theme.name : t.ui.today}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <Sun size={24} className="text-orange-500 mb-2" />
                   <span className="text-xs text-gray-500 uppercase">{t.ui.sunrise}</span>
                   <span className="font-bold text-gray-800">{formatTime(6 * 60 + 30 + varMins)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <Moon size={24} className="text-indigo-500 mb-2" />
                   <span className="text-xs text-gray-500 uppercase">{t.ui.sunset}</span>
                   <span className="font-bold text-gray-800">{formatTime(18 * 60 + 15 - varMins)}</span>
                </div>
             </div>

             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className={`text-gray-800 font-bold mb-4 flex items-center gap-2 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
                <CalendarIcon size={18} className="text-blue-600" /> {t.ui.events}
              </h3>
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

        {/* PANCHANG TAB */}
        {activeTab === 'panchang' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
            <h3 className={`text-orange-600 font-bold mb-6 flex items-center gap-2 ${lang === 'hi' ? 'font-hindi' : 'font-eng'}`}>
              <Sun size={18} /> Panchang Details
            </h3>
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

        {/* MUHURAT TAB */}
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
