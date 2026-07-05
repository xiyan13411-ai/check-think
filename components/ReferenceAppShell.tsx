 "use client";
 
 import type { ReactNode } from "react";
 
 type ReferenceAppShellProps = {
   children: ReactNode;
 };
 
 function getCurrentTimeString(): string {
   const d = new Date();
   const h = d.getHours().toString().padStart(2, "0");
   const m = d.getMinutes().toString().padStart(2, "0");
   return `${h}:${m}`;
 }
 
 export default function ReferenceAppShell({ children }: ReferenceAppShellProps) {
   return (
     <div className="safe-area-bottom relative mx-auto flex min-h-screen max-w-md flex-col bg-[#f5f2eb]">
       {/* ── iOS‑style status bar ── */}
       <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] font-semibold text-stone-500">
         <span>{getCurrentTimeString()}</span>
         <div className="flex items-center gap-1">
           <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
             <rect x="0.5" y="0.5" width="13" height="9" rx="1.5" stroke="#78716c" strokeWidth="0.6" />
             <rect x="2" y="2.5" width="8" height="5" rx="0.8" fill="#78716c" />
             <rect x="11.5" y="3.5" width="1.2" height="3" rx="0.4" fill="#a8a29e" />
           </svg>
           <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
             <rect x="0.5" y="0.5" width="15" height="9" rx="1.5" stroke="#78716c" strokeWidth="0.6" />
             <rect x="2" y="2" width="8.5" height="6" rx="0.8" fill="#78716c" />
           </svg>
         </div>
       </div>
 
       {/* ── Top header ── */}
       <div className="flex items-center justify-between px-5 pb-3">
         <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-stone-400 shadow-sm">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
           </svg>
         </button>
         <h1 className="text-base font-bold text-stone-700">心愿罐</h1>
         <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-stone-400 shadow-sm">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
           </svg>
         </button>
       </div>
 
       {/* ── Scrollable body ── */}
       <div className="flex-1 overflow-y-auto px-4 pb-24">
         {children}
       </div>
 
       {/* ── Bottom Tab Bar ── */}
       <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md">
         <div className="flex items-center justify-around rounded-t-2xl bg-white/90 px-2 pb-2 pt-2 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur-lg">
           {[
             { label: "心愿", icon: "★", active: true },
             { label: "计划", icon: "○", active: false },
             { label: "明细", icon: "≡", active: false },
             { label: "我的", icon: "⊙", active: false },
           ].map((tab) => (
             <button
               key={tab.label}
               className={`flex flex-col items-center gap-0.5 px-4 py-1 text-[10px] font-medium ${
                 tab.active ? "text-pink-500" : "text-stone-300"
               }`}
             >
               <span className="text-lg leading-none">{tab.icon}</span>
               <span>{tab.label}</span>
             </button>
           ))}
         </div>
       </div>
     </div>
   );
 }
