"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";
import GitballCard from "../components/GitballCard";
import { CardDetails } from "../lib/cardUtils";

const EXAMPLE_USERS = [
  { username: "torvalds" },
  { username: "yyx990803" },
  { username: "gaearon" },
  { username: "tj" },
  { username: "dhh" },
];

const DEMO_CARDS = [
  {
    username: "torvalds",
    name: "Linus Torvalds",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024?v=4",
    details: {
      rarity: "Icon",
      position: "CB",
      positionDesc: "Center Back",
      flag: "🇫🇮",
      flagCode: "FI",
      nationName: "Finland",
      club: "Linux Foundation",
      stats: { pac: 95, sho: 90, pas: 96, dri: 92, def: 99, phy: 99 },
      ovr: 99,
      badges: ["Legend", "Capitán"],
      funFact: "Created Git and Linux."
    } as CardDetails
  },
  {
    username: "yyx990803",
    name: "Evan You",
    avatarUrl: "https://avatars.githubusercontent.com/u/499550?v=4",
    details: {
      rarity: "Rare Gold",
      position: "CAM",
      positionDesc: "Attacking Midfielder",
      flag: "🇨🇳",
      flagCode: "CN",
      nationName: "China",
      club: "Vue.js",
      stats: { pac: 93, sho: 97, pas: 98, dri: 96, def: 80, phy: 88 },
      ovr: 96,
      badges: ["Viral Creator", "Speedster"],
      funFact: "Creator of Vue and Vite."
    } as CardDetails
  },
  {
    username: "gaearon",
    name: "Dan Abramov",
    avatarUrl: "https://avatars.githubusercontent.com/u/810438?v=4",
    details: {
      rarity: "Rare Silver",
      position: "CAM",
      positionDesc: "State Controller",
      flag: "🇺🇦",
      flagCode: "UA",
      nationName: "Ukraine",
      club: "React",
      stats: { pac: 90, sho: 94, pas: 96, dri: 95, def: 82, phy: 85 },
      ovr: 95,
      badges: ["Legend", "Capitán"],
      funFact: "Co-created Redux."
    } as CardDetails
  }
];

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isScouting, setIsScouting] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  // Audio Synthesizers (Web Audio API) for zero-latency feedback
  const playSoundEffect = (type: "kick" | "hover" | "transition") => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "kick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "hover") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "transition") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.7);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      }
    } catch (err) {
      console.warn("Audio Context blocked:", err);
    }
  };

  const loadingStatuses = [
    "Preparing scouting logs...",
    "Scanning public profile records...",
    "Analyzing programming language metrics...",
    "Evaluating stats and player roles...",
    "Formatting card structures...",
    "Entering pitch deck...",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().replace(/^@/, "").replace(/https?:\/\/github\.com\//, "");
    if (!cleanUser) {
      setError("Please enter a valid GitHub username");
      return;
    }
    
    setError("");
    playSoundEffect("kick");
    startScouting(cleanUser);
  };

  const startScouting = (targetUser: string) => {
    setIsScouting(true);
    setStatusIndex(0);
    playSoundEffect("transition");

    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev >= loadingStatuses.length - 1) {
          clearInterval(interval);
          router.push(`/scout/${targetUser}`);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <main className="flex-1 w-full min-h-screen bg-[#040d0a] flex flex-col justify-between text-slate-100 relative px-6 py-6 font-inter">
      {/* Subtle lines behind (Pitch theme) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center z-20">
        <div className="flex items-center gap-3 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gitball-logo.svg" alt="GitBall Logo" className="w-8 h-9 object-contain" />
          <span className="font-extrabold text-sm tracking-wider uppercase text-white">GITBALL 2026</span>
        </div>
      </header>

      {/* Hero Split Layout */}
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 py-10 z-20">
        
        <AnimatePresence mode="wait">
          {!isScouting ? (
            <React.Fragment key="form-view">
              {/* Left Side: Form Controls */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex-1 max-w-lg w-full flex flex-col items-center md:items-start text-center md:text-left"
              >
                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-none uppercase">
                  Scout Your GitHub Card
                </h1>
                
                <p className="text-slate-400 text-sm sm:text-base max-w-sm mb-8 leading-relaxed font-normal px-2 md:px-0">
                  Generate dynamic World Cup player cards based on real developer metrics. No auth required.
                </p>

                {/* Form Input */}
                <form onSubmit={handleSubmit} className="w-full mb-8">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-black border border-white/10 rounded-2xl shadow-xl">
                    <div className="relative flex-1 flex items-center min-h-[44px]">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        placeholder="Enter GitHub username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full py-2 pl-10 pr-3 bg-transparent text-white placeholder-slate-700 focus:outline-none text-sm font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-3 px-6 bg-white hover:bg-slate-200 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center min-h-[44px]"
                    >
                      Kick Off
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs font-semibold mt-2 text-left pl-3">
                      {error}
                    </p>
                  )}
                </form>

                {/* Quick Search spotlights */}
                <div className="w-full text-left border-t border-white/5 pt-6 px-2 md:px-0">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-3">
                    Scout Spotlights
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {EXAMPLE_USERS.map((user) => (
                      <button
                        key={user.username}
                        type="button"
                        onMouseEnter={() => playSoundEffect("hover")}
                        onClick={() => {
                          setUsername(user.username);
                          setError("");
                          playSoundEffect("kick");
                        }}
                        className="group px-3 py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 rounded-xl text-xs transition-all cursor-pointer text-slate-300 hover:text-white font-semibold"
                      >
                        @{user.username}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Side: Stacked Card Deck Show */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex justify-center md:justify-end w-full overflow-hidden md:overflow-visible py-4 md:py-8 relative"
              >
                <div 
                  className="relative w-[340px] h-[340px] sm:h-[400px] md:h-[480px] select-none pointer-events-none flex items-center justify-center scale-65 min-[375px]:scale-75 sm:scale-90 md:scale-100 origin-center"
                  style={{
                    willChange: "transform",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden"
                  }}
                >
                  
                  {/* Card 3: Silver (Back) */}
                  <div 
                    className="absolute opacity-40 translate-x-[45px] translate-y-[20px] rotate-[7deg] z-10"
                    style={{ 
                      transformOrigin: "center center",
                      willChange: "transform",
                      WebkitBackfaceVisibility: "hidden",
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <GitballCard
                      details={DEMO_CARDS[2].details}
                      avatarUrl={DEMO_CARDS[2].avatarUrl}
                      username={DEMO_CARDS[2].username}
                      name={DEMO_CARDS[2].name}
                    />
                  </div>

                  {/* Card 2: Gold (Middle) */}
                  <div 
                    className="absolute opacity-75 translate-x-[15px] translate-y-[10px] rotate-[2deg] z-20"
                    style={{ 
                      transformOrigin: "center center",
                      willChange: "transform",
                      WebkitBackfaceVisibility: "hidden",
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <GitballCard
                      details={DEMO_CARDS[1].details}
                      avatarUrl={DEMO_CARDS[1].avatarUrl}
                      username={DEMO_CARDS[1].username}
                      name={DEMO_CARDS[1].name}
                    />
                  </div>

                  {/* Card 1: Icon/Legendary (Front) */}
                  <div 
                    className="absolute opacity-100 -translate-x-[15px] -rotate-[5deg] z-30"
                    style={{ 
                      transformOrigin: "center center",
                      willChange: "transform",
                      WebkitBackfaceVisibility: "hidden",
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <GitballCard
                      details={DEMO_CARDS[0].details}
                      avatarUrl={DEMO_CARDS[0].avatarUrl}
                      username={DEMO_CARDS[0].username}
                      name={DEMO_CARDS[0].name}
                    />
                  </div>
                </div>
              </motion.div>
            </React.Fragment>
          ) : (
            /* Loading State Window */
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center p-6 bg-black border border-white/10 rounded-2xl shadow-xl max-w-xs w-full mx-auto"
            >
              <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-4 select-none">
                Scouting Player
              </h3>
              
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((statusIndex + 1) / loadingStatuses.length) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIndex}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="text-slate-300 font-semibold text-xs text-center min-h-[20px]"
                >
                  {loadingStatuses[statusIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full py-5 text-center text-[10px] text-slate-600 border-t border-white/5 z-20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-3 select-none">
          <span>
            made by{" "}
            <a
              href="https://x.com/abhimanyutwts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors underline font-bold"
            >
              @abhimanyutwts
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
