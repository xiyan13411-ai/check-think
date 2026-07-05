 "use client";
 
 type WishHeaderRowProps = {
   title: string;
   streakDays: number;
 };
 
 export default function WishHeaderRow({ title, streakDays }: WishHeaderRowProps) {
   return (
     <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm">
       {/* Phone thumbnail */}
       <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-stone-100 to-stone-200 shadow-inner">
         <svg width="20" height="26" viewBox="0 0 20 26" fill="none">
           <rect x="1" y="1" width="18" height="24" rx="3" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="0.6" />
           <rect x="4" y="3" width="12" height="2" rx="0.5" fill="#d6d3d1" />
           <circle cx="8" cy="3.5" r="0.8" fill="#a8a29e" />
           <circle cx="11" cy="3.5" r="0.6" fill="#a8a29e" />
         </svg>
       </div>
 
       {/* Title */}
       <div className="flex-1">
         <div className="flex items-center gap-1">
           <span className="text-sm font-semibold text-stone-700">{title}</span>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="9 18 15 12 9 6" />
           </svg>
         </div>
       </div>
 
       {/* Streak badge */}
       <div className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
         <span className="text-xs leading-none">🔥</span>
         <span className="text-[11px] font-semibold text-emerald-600">连续 {streakDays} 天</span>
       </div>
     </div>
   );
 }
