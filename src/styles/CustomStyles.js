import React from 'react';

const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;500;600;700&display=swap');

    .font-hindi { font-family: 'Noto Serif Devanagari', serif; }
    .font-eng { font-family: 'Noto Sans', sans-serif; }

    /* Animation Utilities */
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes pulse-soft { 0%, 100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(234, 88, 12, 0); } }
    @keyframes confetti-fall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100px) rotate(360deg); opacity: 0; } }

    .confetti-piece { position: absolute; width: 8px; height: 8px; background: rgba(255, 255, 255, 0.6); top: -10px; opacity: 0; }
    .transition-content { transition: opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease; }
    .content-hidden { opacity: 0; filter: blur(4px); transform: scale(0.99); }
    .content-visible { opacity: 1; filter: blur(0); transform: scale(1); }
    .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-pop-in { animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-pulse-custom { animation: pulse-soft 2s infinite; }

    /* --- THEMES --- */
    .theme-tricolor { background: linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(255,255,255,0.8) 50%, rgba(19,136,8,0.15) 100%); border-color: rgba(255,153,51,0.3); }
    .theme-holi { background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.1), transparent 40%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.1), transparent 40%); }
    .theme-diwali { background-color: #fffbeb; background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E"); }
    .theme-ganesh { background: linear-gradient(135deg, #ffedd5 0%, #ffcda5 100%); border-color: #fb923c; }
    .theme-rakhi { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 3px solid #dc2626; }
    .theme-onam { background: linear-gradient(135deg, #fefce8 0%, #dcfce7 100%); border-color: #16a34a; }
    .theme-buddha { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-color: #d97706; }
    .theme-sankranti { background: linear-gradient(to bottom right, #fef9c3 50%, #e0f2fe 50%); }
    .theme-christmas { background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 25%, rgba(22, 163, 74, 0.05) 75%); }
    .theme-shivratri { background: linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%); border-left: 3px solid #312e81; }
    .theme-navratri { background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-color: #d946ef; }
    .theme-janmashtami { background: linear-gradient(135deg, #ccfbf1 0%, #e0f2fe 100%); border-color: #0d9488; }
    .theme-valentine { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); }
    
    /* --- NEW MUSLIM THEMES --- */
    /* Eid ul-Fitr (already existed, refined) */
    .theme-eid { background: linear-gradient(135deg, #f0fdf4 0%, #ecfccb 100%); border-left: 3px solid #166534; }
    
    /* Eid al-Adha (Bakrid) - Deep Green and Gold for sacrifice/solemnity */
    .theme-bakrid { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-color: #15803d; border-right: 3px solid #b45309; }
    
    /* Muharram - Somber, darker green/black hint */
    .theme-muharram { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-left: 3px solid #000000; }
    
    /* Milad-un-Nabi - Light, peaceful green */
    .theme-milad { background: linear-gradient(135deg, #ecfccb 0%, #f7fee7 100%); border-color: #84cc16; }

  `}</style>
);

export default CustomStyles;
