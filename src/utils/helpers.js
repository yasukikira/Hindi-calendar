import { DATA } from '../data/constants';

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
  const day = date.getDay(); // 0 Sun, 6 Sat
  const sequences = [
    ['udveg', 'chal', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg'], // Sun
    ['amrit', 'kaal', 'shubh', 'rog', 'udveg', 'chal', 'labh', 'amrit'], // Mon
    ['rog', 'udveg', 'chal', 'labh', 'amrit', 'kaal', 'shubh', 'rog'],   // Tue
    ['labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'chal', 'labh'],   // Wed
    ['shubh', 'rog', 'udveg', 'chal', 'labh', 'amrit', 'kaal', 'shubh'], // Thu
    ['chal', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'chal'],   // Fri
    ['kaal', 'shubh', 'rog', 'udveg', 'chal', 'labh', 'amrit', 'kaal']    // Sat
  ];

  const seq = sequences[day];
  const slots = [
    "06:00 - 07:30", "07:30 - 09:00", "09:00 - 10:30", "10:30 - 12:00",
    "12:00 - 01:30", "01:30 - 03:00", "03:00 - 04:30", "04:30 - 06:00"
  ];

  return slots.map((time, i) => {
    const type = seq[i];
    const label = DATA[lang].choghadiya[type];
    let quality = 'neutral';
    if (['amrit', 'shubh', 'labh', 'chal'].includes(type)) quality = 'good';
    if (['udveg', 'kaal', 'rog'].includes(type)) quality = 'bad';
    return { time, label, quality };
  });
};

export const getDayTheme = (date, panchang, monthIdx, lang) => {
  const d = date.getDate();
  const m = date.getMonth(); // 0-indexed
  const y = date.getFullYear();
  const { tithiRaw } = panchang;

  // --- FIXED DATE FESTIVALS ---
  if (d === 1 && m === 0) return { type: 'newyear', name: lang === 'hi' ? 'नव वर्ष' : 'New Year', icon: '🎉' };
  if (d === 26 && m === 0) return { type: 'national', name: lang === 'hi' ? 'गणतंत्र दिवस' : 'Republic Day', icon: '🇮🇳' };
  if (d === 15 && m === 7) return { type: 'national', name: lang === 'hi' ? 'स्वतंत्रता दिवस' : 'Independence Day', icon: '🇮🇳' };
  if (d === 2 && m === 9) return { type: 'national', name: lang === 'hi' ? 'गांधी जयंती' : 'Gandhi Jayanti', icon: '🕊️' };
  if (d === 14 && m === 0) return { type: 'sankranti', name: lang === 'hi' ? 'मकर संक्रांति' : 'Makar Sankranti', icon: '🪁' };
  if (d === 14 && m === 1) return { type: 'valentine', name: lang === 'hi' ? 'वैलेंटाइन्स डे' : 'Valentine\'s Day', icon: '💖' };
  if (d === 25 && m === 11) return { type: 'christmas', name: lang === 'hi' ? 'क्रिसमस' : 'Christmas', icon: '🎄' };

  // --- 2025 OVERRIDES ---
  if (y === 2025) {
    if (d === 26 && m === 1) return { type: 'shivratri', name: lang === 'hi' ? 'महाशिवरात्रि' : 'Mahashivratri', icon: '🕉️' };
    if (d === 14 && m === 2) return { type: 'holi', name: lang === 'hi' ? 'होली' : 'Holi', icon: '🎨' };
    if (d === 31 && m === 2) return { type: 'eid', name: lang === 'hi' ? 'ईद-उल-फितर' : 'Eid-ul-Fitr', icon: '☪️' };
    if (d === 6 && m === 5) return { type: 'bakrid', name: lang === 'hi' ? 'बकरीद' : 'Eid al-Adha', icon: '🐐' };
    if (d === 6 && m === 6) return { type: 'muharram', name: lang === 'hi' ? 'मुहर्रम' : 'Muharram', icon: '🕌' };
    if (d === 9 && m === 7) return { type: 'rakhi', name: lang === 'hi' ? 'रक्षा बंधन' : 'Raksha Bandhan', icon: '🎁' };
    if (d === 16 && m === 7) return { type: 'janmashtami', name: lang === 'hi' ? 'जन्माष्टमी' : 'Janmashtami', icon: '🪈' };
    if (d === 26 && m === 7) return { type: 'ganesh', name: lang === 'hi' ? 'गणेश चतुर्थी' : 'Ganesh Chaturthi', icon: '🐘' };
    if (d === 5 && m === 8) return { type: 'onam', name: lang === 'hi' ? 'ओणम' : 'Onam', icon: '🌸' };
    if (d === 5 && m === 8) return { type: 'milad', name: lang === 'hi' ? 'मिलाद-उन-नबी' : 'Milad-un-Nabi', icon: '📿' };
    if (d === 2 && m === 9) return { type: 'festive', name: lang === 'hi' ? 'दशहरा' : 'Dussehra', icon: '🏹' };
    if (d === 20 && m === 9) return { type: 'diwali', name: lang === 'hi' ? 'दीपावली' : 'Diwali', icon: '🪔' };
  }

  // --- 2026 OVERRIDES ---
  if (y === 2026) {
    if (d === 15 && m === 1) return { type: 'shivratri', name: lang === 'hi' ? 'महाशिवरात्रि' : 'Mahashivratri', icon: '🕉️' };
    if (d === 4 && m === 2) return { type: 'holi', name: lang === 'hi' ? 'होली' : 'Holi', icon: '🎨' };
    if (d === 20 && m === 2) return { type: 'eid', name: lang === 'hi' ? 'ईद-उल-फितर' : 'Eid-ul-Fitr', icon: '☪️' };
    if (d === 27 && m === 4) return { type: 'bakrid', name: lang === 'hi' ? 'बकरीद' : 'Eid al-Adha', icon: '🐐' };
    if (d === 28 && m === 7) return { type: 'rakhi', name: lang === 'hi' ? 'रक्षा बंधन' : 'Raksha Bandhan', icon: '🎁' };
    if (d === 4 && m === 8) return { type: 'janmashtami', name: lang === 'hi' ? 'जन्माष्टमी' : 'Janmashtami', icon: '🪈' };
    if (d === 14 && m === 8) return { type: 'ganesh', name: lang === 'hi' ? 'गणेश चतुर्थी' : 'Ganesh Chaturthi', icon: '🐘' };
    if (d === 20 && m === 9) return { type: 'festive', name: lang === 'hi' ? 'दशहरा' : 'Dussehra', icon: '🏹' };
    if (d === 8 && m === 10) return { type: 'diwali', name: lang === 'hi' ? 'दीपावली' : 'Diwali', icon: '🪔' };
  }

  // Fallback
  if (tithiRaw === 14) return { type: 'purnima', name: lang === 'hi' ? 'पूर्णिमा' : 'Purnima', icon: '🌕' };
  if (tithiRaw === 29) return { type: 'amavasya', name: lang === 'hi' ? 'अमावस्या' : 'Amavasya', icon: '🌑' };
  if (tithiRaw === 10) return { type: 'ekadashi', name: lang === 'hi' ? 'एकादशी' : 'Ekadashi', icon: '🙏' };

  return null;
};