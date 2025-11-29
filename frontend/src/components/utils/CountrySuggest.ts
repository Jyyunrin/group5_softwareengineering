/**
 * Country suggestion content with ~70 countries.
 */
export const COUNTRIES = [
  // Americas
  "United States",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Peru",
  "Colombia",
  "Venezuela",
  "Ecuador",

  // Europe
  "United Kingdom",
  "Ireland",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Iceland",
  "Poland",
  "Czech Republic",
  "Slovakia",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Greece",
  "Turkey",
  "Ukraine",
  "Russia",

  // Asia
  "China",
  "Japan",
  "South Korea",
  "North Korea",
  "India",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "Bhutan",
  "Thailand",
  "Vietnam",
  "Cambodia",
  "Laos",
  "Myanmar",
  "Indonesia",
  "Malaysia",
  "Singapore",
  "Philippines",
  "Mongolia",

  // Middle East
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Iran",
  "Iraq",
  "Israel",
  "Jordan",
  "Lebanon",

  // Africa
  "South Africa",
  "Egypt",
  "Nigeria",
  "Kenya",
  "Ethiopia",
  "Morocco",
  "Algeria",
  "Tunisia",
  "Ghana",
  "Tanzania",

  // Oceania
  "Australia",
  "New Zealand",
];

// Aliases & common short forms
const ALIASES: Record<string, string> = {
  // United States
  us: "United States",
  usa: "United States",
  "u.s.": "United States",
  "u.s.a": "United States",
  america: "United States",
  "united states of america": "United States",

  // Canada
  ca: "Canada",
  can: "Canada",

  // United Kingdom
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  britain: "United Kingdom",
  "great britain": "United Kingdom",
  england: "United Kingdom",

  // South Korea
  sk: "South Korea",
  "south korea": "South Korea",
  korea: "South Korea",
  "republic of korea": "South Korea",

  // North Korea
  nk: "North Korea",
  "north korea": "North Korea",
  "dprk": "North Korea",

  // UAE
  uae: "United Arab Emirates",
  "united arab emirates": "United Arab Emirates",
  dubai: "United Arab Emirates",

  // Russia
  ru: "Russia",
  rus: "Russia",
  russian: "Russia",
  "russian federation": "Russia",

  // China
  cn: "China",
  prc: "China",
  "people's republic of china": "China",
  china: "China",

  // Japan
  jp: "Japan",
  nippon: "Japan",
  nihon: "Japan",

  // Germany
  de: "Germany",
  ger: "Germany",
  deutsch: "Germany",
  deutschland: "Germany",

  // France
  fr: "France",
  franca: "France",
  france: "France",

  // Spain
  es: "Spain",
  espana: "Spain",
  españa: "Spain",

  // Italy
  it: "Italy",
  italia: "Italy",

  // Brazil
  br: "Brazil",
  brasil: "Brazil",

  // Australia
  au: "Australia",
  aussie: "Australia",

  // New Zealand
  nz: "New Zealand",
  "aotearoa": "New Zealand",

  // South Africa
  za: "South Africa",
  "s. africa": "South Africa",

  // Misc popular shortcuts
  mx: "Mexico",
  ar: "Argentina",
  cl: "Chile",
  pe: "Peru",
  co: "Colombia",
  ve: "Venezuela",
  in: "India",
  pk: "Pakistan",
  bd: "Bangladesh",
  th: "Thailand",
  vn: "Vietnam",
  sg: "Singapore",
  my: "Malaysia",
  id: "Indonesia",
  ph: "Philippines",
  eg: "Egypt",
  ng: "Nigeria",
  ke: "Kenya",
  ma: "Morocco",
  tn: "Tunisia",
  gh: "Ghana",
  tz: "Tanzania",
};

function lev(a: string, b: string) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length,
    n = b.length;
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

export function suggestCountries(query: string) {
  const q = normalize(query);
  if (!q) return [] as { label: string; value: string }[];

  if (ALIASES[q]) {
    const label = ALIASES[q];
    return [{ label, value: label }];
  }

  const starts = COUNTRIES.filter((c) =>
    c.toLowerCase().startsWith(q)
  ).map((c) => ({ label: c, value: c }));
  if (starts.length) return starts.slice(0, 6);

  const scored = COUNTRIES
    .map((c) => ({ c, d: lev(q, normalize(c)) }))
    .sort((a, b) => a.d - b.d)
    .filter((x) => x.d <= 2)
    .map((x) => ({ label: x.c, value: x.c }));

  return scored.slice(0, 6);
}
