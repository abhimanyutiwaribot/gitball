"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CardDetails } from "../lib/cardUtils";

interface GitballCardProps {
  details: CardDetails;
  avatarUrl: string;
  username: string;
  name: string;
  theme?: "light" | "dark";
}

// Sparkles / Glitters BG based on overall rating and theme
const SparklesBg = ({ rarity, theme = "dark" }: { rarity: string; theme?: "light" | "dark" }) => {
  const count = rarity === "Icon" ? 18 : rarity === "Rare Gold" ? 14 : rarity === "Rare Silver" ? 8 : 4;
  
  // High quality matching colors for sparkles, adapting based on card theme
  const colors = rarity === "Icon"
    ? (theme === "light" ? ["text-purple-600", "text-amber-500", "text-pink-500"] : ["text-purple-300", "text-amber-200", "text-pink-300"])
    : rarity === "Rare Gold"
    ? (theme === "light" ? ["text-yellow-600", "text-amber-500", "text-yellow-700"] : ["text-yellow-300", "text-amber-300", "text-yellow-100"])
    : rarity === "Rare Silver"
    ? (theme === "light" ? ["text-slate-400", "text-slate-500", "text-slate-600"] : ["text-slate-200", "text-slate-300", "text-white"])
    : (theme === "light" ? ["text-amber-800", "text-orange-700", "text-amber-900"] : ["text-amber-700", "text-amber-600", "text-orange-500"]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-[40px]">
      {[...Array(count)].map((_, i) => {
        const size = i % 3 === 0 ? "w-4 h-4" : i % 2 === 0 ? "w-3 h-3" : "w-2 h-2";
        const left = `${(i * 17 + 8) % 90}%`;
        const top = `${(i * 23 + 12) % 90}%`;
        const delay = `${i * 0.4}s`;
        const duration = `${2 + (i % 3) * 0.8}s`;
        const color = colors[i % colors.length];

        return (
          <div
            key={i}
            className={`absolute opacity-0 animate-sparkle ${color} ${size}`}
            style={{
              left,
              top,
              animationDelay: delay,
              animationDuration: duration,
            }}
          >
            {/* Vector four-pointed sparkle */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_4px_currentColor]">
              <path d="M12 0 Q12 12 0 12 Q12 12 12 24 Q12 12 24 12 Q12 12 12 0 Z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

// GitBall Logo component: cross-fades Light/Dark assets smoothly using opacity transitions
const GitBallLogo = ({ theme = "dark" }: { theme?: "light" | "dark" }) => (
  <div className="relative w-12 h-14 shrink-0 select-none pointer-events-none">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/dark-gitball-logo.svg"
      alt="GitBall Light Theme Logo"
      className={`absolute inset-0 w-full h-full object-contain drop-shadow transition-opacity duration-500 ${
        theme === "light" ? "opacity-100" : "opacity-0"
      }`}
      crossOrigin="anonymous"
    />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/gitball-logo.svg"
      alt="GitBall Dark Theme Logo"
      className={`absolute inset-0 w-full h-full object-contain drop-shadow transition-opacity duration-500 ${
        theme === "dark" ? "opacity-100" : "opacity-0"
      }`}
      crossOrigin="anonymous"
    />
  </div>
);


export default function GitballCard({ details, avatarUrl, username, name, theme = "dark" }: GitballCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Card Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 12; // Max 12 deg
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 12;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Card neon outer glow colors based on rarity
  const getGlowColor = () => {
    switch (details.rarity) {
      case "Icon":
        return theme === "light" ? "rgba(167,139,250,0.4)" : "rgba(167,139,250,0.25)";
      case "Rare Gold":
        return theme === "light" ? "rgba(234,179,8,0.35)" : "rgba(234,179,8,0.2)";
      case "Rare Silver":
        return theme === "light" ? "rgba(148,163,184,0.3)" : "rgba(203,213,225,0.15)";
      case "Rare Bronze":
      default:
        return theme === "light" ? "rgba(194,65,12,0.25)" : "rgba(180,83,9,0.1)";
    }
  };

  // Card gradient backgrounds based on rarity and card theme (Light/Dark)
  const getCardBgStyle = () => {
    if (theme === "light") {
      switch (details.rarity) {
        case "Icon":
          return "linear-gradient(to bottom, #e9d5ff 0%, #fbf8ff 60%, #ffffff 100%)";
        case "Rare Gold":
          return "linear-gradient(to bottom, #fef08a 0%, #fffef7 60%, #ffffff 100%)";
        case "Rare Silver":
          return "linear-gradient(to bottom, #e2e8f0 0%, #fafbfc 60%, #ffffff 100%)";
        case "Rare Bronze":
        default:
          return "linear-gradient(to bottom, #ffedd5 0%, #fffdfa 60%, #ffffff 100%)";
      }
    }
    // Dark Theme (default)
    switch (details.rarity) {
      case "Icon":
        return "linear-gradient(to bottom, #161031 0%, #090614 60%, #010103 100%)";
      case "Rare Gold":
        return "linear-gradient(to bottom, #1d1603 0%, #090701 60%, #010100 100%)";
      case "Rare Silver":
        return "linear-gradient(to bottom, #1a1e24 0%, #0a0c0f 60%, #020304 100%)";
      case "Rare Bronze":
      default:
        return "linear-gradient(to bottom, #170e06 0%, #070401 60%, #010100 100%)";
    }
  };

  // Contrast configurations based on Card Theme
  const textPrimaryClass = theme === "light" ? "text-slate-950 font-black" : "text-white font-bold";
  const labelClass = theme === "light" ? "text-slate-950" : "text-white";
  const numColorClass = theme === "light" ? "text-slate-950" : "text-[#FBD106]";
  const borderClass = theme === "light" ? "border-slate-400/20" : "border-white/10";
  const borderOuterClass = theme === "light" ? "border-slate-300" : "border-white/5";

  return (
    <div className="perspective-1000 flex items-center justify-center p-0 sm:p-4 overflow-visible w-full">
      <div className="scale-75 min-[375px]:scale-90 sm:scale-100 origin-center transition-transform duration-300 w-[340px] h-[480px] flex items-center justify-center">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          initial={{ rotateY: 180, scale: 0.8, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 85, delay: 0.1 }}
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
            transition: isHovered 
              ? "box-shadow 0.5s ease" 
              : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease",
            boxShadow: isHovered 
              ? `0 25px 50px -12px ${getGlowColor()}, 0 0 30px -5px ${getGlowColor()}` 
              : `0 15px 30px -15px rgba(0,0,0,0.9)`,
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            transformOrigin: "center center",
          }}
          className={`relative w-[340px] h-[480px] cursor-pointer select-none rounded-[40px] ${theme === "light" ? "bg-slate-200" : "bg-black"} p-[1.5px] overflow-hidden transition-all duration-500`}
        >
          {/* Main Card Frame */}
          <div
            id="gitball-card-capture"
            style={{ 
              background: getCardBgStyle(),
              transition: "background 0.5s ease, border-color 0.5s ease, color 0.5s ease"
            }}
            className={`relative w-full h-full flex flex-col justify-between pt-6 pb-8 px-6 rounded-[40px] overflow-hidden border ${borderOuterClass} transition-all duration-500`}
          >
            {/* Shimmer Sparkles background overlay */}
            <SparklesBg rarity={details.rarity} theme={theme} />

            {/* Subtly colored gradient border overlay inside */}
            <div className={`absolute inset-0 border ${borderClass} rounded-[40px] pointer-events-none z-10 transition-all duration-500`} />

            {/* 1. Top Section: Left column metrics & Right photo */}
            <div className="w-full flex justify-between items-start z-10">
              
              {/* Left Column: Logo, OVR, Flag, POS */}
              <div className="flex flex-col items-center gap-4 pl-1 text-center w-[75px] shrink-0 pt-2">
                {/* Logo badge */}
                <GitBallLogo theme={theme} />

                {/* Big bold yellow OVR */}
                <span className={`text-5xl font-black font-inter ${numColorClass} tracking-tight drop-shadow leading-none transition-colors duration-500`}>
                  {details.ovr}
                </span>

                {/* Flag Image (avoids broken Windows text shortcodes) */}
                <div className={`w-10 h-6.5 overflow-hidden rounded-sm border ${borderClass} flex items-center justify-center ${theme === "light" ? "bg-slate-100" : "bg-zinc-900"} shrink-0 select-none drop-shadow-sm transition-all duration-500`}>
                  {(details.flagCode || "un").toLowerCase() === "un" ? (
                    <span className="text-[13px] select-none leading-none">💀</span>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`https://flagcdn.com/w80/${details.flagCode.toLowerCase()}.png`}
                      alt={details.nationName}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  )}
                </div>

                {/* Position label */}
                <span className={`text-lg font-black font-inter ${labelClass} uppercase tracking-wider leading-none select-none drop-shadow-sm transition-colors duration-500`}>
                  {details.position}
                </span>
              </div>

              {/* Right Column: Clean rectangular photo container */}
              <div className={`w-[210px] h-[235px] overflow-hidden rounded-tr-[40px] border ${borderClass} ${theme === "light" ? "bg-slate-100" : "bg-zinc-950"} flex items-center justify-center relative -mr-6 -mt-6 transition-all duration-500`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* 2. Middle Section: Player Name */}
            <div className="w-full flex flex-col items-center z-10 mt-3">
              <h2 className={`text-2xl font-bold tracking-wide text-center truncate max-w-full font-inter select-none drop-shadow ${textPrimaryClass} transition-colors duration-500`}>
                {name || username}
              </h2>
            </div>

            {/* 3. Bottom Section: Double Column Stats */}
            <div className="w-full flex flex-col items-center z-10 mt-2 px-1">
              <div className={`grid grid-cols-2 gap-x-12 gap-y-1.5 w-full max-w-[220px] border-t ${borderClass} pt-3 select-none transition-all duration-500`}>
                <div className="flex justify-between items-center">
                  <span className={`${theme === "light" ? "text-slate-600" : "text-slate-500"} font-black text-base font-handjet transition-colors duration-500`}>PAC</span>
                  <span className={`font-black font-inter text-2xl ${numColorClass} transition-colors duration-500`}>{details.stats.pac}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme === "light" ? "text-slate-600" : "text-slate-500"} font-black text-base font-handjet transition-colors duration-500`}>DRI</span>
                  <span className={`font-black font-inter text-2xl ${numColorClass} transition-colors duration-500`}>{details.stats.dri}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme === "light" ? "text-slate-600" : "text-slate-500"} font-black text-base font-handjet transition-colors duration-500`}>SHO</span>
                  <span className={`font-black font-inter text-2xl ${numColorClass} transition-colors duration-500`}>{details.stats.sho}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme === "light" ? "text-slate-600" : "text-slate-500"} font-black text-base font-handjet transition-colors duration-500`}>DEF</span>
                  <span className={`font-black font-inter text-2xl ${numColorClass} transition-colors duration-500`}>{details.stats.def}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme === "light" ? "text-slate-600" : "text-slate-500"} font-black text-base font-handjet transition-colors duration-500`}>PAS</span>
                  <span className={`font-black font-inter text-2xl ${numColorClass} transition-colors duration-500`}>{details.stats.pas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme === "light" ? "text-slate-600" : "text-slate-500"} font-black text-base font-handjet transition-colors duration-500`}>PHY</span>
                  <span className={`font-black font-inter text-2xl ${numColorClass} transition-colors duration-500`}>{details.stats.phy}</span>
                </div>
              </div>
            </div>

            {/* 4. Left rotated vertical watermark © GITBALL */}
            <div className={`absolute bottom-10 left-2.5 origin-bottom-left -rotate-90 text-[8px] font-black font-inter ${theme === "light" ? "text-slate-400" : "text-slate-800"} tracking-[0.25em] select-none pointer-events-none uppercase transition-colors duration-500`}>
              {/* © GITBALL */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
