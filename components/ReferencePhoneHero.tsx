"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { phoneShards, getUnlockedShardIndices } from "@/lib/fragmented-phone-map";

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

const assetSrc = "/wish-assets/phone/phone-render.svg";

export default function ReferencePhoneHero({
  totalPieces,
  unlockedPieces,
  currentAmount,
  targetAmount,
  warmUpNextPiece = false,
  saveAnimation = null,
}: ReferencePhoneHeroProps) {
  const progress = Math.min(currentAmount / targetAmount, 1);
  const visualProgress = Math.min(progress * 1.75, 1);
  const isComplete = progress >= 1 || unlockedPieces >= totalPieces;
  const unlockedIndices = useMemo(() => getUnlockedShardIndices(visualProgress), [visualProgress]);
  const newestUnlocked = useMemo(() => {
    if (!saveAnimation || saveAnimation.mode !== "unlock") return [];
    return unlockedIndices.slice(-Math.min(saveAnimation.count, 4));
  }, [saveAnimation, unlockedIndices]);

  return (
    <section className="relative mt-4 h-[430px] overflow-hidden rounded-[26px] bg-gradient-to-b from-[#faf7f0] via-[#f3efe6] to-[#e8e2d6] shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_27%,rgba(255,255,255,0.96),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/55 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[84%] h-8 w-60 -translate-x-1/2 rounded-full bg-black/12 blur-xl" />

      {warmUpNextPiece && !isComplete && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[76%] z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.9)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: [0, 1, 0], y: [40, -72, -154], scale: [0.45, 1.6, 0.3] }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      )}

      <div className="absolute left-1/2 top-[48%] w-[218px] -translate-x-1/2 -translate-y-1/2" style={{ transform: "translate(-50%, -50%) rotate(-6deg)" }}>
        <div className="relative aspect-[200/420] w-full">
          <img
            src={assetSrc}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-[0.11] grayscale drop-shadow-[0_12px_18px_rgba(15,23,42,0.10)]"
          />

          {isComplete && (
            <motion.img
              src={assetSrc}
              alt="完整手机"
              className="absolute inset-0 h-full w-full select-none drop-shadow-[0_24px_38px_rgba(15,23,42,0.24)]"
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
                <motion.div
                  key={shard.id}
                  className="absolute inset-0"
                  style={{ zIndex: shard.zIndex, transformOrigin: "center" }}
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
                      ? { duration: 0.78, ease: [0.34, 1.56, 0.64, 1], delay: 0.03 }
                      : { duration: 0.45, ease: "easeOut" }
                  }
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: shard.clipPath,
                      background: "linear-gradient(145deg, rgba(148,163,184,0.95) 0%, rgba(241,245,249,0.78) 38%, rgba(71,85,105,0.92) 100%)",
                      transform: "translate(7px, 8px)",
                      filter: "drop-shadow(0 20px 28px rgba(15,23,42,0.20))",
                      opacity: 0.9,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: shard.clipPath,
                      backgroundImage: `url(${assetSrc})`,
                      backgroundSize: "100% 100%",
                      filter: "drop-shadow(0 15px 24px rgba(15,23,42,0.24))",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: shard.clipPath,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.18) 28%, rgba(15,23,42,0.16) 74%, rgba(255,255,255,0.30) 100%)",
                      mixBlendMode: "overlay",
                      opacity: 0.78,
                    }}
                  />
                </motion.div>
              );
            })}

          {unlockedIndices.length === 0 && (
            <div className="absolute inset-x-0 top-[46%] z-20 text-center text-xs font-medium text-stone-400">
              存第一笔，拼回第一块
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e8e2d6] to-transparent" />

      {isComplete && (
        <div className="absolute right-5 top-5 z-50 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">
          已完成
        </div>
      )}
    </section>
  );
}
