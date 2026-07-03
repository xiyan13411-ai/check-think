 "use client";
 
 import { useMemo } from "react";
 
 type PhoneArtifactProps = {
   /** How many visual fragments are unlocked (0–16) */
   unlockedVisualPieces: number;
   /** Total visual fragment count (default 16) */
   totalVisualPieces?: number;
   /** Whether to show the warmup glow */
   warmUpNextPiece?: boolean;
 };
 
 // ── 14 irregular polygon shards covering the phone body ──
 // Phone body is roughly x:15–185, y:15–395 rounded rect in a 200×420 viewBox.
 // These polygons tile the body with jagged boundaries.
 
 const SHARDS = [
   // Top-left corner (camera area left half)
   "15,15 55,15 50,60 35,50 15,55",
   // Top-mid-left
   "55,15 95,15 90,65 70,60 50,60",
   // Top-mid-right
   "95,15 140,15 135,55 110,65 90,65",
   // Top-right corner
   "140,15 185,15 185,60 165,70 135,55",
   // Upper-left (below camera row)
   "15,55 35,50 50,60 70,60 75,115 55,120 35,110 15,115",
   // Upper-mid
   "50,60 70,60 90,65 110,65 115,110 95,120 75,115",
   // Upper-right
   "110,65 135,55 165,70 185,60 185,120 170,125 145,120 115,110",
   // Mid-left
   "15,115 35,110 55,120 75,115 95,120 90,185 70,195 50,185 30,190 15,185",
   // Mid-center
   "75,115 95,120 115,110 145,120 170,125 185,120 185,195 170,200 145,195 120,190 95,185 90,185",
   // Mid-right
   "145,120 170,125 185,120 185,195 170,200 145,195",
   // Lower-left
   "15,185 30,190 50,185 70,195 90,185 95,185 95,270 75,280 55,275 30,280 15,270",
   // Lower-mid
   "95,185 120,190 145,195 170,200 185,195 185,280 165,285 145,280 120,285 95,270",
   // Lower-right
   "145,195 170,200 185,195 185,280 165,285 145,280",
   // Bottom strip
   "15,270 30,280 55,275 75,280 95,270 95,285 120,285 145,280 165,285 185,280 185,405 170,410 145,405 120,410 95,405 75,410 55,405 30,410 15,405",
 ];
 
 // ── Component ──
 
 export default function PhoneArtifact({
   unlockedVisualPieces,
   totalVisualPieces = 16,
   warmUpNextPiece = false,
 }: PhoneArtifactProps) {
   // Build a list of indices — each shard is either locked (visible fog) or unlocked (transparent)
   const shards = useMemo(
     () => SHARDS.slice(0, Math.min(SHARDS.length, totalVisualPieces)),
     [totalVisualPieces],
   );
 
   return (
     <svg
       viewBox="0 0 200 420"
       className="w-full h-full"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }}
     >
       {/* ── Definitions ── */}
       <defs>
         {/* Phone back gradient */}
         <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stopColor="#fef3f2" />
           <stop offset="40%" stopColor="#fce7f3" />
           <stop offset="100%" stopColor="#ffedd5" />
         </linearGradient>
 
         {/* Camera lens gradient */}
         <radialGradient id="lensGrad" cx="50%" cy="50%" r="50%">
           <stop offset="0%" stopColor="#292524" />
           <stop offset="80%" stopColor="#1c1917" />
           <stop offset="100%" stopColor="#44403c" />
         </radialGradient>
 
         {/* Warm glow gradient */}
         {warmUpNextPiece && (
           <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.3" />
             <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
           </radialGradient>
         )}
 
         {/* Clip path to keep shards inside the phone body */}
         <clipPath id="phoneClip">
           <rect x="15" y="15" width="170" height="390" rx="35" />
         </clipPath>
       </defs>
 
       {/* ── Drop shadow behind phone ── */}
       <rect
         x="15" y="15" width="170" height="390" rx="35"
         fill="rgba(0,0,0,0.03)"
         stroke="rgba(0,0,0,0.04)"
         strokeWidth="2"
         transform="translate(0, 4)"
       />
 
       {/* ── Phone body ── */}
       <rect
         x="15" y="15" width="170" height="390" rx="35"
         fill="url(#bodyGrad)"
         stroke="#e7e5e4"
         strokeWidth="1.5"
       />
 
       {/* ── Camera module ── */}
       <g>
         {/* Camera bump background */}
         <rect
           x="30" y="40" width="65" height="80" rx="12"
           fill="#f5f5f4"
           stroke="#d6d3d1"
           strokeWidth="0.8"
         />
         {/* Lens 1 (large) */}
         <circle cx="45" cy="55" r="12" fill="url(#lensGrad)" />
         <circle cx="45" cy="55" r="10" fill="#292524" />
         <circle cx="42" cy="52" r="3" fill="rgba(255,255,255,0.08)" />
         {/* Lens 2 (small) */}
         <circle cx="75" cy="55" r="9" fill="url(#lensGrad)" />
         <circle cx="75" cy="55" r="7" fill="#292524" />
         <circle cx="73" cy="53" r="2" fill="rgba(255,255,255,0.08)" />
         {/* Lens 3 (tiny) */}
         <circle cx="60" cy="70" r="6" fill="url(#lensGrad)" />
         <circle cx="60" cy="70" r="4.5" fill="#292524" />
         {/* Flash */}
         <rect x="30" y="105" width="8" height="8" rx="2" fill="#e7e5e4" />
       </g>
 
       {/* ── Subtle edge reflection (top edge highlight) ── */}
       <path
         d="M20,18 Q100,15 180,18"
         stroke="rgba(255,255,255,0.35)"
         strokeWidth="1"
         fill="none"
       />
 
       {/* ── Fog shard overlay ── */}
       <g clipPath="url(#phoneClip)">
         {shards.map((points, i) => {
           const unlocked = i < unlockedVisualPieces;
           return (
             <polygon
               key={i}
               points={points}
               fill="white"
               fillOpacity={unlocked ? 0 : 0.55}
               stroke="rgba(255,255,255,0.15)"
               strokeWidth="0.5"
               style={{
                 transition: "fill-opacity 0.5s ease, opacity 0.5s ease",
                 opacity: unlocked ? 0 : 1,
               }}
             />
           );
         })}
 
         {/* Warm glow on next-piece warmup */}
         {warmUpNextPiece && (
           <rect
             x="0" y="0" width="200" height="420"
             fill="url(#warmGlow)"
             style={{ mixBlendMode: "overlay" }}
           />
         )}
       </g>
 
       {/* ── Metal frame edge (on top, for depth) ── */}
       <rect
         x="15" y="15" width="170" height="390" rx="35"
         fill="none"
         stroke="rgba(255,255,255,0.3)"
         strokeWidth="1"
       />
     </svg>
   );
 }
