 "use client";
 
 import { motion } from "framer-motion";
 import { formatCurrency } from "@/lib/progress";
 
 type ReferenceProgressCardProps = {
   currentAmount: number;
   targetAmount: number;
   progress: number;
   lastRecordAmount?: number;
   lastRecordTimeLabel?: string;
   onPrimarySave: () => void;
 };
 
 export default function ReferenceProgressCard({
   currentAmount,
   targetAmount,
   progress,
   lastRecordAmount,
   lastRecordTimeLabel,
   onPrimarySave,
 }: ReferenceProgressCardProps) {
   const remaining = Math.max(targetAmount - currentAmount, 0);
   const progressPct = Math.floor(progress * 100);
 
   return (
     <motion.div
       className="rounded-2xl bg-white px-5 pb-5 pt-4 shadow-sm"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.4, delay: 0.15 }}
     >
       {/* Amount + percentage */}
       <div className="flex items-end justify-between">
         <div>
           <span className="text-[11px] font-medium text-stone-400">已存</span>
           <p className="text-2xl font-bold text-stone-900 tabular-nums leading-tight">
             {formatCurrency(currentAmount)}
           </p>
         </div>
         <div className="flex items-baseline gap-1">
           <span className="text-3xl font-bold text-blue-500 tabular-nums">{progressPct}</span>
           <span className="text-[11px] font-medium text-stone-400">%</span>
         </div>
       </div>
 
       {/* Target */}
       <p className="mt-0.5 text-[11px] text-stone-400">
         目标 {formatCurrency(targetAmount)}
       </p>
 
       {/* Progress bar */}
       <div className="relative mt-4 h-4 w-full overflow-hidden rounded-full bg-stone-100">
         <motion.div
           className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
           initial={{ width: 0 }}
           animate={{ width: `${progress * 100}%` }}
           transition={{ duration: 0.6, ease: "easeOut" }}
         />
         {/* Star node on progress */}
         <div
           className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-md flex items-center justify-center"
           style={{
             left: `calc(${progress * 100}% - 10px)`,
             transition: "left 0.6s ease",
           }}
         >
           <svg width="10" height="10" viewBox="0 0 24 24" fill="#60a5fa">
             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
           </svg>
         </div>
       </div>
 
       {/* Remaining hint */}
       <p className="mt-2 text-xs text-stone-500">
         再存 {formatCurrency(remaining)} 就能完成心愿啦！
       </p>
 
       {/* Last record */}
       {lastRecordAmount !== undefined && (
         <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50/50 px-3 py-2">
           <span className="text-sm font-semibold text-blue-600 tabular-nums">
             刚刚存入 {formatCurrency(lastRecordAmount)}
           </span>
           <span className="text-[11px] text-stone-400">
             {lastRecordTimeLabel ?? ""}
           </span>
         </div>
       )}
 
       {/* Primary save button */}
       <motion.button
         onClick={onPrimarySave}
         className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 text-base font-bold text-white shadow-lg shadow-blue-200/50"
         whileTap={{ scale: 0.96 }}
       >
         存一笔
       </motion.button>
     </motion.div>
   );
 }
