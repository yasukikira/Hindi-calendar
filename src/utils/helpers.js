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
    const labelData = DATA[lang] || DATA['en']; 
    const label = labelData.choghadiya[type];
    let quality = 'neutral';
    if (['amrit', 'shubh', 'labh', 'chal'].includes(type)) quality = 'good';
    if (['udveg', 'kaal', 'rog'].includes(type)) quality = 'bad';
    return { time, label, quality };
  });
};

const isDateInRange = (d, m, y, startD, startM, endD, endM) => {
  if (m === startM && d >= startD && d <= endD) return true;
  if (m === startM && m !== endM && d >= startD) return true; 
  if (m === endM && m !== startM && d <= endD) return true;   
  return false;
};

export const getDayTheme = (date, panchang, monthIdx, lang) => {
  const d = date.getDate();
  const m = date.getMonth(); 
  const y = date.getFullYear();
  const { tithiRaw } = panchang;
  const tData = DATA[lang] || DATA['en'];

  if (d === 1 && m === 0) return { type: 'newyear', name: lang === 'hi' ? 'नव वर्ष' : 'New Year', icon: '🎉' };
  
  // National Holidays
  if (d === 26 && m === 0) return { type: 'national', name: lang === 'hi' ? 'गणतंत्र दिवस' : 'Republic Day', icon: '🇮🇳' };
  if (d === 15 && m === 7) return { type: 'national', name: lang === 'hi' ? 'स्वतंत्रता दिवस' : 'Independence Day', icon: '🇮🇳' };
  if (d === 2 && m === 9) return { type: 'national', name: lang === 'hi' ? 'गांधी जयंती' : 'Gandhi Jayanti', icon: '🕊️' };
  if (d === 14 && m === 3) return { type: 'national', name: lang === 'hi' ? 'अम्बेडकर जयंती' : 'Ambedkar Jayanti', icon: '⚖️' };
  if (d === 14 && m === 10) return { type: 'festive', name: lang === 'hi' ? 'बाल दिवस' : "Children's Day", icon: '🎈' };

  if (d === 14 && m === 0) return { type: 'sankranti', name: lang === 'hi' ? 'मकर संक्रांति' : 'Makar Sankranti', icon: '🪁' };
  if (d === 14 && m === 1) return { type: 'valentine', name: lang === 'hi' ? 'वैलेंटाइन्स डे' : "Valentine's Day", icon: '💖' };
  if (d === 25 && m === 11) return { type: 'christmas', name: lang === 'hi' ? 'क्रिसमस' : 'Christmas', icon: '🎄' };

  // NAVRATRI (Adjusted to end on Navami, 9 days)
  // Chaitra 2026: Mar 19 - 27
  if (y === 2026 && isDateInRange(d, m, y, 19, 2, 27, 2)) return { type: 'navratri', name: lang === 'hi' ? 'चैत्र नवरात्रि' : 'Chaitra Navratri', icon: '🔱' };
  // Sharad 2026: Oct 11 - 19 
  if (y === 2026 && isDateInRange(d, m, y, 11, 9, 19, 9)) return { type: 'navratri', name: lang === 'hi' ? 'शारदीय नवरात्रि' : 'Sharad Navratri', icon: '🕉️' };
  
  // Chaitra 2025: Mar 30 - Apr 6 (Approx range fix)
  if (y === 2025 && ((m===2 && d>=30) || (m===3 && d<=6))) return { type: 'navratri', name: lang === 'hi' ? 'चैत्र नवरात्रि' : 'Chaitra Navratri', icon: '🔱' };
  // Sharad 2025: Sep 22 - 30
  if (y === 2025 && ((m===8 && d>=22) || (m===8 && d<=30))) return { type: 'navratri', name: lang === 'hi' ? 'शारदीय नवरात्रि' : 'Sharad Navratri', icon: '🕉️' };

  // Specific Dates - ALL PRESERVED
  const festivals = {
    2025: {
      '1-26': { type: 'shivratri', name: 'Mahashivratri', icon: '🕉️' },
      '2-14': { type: 'holi', name: 'Holi', icon: '🎨' },
      '2-31': { type: 'eid', name: 'Eid-ul-Fitr', icon: '☪️' },
      '5-6': { type: 'bakrid', name: 'Eid al-Adha', icon: '🐐' },
      '6-6': { type: 'muharram', name: 'Muharram', icon: '🕌' },
      '7-9': { type: 'rakhi', name: 'Raksha Bandhan', icon: '🎁' },
      '7-16': { type: 'janmashtami', name: 'Janmashtami', icon: '🪈' },
      '7-26': { type: 'ganesh', name: 'Ganesh Chaturthi', icon: '🐘' },
      '8-5': { type: 'onam', name: 'Onam', icon: '🌸' },
      '9-2': { type: 'festive', name: 'Dussehra', icon: '🏹' },
      '9-20': { type: 'diwali', name: 'Diwali', icon: '🪔' }
    },
    2026: {
      '1-15': { type: 'shivratri', name: 'Mahashivratri', icon: '🕉️' },
      '2-4': { type: 'holi', name: 'Holi', icon: '🎨' },
      '2-20': { type: 'eid', name: 'Eid-ul-Fitr', icon: '☪️' },
      '4-27': { type: 'bakrid', name: 'Eid al-Adha', icon: '🐐' },
      '7-28': { type: 'rakhi', name: 'Raksha Bandhan', icon: '🎁' },
      '8-4': { type: 'janmashtami', name: 'Janmashtami', icon: '🪈' },
      '8-14': { type: 'ganesh', name: 'Ganesh Chaturthi', icon: '🐘' },
      '9-20': { type: 'festive', name: 'Dussehra', icon: '🏹' },
      '10-8': { type: 'diwali', name: 'Diwali', icon: '🪔' }
    }
  };

  const key = `${m}-${d}`;
  if (festivals[y] && festivals[y][key]) {
    const f = festivals[y][key];
    return { ...f, name: (lang === 'hi' || lang === 'mr') ? getHindiName(f.name) : f.name };
  }

  // Tithi Fallbacks
  if (tithiRaw === 14) return { type: 'purnima', name: tData.tithis[14], icon: '🌕' };
  if (tithiRaw === 29) return { type: 'amavasya', name: tData.tithis[15], icon: '🌑' };
  if (tithiRaw === 10) return { type: 'ekadashi', name: tData.tithis[10], icon: '🙏' };

  return null;
};

// PRESERVED HELPER
function getHindiName(enName) {
  const map = {
    'Mahashivratri': 'महाशिवरात्रि', 'Holi': 'होली', 'Eid-ul-Fitr': 'ईद-उल-फितर',
    'Eid al-Adha': 'बकरीद', 'Muharram': 'मुहर्रम', 'Raksha Bandhan': 'रक्षा बंधन',
    'Janmashtami': 'जन्माष्टमी', 'Ganesh Chaturthi': 'गणेश चतुर्थी', 'Onam': 'ओणम',
    'Dussehra': 'दशहरा', 'Diwali': 'दीपावली'
  };
  return map[enName] || enName;
}

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