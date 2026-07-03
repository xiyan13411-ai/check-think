 "use client";
 
 import { useState, useCallback } from "react";
 import AssetHeroScene from "@/components/AssetHeroScene";
 import { phoneWishAssets } from "@/lib/wish-assets";
 import { formatCurrency } from "@/lib/progress";
 
 export default function LabAssetsPage() {
   const [progress, setProgress] = useState(0.5);
   const [animKey, setAnimKey] = useState(0);
   const [animMode, setAnimMode] = useState<"warmup" | "unlock" | "complete" | null>(null);
 
   const totalPieces = 40;
   const targetAmount = 10000;
   const currentAmount = Math.round(progress * targetAmount);
   const unlockedPieces = Math.floor(progress * totalPieces);
   const visualUnlocked = phoneWishAssets.fragments.filter(
     (f) => progress >= f.unlockAt,
   ).length;
 
   const triggerAnim = useCallback(
     (mode: "warmup" | "unlock" | "complete") => {
       setAnimKey((k) => k + 1);
       setAnimMode(mode);
       setTimeout(() => setAnimMode(null), 2000);
     },
     [],
   );
 
   return (
     <main className="min-h-screen bg-stone-50 px-4 py-6 text-stone-900">
       <div className="mx-auto max-w-md">
         <h1 className="text-lg font-bold text-pink-500">资产预览调参</h1>
         <p className="mt-0.5 text-xs text-stone-400">
           开发调试页 · 不影响首页功能
         </p>
 
         {/* Controls */}
         <div className="mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm">
           {/* Progress slider */}
           <div>
             <label className="text-sm font-medium text-stone-500">
               进度：{Math.round(progress * 100)}%
             </label>
             <input
               type="range"
               min="0"
               max="1"
               step="0.01"
               value={progress}
               onChange={(e) => setProgress(parseFloat(e.target.value))}
               className="mt-2 w-full accent-pink-400"
             />
           </div>
 
           {/* Stats */}
           <div className="flex gap-4 text-xs text-stone-500">
             <span>已存：{formatCurrency(currentAmount)}</span>
             <span>逻辑碎片：{unlockedPieces}/{totalPieces}</span>
             <span>视觉碎片：{visualUnlocked}/{phoneWishAssets.fragments.length}</span>
           </div>
 
           {/* Action buttons */}
           <div className="flex gap-2">
             <button
               onClick={() => triggerAnim("warmup")}
               className="min-h-[36px] flex-1 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-xs font-semibold text-amber-700"
             >
               warmup
             </button>
             <button
               onClick={() => triggerAnim("unlock")}
               className="min-h-[36px] flex-1 rounded-xl bg-gradient-to-br from-pink-100 to-orange-100 text-xs font-semibold text-pink-600"
             >
               unlock
             </button>
             <button
               onClick={() => triggerAnim("complete")}
               className="min-h-[36px] flex-1 rounded-xl bg-gradient-to-br from-pink-200 to-orange-200 text-xs font-semibold text-pink-700"
             >
               complete
             </button>
             <button
               onClick={() => setProgress(0)}
               className="min-h-[36px] flex-0 rounded-xl bg-stone-100 px-3 text-xs text-stone-400"
             >
               重置
             </button>
           </div>
         </div>
 
         {/* Hero preview */}
         <div className="mt-6">
           <AssetHeroScene
             totalPieces={totalPieces}
             unlockedPieces={unlockedPieces}
             currentAmount={currentAmount}
             targetAmount={targetAmount}
             warmUpNextPiece={animMode === "warmup"}
             saveAnimation={
               animKey > 0 && animMode
                 ? { key: animKey, mode: animMode, count: 6 }
                 : null
             }
           />
         </div>
 
         {/* Fragment list */}
         <details className="mt-6">
           <summary className="cursor-pointer text-xs text-stone-400">
             碎片坐标（{phoneWishAssets.fragments.length} 块）
           </summary>
           <div className="mt-2 space-y-1">
             {phoneWishAssets.fragments.map((f, i) => {
               const unlocked = progress >= f.unlockAt;
               return (
                 <div
                   key={f.id}
                   className={`flex items-center justify-between rounded-lg px-3 py-1 text-[11px] ${
                     unlocked ? "bg-pink-50 text-stone-600" : "bg-stone-50 text-stone-300"
                   }`}
                 >
                   <span>
                     {f.id} (unlockAt: {f.unlockAt})
                   </span>
                   <span className="tabular-nums">
                     ({f.targetX},{f.targetY}) → ({f.startX},{f.startY})
                   </span>
                 </div>
               );
             })}
           </div>
         </details>
 
         <p className="mt-6 text-center text-[10px] text-stone-300">
           预览页面 · 仅供开发调试使用
         </p>
       </div>
     </main>
   );
 }
