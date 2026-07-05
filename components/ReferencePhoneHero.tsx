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

const decorativeShards = [
  { left: "7%", top: "55%", width: 42, height: 86, rotate: -25, delay: 0, clipPath: "polygon(35% 0%, 100% 18%, 72% 100%, 0% 72%)" },
  { left: "20%", top: "66%", width: 62, height: 70, rotate: 24, delay: 0.2, clipPath: "polygon(18% 0%, 100% 34%, 78% 92%, 0% 100%, 26% 48%)" },
  { left: "76%", top: "23%", width: 48, height: 72, rotate: 18, delay: 0.1, clipPath: "polygon(0% 12%, 82% 0%, 100% 74%, 28% 100%)" },
  { left: "82%", top: "60%", width: 50, height: 66, rotate: -18, delay: 0.3, clipPath: "polygon(28% 0%, 100% 34%, 74% 100%, 0% 78%)" },
  { left: "11%", top: "28%", width: 34, height: 54, rotate: 30, delay: 0.4, clipPath: "polygon(0% 20%, 72% 0%, 100% 82%, 24% 100%)" },
];

export default function ReferencePhoneHero({
  totalPieces,
  unlockedPieces,
  currentAmount,
  targetAmount,
  warmUpNextPiece = false,
  saveAnimation = null,
}: ReferencePhoneHeroProps) {
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isComplete = progress >= 1 || unlockedPieces >= totalPieces;
  const unlockedIndices = useMemo(() => getUnlockedShardIndices(progress), [progress]);
  const newestUnlocked = useMemo(() => {
    if (!saveAnimation || saveAnimation.mode !== "unlock") return [];
    return unlockedIndices.slice(-Math.min(saveAnimation.count, 3));
  }, [saveAnimation, unlockedIndices]);

  // V10.1: keep the hero deterministic. The generated PNG can be a bad full-scene image,
  // so this shell uses the curated SVG phone asset until a clean transparent phone PNG exists.
  const assetSrc = phoneRenderAsset.fallbackSvg;
  const edgeHighlight =
    "linear-gradient(135deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.10) 38%, transparent 58%)";

  return (
    <section className="relative mt-4 h-[430px] overflow-hidden rounded-[24px] bg-gradient-to-b from-[#f8f5ee] to-[#ebe6dc] shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.85),transparent_46%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[84%] h-7 w-56 -translate-x-1/2 rounded-full bg-black/10 blur-xl" />

      <svg
        className="pointer-events-none absolute left-1/2 top-[10%] -translate-x-1/2 opacity-25"
        width="310"
        height="220"
        viewBox="0 0 310 220"
        fill="none"
      >
        <path d="M34 176 C84 80 122 52 164 62 C212 73 242 102 280 166" stroke="#bfdbfe" strokeWidth="1.4" />
        <path d="M22 194 C86 62 136 28 184 44 C230 60 256 100 296 154" stroke="#dbeafe" strokeWidth="0.9" />
      </svg>

      {decorativeShards.map((shard, index) => (
        <motion.div
          key={index}
          className="pointer-events-none absolute border border-white/60 bg-gradient-to-br from-white via-stone-100 to-stone-300 shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
          style={{
            left: shard.left,
            top: shard.top,
            width: shard.width,
            height: shard.height,
            rotate: `${shard.rotate}deg`,
            clipPath: shard.clipPath,
          }}
          animate={{ y: [0, -8, 0], opacity: [0.68, 0.92, 0.68] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: shard.delay, ease: "easeInOut" }}
        />
      ))}

      {warmUpNextPiece && !isComplete && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[76%] z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.85)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: [0, 1, 0], y: [40, -70, -150], scale: [0.45, 1.5, 0.3] }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      )}

      <div className="absolute left-1/2 top-[48%] w-[205px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative aspect-[200/420] w-full">
          <img
            src={assetSrc}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-[0.13] grayscale"
          />

          {isComplete && (
            <motion.img
              src={assetSrc}
              alt="完整手机"
              className="absolute inset-0 h-full w-full select-none drop-shadow-[0_20px_34px_rgba(15,23,42,0.20)]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}

          {!isComplete &&
            phoneShards.map((shard, i) => {
              const unlocked = unlockedIndices.includes(i);
              if (!unlocked) return null;
              const justUnlocked = newestUnlocked.includes(i);

              return (
                <div key={shard.id} className="contents">
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      clipPath: shard.clipPath,
                      backgroundImage: `url(${assetSrc})`,
                      backgroundSize: "100% 100%",
                      zIndex: shard.zIndex,
                      filter: "drop-shadow(0 14px 22px rgba(15,23,42,0.22))",
                    }}
                    initial={
                      justUnlocked
                        ? {
                            x: shard.startX,
                            y: shard.startY,
                            rotate: shard.startRotate,
                            scale: shard.startScale,
                            opacity: 0,
                          }
                        : false
                    }
                    animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                    transition={
                      justUnlocked
                        ? { duration: 0.75, ease: [0.34, 1.56, 0.64, 1], delay: 0.03 }
                        : { duration: 0.45, ease: "easeOut" }
                    }
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      clipPath: shard.clipPath,
                      background: edgeHighlight,
                      mixBlendMode: "overlay",
                      zIndex: shard.zIndex + 1,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.45 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              );
            })}

          {unlockedIndices.length === 0 && (
            <div className="absolute inset-x-0 top-[46%] z-20 text-center text-xs font-medium text-stone-400">
              存第一笔，拼回第一块
            </div>
          )}
        </div>
      </div>

      {isComplete && (
        <div className="absolute right-5 top-5 z-50 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">
          已完成
        </div>
      )}
    </section>
  );
}
