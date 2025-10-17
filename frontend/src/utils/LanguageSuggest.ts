export const LANGUAGES = [
    "English","Korean","Japanese","Chinese","French","Spanish","German","Italian","Portuguese","Russian","Arabic","Hindi","Thai","Vietnamese","Tagalog","Indonesian","Turkish"
    ];
    
    
    const ALIASES: Record<string, string> = {
    eng: "English", engl: "English", english: "English", engrish: "English",
    kr: "Korean", kor: "Korean", hangul: "Korean", hangugo: "Korean",
    jp: "Japanese", jpn: "Japanese", nihongo: "Japanese",
    cn: "Chinese", mandarin: "Chinese", cantonese: "Chinese",
    espanol: "Spanish", espanhol: "Spanish",
    };
    
    
    // Simple Levenshtein distance for fuzzy matching
    function lev(a: string, b: string) {
    a = a.toLowerCase(); b = b.toLowerCase();
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
    
    
    // alias exact match first
    if (ALIASES[q]) return [{ label: ALIASES[q], value: ALIASES[q] }];
    
    
    // direct startsWith matches
    const starts = LANGUAGES.filter(l => l.toLowerCase().startsWith(q)).map(l => ({ label: l, value: l }));
    if (starts.length) return starts.slice(0, 6);
    
    
    // fuzzy by distance <= 2
    const scored = LANGUAGES
    .map(l => ({ l, d: lev(q, normalize(l)) }))
    .sort((a, b) => a.d - b.d)
    .filter(x => x.d <= 2)
    .map(x => ({ label: x.l, value: x.l }));
    
    
    return scored.slice(0, 6);
    }