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
    
    @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } 25%, 75% { opacity: 0.95; } }
    @keyframes float { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    @keyframes color-shift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
    @keyframes shine { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
    @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }

    .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-pop-in { animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    .confetti-piece { position: absolute; width: 8px; height: 8px; z-index: 50; top: -10px; opacity: 0; }
    .transition-content { transition: opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease; }
    .content-hidden { opacity: 0; filter: blur(4px); transform: scale(0.99); }
    .content-visible { opacity: 1; filter: blur(0); transform: scale(1); }

    /* --- DARK MODE (GALAXY THEME) --- */
    .dark-mode {
      /* Stronger Galaxy Gradient for Mobile Visibility */
      background: radial-gradient(circle at top, #240b36 0%, #1a1c2c 40%, #000000 100%);
      color: #e2e8f0;
      overflow-x: hidden;
    }
    
    .dark-mode .bg-white { background-color: #1e293b; border-color: #334155; }
    .dark-mode .bg-gray-50 { background-color: #0f172a; }
    .dark-mode .bg-gray-100 { background-color: #1e293b; }
    .dark-mode .text-gray-900 { color: #f8fafc; }
    .dark-mode .text-gray-800 { color: #f1f5f9; }
    .dark-mode .text-gray-700 { color: #cbd5e1; }
    .dark-mode .text-gray-600 { color: #94a3b8; }
    
    /* Stars Background - Made Brighter */
    .stars-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background: transparent;
    }
    .stars-bg::after {
      content: ""; position: absolute; inset: 0;
      background-image: 
        radial-gradient(white 2px, transparent 2px),
        url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,100 L120,150 L180,80 L250,120' stroke='rgba(255,255,255,0.15)' stroke-width='1' fill='none'/%3E%3Ccircle cx='50' cy='100' r='2' fill='white' opacity='0.9'/%3E%3Ccircle cx='120' cy='150' r='1.5' fill='white' opacity='0.7'/%3E%3C/svg%3E");
      background-size: 100px 100px, 400px 400px;
      opacity: 0.8; /* Increased visibility */
      animation: twinkle 4s infinite ease-in-out alternate;
    }

    /* --- FESTIVAL THEMES --- */
    
    /* Republic/Independence/Gandhi (Tri-color) */
    .theme-national { 
      background: linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%);
      animation: shine 6s linear infinite;
      background-size: 200% 200%;
      border-color: #ff9933;
      color: #1a1a1a !important; /* Force dark text for readability */
    }
    
    /* Purnima (Full Moon) - FIX: Force Dark Text on Light Background */
    .theme-purnima {
      background: radial-gradient(circle at center, #ffffff 0%, #fefce8 100%);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
      border: 1px solid #fef08a;
      color: #000000 !important; /* CRITICAL FIX */
    }
    
    /* Amavasya (New Moon) */
    .theme-amavasya {
      background: linear-gradient(135deg, #1f2937 0%, #000000 100%);
      border: 1px solid #374151;
      color: #e5e7eb !important;
    }

    /* Holi */
    .theme-holi { 
      background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.2), transparent 60%), 
                  radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.2), transparent 60%);
      background-color: #fff;
      animation: color-shift 5s infinite alternate;
    }
    .dark-mode .theme-holi { background-color: #1e293b; } /* Dark mode fallback base */

    /* Diwali */
    .theme-diwali { 
      background: linear-gradient(to bottom, #7f1d1d, #991b1b);
      animation: flicker 4s infinite;
      color: #fef3c7 !important;
      border-color: #fbbf24;
    }

    /* Sankranti */
    .theme-sankranti { 
      background: linear-gradient(to bottom right, #fef9c3, #bfdbfe); 
      color: #1e3a8a !important;
    }

    /* Christmas */
    .theme-christmas { 
      background: linear-gradient(135deg, #166534 0%, #991b1b 100%); 
      color: #fff !important; 
    }

    /* Eid/Bakrid/Milad */
    .theme-eid, .theme-bakrid, .theme-milad {
      background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
      color: #ecfccb !important;
      border-left: 3px solid #fbbf24;
    }

    /* New Year */
    .theme-newyear { 
      background: linear-gradient(135deg, #4338ca 0%, #7e22ce 100%);
      color: white !important;
      animation: shine 8s linear infinite;
      background-size: 200% 200%;
    }
    
    /* Standard Fallbacks */
    .theme-shivratri { background: linear-gradient(135deg, #312e81 0%, #4338ca 100%); color: #e0e7ff !important; }
    .theme-janmashtami { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: #ccfbf1 !important; }
    .theme-ganesh { background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); color: #9a3412 !important; border-color: #fb923c; }
    .theme-rakhi { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); color: #9f1239 !important; border-left: 3px solid #e11d48; }
    .theme-navratri { background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); color: #86198f !important; border-color: #d946ef; }

  `}</style>
);

export default CustomStyles;