"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/progress";
import { phoneShards, getUnlockedShardIndices } from "@/lib/fragmented-phone-map";
import { phoneRenderAsset } from "@/lib/wish-assets";

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

const PNG_SRC = phoneRenderAsset.png;
const SVG_FALLBACK = phoneRenderAsset.fallbackSvg;

/** Custom hook: load PNG, fall back to SVG on error */
function useAssetSrc(): string {
  const [src, setSrc] = useState(PNG_SRC);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setSrc(PNG_SRC);
    img.onerror = () => setSrc(SVG_FALLBACK);
    img.src = PNG_SRC;
  }, []);
  return src;
}

export default function FragmentedPhoneScene({
  totalPieces,
  unlockedPieces,
  currentAmount,
  targetAmount,
  newlyUnlockedPieceIndexes = [],
  warmUpNextPiece = false,
  saveAnimation = null,
}: FragmentedPhoneSceneProps) {
  const assetSrc = useAssetSrc();
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isComplete = unlockedPieces >= totalPieces;
  const unlockedIndices = useMemo(() => getUnlockedShardIndices(progress), [progress]);

  const justUnlockedShards = useMemo(() => {
    if (!saveAnimation || saveAnimation.mode !== "unlock") return [];
    const prevProgress = Math.max(0, progress - (currentAmount / targetAmount - progress));
    const prev = getUnlockedShardIndices(prevProgress);
    const curr = getUnlockedShardIndices(progress);
    return curr.filter((i) => !prev.includes(i));
  }, [saveAnimation, progress, currentAmount, targetAmount]);

  const pieceValue = targetAmount / totalPieces;
  const currentPieceRemainder = currentAmount % pieceValue;
  const nextPieceProgress = Math.min(currentPieceRemainder / pieceValue, 1);
  const amountToNextPiece = Math.ceil(pieceValue - currentPieceRemainder);

  const EDGE_HIGHLIGHT = "linear-gradient(135deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.08) 35%, transparent 55%)";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative w-full overflow-hidden rounded-3xl ${
        isComplete ? "bg-gradient-to-b from-pink-100/80 via-rose-50/60 to-amber-50/80" : "bg-white/70"
      } shadow-sm backdrop-blur-sm transition-colors duration-700`}>
        {isComplete && <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-200/40 via-rose-100/20 to-amber-100/30" />}

        {warmUpNextPiece && !isComplete && (
          <motion.div
            className="pointer-events-none absolute left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: [0, 1, 0], y: [60, -40, -120], scale: [0.4, 1.2, 0.3] }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          />
        )}

        <div className="relative px-4 py-8">
          <div className="relative mx-auto w-44">
            {isComplete && <div className="pointer-events-none absolute -inset-4 z-0 rounded-[2.5rem] phone-soft-glow" />}

            <div className="relative aspect-[200/420] w-full">
              <svg viewBox="0 0 200 420" className="pointer-events-none absolute inset-0 opacity-[0.08]">
                <rect x="15" y="15" width="170" height="390" rx="35" fill="#f8fafc" />
                <rect x="15" y="15" width="170" height="390" rx="35" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2.5 2.5" />
                <rect x="30" y="38" width="65" height="85" rx="14" fill="none" stroke="#475569" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
              </svg>

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
                        initial={
                          unlocked
                            ? { x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.5 }
                            : { x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.5 }
                        }
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

              {justUnlockedShards.length > 0 && (
                <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.75rem] bg-gradient-to-b from-pink-200/10 via-transparent to-transparent animate-pulse" />
              )}
            </div>

            {isComplete && (
              <motion.div
                className="absolute inset-0 z-40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="-mt-10 text-center">
                  <p className="text-sm font-semibold text-pink-500">愿望拼回来了</p>
                  <p className="mt-1 text-[11px] text-stone-400">新手机基金已攒够</p>
                </div>
              </motion.div>
            )}

            {isComplete && (
              <div className="absolute -right-1 -top-1 z-50 flex h-8 min-w-[3.5rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-2.5 text-[10px] font-bold text-white shadow-md">
                已完成
              </div>
            )}
          </div>
        </div>

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
