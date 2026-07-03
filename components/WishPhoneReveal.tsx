 "use client";

 import { useMemo } from "react";
 import { formatCurrency } from "@/lib/progress";
 import FlyingShards from "./FlyingShards";

 type WishPhoneRevealProps = {
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

 const COLS = 5;

 export default function WishPhoneReveal({
   totalPieces = 40,
   unlockedPieces,
   currentAmount,
   targetAmount,
   newlyUnlockedPieceIndexes = [],
   warmUpNextPiece = false,
   saveAnimation = null,
 }: WishPhoneRevealProps) {
  const pieces = useMemo(
    () => Array.from({ length: totalPieces }, (_, i) => i),
    [totalPieces],
  );

  const pieceValue = targetAmount / totalPieces;
  const currentPieceRemainder = currentAmount % pieceValue;
  const nextPieceProgress = Math.min(currentPieceRemainder / pieceValue, 1);
  const amountToNextPiece = Math.ceil(pieceValue - currentPieceRemainder);
  const isComplete = unlockedPieces >= totalPieces;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Outer stage card */}
      <div className="relative rounded-3xl bg-white/70 px-6 py-8 shadow-sm backdrop-blur-sm">
        {/* Subtle background glow */}
        {isComplete && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-pink-100/60 via-amber-50/40 to-transparent" />
        )}

        {/* Phone */}
        <div
          className={`relative mx-auto ${
            isComplete ? "w-44 md:w-48" : "w-44"
          }`}
        >
          {/* Phone body */}
          <div
            className={`relative rounded-[2rem] p-[5px] shadow-lg transition-shadow duration-500 ${
              warmUpNextPiece
                ? "shadow-pink-300/30"
                : isComplete
                  ? "shadow-pink-200/40"
                  : "shadow-stone-300/20"
            }`}
            style={{
              background: isComplete
                ? "linear-gradient(145deg, #fef3f2, #fff1ef)"
                : "linear-gradient(145deg, #fef3f2, #fff7ed)",
            }}
          >
            {/* Screen area */}
           <div className="relative h-80 w-full overflow-hidden rounded-[1.75rem] bg-rose-50">
               {/* Flying shards overlay */}
               {saveAnimation && (
                 <FlyingShards
                   triggerKey={saveAnimation.key}
                   mode={saveAnimation.mode}
                   count={saveAnimation.count}
                 />
               )}
 
              {/* Wallpaper gradient (always visible underneath) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-700 ${
                  isComplete ? "from-pink-300 via-rose-200 to-amber-200" : "from-pink-200 via-rose-100 to-amber-100"
                }`}
              />

              {/* Fog overlay grid */}
              {!isComplete && (
                <div className="relative z-10 grid h-full w-full grid-cols-5 grid-rows-8 gap-[1px] p-[3px]">
                  {pieces.map((i) => {
                    const unlocked = i < unlockedPieces;
                    const justUnlocked = newlyUnlockedPieceIndexes.includes(i);
                    const row = Math.floor(i / COLS);
                    const col = i % COLS;
                    const staleRotate = ((i * 7 + col * 3) % 7 - 3) * 0.6;

                    return (
                      <div
                        key={i}
                        className={`rounded-[3px] transition-all duration-500 ${
                          justUnlocked
                            ? "reveal-fog-away"
                            : unlocked
                              ? "opacity-0"
                              : "bg-white/60"
                        }`}
                        style={{
                          transform: `rotate(${staleRotate}deg)`,
                          animationDelay: justUnlocked
                            ? `${col * 0.04 + row * 0.025}s`
                            : undefined,
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Glass reflection */}
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-white/20 via-transparent to-transparent" />

              {/* Top notch */}
              <div className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-rose-100/80 backdrop-blur-sm">
                <div className="mx-auto mt-[5px] h-2 w-2 rounded-full bg-rose-300/60" />
              </div>

              {/* Bottom home bar */}
              <div className="absolute bottom-2 left-1/2 h-[3px] w-9 -translate-x-1/2 rounded-full bg-stone-300/50" />

              {/* Tiny coin fly-up (warm-up) */}
              {warmUpNextPiece && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.5)] tiny-coin-fly" />
              )}
            </div>
          </div>

          {/* 100% celebration effects */}
          {isComplete && (
            <>
              <div className="pointer-events-none absolute -inset-4 z-0 rounded-[2.5rem] phone-soft-glow" />
               {/* Completion badge */}
               <div className="absolute -right-2 -top-2 z-10 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">
                 已完成
               </div>
               <span className="absolute -left-3 -top-2 text-lg" style={{ animation: "float-star 2s ease-in-out infinite" }}>
                 ✨
               </span>
               <span className="absolute -bottom-1 -right-3 text-base" style={{ animation: "float-star 2s ease-in-out 0.6s infinite" }}>
                 ✨
               </span>
               <span className="absolute -right-3 top-8 text-sm" style={{ animation: "float-star 2.5s ease-in-out 1.2s infinite" }}>
                 🌟
               </span>
               <span className="absolute -bottom-2 left-6 text-xs" style={{ animation: "float-star 3s ease-in-out 0.8s infinite" }}>
                 ✨
               </span>
            </>
          )}
        </div>

        {/* Next piece progress (only when not complete) */}
        {!isComplete && (
          <div className="mt-4 w-full max-w-[200px] space-y-1.5 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">
                下一块碎片正在路上
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
              再存 {formatCurrency(amountToNextPiece)}，就能拼回下一块
            </p>
          </div>
        )}

        {/* 100% celebration message */}
         {isComplete && (
           <div className="mt-6 text-center">
             <p className="text-sm font-semibold text-pink-500">
               🎉 愿望全部拼回来了！
             </p>
             <p className="mt-1 text-xs text-stone-400">
               你的新手机基金已经攒够啦
             </p>
             <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-50 to-orange-50 px-4 py-1.5 text-xs text-stone-500 shadow-sm">
               <span className="text-pink-400">★</span>
               共积攒 ¥{targetAmount.toLocaleString("zh-CN")}
               <span className="text-orange-400">★</span>
             </div>
           </div>
         )}

        {/* Warm-up coin source indicator */}
        {warmUpNextPiece && !isComplete && (
          <div className="mt-2 text-center">
            <p className="animate-pulse text-xs text-amber-400/70">
              💫 存进去了
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
