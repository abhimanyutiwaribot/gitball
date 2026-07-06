export interface GitHubProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  blog: string;
  company: string;
}

export interface RepoStats {
  totalStars: number;
  totalForks: number;
  languages: { [key: string]: number }; // Language -> repo count
  reposCount: number;
  hasLicenseCount: number;
  openIssuesCount: number;
}

export interface ContributionStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  greenDays: number;
}

export interface ScoutData {
  profile: GitHubProfile;
  repoStats: RepoStats;
  contributions: ContributionStats;
}

/**
 * Fetch public GitHub profile data
 */
export async function fetchUserProfile(username: string, token?: string): Promise<GitHubProfile> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitBall-2026-Scouter",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`GitHub user "${username}" not found.`);
    }
    throw new Error(`GitHub API error: ${res.statusText} (${res.status})`);
  }

  const data = await res.json();

  return {
    username: data.login,
    name: data.name || data.login,
    avatarUrl: data.avatar_url,
    bio: data.bio || "",
    location: data.location || "",
    followers: data.followers || 0,
    following: data.following || 0,
    publicRepos: data.public_repos || 0,
    createdAt: data.created_at,
    blog: data.blog || "",
    company: data.company || "",
  };
}

/**
 * Fetch user repositories and aggregate stats
 */
export async function fetchUserRepos(username: string, token?: string): Promise<RepoStats> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitBall-2026-Scouter",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  // Fetch up to 100 public repositories (standard page limit)
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch repositories for ${username}: ${res.statusText}`);
  }

  const repos = await res.json();

  let totalStars = 0;
  let totalForks = 0;
  let hasLicenseCount = 0;
  let openIssuesCount = 0;
  const languages: { [key: string]: number } = {};

  if (Array.isArray(repos)) {
    repos.forEach((repo: any) => {
      // Don't count forks owned by the user to avoid inflating stats
      if (repo.fork) return;

      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      openIssuesCount += repo.open_issues_count || 0;
      if (repo.license) {
        hasLicenseCount++;
      }

      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
  }

  return {
    totalStars,
    totalForks,
    languages,
    reposCount: Array.isArray(repos) ? repos.filter((r: any) => !r.fork).length : 0,
    hasLicenseCount,
    openIssuesCount,
  };
}

/**
 * Scrape GitHub contribution calendar from the public page
 */
export async function scrapeContributions(username: string): Promise<ContributionStats> {
  const fallbackStats: ContributionStats = {
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
    greenDays: 0,
  };

  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return fallbackStats;
    }

    const html = await res.text();

    // 1. Extract total contributions count
    // Example markup: <h2 class="f4 text-normal mb-2"> 1,234 contributions in the last year </h2>
    const totalMatch = html.match(/(\d{1,3}(?:,\d{3})*)\s+contributions/i);
    const totalContributions = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
      : 0;

    // 2. Parse calendar days
    // Example markup (various formats):
    // <td ... data-level="1" data-date="2026-07-01" ...>
    // or SVG <rect ... data-level="1" data-date="2026-07-01" ...>
    const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    const days: { date: string; level: number }[] = [];
    let match;

    while ((match = dayRegex.exec(html)) !== null) {
      days.push({
        date: match[1],
        level: parseInt(match[2], 10),
      });
    }

    // Sort days chronologically
    days.sort((a, b) => a.date.localeCompare(b.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let greenDays = 0;

    days.forEach((day) => {
      if (day.level > 0) {
        greenDays++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    // Calculate current streak (look backwards from today/yesterday)
    // Find the latest day with level > 0, and trace backwards
    let streakActive = true;
    let activeStreakCount = 0;
    
    // We start from the end of the days array
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].level > 0) {
        activeStreakCount++;
      } else {
        // A single day of gap is allowed if it's today (e.g. they haven't committed today yet)
        if (i === days.length - 1) {
          continue; // Allow today to be 0 and keep checking yesterday
        }
        break;
      }
    }
    currentStreak = activeStreakCount;

    return {
      totalContributions: totalContributions || greenDays * 2, // Fallback if count scraping fails
      currentStreak,
      longestStreak: longestStreak || currentStreak,
      greenDays,
    };
  } catch (error) {
    console.error("Error scraping contributions:", error);
    return fallbackStats;
  }
}

/**
 * Combined scouter service
 */
export async function scoutUser(username: string, token?: string): Promise<ScoutData> {
  const cleanUsername = username.trim().replace(/^@/, "");
  
  // Run queries in parallel
  const [profile, repoStats, contributions] = await Promise.all([
    fetchUserProfile(cleanUsername, token),
    fetchUserRepos(cleanUsername, token),
    scrapeContributions(cleanUsername),
  ]);

  return {
    profile,
    repoStats,
    contributions,
  };
}
