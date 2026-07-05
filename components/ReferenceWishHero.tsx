"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { WishType } from "@/lib/wish-presets";
import { getWishAsset } from "@/lib/wish-assets";

type ReferenceWishHeroProps = {
  wishType: WishType;
  currentAmount: number;
  targetAmount: number;
  warmUpNextPiece?: boolean;
  saveAnimation?: {
    key: number;
    mode: "warmup" | "unlock" | "complete";
    count: number;
  } | null;
};

type PosterShard = {
  id: string;
  clipPath: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  z: number;
};

const posterShards: PosterShard[] = [
  { id: "top-left", clipPath: "polygon(8% 8%, 34% 5%, 42% 25%, 22% 36%, 6% 27%)", x: -162, y: -106, rotate: -24, scale: 0.9, z: 32 },
  { id: "top-core", clipPath: "polygon(33% 6%, 62% 7%, 61% 30%, 43% 34%, 36% 22%)", x: -20, y: -146, rotate: 17, scale: 0.9, z: 38 },
  { id: "top-right", clipPath: "polygon(61% 7%, 92% 10%, 88% 37%, 64% 32%)", x: 160, y: -108, rotate: 24, scale: 0.9, z: 34 },
  { id: "left-mid", clipPath: "polygon(6% 27%, 30% 34%, 32% 59%, 8% 67%, 2% 47%)", x: -204, y: 16, rotate: -18, scale: 0.92, z: 36 },
  { id: "center-main", clipPath: "polygon(28% 31%, 58% 28%, 67% 57%, 39% 66%, 29% 50%)", x: 18, y: -58, rotate: 12, scale: 0.96, z: 46 },
  { id: "right-mid", clipPath: "polygon(58% 30%, 91% 35%, 83% 65%, 63% 58%)", x: 188, y: 8, rotate: 19, scale: 0.9, z: 40 },
  { id: "left-lower", clipPath: "polygon(16% 61%, 40% 58%, 45% 74%, 22% 80%, 8% 71%)", x: -158, y: 128, rotate: 21, scale: 0.9, z: 42 },
  { id: "center-lower", clipPath: "polygon(35% 58%, 66% 58%, 72% 79%, 41% 84%, 35% 72%)", x: 12, y: 144, rotate: -11, scale: 0.9, z: 48 },
  { id: "right-lower", clipPath: "polygon(65% 59%, 94% 66%, 89% 86%, 70% 80%)", x: 164, y: 154, rotate: -19, scale: 0.9, z: 39 },
  { id: "bottom-left", clipPath: "polygon(10% 73%, 38% 80%, 36% 97%, 6% 91%)", x: -118, y: 224, rotate: -13, scale: 0.92, z: 44 },
  { id: "bottom-core", clipPath: "polygon(38% 78%, 62% 77%, 61% 95%, 37% 96%)", x: 0, y: 232, rotate: 10, scale: 0.92, z: 50 },
  { id: "bottom-right", clipPath: "polygon(61% 78%, 91% 83%, 97% 96%, 62% 96%)", x: 138, y: 222, rotate: 18, scale: 0.9, z: 45 },
  { id: "tiny-left", clipPath: "polygon(0% 50%, 12% 55%, 11% 78%, 0% 73%)", x: -226, y: 96, rotate: 29, scale: 0.78, z: 52 },
  { id: "tiny-right", clipPath: "polygon(88% 42%, 100% 50%, 97% 72%, 84% 63%)", x: 228, y: 90, rotate: -28, scale: 0.78, z: 53 },
  { id: "thin-bottom", clipPath: "polygon(19% 93%, 82% 92%, 96% 100%, 8% 100%)", x: 0, y: 278, rotate: -7, scale: 0.86, z: 54 },
];

function Sparkles() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.96)]"
          style={{ left: `${14 + i * 11}%`, top: `${22 + (i % 4) * 14}%` }}
          animate={{ opacity: [0.12, 0.95, 0.12], scale: [0.55, 1.55, 0.55] }}
          transition={{ duration: 2.1 + i * 0.16, repeat: Infinity, delay: i * 0.17, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function LightTrails() {
  return (
    <svg className="pointer-events-none absolute left-1/2 top-[10%] -translate-x-1/2 opacity-70" width="370" height="270" viewBox="0 0 370 270" fill="none">
      <path d="M24 206C94 75 146 48 188 70C242 98 278 126 344 194" stroke="#bfdbfe" strokeWidth="1.8" />
      <path d="M10 228C94 64 158 30 214 54C268 78 306 118 356 184" stroke="#dbeafe" strokeWidth="1.1" />
      <path d="M58 214C124 118 180 96 242 132" stroke="#eff6ff" strokeWidth="2.2" opacity="0.78" />
    </svg>
  );
}

export default function ReferenceWishHero({
  wishType,
  currentAmount,
  targetAmount,
  warmUpNextPiece = false,
  saveAnimation = null,
}: ReferenceWishHeroProps) {
  const asset = getWishAsset(wishType);
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isPristine = progress <= 0;
  const isComplete = progress >= 1;
  const visualProgress = Math.min(1, progress * 1.85);
  const visibleCount = isPristine || isComplete ? 0 : Math.max(5, Math.ceil(visualProgress * posterShards.length));
  const shownShards = posterShards.slice(0, visibleCount);
  const completeSrc = asset.completeSrc ?? asset.src;
  const heroSrc = isComplete ? completeSrc : asset.src;
  const srcCandidates = useMemo(
    () => Array.from(new Set([heroSrc, asset.src, ...(asset.fallbackSrcs ?? [])])),
    [asset.fallbackSrcs, asset.src, heroSrc],
  );
  const [srcIndex, setSrcIndex] = useState(0);
  const activeSrc = srcCandidates[Math.min(srcIndex, srcCandidates.length - 1)] ?? asset.src;

  useEffect(() => {
    setSrcIndex(0);
  }, [wishType, heroSrc]);

  const handleAssetError = () => {
    setSrcIndex((index) => Math.min(index + 1, srcCandidates.length - 1));
  };

  return (
    <section className="relative mt-4 h-[440px] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#fffdf8] via-[#f5efe4] to-[#e7dfd1] shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.98),transparent_43%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[84%] h-8 w-64 -translate-x-1/2 rounded-full bg-black/12 blur-xl" />
      <Sparkles />
      <LightTrails />

      <div className={`absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 ${asset.className}`}>
        <motion.img
          src={activeSrc}
          onError={handleAssetError}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain drop-shadow-[0_28px_38px_rgba(15,23,42,0.20)]"
          initial={false}
          animate={saveAnimation ? { scale: [1, 1.028, 1], rotate: [0, -0.6, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.58, ease: "easeOut" }}
          style={{
            opacity: isComplete ? 1 : isPristine ? asset.ghostOpacity : asset.liveOpacity,
            filter: isComplete ? "none" : isPristine ? "grayscale(0.74) saturate(0.68)" : "grayscale(0.08)",
          }}
        />

        {shownShards.map((shard, index) => {
          const finalPull = Math.min(0.86, visualProgress * 0.82);
          const targetX = shard.x * (1 - finalPull);
          const targetY = shard.y * (1 - finalPull);
          const targetRotate = shard.rotate * (1 - finalPull);
          const newest = saveAnimation?.mode === "unlock" && index >= Math.max(0, shownShards.length - 3);

          return (
            <motion.div
              key={`${wishType}-${shard.id}`}
              className="absolute inset-0"
              style={{ zIndex: shard.z, transformOrigin: "center" }}
              initial={newest ? { x: shard.x, y: shard.y, rotate: shard.rotate, scale: shard.scale, opacity: 0 } : false}
              animate={{ x: targetX, y: targetY, rotate: targetRotate, scale: 1, opacity: 1 }}
              transition={newest ? { duration: 0.74, ease: [0.34, 1.56, 0.64, 1] } : { duration: 0.5, ease: "easeOut" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  clipPath: shard.clipPath,
                  background: "linear-gradient(145deg, rgba(71,85,105,0.96), rgba(248,250,252,0.9) 42%, rgba(15,23,42,0.96))",
                  transform: "translate(7px, 8px)",
                  filter: "drop-shadow(0 20px 28px rgba(15,23,42,0.24))",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: shard.clipPath,
                  backgroundImage: `url(${activeSrc})`,
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  filter: "drop-shadow(0 16px 24px rgba(15,23,42,0.22))",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: shard.clipPath,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.10) 38%, transparent 62%)",
                  mixBlendMode: "screen",
                }}
              />
              {newest && (
                <motion.div
                  className="absolute inset-0"
                  style={{ clipPath: shard.clipPath, background: "radial-gradient(circle, rgba(255,255,255,0.92), transparent 58%)", mixBlendMode: "screen" }}
                  initial={{ opacity: 0.9, scale: 0.92 }}
                  animate={{ opacity: 0, scale: 1.18 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                />
              )}
            </motion.div>
          );
        })}

        {isPristine && (
          <motion.div className="absolute left-1/2 top-[48%] z-50 -translate-x-1/2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-stone-400 shadow-sm backdrop-blur" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            存第一笔，开始拼回心愿
          </motion.div>
        )}

        {warmUpNextPiece && !isComplete && (
          <motion.div className="pointer-events-none absolute left-1/2 top-[74%] z-50 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.95)]" initial={{ opacity: 0, y: 44 }} animate={{ opacity: [0, 1, 0], y: [44, -76, -164], scale: [0.45, 1.7, 0.3] }} transition={{ duration: 1.05, ease: "easeOut" }} />
        )}
      </div>

      {saveAnimation && (
        <div key={saveAnimation.key} className="pointer-events-none absolute inset-0 z-40">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.span key={i} className="absolute left-1/2 top-[50%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(147,197,253,0.95)]" initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.6 }} animate={{ x: Math.cos((i / 8) * Math.PI * 2) * 118, y: Math.sin((i / 8) * Math.PI * 2) * 88, opacity: 0, scale: 1.4 }} transition={{ duration: 0.75, ease: "easeOut" }} />
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e7dfd1] to-transparent" />
      {isComplete && <div className="absolute right-5 top-5 z-50 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">已完成</div>}
    </section>
  );
}
