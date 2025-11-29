/**
 * Language suggestion content with 60 languages.
 * This page is paired with TextInputStep.tsx
 */
export const LANGUAGES = [
  "Afrikaans",
  "Amharic",
  "Arabic",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Burmese",
  "Chinese",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Finnish",
  "French",
  "German",
  "Greek",
  "Gujarati",
  "Hausa",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Italian",
  "Japanese",
  "Kannada",
  "Khmer",
  "Korean",
  "Kurdish",
  "Lao",
  "Malay",
  "Malayalam",
  "Marathi",
  "Mongolian",
  "Nepali",
  "Norwegian",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Serbian",
  "Sinhala",
  "Slovak",
  "Somali",
  "Spanish",
  "Swahili",
  "Swedish",
  "Tagalog",
  "Tamil",
  "Telugu",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Vietnamese",
  "Xhosa",
  "Yoruba",
  "Zulu"
];

// Extended aliases & common names
const ALIASES: Record<string, string> = {
  // English-family
  en: "English", eng: "English", engl: "English", english: "English", engrish: "English",

  // East Asian
  kr: "Korean", kor: "Korean", hangul: "Korean", hangugo: "Korean", hangukeo: "Korean",
  jp: "Japanese", jpn: "Japanese", nihongo: "Japanese", nippon: "Japanese", ja: "Japanese",
  cn: "Chinese", zh: "Chinese", mandarin: "Chinese", cantonese: "Chinese", zhongwen: "Chinese",

  // European
  fr: "French", francais: "French", frnch: "French",
  es: "Spanish", espanol: "Spanish", espanhol: "Spanish", spn: "Spanish",
  de: "German", deutsch: "German", ger: "German",
  it: "Italian", italiano: "Italian", ita: "Italian",
  pt: "Portuguese", portugues: "Portuguese", brasil: "Portuguese", br: "Portuguese",
  ru: "Russian", rus: "Russian", russkiy: "Russian",
  nl: "Dutch", nederlands: "Dutch",
  pl: "Polish", polski: "Polish",
  sv: "Swedish", svenska: "Swedish",
  da: "Danish", dansk: "Danish",
  no: "Norwegian", norsk: "Norwegian",
  fi: "Finnish", suomi: "Finnish",
  is: "Icelandic", islenska: "Icelandic",
  el: "Greek", greek: "Greek", ellinika: "Greek",
  ro: "Romanian", romana: "Romanian",
  hu: "Hungarian", magyar: "Hungarian",
  cs: "Czech", cz: "Czech", cesky: "Czech",
  sk: "Slovak", slovensky: "Slovak",
  bg: "Bulgarian", bulgarian: "Bulgarian",
  sr: "Serbian", srb: "Serbian",
  hr: "Croatian", hrv: "Croatian",
  bs: "Bosnian", bosanski: "Bosnian",

  // Middle East & South Asia
  ar: "Arabic", arab: "Arabic", arabic: "Arabic",
  fa: "Persian", farsi: "Persian",
  ps: "Pashto", pushto: "Pashto",
  ku: "Kurdish", kurdi: "Kurdish",
  he: "Hebrew", ivrit: "Hebrew",
  hi: "Hindi", hind: "Hindi",
  ur: "Urdu", urd: "Urdu",
  ta: "Tamil", tamizh: "Tamil",
  te: "Telugu", tel: "Telugu",
  mr: "Marathi", marathi: "Marathi",
  pa: "Punjabi", punjabi: "Punjabi", panjabi: "Punjabi",
  gu: "Gujarati", gujrati: "Gujarati",
  kn: "Kannada", kan: "Kannada",
  ml: "Malayalam", malayalam: "Malayalam",
  si: "Sinhala", sinhalese: "Sinhala",
  ne: "Nepali", nep: "Nepali",

  // SE Asia
  th: "Thai", thai: "Thai", siam: "Thai",
  km: "Khmer", cambodian: "Khmer",
  lo: "Lao", laos: "Lao",
  my: "Burmese", burma: "Burmese", myanmar: "Burmese",
  mn: "Mongolian", mongol: "Mongolian",
  id: "Indonesian", indo: "Indonesian", bahasa: "Indonesian",
  ms: "Malay", melayu: "Malay",
  tl: "Tagalog", filipino: "Tagalog", ph: "Tagalog",
  vi: "Vietnamese", viet: "Vietnamese", tiengviet: "Vietnamese",

  // Africa
  sw: "Swahili", kiswahili: "Swahili",
  zu: "Zulu", xh: "Xhosa", af: "Afrikaans", ha: "Hausa",
  am: "Amharic", so: "Somali", yo: "Yoruba", ig: "Igbo",

  // South Asia (extras)
  bn: "Bengali", bangla: "Bengali",
};

const LANGUAGE_FLAGS: Record<
  string,
  { flag: string; code: string }
> = {
  English:    { flag: "🇺🇸", code: "EN" },
  Korean:     { flag: "🇰🇷", code: "KO" },
  Japanese:   { flag: "🇯🇵", code: "JA" },
  Chinese:    { flag: "🇨🇳", code: "ZH" },
  French:     { flag: "🇫🇷", code: "FR" },
  Spanish:    { flag: "🇪🇸", code: "ES" },
  German:     { flag: "🇩🇪", code: "DE" },
  Italian:    { flag: "🇮🇹", code: "IT" },
  Portuguese: { flag: "🇵🇹", code: "PT" },
  Russian:    { flag: "🇷🇺", code: "RU" },
  Arabic:     { flag: "🇸🇦", code: "AR" },
  Hindi:      { flag: "🇮🇳", code: "HI" },
  Thai:       { flag: "🇹🇭", code: "TH" },
  Vietnamese: { flag: "🇻🇳", code: "VI" },
  Indonesian: { flag: "🇮🇩", code: "ID" },
  Dutch:      { flag: "🇳🇱", code: "NL" },
  Polish:     { flag: "🇵🇱", code: "PL" },
  Swedish:    { flag: "🇸🇪", code: "SV" },
  Greek:      { flag: "🇬🇷", code: "EL" },
  Hebrew:     { flag: "🇮🇱", code: "HE" },
  Malay:      { flag: "🇲🇾", code: "MS" },
  Bengali:    { flag: "🇧🇩", code: "BN" },
  Urdu:       { flag: "🇵🇰", code: "UR" },
  Turkish:    { flag: "🇹🇷", code: "TR" },
};

export type LanguageMeta = {
  label: string; 
  code: string; 
  flag: string;  
};

export function getLanguageMeta(raw: string | null | undefined): LanguageMeta | null {
  if (!raw) return null;

  const q = normalize(raw);

  let label: string | undefined = ALIASES[q];
  if (!label) {
    label = LANGUAGES.find(l => normalize(l) === q) || undefined;
  }
  if (!label && q.length <= 3) {
    const codeMap: Record<string, string> = {
      en: "English",
      fr: "French",
      pt: "Portuguese",
      es: "Spanish",
      de: "German",
      it: "Italian",
      ko: "Korean",
      ja: "Japanese",
      zh: "Chinese",
      ru: "Russian",
      ar: "Arabic",
      hi: "Hindi",
    };
    label = codeMap[q];
  }

  if (!label) return null;

  const meta = LANGUAGE_FLAGS[label] || {
    flag: "🏳️", // fallback generic flag
    code: raw.toString().toUpperCase(),
  };

  return {
    label,
    code: meta.code,
    flag: meta.flag,
  };
}

function lev(a: string, b: string) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

export function suggestLanguages(query: string) {
  const q = normalize(query);
  if (!q) return [] as { label: string; value: string }[];

  if (ALIASES[q]) return [{ label: ALIASES[q], value: ALIASES[q] }];

  const starts = LANGUAGES.filter(l => l.toLowerCase().startsWith(q))
    .map(l => ({ label: l, value: l }));
  if (starts.length) return starts.slice(0, 6);

  const scored = LANGUAGES
    .map(l => ({ l, d: lev(q, normalize(l)) }))
    .sort((a, b) => a.d - b.d)
    .filter(x => x.d <= 2)
    .map(x => ({ label: x.l, value: x.l }));

  return scored.slice(0, 6);
}

