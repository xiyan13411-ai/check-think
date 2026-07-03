 "use client";
 
 import { useMemo, useRef } from "react";
 import { motion } from "framer-motion";
 import { formatCurrency } from "@/lib/progress";
 import { phoneShards, getUnlockedShardIndices } from "@/lib/fragmented-phone-map";
 
 type FragmentedPhoneSceneProps = {
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
 
 const PHONE_IMG = "/wish-assets/phone/phone-render.svg";
 
 export default function FragmentedPhoneScene({
   totalPieces,
   unlockedPieces,
   currentAmount,
   targetAmount,
   newlyUnlockedPieceIndexes = [],
   warmUpNextPiece = false,
   saveAnimation = null,
 }: FragmentedPhoneSceneProps) {
   const progress = Math.min(currentAmount / targetAmount, 1);
   const isComplete = unlockedPieces >= totalPieces;
   const unlockedIndices = useMemo(
     () => getUnlockedShardIndices(progress),
     [progress],
   );
 
   // Map logical unlocked piece indexes to visual shards
   // (the fly-in animation trigger)
   const justUnlockedShards = useMemo(() => {
     if (saveAnimation?.mode === "unlock") {
       // Find the shards that were unlocked by this save
       const prevProgress = Math.max(0, progress - (currentAmount > 0 ? currentAmount / targetAmount - progress : progress));
       const prevUnlocked = getUnlockedShardIndices(prevProgress);
       const currUnlocked = getUnlockedShardIndices(progress);
       return currUnlocked.filter((i) => !prevUnlocked.includes(i));
     }
     return [];
   }, [saveAnimation, progress, currentAmount, targetAmount]);
 
   // Next piece calculation
   const pieceValue = targetAmount / totalPieces;
   const currentPieceRemainder = currentAmount % pieceValue;
   const nextPieceProgress = Math.min(currentPieceRemainder / pieceValue, 1);
   const amountToNextPiece = Math.ceil(pieceValue - currentPieceRemainder);
 
   return (
     <div className="flex flex-col items-center gap-4">
       <div
         className={`relative w-full overflow-hidden rounded-3xl ${
           isComplete
             ? "bg-gradient-to-b from-pink-100/80 via-rose-50/60 to-amber-50/80"
             : "bg-white/70"
         } shadow-sm backdrop-blur-sm transition-colors duration-700`}
       >
         {/* Complete bg glow */}
         {isComplete && (
           <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-200/40 via-rose-100/20 to-amber-100/30" />
         )}
 
         {/* Warmup light */}
         {warmUpNextPiece && !isComplete && (
           <motion.div
             className="pointer-events-none absolute left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
             initial={{ opacity: 0, y: 60 }}
             animate={{ opacity: [0, 1, 0], y: [60, -40, -120], scale: [0.4, 1.2, 0.3] }}
             transition={{ duration: 1.0, ease: "easeOut" }}
           />
         )}
 
         {/* Main content */}
         <div className="relative px-4 py-8">
           <div className="relative mx-auto w-44">
             {isComplete && (
               <div className="pointer-events-none absolute -inset-4 z-0 rounded-[2.5rem] phone-soft-glow" />
             )}
 
             {/* Phone ghost silhouette + shard layers */}
             <div className="relative aspect-[200/420] w-full">
               {/* Ghost outline (always visible, very faint) */}
               <svg
                 viewBox="0 0 200 420"
                 className="pointer-events-none absolute inset-0 opacity-10"
               >
                 <rect x="15" y="15" width="170" height="390" rx="35" fill="none" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="3 3" />
               </svg>
 
               {/* Shard layers — each clips the phone image */}
               <div className="absolute inset-0">
                 {phoneShards.map((shard, i) => {
                   const unlocked = unlockedIndices.includes(i);
                   const justUnlocked = justUnlockedShards.includes(i);
 
                   return (
                     <motion.div
                       key={i}
                       className="absolute inset-0"
                       style={{
                         clipPath: shard.clipPath,
                         backgroundImage: `url(${PHONE_IMG})`,
                         backgroundSize: "100% 100%",
                         zIndex: shard.zIndex,
                       }}
                       initial={
                         unlocked
                           ? { x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.5 }
                           : { x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.5 }
                       }
                       animate={
                         unlocked
                           ? {
                               x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
                             }
                           : {
                               x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.5,
                             }
                       }
                       transition={
                         justUnlocked
                           ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.05 }
                           : { duration: 0.5, ease: "easeOut" }
                       }
                     />
                   );
                 })}
               </div>
 
               {/* Warm glow on recently unlocked shards */}
               {justUnlockedShards.length > 0 && (
                 <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.75rem] bg-gradient-to-b from-pink-200/10 via-transparent to-transparent animate-pulse" />
               )}
             </div>
 
             {/* 100% complete overlay — fade in when all shards in place */}
             {isComplete && (
               <motion.div
                 className="absolute inset-0 z-40 flex items-center justify-center"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
               >
                 <div className="-mt-10 text-center">
                   <p className="text-sm font-semibold text-pink-500">愿望拼回来了</p>
                 </div>
               </motion.div>
             )}
 
             {/* 100% badge */}
             {isComplete && (
               <div className="absolute -right-1 -top-1 z-50 flex h-8 min-w-[3.5rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-2.5 text-[10px] font-bold text-white shadow-md">
                 已完成
               </div>
             )}
           </div>
         </div>
 
         {/* Bottom info */}
         <div className="relative z-10 px-4 pb-5">
           {!isComplete && (
             <div className="mx-auto w-full max-w-[200px] space-y-1.5 text-center">
               <div className="flex items-center justify-between">
                 <span className="text-xs text-stone-400">下一块碎片</span>
                 <span className="text-xs font-medium text-pink-400">{Math.floor(nextPieceProgress * 100)}%</span>
               </div>
               <progress className="next-piece-progress w-full" max="1" value={nextPieceProgress} />
               <p className="text-xs text-stone-400">再存 {formatCurrency(amountToNextPiece)} 就能拼回下一块</p>
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
