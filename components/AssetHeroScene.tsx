 "use client";
 
 import { useMemo, useCallback } from "react";
 import { motion } from "framer-motion";
 import { formatCurrency } from "@/lib/progress";
import { phoneShards, getUnlockedShardIndices } from "@/lib/fragmented-phone-map";
 
 
 type AssetHeroSceneProps = {
   totalPieces: number;
   unlockedPieces: number;
   currentAmount: number;
   targetAmount: number;
   newlyUnlockedPieceIndexes?: number[];
   warmUpNextPiece?: boolean;
   saveAnimation?: {
     key: number;
     mode: "warmup" | "unlock" | "complete";
     count: number;
   } | null;
 };
 
 const VISUAL_FRAGMENTS = 14;
 const SVG_W = 200;
 const SVG_H = 420;
 
 // ── Convert SVG "x,y x,y ..." to CSS "xpx ypx, xpx ypx, ..." ──
 function toCssPolygon(points: string): string {
   return points
     .split(" ")
     .map((p) => p.trim())
     .filter(Boolean)
     .map((p) => `${p.replace(",", "px ")}px`)
     .join(", ");
 }
 
 export default function AssetHeroScene({
   totalPieces,
   unlockedPieces,
   currentAmount,
   targetAmount,
   newlyUnlockedPieceIndexes = [],
   warmUpNextPiece = false,
   saveAnimation = null,
 }: AssetHeroSceneProps) {
   const progress = Math.min(currentAmount / targetAmount, 1);
   const isComplete = unlockedPieces >= totalPieces;
 
    const fragments = phoneShards;
   const unlockedIndices = useMemo(
     () => getUnlockedShardIndices(progress),
      [progress],
   );
 
   // Next piece calculation
   const pieceValue = targetAmount / totalPieces;
   const currentPieceRemainder = currentAmount % pieceValue;
   const nextPieceProgress = Math.min(currentPieceRemainder / pieceValue, 1);
   const amountToNextPiece = Math.ceil(pieceValue - currentPieceRemainder);
 
   // ── Render ──
   return (
     <div className="flex flex-col items-center gap-4">
       <div
         className={`relative w-full overflow-hidden rounded-3xl ${
           isComplete
             ? "bg-gradient-to-b from-pink-100/80 via-rose-50/60 to-amber-50/80"
             : "bg-white/70"
         } shadow-sm backdrop-blur-sm transition-colors duration-700`}
       >
         {/* Complete background glow */}
         {isComplete && (
           <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-200/40 via-rose-100/20 to-amber-100/30" />
         )}
 
         {/* Warmup glow */}
         {warmUpNextPiece && !isComplete && (
           <motion.div
             className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
             initial={{ opacity: 0 }}
             animate={{ opacity: [0, 0.5, 0] }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             style={{
               background:
                 "linear-gradient(to top, rgba(244,114,182,0.12) 0%, transparent 100%)",
             }}
           />
         )}
 
         {/* Warmup light trail */}
         {warmUpNextPiece && !isComplete && (
           <motion.div
             className="pointer-events-none absolute left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
             initial={{ opacity: 0, y: 60 }}
             animate={{
               opacity: [0, 1, 0],
               y: [60, -40, -120],
               scale: [0.4, 1.2, 0.3],
             }}
             transition={{ duration: 1.0, ease: "easeOut" }}
           />
         )}
 
         {/* ── Main content ── */}
         <div className="relative px-4 py-8">
           {/* Phone + fragments container */}
           <div className="relative mx-auto w-44">
             {isComplete && (
               <div className="pointer-events-none absolute -inset-4 z-0 rounded-[2.5rem] phone-soft-glow" />
             )}
 
             {/* SVG phone scene */}
             <svg
               viewBox={`0 0 ${SVG_W} ${SVG_H}`}
               className="w-full"
               style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))", overflow: "visible" }}
             >
               <defs>
                 <linearGradient id="abg" x1="0" y1="0" x2="1" y2="1">
                   <stop offset="0%" stopColor="#fef3f2" />
                   <stop offset="40%" stopColor="#fce7f3" />
                   <stop offset="100%" stopColor="#ffedd5" />
                 </linearGradient>
                 <radialGradient id="alens" cx="50%" cy="50%" r="50%">
                   <stop offset="0%" stopColor="#292524" />
                   <stop offset="80%" stopColor="#1c1917" />
                   <stop offset="100%" stopColor="#44403c" />
                 </radialGradient>
               </defs>
 
               {/* Shadow */}
               <rect x="15" y="15" width="170" height="390" rx="35" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.04)" strokeWidth="2" transform="translate(0,4)" />
               {/* Body */}
               <rect x="15" y="15" width="170" height="390" rx="35" fill="url(#abg)" stroke="#e7e5e4" strokeWidth="1.5" />
               {/* Camera module */}
               <rect x="30" y="40" width="65" height="80" rx="12" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="0.8" />
               <circle cx="45" cy="55" r="12" fill="url(#alens)" />
               <circle cx="45" cy="55" r="10" fill="#292524" />
               <circle cx="42" cy="52" r="3" fill="rgba(255,255,255,0.08)" />
               <circle cx="75" cy="55" r="9" fill="url(#alens)" />
               <circle cx="75" cy="55" r="7" fill="#292524" />
               <circle cx="73" cy="53" r="2" fill="rgba(255,255,255,0.08)" />
               <circle cx="60" cy="70" r="6" fill="url(#alens)" />
               <circle cx="60" cy="70" r="4.5" fill="#292524" />
               <rect x="30" y="105" width="8" height="8" rx="2" fill="#e7e5e4" />
               {/* Edge highlight */}
               <path d="M20,18 Q100,15 180,18" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
 
               {/* ── Fragments ── */}
               {fragments.map((f, i) => {
                 const unlocked = unlockedIndices.includes(i);
                 // Locked floating position — spread in a ring around the phone
                 const angle = (i / fragments.length) * Math.PI * 2;
                 const floatR = 130;
                 const floatX = Math.cos(angle) * floatR;
                 const floatY = Math.sin(angle) * floatR;
 
                 return (
                   <motion.g
                     key={i}
                     initial={
                       unlocked
                         ? { opacity: 1, translateX: f.startX, translateY: f.startY, rotate: f.startRotate * 2 }
                         : { opacity: 0.5, translateX: floatX, translateY: floatY, rotate: f.startRotate }
                     }
                     animate={
                       unlocked
                         ? {
                             opacity: 1,
                             translateX: 0,
                             translateY: 0,
                             rotate: f.startRotate,
                           }
                         : {
                             opacity: 0.45,
                             translateX: floatX,
                             translateY: floatY,
                             rotate: f.startRotate,
                           }
                     }
                     transition={
                       unlocked
                         ? { duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: i * 0.03 }
                         : { duration: 0.5, ease: "easeOut" }
                     }
                   >
                     <polygon
                       points={cssToSvgPoints(f.clipPath)}
                       fill={unlocked ? "url(#abg)" : "rgba(255,255,255,0.5)"}
                       stroke={unlocked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)"}
                       strokeWidth="0.5"
                       style={{ transition: "fill 0.3s ease" }}
                     />
                   </motion.g>
                 );
               })}
 
               {/* Warm glow overlay */}
               {warmUpNextPiece && !isComplete && (
                 <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="rgba(244,114,182,0.08)" style={{ mixBlendMode: "overlay" }} />
               )}
             </svg>
 
             {/* 100% badge */}
             {isComplete && (
               <div className="absolute -right-1 -top-1 z-10 flex h-8 min-w-[3.5rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-2.5 text-[10px] font-bold text-white shadow-md">
                 已完成
               </div>
             )}
           </div>
         </div>
 
         {/* ── Bottom info ── */}
         <div className="relative z-10 px-4 pb-5">
           {!isComplete && (
             <div className="mx-auto w-full max-w-[200px] space-y-1.5 text-center">
               <div className="flex items-center justify-between">
                 <span className="text-xs text-stone-400">下一块碎片</span>
                 <span className="text-xs font-medium text-pink-400">
                   {Math.floor(nextPieceProgress * 100)}%
                 </span>
               </div>
               <progress className="next-piece-progress w-full" max="1" value={nextPieceProgress} />
               <p className="text-xs text-stone-400">
                 再存 {formatCurrency(amountToNextPiece)} 就能拼回下一块
               </p>
             </div>
           )}
 
           {isComplete && (
             <div className="text-center">
               <p className="text-sm font-semibold text-pink-500">愿望拼回来了</p>
               <p className="mt-0.5 text-xs text-stone-400">你的新手机基金已经攒够啦</p>
               <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-50 to-orange-50 px-3.5 py-1 text-[11px] text-stone-500 shadow-sm">
                 <span className="text-pink-400">★</span>
                 共积攒 ¥{targetAmount.toLocaleString("zh-CN")}
                 <span className="text-orange-400">★</span>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }


