 "use client";
 
 import { useMemo } from "react";
 import { motion } from "framer-motion";
 
 type FlyingShardsProps = {
   triggerKey: number;
   mode: "warmup" | "unlock" | "complete";
   count?: number;
 };
 
 type ShardConfig = {
   x: number;
   y: number;
   rotate: number;
   delay: number;
   size: number;
 };
 
 // Stable shard config arrays — no randomness for SSR/hydration safety.
 // For warmup/unlock, (x, y) is the *starting* offset from phone center;
 // shard flies toward center (0, 0).
 // For complete, (x, y) is the *ending* offset from center;
 // shard bursts outward from center.
 
 const WARMUP_SHARDS: ShardConfig[] = [
   { x: -20, y: 80, rotate: -10, delay: 0, size: 8 },
   { x: 22, y: 90, rotate: 8, delay: 0.12, size: 7 },
 ];
 
 const UNLOCK_SHARDS: ShardConfig[] = [
   { x: -65, y: 50, rotate: -18, delay: 0, size: 12 },
   { x: 60, y: 45, rotate: 15, delay: 0.07, size: 10 },
   { x: -45, y: 85, rotate: 10, delay: 0.14, size: 9 },
   { x: 55, y: 80, rotate: -12, delay: 0.21, size: 11 },
   { x: -25, y: 105, rotate: 20, delay: 0.28, size: 9 },
   { x: 35, y: 95, rotate: -8, delay: 0.35, size: 10 },
   { x: -75, y: 20, rotate: 5, delay: 0.42, size: 8 },
   { x: 70, y: 30, rotate: -22, delay: 0.49, size: 9 },
 ];
 
 const COMPLETE_SHARDS: ShardConfig[] = [
   { x: -55, y: -45, rotate: -25, delay: 0, size: 14 },
   { x: 60, y: -40, rotate: 22, delay: 0.1, size: 12 },
   { x: -75, y: 5, rotate: 12, delay: 0.2, size: 10 },
   { x: 70, y: 10, rotate: -18, delay: 0.3, size: 13 },
   { x: -40, y: 65, rotate: 8, delay: 0.4, size: 11 },
   { x: 45, y: 60, rotate: -14, delay: 0.5, size: 10 },
   { x: -85, y: -15, rotate: 30, delay: 0.6, size: 9 },
   { x: 80, y: -20, rotate: -24, delay: 0.7, size: 11 },
   { x: -30, y: 85, rotate: 16, delay: 0.8, size: 8 },
   { x: 30, y: 90, rotate: -10, delay: 0.9, size: 9 },
   { x: -65, y: -60, rotate: 20, delay: 1.0, size: 7 },
   { x: 65, y: -55, rotate: -28, delay: 1.1, size: 8 },
 ];
 
 // ── Shard visual style per mode ──
 
 function shardStyle(mode: FlyingShardsProps["mode"]): {
   className: string;
   shape: "circle" | "rounded" | "star";
   duration: number;
 } {
   switch (mode) {
     case "warmup":
       return {
         className:
           "rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]",
         shape: "circle",
         duration: 0.9,
       };
     case "unlock":
       return {
         className:
           "rounded-md bg-gradient-to-br from-pink-300 to-orange-400 shadow-[0_0_5px_rgba(244,114,182,0.4)]",
         shape: "rounded",
         duration: 1.0,
       };
     case "complete":
       return {
         className:
           "rounded-full bg-gradient-to-br from-pink-200 via-amber-100 to-white shadow-[0_0_8px_rgba(244,114,182,0.5)]",
         shape: "star",
         duration: 1.4,
       };
   }
 }
 
 // ── Component ──
 
 export default function FlyingShards({
   triggerKey,
   mode,
   count,
 }: FlyingShardsProps) {
   const config = shardStyle(mode);
 
   // Pick the right pool and slice by requested count
   // recomputed on triggerKey change to force full mount
   const activeShards = useMemo(() => {
     let pool: ShardConfig[];
     let maxCount: number;
     switch (mode) {
       case "complete":
         pool = COMPLETE_SHARDS;
         maxCount = count ?? 10;
         break;
       case "unlock":
         pool = UNLOCK_SHARDS;
         maxCount = count ?? 6;
         break;
       case "warmup":
       default:
         pool = WARMUP_SHARDS;
         maxCount = count ?? 2;
         break;
     }
     return pool.slice(0, Math.min(maxCount, pool.length));
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [triggerKey, mode, count]);
 
   // ── Render ──
   return (
     <div
       className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
       key={triggerKey}
     >
       {activeShards.map((s, i) => {
         // For warmup/unlock: fly TOWARD center (from outer position)
         // For complete: fly OUTWARD from center
         const flyIn = mode === "warmup" || mode === "unlock";
 
         const startX = flyIn ? s.x : 0;
         const startY = flyIn ? s.y : 0;
         const endX = flyIn ? 0 : s.x;
         const endY = flyIn ? 0 : s.y;
 
         // For warmup/unlock we also add a subtle overshoot
         const midX = flyIn ? s.x * 0.3 : s.x * 0.5;
         const midY = flyIn ? s.y * 0.3 : s.y * 0.5;
 
         const emojiSymbols = ["✨", "🌟", "⭐", "💫"];
         const emoji = emojiSymbols[i % emojiSymbols.length];
 
         return (
           <motion.div
             key={i}
             className="absolute"
             style={{ left: "50%", top: "50%" }}
             initial={{
               opacity: 0,
               x: startX,
               y: startY,
               scale: 0.3,
               rotate: 0,
             }}
             animate={{
               opacity: [0, 1, 1, 0],
               x: [startX, midX, endX],
               y: [startY, midY, endY],
               scale: flyIn
                 ? [0.3, 1.3, 0.8]
                 : [0, 0.6, 1.4],
               rotate: [0, s.rotate * 0.5, s.rotate],
             }}
             transition={{
               duration: config.duration,
               delay: s.delay,
               ease: [0.34, 1.56, 0.64, 1], // springy overshoot
               times: [0, 0.4, 1],
             }}
           >
             {mode === "complete" ? (
               <span
                 className="block text-center leading-none"
                 style={{ fontSize: `${s.size}px` }}
               >
                 {emoji}
               </span>
             ) : (
               <div
                 className={config.className}
                 style={{
                   width: `${s.size}px`,
                   height: `${s.size}px`,
                   filter: "blur(0.5px)",
                 }}
              />
             )}
           </motion.div>
         );
       })}
     </div>
   );
 }
