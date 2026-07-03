 "use client";
 
 import { useMemo } from "react";
 import { motion } from "framer-motion";
 import { formatCurrency } from "@/lib/progress";
 import PhoneArtifact from "./PhoneArtifact";
 import FloatingFragments from "./FloatingFragments";
 import FlyingShards from "./FlyingShards";
 
 type WishHeroSceneProps = {
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
 
 const VISUAL_PIECES = 16;
 
 export default function WishHeroScene({
   totalPieces,
   unlockedPieces,
   currentAmount,
   targetAmount,
   newlyUnlockedPieceIndexes = [],
   warmUpNextPiece = false,
   saveAnimation = null,
 }: WishHeroSceneProps) {
   const progress = Math.min(currentAmount / targetAmount, 1);
   const unlockedVisualPieces = Math.min(
     Math.floor(progress * VISUAL_PIECES),
     VISUAL_PIECES,
   );
   const isComplete = unlockedPieces >= totalPieces;
 
   // Next piece calculation (same logic as WishPhoneReveal)
   const pieceValue = targetAmount / totalPieces;
   const currentPieceRemainder = currentAmount % pieceValue;
   const nextPieceProgress = Math.min(currentPieceRemainder / pieceValue, 1);
   const amountToNextPiece = Math.ceil(pieceValue - currentPieceRemainder);
 
   return (
     <div className="flex flex-col items-center gap-4">
       {/* ── Hero scene stage ── */}
       <div
         className={`relative w-full overflow-hidden rounded-3xl ${
           isComplete
             ? "bg-gradient-to-b from-pink-100/80 via-rose-50/60 to-amber-50/80"
             : "bg-white/70"
         } shadow-sm backdrop-blur-sm transition-colors duration-700`}
       >
         {/* ── Background glow (complete state) ── */}
         {isComplete && (
           <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-200/40 via-rose-100/20 to-amber-100/30" />
         )}
 
         {/* ── Subtle warm glow at bottom (warmup) ── */}
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
 
         {/* ── Light trail for warmup (small coin fly-up) ── */}
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
 
         {/* ── Main hero content ── */}
         <div className="relative px-4 py-8">
           {/* Floating fragments — back layer (blurred, behind phone) */}
           <FloatingFragments
             layer="back"
             unlockedVisualPieces={unlockedVisualPieces}
             totalVisualPieces={VISUAL_PIECES}
           />
 
           {/* Phone artifact */}
           <div className="relative z-10 mx-auto w-44">
             {/* Phone glow effect */}
             {isComplete && (
               <div className="pointer-events-none absolute -inset-4 z-0 rounded-[2.5rem] phone-soft-glow" />
             )}
 
             <div className="relative">
               <PhoneArtifact
                 unlockedVisualPieces={unlockedVisualPieces}
                 totalVisualPieces={VISUAL_PIECES}
                 warmUpNextPiece={warmUpNextPiece && !isComplete}
               />
 
               {/* FlyingShards overlay (reused from V3) */}
               {saveAnimation && (
                 <div className="pointer-events-none absolute inset-0 z-30">
                   <FlyingShards
                     triggerKey={saveAnimation.key}
                     mode={saveAnimation.mode}
                     count={saveAnimation.count}
                   />
                 </div>
               )}
 
               {/* 100% completion badge */}
               {isComplete && (
                 <div className="absolute -right-1 -top-1 z-10 flex h-8 min-w-[3.5rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-2.5 text-[10px] font-bold text-white shadow-md">
                   已完成
                 </div>
               )}
             </div>
           </div>
 
           {/* Floating fragments — front layer (clear, in front of phone) */}
           <FloatingFragments
             layer="front"
             unlockedVisualPieces={unlockedVisualPieces}
             totalVisualPieces={VISUAL_PIECES}
           />
         </div>
 
         {/* ── Bottom progress info ── */}
         <div className="relative z-10 px-4 pb-5">
           {!isComplete && (
             <div className="mx-auto w-full max-w-[200px] space-y-1.5 text-center">
               <div className="flex items-center justify-between">
                 <span className="text-xs text-stone-400">
                   下一块碎片
                 </span>
                 <span className="text-xs font-medium text-pink-400">
                   {Math.floor(nextPieceProgress * 100)}%
                 </span>
               </div>
               <progress
                 className="next-piece-progress w-full"
                 max="1"
                 value={nextPieceProgress}
               />
               <p className="text-xs text-stone-400">
                 再存 {formatCurrency(amountToNextPiece)} 就能拼回下一块
               </p>
             </div>
           )}
 
           {/* Celebratory message shown only when 100% */}
           {isComplete && (
             <div className="text-center">
               <p className="text-sm font-semibold text-pink-500">
                 愿望拼回来了
               </p>
               <p className="mt-0.5 text-xs text-stone-400">
                 你的新手机基金已经攒够啦
               </p>
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
