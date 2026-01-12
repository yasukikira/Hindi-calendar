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
    @keyframes pulse-soft { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
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
      /* Deep Galaxy Gradient */
      background: radial-gradient(circle at top, #1a1c2c 0%, #0d0e15 100%); 
      color: #e2e8f0;
      overflow-x: hidden;
    }
    
    /* Dark Mode Text Fixes */
    .dark-mode .text-gray-900 { color: #f8fafc; }
    .dark-mode .text-gray-800 { color: #f1f5f9; }
    .dark-mode .text-gray-700 { color: #e2e8f0; }
    .dark-mode .text-gray-600 { color: #cbd5e1; }
    .dark-mode .text-gray-500 { color: #94a3b8; }
    .dark-mode .text-red-500 { color: #ff8080; } 
    
    /* Dark Mode Component Backgrounds */
    .dark-mode .bg-white { background-color: #1e293b; border-color: #334155; }
    .dark-mode .bg-gray-50 { background-color: #0f172a; }
    .dark-mode .bg-gray-100 { background-color: #1e293b; }
    .dark-mode .border-gray-100, .dark-mode .border-gray-200 { border-color: #334155; }

    /* STARS & CONSTELLATIONS BACKGROUND */
    .stars-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); /* Galaxy Gradient */
    }
    
    /* Layer 1: Tiny Stars */
    .stars-bg::before {
      content: ""; position: absolute; inset: 0;
      background-image: radial-gradient(white 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.3;
    }

    /* Layer 2: Constellations & Big Stars */
    .stars-bg::after {
      content: ""; position: absolute; inset: 0;
      background-image: 
        radial-gradient(white 2px, transparent 2px),
        url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- Constellation Lines --%3E%3Cpath d='M50,100 L120,150 L180,80 L250,120' stroke='rgba(255,255,255,0.1)' stroke-width='1' fill='none'/%3E%3Cpath d='M300,300 L350,250 L380,320' stroke='rgba(255,255,255,0.1)' stroke-width='1' fill='none'/%3E%3C!-- Bright Stars --%3E%3Ccircle cx='50' cy='100' r='2' fill='white' opacity='0.8'/%3E%3Ccircle cx='120' cy='150' r='1.5' fill='white' opacity='0.6'/%3E%3Ccircle cx='180' cy='80' r='2' fill='white' opacity='0.9'/%3E%3Ccircle cx='250' cy='120' r='1.5' fill='white' opacity='0.7'/%3E%3Ccircle cx='300' cy='300' r='2' fill='white' opacity='0.8'/%3E%3C/svg%3E");
      background-size: 100px 100px, 400px 400px;
      background-position: 0 0, center center;
      animation: twinkle 5s infinite ease-in-out alternate;
    }

    /* --- FESTIVAL THEMES (Crucial: These classes must be applied to Header) --- */
    
    /* Tricolor (Republic/Independence) - Shimmering Flag */
    .theme-tricolor { 
      background: linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%);
      background-size: 200% 200%;
      animation: shine 5s linear infinite;
      color: #1a1a1a !important; /* Force text dark for readability */
    }
    
    /* Holi - Colorful Pulse */
    .theme-holi { 
      background: linear-gradient(45deg, #ff00cc, #3333ff, #ffcc00);
      background-size: 300% 300%;
      animation: shine 3s ease infinite;
    }
    
    /* Diwali - Golden Flicker */
    .theme-diwali { 
      background: linear-gradient(to bottom, #4a0404, #9f1239);
      box-shadow: inset 0 0 50px #fbbf24;
      animation: flicker 4s infinite;
      border-bottom: 4px solid #fbbf24;
    }
    
    /* Navratri/Durga Puja - Purple Glow */
    .theme-navratri {
      background: linear-gradient(135deg, #4c1d95 0%, #d946ef 100%);
      animation: pulse-soft 3s infinite;
    }

    /* Eid/Bakrid - Green Gradient */
    .theme-eid, .theme-bakrid, .theme-milad {
      background: linear-gradient(135deg, #064e3b 0%, #10b981 100%);
      border-bottom: 4px solid #fbbf24;
    }
    
    /* New Year - Party Gradient */
    .theme-newyear {
      background: linear-gradient(to right, #4f46e5, #9333ea, #db2777);
      background-size: 200% auto;
      animation: shine 4s linear infinite;
    }

    /* Default Fallback Header */
    .theme-default-light { background: linear-gradient(to bottom right, #374151, #111827); }
    .theme-default-dark { background: linear-gradient(to bottom right, #1e293b, #0f172a); }

  `}</style>
);

export default CustomStyles;