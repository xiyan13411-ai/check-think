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

const decorativeShards = [
  {
    left: "5%",
    top: "54%",
    width: 48,
    height: 92,
    rotate: -27,
    delay: 0,
    clipPath: "polygon(34% 0%, 100% 18%, 72% 100%, 0% 72%)",
    darkAccent: true,
  },
  {
    left: "20%",
    top: "67%",
    width: 68,
    height: 74,
    rotate: 23,
    delay: 0.18,
    clipPath: "polygon(18% 0%, 100% 34%, 78% 92%, 0% 100%, 26% 48%)",
    darkAccent: false,
  },
  {
    left: "75%",
    top: "22%",
    width: 52,
    height: 76,
    rotate: 18,
    delay: 0.1,
    clipPath: "polygon(0% 12%, 82% 0%, 100% 74%, 28% 100%)",
    darkAccent: false,
  },
  {
    left: "82%",
    top: "58%",
    width: 54,
    height: 70,
    rotate: -17,
    delay: 0.26,
    clipPath: "polygon(28% 0%, 100% 34%, 74% 100%, 0% 78%)",
    darkAccent: true,
  },
  {
    left: "10%",
    top: "27%",
    width: 38,
    height: 58,
    rotate: 30,
    delay: 0.36,
    clipPath: "polygon(0% 20%, 72% 0%, 100% 82%, 24% 100%)",
    darkAccent: false,
  },
  {
    left: "58%",
    top: "71%",
    width: 44,
    height: 62,
    rotate: -9,
    delay: 0.44,
    clipPath: "polygon(18% 0%, 100% 26%, 80% 100%, 0% 74%)",
    darkAccent: false,
  },
];

const sideMaterial = "linear-gradient(145deg, rgba(148,163,184,0.95) 0%, rgba(241,245,249,0.78) 38%, rgba(71,85,105,0.92) 100%)";
const bevelMaterial = "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.18) 28%, rgba(15,23,42,0.16) 74%, rgba(255,255,255,0.30) 100%)";
const blueEdgeMaterial = "linear-gradient(135deg, rgba(219,234,254,0.14), rgba(29,78,216,0.45) 48%, rgba(2,6,23,0.52))";
const edgeHighlight = "linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.12) 38%, transparent 58%)";

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

  // Use the curated SVG as the deterministic product asset. The generated PNG path can be
  // restored later when it is a clean transparent single-phone render.
  const assetSrc = phoneRenderAsset.fallbackSvg;

  return (
    <section className="relative mt-4 h-[430px] overflow-hidden rounded-[26px] bg-gradient-to-b from-[#faf7f0] via-[#f3efe6] to-[#e8e2d6] shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_27%,rgba(255,255,255,0.96),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/55 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[84%] h-8 w-60 -translate-x-1/2 rounded-full bg-black/12 blur-xl" />

      <svg
        className="pointer-events-none absolute left-1/2 top-[9%] -translate-x-1/2 opacity-35"
        width="328"
        height="228"
        viewBox="0 0 328 228"
        fill="none"
      >
        <path d="M34 184 C88 82 132 52 170 64 C218 79 254 112 296 176" stroke="#bfdbfe" strokeWidth="1.5" />
        <path d="M18 204 C88 62 142 30 194 48 C242 66 270 106 312 160" stroke="#dbeafe" strokeWidth="0.9" />
        <path d="M62 196 C120 116 168 96 222 124" stroke="#eff6ff" strokeWidth="2" opacity="0.65" />
      </svg>

      {decorativeShards.map((shard, index) => (
        <motion.div
          key={index}
          className="pointer-events-none absolute"
          style={{
            left: shard.left,
            top: shard.top,
            width: shard.width,
            height: shard.height,
            transform: `rotate(${shard.rotate}deg)`,
          }}
          animate={{ y: [0, -9, 0], opacity: [0.72, 0.96, 0.72] }}
          transition={{ duration: 4.6, repeat: Infinity, delay: shard.delay, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 shadow-[0_18px_34px_rgba(15,23,42,0.16)]"
            style={{
              clipPath: shard.clipPath,
              background: sideMaterial,
              transform: "translate(6px, 7px)",
              filter: "blur(0.15px)",
            }}
          />
          <div
            className="absolute inset-0 border border-white/70 bg-gradient-to-br from-white via-stone-100 to-stone-300 shadow-[0_14px_28px_rgba(15,23,42,0.11)]"
            style={{ clipPath: shard.clipPath }}
          />
          {shard.darkAccent && (
            <div
              className="absolute inset-0"
              style={{ clipPath: shard.clipPath, background: blueEdgeMaterial, mixBlendMode: "multiply" }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ clipPath: shard.clipPath, background: edgeHighlight, mixBlendMode: "screen" }}
          />
        </motion.div>
      ))}

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
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-black/5 opacity-70" />

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

              const initialState = justUnlocked
                ? {
                    x: shard.startX,
                    y: shard.startY,
                    rotate: shard.startRotate,
                    scale: shard.startScale,
                    opacity: 0,
                  }
                : false;

              return (
                <motion.div
                  key={shard.id}
                  className="absolute inset-0"
                  style={{ zIndex: shard.zIndex, transformOrigin: "center" }}
                  initial={initialState}
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
                      background: sideMaterial,
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
                      background: bevelMaterial,
                      mixBlendMode: "overlay",
                      opacity: 0.78,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: shard.clipPath,
                      background: "linear-gradient(90deg, rgba(255,255,255,0.55), transparent 18%, transparent 72%, rgba(15,23,42,0.18))",
                      mixBlendMode: "screen",
                      opacity: 0.58,
                    }}
                  />
                  {justUnlocked && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        clipPath: shard.clipPath,
                        background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 60%)",
                        mixBlendMode: "screen",
                      }}
                      initial={{ opacity: 0.8, scale: 0.92 }}
                      animate={{ opacity: 0, scale: 1.18 }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                    />
                  )}
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

