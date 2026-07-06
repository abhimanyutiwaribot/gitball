"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, ArrowLeft, RotateCcw, AlertTriangle, Trophy, Volume2 } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import GitballCard from "../../../components/GitballCard";
import { CardDetails } from "../../../lib/cardUtils";
import { ScoutData } from "../../../lib/github";

interface ScoutClientProps {
  username: string;
}

export default function ScoutClient({ username }: ScoutClientProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<{
    scoutData: ScoutData;
    cardDetails: CardDetails;
  } | null>(null);

  const [packOpened, setPackOpened] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [cardTheme, setCardTheme] = useState<"light" | "dark">("dark");

  // Audio Synthesizer zero-latency chimes
  const playSoundEffect = (type: "open" | "click" | "error") => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "open") {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
          
          const start = ctx.currentTime + index * 0.08;
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
          
          osc.start(start);
          osc.stop(start + 0.4);
        });
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(170, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (err) {
      console.warn("Audio Context blocked:", err);
    }
  };

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/scout?username=${encodeURIComponent(username)}`);
        
        if (!active) return;

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to scout profile");
        }

        const json = await response.json();
        setData(json);
        setIsLoading(false);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Failed to fetch user data.");
        setIsLoading(false);
        playSoundEffect("error");
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [username]);

  const handleOpenPack = () => {
    playSoundEffect("open");
    setPackOpened(true);
    if (data && data.cardDetails.ovr >= 80) {
      setTimeout(() => {
        triggerCelebration();
      }, 250);
    }
  };

  const triggerCelebration = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#ffffff", "#eab308", "#1e293b"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#ffffff", "#eab308", "#1e293b"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleDownload = async () => {
    const cardNode = document.getElementById("gitball-card-capture");
    if (!cardNode) return;

    setDownloading(true);
    playSoundEffect("click");
    try {
      const dataUrl = await toPng(cardNode, {
        cacheBust: true,
        backgroundColor: "transparent",
        pixelRatio: 3, 
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          boxShadow: "none",
        },
      });

      const link = document.createElement("a");
      link.download = `gitball-26-${username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate card image", err);
      alert("Failed to download card. Try taking a screenshot!");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!data) return;
    playSoundEffect("click");
    setSharing(true);

    const { cardDetails } = data;
    const tweetText = `Scouted my GitHub profile for the 2026 World Cup! ⚽🏆

Position: ${cardDetails.position}
OVR Rating: ${cardDetails.ovr}
Badges: ${cardDetails.badges.join(", ")}

Scout yours here: ${window.location.origin}

#GitBall2026 @GitHub`;

    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GitBall 2026 Scout Card",
          text: tweetText,
          url: window.location.origin,
        });
        setSharing(false);
        return;
      } catch (err) {
        // Fallback
      }
    }

    window.open(shareUrl, "_blank");
    setSharing(false);
  };

  return (
    <main className="flex-1 w-full min-h-screen bg-[#040d0a] flex flex-col justify-between text-slate-100 relative px-6 py-6 font-inter">
      {/* Subtle lines behind (Pitch theme) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center z-20">
        <Link href="/" className="flex items-center gap-1.5 group text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Pitch Entry</span>
        </Link>
        
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full z-20 py-8">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center p-6 bg-black border border-white/10 rounded-2xl shadow-xl max-w-xs w-full text-center"
            >
              <div className="w-10 h-10 relative mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-white animate-spin" />
              </div>
              <h3 className="text-xs uppercase tracking-wider font-black text-slate-500 mb-1">Scouting Roster</h3>
              <p className="text-slate-300 text-xs font-semibold">
                Analyzing <span className="text-white font-bold">@{username}</span>
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center p-6 bg-black border border-red-500/20 rounded-2xl shadow-xl max-w-xs w-full text-center"
            >
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xs uppercase tracking-wider font-black text-red-400 mb-1">Scout Error</h3>
              <p className="text-slate-300 text-xs font-semibold mb-6 leading-relaxed px-1">{error}</p>
              
              <button
                onClick={() => router.push("/")}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-white/15 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Change User
              </button>
            </motion.div>
          )}

          {data && !isLoading && !packOpened && (
            <motion.div
              key="pack"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center"
            >
              <div
                onClick={handleOpenPack}
                className="relative w-[280px] h-[400px] cursor-pointer flex flex-col justify-between p-8 bg-zinc-950 border border-white/10 hover:border-white/20 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-102 active:scale-98 text-center overflow-hidden"
              >
                <Trophy className="w-10 h-10 text-slate-500 mx-auto mt-8" />
                
                <div className="flex flex-col items-center">
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-black">GITBALL FUT 26</h3>
                  <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mt-1">
                    GOLD PLAYER DECK
                  </p>
                </div>

                <button className="w-full py-3 bg-white hover:bg-slate-200 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all">
                  Open Pack
                </button>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4 animate-pulse select-none">
                Click pack to reveal player
              </p>
            </motion.div>
          )}

          {data && !isLoading && packOpened && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full px-2"
            >
              {/* Left Side: Card Frame */}
              <div className="relative shrink-0">
                <GitballCard
                  details={data.cardDetails}
                  avatarUrl={data.scoutData.profile.avatarUrl}
                  username={data.scoutData.profile.username}
                  name={data.scoutData.profile.name}
                  theme={cardTheme}
                />
              </div>

              {/* Right Side: Scouting Console */}
              <div className="w-full max-w-sm flex flex-col justify-center text-left">
                
                {/* Console Header: Rarity and Theme Switcher */}
                <div className="flex justify-between items-center w-full mb-3 select-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold uppercase rounded-full tracking-wider text-slate-400">
                    <span>{data.cardDetails.rarity}</span>
                  </div>
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      Card Theme
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playSoundEffect("click");
                        setCardTheme(cardTheme === "light" ? "dark" : "light");
                      }}
                      className={`relative w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center border ${
                        cardTheme === "light"
                          ? "bg-white border-slate-300"
                          : "bg-white/10 border-white/10"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full transition-transform duration-200 ${
                          cardTheme === "light"
                            ? "bg-black translate-x-4"
                            : "bg-white translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-1 uppercase leading-none">
                  {data.scoutData.profile.name || data.scoutData.profile.username}
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6">
                  Scouted Role: <span className="text-slate-300">{data.cardDetails.positionDesc}</span>
                </p>

                {/* Satirical Scouting Note Board */}
                <div className="p-5 bg-white/[0.01] border border-white/10 rounded-2xl mb-6 relative text-left">
                  <h4 className="text-[9px] uppercase tracking-widest text-slate-500 font-extrabold mb-1.5">
                    Scouter Report
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed italic font-medium">
                    &ldquo;{data.cardDetails.funFact}&rdquo;
                  </p>
                </div>

                {/* Developer Scouting Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6 w-full text-left font-semibold text-slate-400">
                  <div className="p-3 bg-black border border-white/5 rounded-xl flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Total Repos</span>
                    <span className="text-white text-base font-black font-inter mt-0.5">{data.scoutData.profile.publicRepos}</span>
                  </div>
                  <div className="p-3 bg-black border border-white/5 rounded-xl flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Scouted Stars</span>
                    <span className="text-white text-base font-black font-inter mt-0.5">{data.scoutData.repoStats.totalStars}</span>
                  </div>
                  <div className="p-3 bg-black border border-white/5 rounded-xl flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Active Followers</span>
                    <span className="text-white text-base font-black font-inter mt-0.5">{data.scoutData.profile.followers}</span>
                  </div>
                  <div className="p-3 bg-black border border-white/5 rounded-xl flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Yearly Commits</span>
                    <span className="text-white text-base font-black font-inter mt-0.5">{data.scoutData.contributions.totalContributions}</span>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="px-4 py-3 bg-white hover:bg-slate-200 disabled:opacity-50 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow active:scale-98 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloading ? "Exporting" : "Save PNG"}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      disabled={sharing}
                      className="px-4 py-3 bg-zinc-950 hover:bg-zinc-900 border border-white/10 disabled:opacity-50 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 text-slate-200 active:scale-98 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      playSoundEffect("click");
                      router.push("/");
                    }}
                    className="w-full py-3 bg-transparent border border-white/5 hover:border-white/15 text-slate-500 hover:text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Scout Another</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[10px] text-slate-600 border-t border-white/5 z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 select-none">
          <span>GitBall 2026</span>
          <span>FIFA World Cup Fan App</span>
        </div>
      </footer>
    </main>
  );
}
