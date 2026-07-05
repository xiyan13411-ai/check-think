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

export default function ReferencePhoneHero({
  totalPieces,
  unlockedPieces,
  currentAmount,
  targetAmount,
  newlyUnlockedPieceIndexes = [],
  warmUpNextPiece = false,
  saveAnimation = null,
}: ReferencePhoneHeroProps) {
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isComplete = unlockedPieces >= totalPieces;
  const unlockedIndices = useMemo(() => getUnlockedShardIndices(progress), [progress]);
  const justUnlockedShards = useMemo(() => {
    if (!saveAnimation || saveAnimation.mode !== "unlock") return [];
    const prev = getUnlockedShardIndices(Math.max(0, progress - 0.01));
    const curr = getUnlockedShardIndices(progress);
    return curr.filter((i) => !prev.includes(i));
  }, [saveAnimation, progress]);
  const assetSrc = phoneRenderAsset.png;
  const EDGE_HIGHLIGHT = "linear-gradient(135deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.08) 35%, transparent 55%)";

  return (
    <section className="relative mt-4 h-[520px] overflow-hidden rounded-[24px] bg-[#f7f4ee]">
      {/* Warmup light */}
      {warmUpNextPiece && !isComplete && (
        <motion.div
          className="pointer-events-none absolute left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0], y: [20, -60, -120], scale: [0.4, 1.2, 0.3] }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      )}

      {/* Light arc decoration */}
      <svg className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-15" width="280" height="180" viewBox="0 0 280 180" fill="none">
        <path d="M40,160 Q80,50 140,45 Q200,40 240,120" stroke="#93c5fd" strokeWidth="1.5" fill="none" />
        <path d="M30,170 Q90,30 160,35 Q230,40 260,130" stroke="#bfdbfe" strokeWidth="0.8" fill="none" />
      </svg>

      {/* Phone */}
      <div className="absolute left-1/2 top-[44%] w-[250px] -translate-x-1/2 -translate-y-1/2">
        {/* Shadow under phone */}
        <div className="pointer-events-none absolute -bottom-4 left-1/2 h-6 w-48 -translate-x-1/2 rounded-full bg-black/8 blur-md" />

        {/* Shard layers — the only visual layer */}
        <div className="relative aspect-[200/420] w-full">
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
                      filter: unlocked
                        ? "drop-shadow(0 16px 24px rgba(15,23,42,0.18))"
                        : "drop-shadow(0 8px 14px rgba(15,23,42,0.12))",
                    }}
                    initial={{ x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: unlocked ? 1 : 0.85 }}
                    animate={
                      unlocked
                        ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                        : { x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.85 }
                    }
                    transition={
                      justUnlocked
                        ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.05 }
                        : { duration: 0.5, ease: "easeOut" }
                    }
                  />
                  {/* Edge highlight */}
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
        </div>

        {/* 100% badge */}
        {isComplete && (
          <div className="absolute -right-2 -top-2 z-50 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">
            已完成
          </div>
        )}
      </div>
    </section>
  );
}
