import React from 'react';

const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;600&display=swap');

    .font-hindi, .font-mr { font-family: 'Noto Serif Devanagari', serif; }
    .font-gu { font-family: 'Noto Sans Gujarati', sans-serif; }
    .font-eng { font-family: 'Noto Sans', sans-serif; }

    /* --- ANIMATIONS --- */
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes pulse-purple { 0%, 100% { box-shadow: 0 0 10px #d946ef; } 50% { box-shadow: 0 0 20px #a855f7; } }
    
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
    
    /* Light Themes (Force Black Text) */
    .theme-national, .theme-purnima, .theme-holi, .theme-diwali, .theme-ganesh, .theme-rakhi, .theme-sankranti, .theme-christmas, .theme-newyear, .theme-festive {
      color: #000000 !important;
    }
    .theme-national { background: linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%); border-color: #ff9933; }
    .theme-purnima { background: radial-gradient(circle at center, #ffffff 0%, #fefce8 100%); border: 1px solid #fef08a; }
    .theme-holi { background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.4), transparent 60%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.4), transparent 60%); background-color: #fff; }
    .theme-diwali { background: linear-gradient(to bottom, #fef3c7, #fde68a); border-color: #fbbf24; }
    .theme-ganesh { background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-color: #fb923c; }
    .theme-rakhi { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border-left: 3px solid #e11d48; }
    .theme-sankranti { background: linear-gradient(to bottom right, #fef9c3, #bfdbfe); }
    .theme-christmas { background: linear-gradient(135deg, #dcfce7 0%, #fee2e2 100%); }
    .theme-newyear { background: linear-gradient(135deg, #e0e7ff 0%, #fae8ff 100%); border-left: 3px solid #4f46e5; }
    .theme-festive { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }

    /* Dark Themes (Force White Text) */
    .theme-amavasya, .theme-shivratri, .theme-navratri, .theme-eid, .theme-bakrid, .theme-muharram {
      color: #ffffff !important;
    }
    .theme-amavasya { background: linear-gradient(135deg, #1f2937 0%, #000000 100%); border: 1px solid #374151; }
    .theme-shivratri { background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%); }
    .theme-navratri { background: linear-gradient(135deg, #4c1d95 0%, #701a75 100%); border-color: #d946ef; }
    .theme-eid, .theme-bakrid, .theme-milad { background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); border-left: 3px solid #fbbf24; }
    .theme-muharram { background: linear-gradient(135deg, #1f2937 0%, #000000 100%); border-left: 3px solid #ef4444; }

  `}</style>
);

export default CustomStyles;