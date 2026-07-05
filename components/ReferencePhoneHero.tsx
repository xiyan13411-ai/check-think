 "use client";
 
 import { useMemo } from "react";
 import { motion } from "framer-motion";
 import { phoneShards, getUnlockedShardIndices } from "@/lib/fragmented-phone-map";
 import { phoneRenderAsset } from "@/lib/wish-assets";
 
 type ReferencePhoneHeroProps = {
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
 
 export default function ReferencePhoneHero({
   totalPieces,
   unlockedPieces,
   currentAmount,
   targetAmount,
   newlyUnlockedPieceIndexes = [],
   warmUpNextPiece = false,
   saveAnimation = null,
 }: ReferencePhoneHeroProps) {
   const progress = Math.min(currentAmount / targetAmount, 1);
   const isComplete = unlockedPieces >= totalPieces;
   const unlockedIndices = useMemo(() => getUnlockedShardIndices(progress), [progress]);
   const justUnlockedShards = useMemo(() => {
     if (!saveAnimation || saveAnimation.mode !== "unlock") return [];
     const prev = getUnlockedShardIndices(Math.max(0, progress - 0.01));
     const curr = getUnlockedShardIndices(progress);
     return curr.filter((i) => !prev.includes(i));
   }, [saveAnimation, progress]);
   const assetSrc = phoneRenderAsset.png;
   const EDGE_HIGHLIGHT = "linear-gradient(135deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.08) 35%, transparent 55%)";
 
   return (
     <div className="relative mb-4 overflow-hidden rounded-3xl bg-gradient-to-b from-[#f5f2eb] via-[#f0ede4] to-[#eae6db]">
       {/* Warmup light trail */}
       {warmUpNextPiece && !isComplete && (
         <motion.div
           className="pointer-events-none absolute left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
           initial={{ opacity: 0, y: 60 }}
           animate={{ opacity: [0, 1, 0], y: [60, -20, -80], scale: [0.4, 1.2, 0.3] }}
           transition={{ duration: 1.0, ease: "easeOut" }}
         />
       )}
 
       {/* Light arc decoration */}
       <svg className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-20" width="280" height="180" viewBox="0 0 280 180" fill="none">
         <path d="M40,160 Q80,60 140,50 Q200,40 240,120" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.4" />
         <path d="M30,170 Q90,40 160,40 Q230,40 260,130" stroke="#bfdbfe" strokeWidth="0.8" fill="none" opacity="0.3" />
       </svg>
 
       {/* Phone + shards */}
       <div className="relative flex items-center justify-center px-4 py-6">
         <div className="relative w-60">
           {/* Shadow under phone */}
           <div className="pointer-events-none absolute -bottom-2 left-1/2 h-6 w-44 -translate-x-1/2 rounded-full bg-black/5 blur-md" />
 
           {/* Ghost silhouette */}
           <svg viewBox="0 0 200 420" className="pointer-events-none absolute inset-0 opacity-[0.06]">
             <rect x="15" y="15" width="170" height="390" rx="35" fill="#f8fafc" />
             <rect x="15" y="15" width="170" height="390" rx="35" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2.5 2.5" />
             <rect x="30" y="38" width="65" height="85" rx="14" fill="none" stroke="#475569" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
           </svg>
 
           {/* Shard layers */}
           <div className="relative aspect-[200/420] w-full">
             <div className="absolute inset-0">
               {phoneShards.map((shard, i) => {
                 const unlocked = unlockedIndices.includes(i);
                 const justUnlocked = justUnlockedShards.includes(i);
                 return (
                   <div key={i} className="contents">
                     <motion.div
                       className="absolute inset-0"
                       style={{
                         clipPath: shard.clipPath,
                         backgroundImage: `url(${assetSrc})`,
                         backgroundSize: "100% 100%",
                         zIndex: shard.zIndex,
                         filter: "drop-shadow(0 4px 10px rgba(15,23,42,0.18))",
                       }}
                       initial={{ x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.5 }}
                       animate={
                         unlocked
                           ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                           : { x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.5 }
                       }
                       transition={
                         justUnlocked
                           ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.05 }
                           : { duration: 0.5, ease: "easeOut" }
                       }
                     />
                     <motion.div
                       className="pointer-events-none absolute inset-0"
                       style={{
                         clipPath: shard.clipPath,
                         background: EDGE_HIGHLIGHT,
                         mixBlendMode: "overlay",
                         zIndex: shard.zIndex + 1,
                       }}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: unlocked ? 0.4 : 0 }}
                       transition={{ duration: 0.6, delay: 0.3 }}
                     />
                   </div>
                 );
               })}
             </div>
           </div>
 
           {/* 100% badge */}
           {isComplete && (
             <div className="absolute -right-1 -top-1 z-50 flex h-8 min-w-[3.5rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-2.5 text-[10px] font-bold text-white shadow-md">
               已完成
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }
