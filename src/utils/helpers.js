import { DATA, MUHURAT_DATES } from '../data/constants';

export const calculatePanchang = (date) => {
  const J2000 = 2451545.0;
  const toJulian = (d) => (d.getTime() / 86400000) - (d.getTimezoneOffset() / 1440) + 2440587.5;
  const normalize = (deg) => { let a = deg % 360; return a < 0 ? a + 360 : a; };

  const jd = toJulian(date);
  const D = jd - J2000;
  
  const L = normalize(280.460 + 0.9856474 * D);
  const g = normalize(357.528 + 0.9856003 * D);
  const lambdaSun = normalize(L + 1.915 * Math.sin(g * Math.PI / 180));
  
  const l = normalize(218.316 + 13.176396 * D);
  const mm = normalize(134.963 + 13.064993 * D);
  const lambdaMoon = normalize(l + 6.289 * Math.sin(mm * Math.PI / 180));

  let diff = lambdaMoon - lambdaSun;
  if (diff < 0) diff += 360;

  const tithiRaw = Math.floor(diff / 12);
  const nakshatraIndex = Math.floor(lambdaMoon / (360 / 27));
  const yogaIndex = Math.floor((lambdaSun + lambdaMoon) / (360 / 27));
  
  const isShukla = tithiRaw < 15;
  const tithiIndex = tithiRaw % 15;
  
  let tithiDisplayIndex = tithiIndex;
  if (isShukla && tithiIndex === 14) tithiDisplayIndex = 14; 
  if (!isShukla && tithiIndex === 14) tithiDisplayIndex = 15; 

  return {
    tithiRaw,
    tithiDisplayIndex,
    nakshatraIndex,
    yogaIndex,
    paksha: isShukla ? 'shukla' : 'krishna',
    vikramSamvat: date.getFullYear() + 57
  };
};

export const getHindiMonthIndex = (date) => {
  const m = date.getMonth();
  const d = date.getDate();
  const cutoffs = [14, 13, 14, 14, 15, 15, 16, 16, 16, 17, 16, 16];
  const offset = d < cutoffs[m] ? 9 : 10;
  return (m + offset) % 12; 
};

export const getChoghadiya = (date, lang) => {
  const day = date.getDay(); 
  const sequences = [
    ['udveg', 'chal', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg'], 
    ['amrit', 'kaal', 'shubh', 'rog', 'udveg', 'chal', 'labh', 'amrit'], 
    ['rog', 'udveg', 'chal', 'labh', 'amrit', 'kaal', 'shubh', 'rog'],   
    ['labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'chal', 'labh'],   
    ['shubh', 'rog', 'udveg', 'chal', 'labh', 'amrit', 'kaal', 'shubh'], 
    ['chal', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'chal'],   
    ['kaal', 'shubh', 'rog', 'udveg', 'chal', 'labh', 'amrit', 'kaal']    
  ];

  const seq = sequences[day];
  const slots = ["06:00 - 07:30", "07:30 - 09:00", "09:00 - 10:30", "10:30 - 12:00", "12:00 - 01:30", "01:30 - 03:00", "03:00 - 04:30", "04:30 - 06:00"];

  return slots.map((time, i) => {
    const type = seq[i];
    const labelData = DATA[lang] || DATA['en']; // Fallback
    const label = labelData.choghadiya[type];
    let quality = 'neutral';
    if (['amrit', 'shubh', 'labh', 'chal'].includes(type)) quality = 'good';
    if (['udveg', 'kaal', 'rog'].includes(type)) quality = 'bad';
    return { time, label, quality };
  });
};

export const getDayTheme = (date, panchang, monthIdx, lang) => {
  const d = date.getDate();
  const m = date.getMonth(); 
  const y = date.getFullYear();
  const { tithiRaw } = panchang;
  const tData = DATA[lang] || DATA['en'];

  // Helper for translating names
  const tr = (key, fallback) => key; // Simplified for fixed strings, or extend logic if needed

  // Fixed
  if (d === 1 && m === 0) return { type: 'newyear', name: lang === 'en' ? 'New Year' : (lang === 'hi' ? 'नव वर्ष' : (lang === 'mr' ? 'नवीन वर्ष' : 'નવું વર્ષ')), icon: '🎉' };
  if (d === 26 && m === 0) return { type: 'national', name: lang === 'en' ? 'Republic Day' : (lang === 'hi' ? 'गणतंत्र दिवस' : (lang === 'mr' ? 'प्रजासत्ताक दिन' : 'પ્રજાસત્તાક દિવસ')), icon: '🇮🇳' };
  if (d === 15 && m === 7) return { type: 'national', name: lang === 'en' ? 'Independence Day' : (lang === 'hi' ? 'स्वतंत्रता दिवस' : (lang === 'mr' ? 'स्वातंत्र्य दिन' : 'સ્વતંત્રતા દિવસ')), icon: '🇮🇳' };
  if (d === 2 && m === 9) return { type: 'national', name: lang === 'en' ? 'Gandhi Jayanti' : 'गांधी जयंती', icon: '🕊️' };
  if (d === 14 && m === 0) return { type: 'sankranti', name: lang === 'en' ? 'Makar Sankranti' : 'मकर संक्रांति', icon: '🪁' };
  if (d === 14 && m === 1) return { type: 'valentine', name: lang === 'en' ? "Valentine's Day" : (lang === 'gu' ? 'વેલેન્ટાઇન ડે' : 'वैलेंटाइन्स डे'), icon: '💖' };
  if (d === 25 && m === 11) return { type: 'christmas', name: lang === 'en' ? 'Christmas' : 'क्रिसमस', icon: '🎄' };

  // Note: For dynamic years, we keep the simple Hindi names as they are widely understood, or add dictionary lookup if strictly needed.
  if (y === 2025) {
    if (d === 26 && m === 1) return { type: 'shivratri', name: 'Mahashivratri', icon: '🕉️' };
    if (d === 14 && m === 2) return { type: 'holi', name: 'Holi', icon: '🎨' };
    if (d === 31 && m === 2) return { type: 'eid', name: 'Eid-ul-Fitr', icon: '☪️' };
    if (d === 6 && m === 5) return { type: 'bakrid', name: 'Eid al-Adha', icon: '🐐' };
    if (d === 6 && m === 6) return { type: 'muharram', name: 'Muharram', icon: '🕌' };
    if (d === 9 && m === 7) return { type: 'rakhi', name: 'Raksha Bandhan', icon: '🎁' };
    if (d === 16 && m === 7) return { type: 'janmashtami', name: 'Janmashtami', icon: '🪈' };
    if (d === 26 && m === 7) return { type: 'ganesh', name: 'Ganesh Chaturthi', icon: '🐘' };
    if (d === 5 && m === 8) return { type: 'onam', name: 'Onam', icon: '🌸' };
    if (d === 5 && m === 8) return { type: 'milad', name: 'Milad-un-Nabi', icon: '📿' };
    if (d === 2 && m === 9) return { type: 'festive', name: 'Dussehra', icon: '🏹' };
    if (d === 20 && m === 9) return { type: 'diwali', name: 'Diwali', icon: '🪔' };
  }
  if (y === 2026) {
    if (d === 15 && m === 1) return { type: 'shivratri', name: 'Mahashivratri', icon: '🕉️' };
    if (d === 4 && m === 2) return { type: 'holi', name: 'Holi', icon: '🎨' };
    if (d === 20 && m === 2) return { type: 'eid', name: 'Eid-ul-Fitr', icon: '☪️' };
    if (d === 27 && m === 4) return { type: 'bakrid', name: 'Eid al-Adha', icon: '🐐' };
    if (d === 28 && m === 7) return { type: 'rakhi', name: 'Raksha Bandhan', icon: '🎁' };
    if (d === 4 && m === 8) return { type: 'janmashtami', name: 'Janmashtami', icon: '🪈' };
    if (d === 14 && m === 8) return { type: 'ganesh', name: 'Ganesh Chaturthi', icon: '🐘' };
    if (d === 20 && m === 9) return { type: 'festive', name: 'Dussehra', icon: '🏹' };
    if (d === 8 && m === 10) return { type: 'diwali', name: 'Diwali', icon: '🪔' };
  }

  if (tithiRaw === 14) return { type: 'purnima', name: tData.tithis[14], icon: '🌕' };
  if (tithiRaw === 29) return { type: 'amavasya', name: tData.tithis[15], icon: '🌑' };
  if (tithiRaw === 10) return { type: 'ekadashi', name: tData.tithis[10], icon: '🙏' };

  return null;
};

export const getAuspiciousTimes = (date, sunTimes) => {
  if (!sunTimes) return null;
  const start = sunTimes.sunrise.getTime();
  const end = sunTimes.sunset.getTime();
  const dayDuration = end - start;
  const part = dayDuration / 8; 
  const day = date.getDay();
  const rahuMap = [8, 2, 7, 5, 6, 4, 3]; 
  const yamaMap = [5, 4, 3, 2, 1, 7, 6]; 

  const getSlot = (partIndex) => {
    const s = new Date(start + (partIndex - 1) * part);
    const e = new Date(start + partIndex * part);
    return `${formatTimeSimple(s)} - ${formatTimeSimple(e)}`;
  };
  return { rahu: getSlot(rahuMap[day]), yama: getSlot(yamaMap[day]) };
};

const formatTimeSimple = (date) => {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; h = h ? h : 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
};