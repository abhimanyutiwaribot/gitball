import { NextRequest, NextResponse } from "next/server";
import { scoutUser } from "../../../lib/github";
import { calculateCardDetails, getEasterEggCard } from "../../../lib/cardUtils";

// Simple in-memory sliding-window rate limiter
const ipCache = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute per IP

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
  }

  // Enforce rate limit
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
  const now = Date.now();
  
  // Occasional cache eviction to prevent memory growth (1% chance per call)
  if (Math.random() < 0.01) {
    for (const [key, val] of ipCache.entries()) {
      if (now > val.resetTime) {
        ipCache.delete(key);
      }
    }
  }

  const cached = ipCache.get(ip);
  if (cached) {
    if (now > cached.resetTime) {
      // Limit window expired, refresh slot
      ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else if (cached.count >= MAX_REQUESTS) {
      // Too many requests
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before scouting again." },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((cached.resetTime - now) / 1000).toString()
          }
        }
      );
    } else {
      cached.count++;
    }
  } else {
    ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }

  // Enforce GitHub username security restrictions: max 39 chars, alphanumeric/hyphens, no consecutive hyphens
  const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  if (!usernameRegex.test(username)) {
    return NextResponse.json({ error: "Invalid GitHub username format" }, { status: 400 });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const scoutData = await scoutUser(username, token);

    // Intercept Easter Eggs to bypass AI processing and guarantee exact stats
    const easterEgg = getEasterEggCard(username);
    if (easterEgg) {
      return NextResponse.json({
        scoutData,
        cardDetails: easterEgg
      });
    }

    // Try NVIDIA NIM AI integration first
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    if (nvidiaKey) {
      try {
        const topLanguages = Object.entries(scoutData.repoStats.languages)
          .sort((a, b) => b[1] - a[1])
          .map(([lang]) => lang)
          .slice(0, 4);

        const promptData = {
          username: scoutData.profile.username,
          name: scoutData.profile.name,
          bio: scoutData.profile.bio,
          location: scoutData.profile.location,
          followers: scoutData.profile.followers,
          following: scoutData.profile.following,
          publicRepos: scoutData.profile.publicRepos,
          totalStars: scoutData.repoStats.totalStars,
          totalForks: scoutData.repoStats.totalForks,
          topLanguages,
          totalContributions: scoutData.contributions.totalContributions,
          longestStreak: scoutData.contributions.longestStreak,
        };

        const systemPrompt = `You are a professional EA Sports FIFA FUT scout. 
You calculate ratings for developers based on their GitHub profile metrics.
You MUST output a valid JSON object matching this structure EXACTLY:
{
  "ovr": number, (Overall Rating between 45 and 99. Make it feel fair and proportional to stargazers/followers/streaks)
  "position": string, (GK, CB, LB, RB, CDM, CM, CAM, RW, LW, ST. Map based on top language)
  "stats": {
    "pac": number, (Pace: coding speed/streak/commits volume, 30-99)
    "sho": number, (Shooting: stars/forks/code impact, 30-99)
    "pas": number, (Passing: followers/following/collab work, 30-99)
    "dri": number, (Dribbling: languages count/gist variety, 30-99)
    "def": number, (Defending: licenses percentage/open issues solved, 30-99)
    "phy": number (Physical: stamina/public repos volume/account age, 30-99)
  },
  "badges": string[], (Exactly 2 to 3 badges from: "Legend", "OS Protector", "Viral Creator", "Capitán", "Speedster", "Veteran", "Polylingual")
  "funFact": string (A highly specific, witty, funny, and satirical 1-2 sentence scouting report of this developer as a football player based on their top languages and coding habits. Make it hilarious!)
}
Do NOT include any markdown code blocks, backticks, or other text outside the JSON object. Just return the raw JSON object.`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.1-8b-instruct",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: JSON.stringify(promptData) },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (aiResponse.ok) {
          const aiJson = await aiResponse.json();
          const content = aiJson.choices?.[0]?.message?.content;
          if (content) {
            let responseText = content.trim();
            // Sanitize markdown fences if generated
            if (responseText.startsWith("```json")) {
              responseText = responseText.substring(7);
            } else if (responseText.startsWith("```")) {
              responseText = responseText.substring(3);
            }
            if (responseText.endsWith("```")) {
              responseText = responseText.substring(0, responseText.length - 3);
            }

            const parsed = JSON.parse(responseText.trim());

            // Build cardDetails matching layout requirements
            const cardDetails = {
              rarity: parsed.ovr >= 90 ? "Icon" : parsed.ovr >= 80 ? "Rare Gold" : parsed.ovr >= 60 ? "Rare Silver" : "Rare Bronze",
              position: parsed.position,
              positionDesc: `${parsed.position} (AI Scouted Role)`,
              flag: calculateCardDetails(scoutData).flag, // reuse flag detect logic
              flagCode: calculateCardDetails(scoutData).flagCode,
              nationName: calculateCardDetails(scoutData).nationName,
              club: calculateCardDetails(scoutData).club, // reuse club detect logic
              stats: parsed.stats,
              ovr: parsed.ovr,
              badges: parsed.badges,
              funFact: parsed.funFact,
            };

            return NextResponse.json({ scoutData, cardDetails });
          }
        }
      } catch (aiErr) {
        console.warn("NVIDIA NIM API failed, falling back to heuristics:", aiErr);
      }
    }

    // Fallback to local heuristic engine
    const cardDetails = calculateCardDetails(scoutData);
    return NextResponse.json({ scoutData, cardDetails });
  } catch (error: any) {
    console.error("Scout API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to scout player" },
      { status: error.message?.includes("not found") ? 404 : 500 }
    );
  }
}
