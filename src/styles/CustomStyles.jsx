import React from 'react';

const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;600&display=swap');

    .font-hindi, .font-mr { font-family: 'Noto Serif Devanagari', serif; }
    .font-gu { font-family: 'Noto Sans Gujarati', sans-serif; }
    .font-eng { font-family: 'Noto Sans', sans-serif; }

    /* --- ANIMATIONS (ALL RESTORED) --- */
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
    
    @keyframes pulse-purple { 0%, 100% { box-shadow: 0 0 10px #d946ef; } 50% { box-shadow: 0 0 20px #a855f7; } }
    @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } 25%, 75% { opacity: 0.95; } }
    @keyframes float { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    @keyframes color-shift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
    @keyframes shine { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
    
    /* Christmas Stripes */
    @keyframes barberpole { 
      0% { background-position: 0 0; } 
      100% { background-position: 50px 50px; } 
    }
    
    /* New Year Disco */
    @keyframes disco { 
      0% { filter: hue-rotate(0deg); } 
      50% { filter: hue-rotate(180deg); } 
      100% { filter: hue-rotate(360deg); } 
    }

    .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-pop-in { animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    .confetti-piece { position: absolute; width: 8px; height: 8px; z-index: 50; top: -10px; opacity: 0; }
    .transition-content { transition: opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease; }
    .content-hidden { opacity: 0; filter: blur(4px); transform: scale(0.99); }
    .content-visible { opacity: 1; filter: blur(0); transform: scale(1); }

    /* --- DARK MODE UTILS --- */
    .dark-mode { color: #e2e8f0; }
    .dark-mode .bg-white { background-color: #1e293b; border-color: #334155; }
    .dark-mode .text-gray-900 { color: #f8fafc; }
    .dark-mode .text-gray-800 { color: #f1f5f9; }
    .dark-mode .text-gray-600 { color: #94a3b8; }
    .dark-mode .border-gray-100 { border-color: #334155; }

    /* --- THEMES --- */
    
    /* DEFAULT THEME (Restored cool dark background for normal days) */
    .theme-default {
      background: linear-gradient(to bottom right, #0f172a, #000000);
      color: white !important;
      border-bottom: 1px solid #334155;
    }

    /* Light Themes (Force Black Text) */
    .theme-national, .theme-purnima, .theme-holi, .theme-diwali, .theme-ganesh, .theme-rakhi, .theme-sankranti, .theme-festive {
      color: #000000 !important;
    }
    .theme-national { background: linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%); border-color: #ff9933; }
    .theme-purnima { background: radial-gradient(circle at center, #ffffff 0%, #fefce8 100%); border: 1px solid #fef08a; }
    .theme-holi { background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.4), transparent 60%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.4), transparent 60%); background-color: #fff; animation: color-shift 5s infinite; }
    .theme-diwali { background: linear-gradient(to bottom, #fef3c7, #fde68a); border-color: #fbbf24; animation: flicker 4s infinite; }
    .theme-ganesh { background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-color: #fb923c; }
    .theme-rakhi { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border-left: 3px solid #e11d48; }
    .theme-sankranti { background: linear-gradient(to bottom right, #fef9c3, #bfdbfe); animation: float 6s infinite; background-size: 150%; }
    .theme-festive { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }

    /* Special Animation Themes */
    .theme-christmas { background: repeating-linear-gradient(45deg, #dcfce7, #dcfce7 10px, #fee2e2 10px, #fee2e2 20px); animation: barberpole 20s linear infinite; color: #000 !important; }
    .theme-newyear { background: linear-gradient(135deg, #e0e7ff 0%, #fae8ff 100%); border-left: 3px solid #4f46e5; animation: disco 8s infinite alternate; color: #000 !important; }

    /* Dark Themes (Force White Text) */
    .theme-amavasya, .theme-shivratri, .theme-navratri, .theme-eid, .theme-bakrid, .theme-muharram {
      color: #ffffff !important;
    }
    .theme-amavasya { background: linear-gradient(135deg, #1f2937 0%, #000000 100%); border: 1px solid #374151; }
    .theme-shivratri { background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%); }
    .theme-navratri { background: linear-gradient(135deg, #4c1d95 0%, #701a75 100%); border-color: #d946ef; animation: pulse-purple 3s infinite; }
    .theme-eid, .theme-bakrid, .theme-milad { background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); border-left: 3px solid #fbbf24; }
    .theme-muharram { background: linear-gradient(135deg, #1f2937 0%, #000000 100%); border-left: 3px solid #ef4444; }
  `}</style>
);

export default CustomStyles;