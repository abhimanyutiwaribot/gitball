import { ScoutData } from "./github";

export interface CardStats {
  pac: number; // Pace -> Coding Speed & Activity
  sho: number; // Shooting -> Stars & Impact
  pas: number; // Passing -> Followers & Collaboration
  dri: number; // Dribbling -> Language & Gist variety
  def: number; // Defending -> Quality/Licenses & Open issues handled
  phy: number; // Physical -> Disk space & volume of work (Public repos)
}

export type CardRarity = "Icon" | "Rare Gold" | "Rare Silver" | "Rare Bronze";

export interface CardDetails {
  rarity: CardRarity;
  position: string;
  positionDesc: string;
  flag: string;
  flagCode: string;
  nationName: string;
  club: string;
  stats: CardStats;
  ovr: number;
  badges: string[];
  funFact: string;
}

// Map common locations to country flags, names, and 2-letter ISO codes
const locationMap: { [key: string]: { flag: string; name: string; code: string } } = {
  usa: { flag: "🇺🇸", name: "United States", code: "US" },
  "united states": { flag: "🇺🇸", name: "United States", code: "US" },
  america: { flag: "🇺🇸", name: "United States", code: "US" },
  california: { flag: "🇺🇸", name: "United States", code: "US" },
  "san francisco": { flag: "🇺🇸", name: "United States", code: "US" },
  "new york": { flag: "🇺🇸", name: "United States", code: "US" },
  canada: { flag: "🇨🇦", name: "Canada", code: "CA" },
  uk: { flag: "🇬🇧", name: "United Kingdom", code: "GB" },
  "united kingdom": { flag: "🇬🇧", name: "United Kingdom", code: "GB" },
  london: { flag: "🇬🇧", name: "United Kingdom", code: "GB" },
  england: { flag: "🇬🇧", name: "United Kingdom", code: "GB" },
  germany: { flag: "🇩🇪", name: "Germany", code: "DE" },
  deutschland: { flag: "🇩🇪", name: "Germany", code: "DE" },
  berlin: { flag: "🇩🇪", name: "Germany", code: "DE" },
  munich: { flag: "🇩🇪", name: "Germany", code: "DE" },
  france: { flag: "🇫🇷", name: "France", code: "FR" },
  paris: { flag: "🇫🇷", name: "France", code: "FR" },
  japan: { flag: "🇯🇵", name: "Japan", code: "JP" },
  tokyo: { flag: "🇯🇵", name: "Japan", code: "JP" },
  brazil: { flag: "🇧🇷", name: "Brazil", code: "BR" },
  brasil: { flag: "🇧🇷", name: "Brazil", code: "BR" },
  india: { flag: "🇮🇳", name: "India", code: "IN" },
  bangalore: { flag: "🇮🇳", name: "India", code: "IN" },
  mumbai: { flag: "🇮🇳", name: "India", code: "IN" },
  spain: { flag: "🇪🇸", name: "Spain", code: "ES" },
  espana: { flag: "🇪🇸", name: "Spain", code: "ES" },
  madrid: { flag: "🇪🇸", name: "Spain", code: "ES" },
  barcelona: { flag: "🇪🇸", name: "Spain", code: "ES" },
  ukraine: { flag: "🇺🇦", name: "Ukraine", code: "UA" },
  china: { flag: "🇨🇳", name: "China", code: "CN" },
  beijing: { flag: "🇨🇳", name: "China", code: "CN" },
  shanghai: { flag: "🇨🇳", name: "China", code: "CN" },
  taiwan: { flag: "🇹🇼", name: "Taiwan", code: "TW" },
  australia: { flag: "🇦🇺", name: "Australia", code: "AU" },
  sydney: { flag: "🇦🇺", name: "Australia", code: "AU" },
  melbourne: { flag: "🇦🇺", name: "Australia", code: "AU" },
  netherlands: { flag: "🇳🇱", name: "Netherlands", code: "NL" },
  amsterdam: { flag: "🇳🇱", name: "Netherlands", code: "NL" },
  sweden: { flag: "🇸🇪", name: "Sweden", code: "SE" },
  stockholm: { flag: "🇸🇪", name: "Sweden", code: "SE" },
  switzerland: { flag: "🇨🇭", name: "Switzerland", code: "CH" },
  italy: { flag: "🇮🇹", name: "Italy", code: "IT" },
  italia: { flag: "🇮🇹", name: "Italy", code: "IT" },
  rome: { flag: "🇮🇹", name: "Italy", code: "IT" },
  russia: { flag: "🇷🇺", name: "Russia", code: "RU" },
  poland: { flag: "🇵🇱", name: "Poland", code: "PL" },
  singapore: { flag: "🇸🇬", name: "Singapore", code: "SG" },
  vietnam: { flag: "🇻🇳", name: "Vietnam", code: "VN" },
  indonesia: { flag: "🇮🇩", name: "Indonesia", code: "ID" },
  mexico: { flag: "🇲🇽", name: "Mexico", code: "MX" },
  nigeria: { flag: "🇳🇬", name: "Nigeria", code: "NG" },
  argentina: { flag: "🇦🇷", name: "Argentina", code: "AR" },
  portugal: { flag: "🇵🇹", name: "Portugal", code: "PT" },
};

/**
 * Detect flag and country name from location string
 */
export function detectFlag(location: string): { flag: string; name: string; code: string } {
  if (!location) {
    return { flag: "🏴‍☠️", name: "Stateless Nomad", code: "un" };
  }

  const cleanLoc = location.toLowerCase().trim();

  // Try exact key matching and substring matching
  for (const [key, val] of Object.entries(locationMap)) {
    if (cleanLoc.includes(key)) {
      return val;
    }
  }

  return { flag: "🌍", name: "Global Nomad", code: "un" };
}

/**
 * Determine player position based on top languages
 */
export function getPosition(languages: { [key: string]: number }): { position: string; desc: string } {
  const langList = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  if (langList.length === 0) {
    return { position: "ST", desc: "Independent Striker (Agile all-rounder)" };
  }

  const topLang = langList[0][0].toLowerCase();

  switch (topLang) {
    case "html":
    case "css":
    case "scss":
    case "svelte":
      return { position: "GK", desc: "Goalkeeper (Guarding visual aesthetics)" };
    case "rust":
    case "c":
    case "zig":
      return { position: "CB", desc: "Center Back (Iron-clad system safety)" };
    case "c++":
    case "assembly":
    case "cuda":
      return { position: "SW", desc: "Sweeper (Low-level compiler defense)" };
    case "go":
    case "dockerfile":
    case "shell":
    case "makefile":
      return { position: "LB", desc: "Left Back (Fast containerized pipelines)" };
    case "java":
    case "c#":
    case "kotlin":
      return { position: "CDM", desc: "Defensive Midfielder (Solid thread pool anchor)" };
    case "python":
    case "ruby":
    case "php":
      return { position: "CM", desc: "Central Midfielder (Glue logic & data distributor)" };
    case "typescript":
    case "javascript":
      return { position: "CAM", desc: "Attacking Midfielder (Highly creative frontend architect)" };
    case "swift":
    case "dart":
      return { position: "RW", desc: "Right Winger (Responsive mobile specialist)" };
    case "vue":
    case "astro":
      return { position: "LW", desc: "Left Winger (Speedy rendering winger)" };
    default:
      return { position: "ST", desc: "Striker (Deploys clean builds & finishes features)" };
  }
}

/**
 * Calculate FIFA card stats and details
 */
export function calculateCardDetails(scoutData: ScoutData): CardDetails {
  const { profile, repoStats, contributions } = scoutData;

  // Account Age in years (min 1 year to avoid division by zero)
  const accountAgeYears = Math.max(
    1,
    (new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  // 1. PAC (Pace) - Velocity, frequency and active streaks
  // Formed by current/longest contribution streaks + public repos speed
  const streakBonus = Math.min(20, contributions.longestStreak * 0.5);
  const reposSpeed = Math.min(20, (profile.publicRepos / accountAgeYears) * 3);
  const totalCommitsBonus = Math.min(20, contributions.totalContributions / 20);
  const pac = Math.round(35 + Math.min(64, streakBonus + reposSpeed + totalCommitsBonus));

  // 2. SHO (Shooting) - Stars and Forks (Overall Impact)
  const starsFactor = Math.min(30, repoStats.totalStars * 1.5);
  const forksFactor = Math.min(20, repoStats.totalForks * 2.5);
  const bioVibe = profile.bio ? 5 : 0;
  const followersBonus = Math.min(10, profile.followers * 0.1);
  const sho = Math.round(35 + Math.min(64, starsFactor + forksFactor + bioVibe + followersBonus));

  // 3. PAS (Passing) - Collaboration and Outreach (Followers, Following, Org membership)
  const colFollowers = Math.min(30, profile.followers * 0.5);
  const colFollowing = Math.min(15, profile.following * 0.3);
  const blogBonus = profile.blog ? 10 : 0;
  const companyBonus = profile.company ? 10 : 0;
  const pas = Math.round(35 + Math.min(64, colFollowers + colFollowing + blogBonus + companyBonus));

  // 4. DRI (Dribbling) - Languages variety & gist versatility
  const langCount = Object.keys(repoStats.languages).length;
  const langBonus = Math.min(30, langCount * 6);
  const hasGists = Math.min(15, (profile.followers > 0 ? 10 : 0) + 5);
  const websiteBonus = profile.blog.includes("https") ? 10 : 0;
  const dri = Math.round(35 + Math.min(64, langBonus + hasGists + websiteBonus));

  // 5. DEF (Defending) - Code stability & project longevity (Licenses, Issues managed)
  const licenseRate = repoStats.reposCount > 0 ? (repoStats.hasLicenseCount / repoStats.reposCount) * 30 : 0;
  const issuesBonus = Math.min(20, repoStats.openIssuesCount * 1.5);
  const def = Math.round(35 + Math.min(64, licenseRate + issuesBonus + 15));

  // 6. PHY (Physical) - Work Volume & Stamina (Public repos, green contribution days)
  const greenDaysBonus = Math.min(25, contributions.greenDays * 0.2);
  const publicReposBonus = Math.min(25, profile.publicRepos * 0.5);
  const physicalAge = Math.min(14, accountAgeYears * 1.5);
  const phy = Math.round(35 + Math.min(64, greenDaysBonus + publicReposBonus + physicalAge));

  // OVR (Overall Rating)
  let rawOvr = Math.round(
    pac * 0.15 +
    sho * 0.22 +
    pas * 0.20 +
    dri * 0.15 +
    def * 0.13 +
    phy * 0.15
  );

  // Boosts
  if (repoStats.totalStars > 1000) rawOvr += 2;
  if (contributions.longestStreak > 30) rawOvr += 2;
  if (profile.followers > 500) rawOvr += 1;

  const ovr = Math.min(99, Math.max(45, rawOvr));

  // Determine Rarity
  let rarity: CardRarity = "Rare Bronze";
  if (ovr >= 90) rarity = "Icon";
  else if (ovr >= 80) rarity = "Rare Gold";
  else if (ovr >= 60) rarity = "Rare Silver";

  // Badges
  const badges: string[] = [];
  if (repoStats.totalStars >= 500) badges.push("Viral Creator");
  if (contributions.longestStreak >= 21) badges.push("Streak King");
  if (profile.followers >= 200) badges.push("Capitán");
  if (langCount >= 6) badges.push("Polylingual");
  if (accountAgeYears >= 10) badges.push("Legend");
  else if (accountAgeYears >= 5) badges.push("Veteran");
  
  if (repoStats.hasLicenseCount >= 5) badges.push("OS Protector");
  if (pac >= 85) badges.push("Speedster");
  if (sho >= 85) badges.push("Golden Boot");

  // Keep max 3 badges for styling
  const finalBadges = badges.slice(0, 3);
  if (finalBadges.length === 0) {
    finalBadges.push("Team Player");
  }

  // Club Name
  let club = profile.company ? profile.company.replace(/^@/, "") : "";
  if (!club && repoStats.reposCount > 0) {
    club = "FC OpenSource";
  } else if (!club) {
    club = "Unattached FC";
  }
  if (club.length > 15) club = club.substring(0, 13) + "..";

  // Position
  const { position, desc: positionDesc } = getPosition(repoStats.languages);

  // Nation
  const { flag, name: nationName, code: flagCode } = detectFlag(profile.location);

  // Fun Fact (Satirical Scouting Report)
  let funFact = "";
  const topLangList = Object.entries(repoStats.languages).sort((a, b) => b[1] - a[1]);
  const primaryLanguage = topLangList.length > 0 ? topLangList[0][0] : "";

  if (repoStats.reposCount === 0) {
    funFact = "A mysterious signing who prefers training behind closed doors (private repos). Zero public footprints detected.";
  } else if (primaryLanguage.toLowerCase() === "typescript" || primaryLanguage.toLowerCase() === "javascript") {
    funFact = "Flamboyant playmaker prone to excessive step-overs (nested callbacks). Warned by refs for diving in npm package pools.";
  } else if (primaryLanguage.toLowerCase() === "rust") {
    funFact = "Iron-clad defender rumored to eat memory leaks for breakfast. Borrow-checks attackers into absolute submission.";
  } else if (primaryLanguage.toLowerCase() === "python") {
    funFact = "Deploys precise data passes in the midfield, but gets caught walking when asked to run multi-threaded sprints.";
  } else if (primaryLanguage.toLowerCase() === "go") {
    funFact = "Speedy fullback delivering containerized passes. Lacks generic moves, relying entirely on basic structural sprints.";
  } else if (primaryLanguage.toLowerCase() === "c" || primaryLanguage.toLowerCase() === "c++") {
    funFact = "Plays without protective gear (garbage collection). One bad tackle results in a segfault, crashing the entire match.";
  } else if (primaryLanguage.toLowerCase() === "java" || primaryLanguage.toLowerCase() === "c#") {
    funFact = "Constructs abstract factory patterns for 80 minutes before taking a shot. Stable anchor but slow boot time.";
  } else if (primaryLanguage.toLowerCase() === "html" || primaryLanguage.toLowerCase() === "css") {
    funFact = "Agile goalkeeper who refuses to dive unless absolute positioning is maintained and the grid aligns.";
  } else if (primaryLanguage.toLowerCase() === "ruby") {
    funFact = "Values developer happiness above tactical discipline. Scores beautiful overhead kicks but struggles under heavy pressure.";
  } else if (primaryLanguage.toLowerCase() === "php") {
    funFact = "Declared finished by analysts for 15 years, yet continues to power 80% of all goals in the lower divisions.";
  } else if (repoStats.totalStars > 1000) {
    funFact = `A crowd-favorite superstar whose viral goals (${repoStats.totalStars} stars) have stadium scouts in absolute frenzy.`;
  } else if (contributions.longestStreak > 21) {
    funFact = `Stamina monster with a ${contributions.longestStreak}-day green training streak, running laps while teammates sleep.`;
  } else {
    funFact = `A reliable utility player who has clocked ${profile.publicRepos} public matches with a clean technical style.`;
  }

  // Hardcode fun Easter Eggs for famous developers
  const lowerUser = profile.username.toLowerCase();
  if (lowerUser === "torvalds") {
    return {
      rarity: "Icon",
      position: "CB",
      positionDesc: "Center Back (Iron-clad system safety)",
      flag: "🇫🇮",
      flagCode: "FI",
      nationName: "Finland",
      club: "Linux Foundation",
      stats: { pac: 95, sho: 90, pas: 96, dri: 92, def: 99, phy: 99 },
      ovr: 99,
      badges: ["Legend", "OS Protector", "Capitán"],
      funFact: "Created Git and Linux. Basically owns the stadium we are playing in.",
    };
  } else if (lowerUser === "yyx990803") {
    return {
      rarity: "Icon",
      position: "CAM",
      positionDesc: "Attacking Midfielder (Highly creative frontend architect)",
      flag: "🇨🇳",
      flagCode: "CN",
      nationName: "China",
      club: "Vue.js",
      stats: { pac: 93, sho: 97, pas: 98, dri: 96, def: 80, phy: 88 },
      ovr: 96,
      badges: ["Viral Creator", "Polylingual", "Speedster"],
      funFact: "Dribbles past bugs using reactive signals. Creator of Vue and Vite.",
    };
  } else if (lowerUser === "gaearon") {
    return {
      rarity: "Icon",
      position: "CAM",
      positionDesc: "Attacking Midfielder (Highly creative frontend architect)",
      flag: "🇺🇦",
      flagCode: "UA",
      nationName: "Ukraine",
      club: "Meta",
      stats: { pac: 90, sho: 94, pas: 96, dri: 95, def: 82, phy: 85 },
      ovr: 95,
      badges: ["Legend", "Polylingual", "Capitán"],
      funFact: "Co-created Redux and shaped modern React. Controls state in the midfield.",
    };
  }



  return {
    rarity,
    position,
    positionDesc,
    flag,
    flagCode,
    nationName,
    club,
    stats: { pac, sho, pas, dri, def, phy },
    ovr,
    badges: finalBadges,
    funFact,
  };
}
