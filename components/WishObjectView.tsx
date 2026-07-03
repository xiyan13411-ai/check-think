"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/progress";

type WishObjectViewProps = {
  totalPieces: number;
  unlockedPieces: number;
  currentAmount: number;
  targetAmount: number;
  newlyUnlockedPieceIndexes?: number[];
  warmUpNextPiece?: boolean;
};

const ROWS = 8;
const COLS = 5;

export default function WishObjectView({
  totalPieces = 40,
  unlockedPieces,
  currentAmount,
  targetAmount,
  newlyUnlockedPieceIndexes = [],
  warmUpNextPiece = false,
}: WishObjectViewProps) {
  const pieces = useMemo(
    () => Array.from({ length: totalPieces }, (_, i) => i),
    [totalPieces],
  );

  // Next piece progress
  const pieceValue = targetAmount / totalPieces;
  const currentPieceRemainder = currentAmount % pieceValue;
  const nextPieceProgress = Math.min(currentPieceRemainder / pieceValue, 1);
  const amountToNextPiece = Math.ceil(pieceValue - currentPieceRemainder);
  const showNextPieceInfo = unlockedPieces < totalPieces;

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Phone */}
      <div
        className={`relative mx-auto w-44 rounded-[2.5rem] p-[5px] shadow-xl transition-shadow duration-700 ${
          warmUpNextPiece
            ? "shadow-pink-300/40"
            : "shadow-stone-300/30"
        }`}
        style={{ background: "linear-gradient(145deg, #1c1917, #292524)" }}
      >
        {/* Warm glow overlay */}
        {warmUpNextPiece && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(244,114,182,0.3) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Screen area */}
        <div className="relative h-80 w-full overflow-hidden rounded-[2rem] bg-stone-900">
          {/* Grid pieces */}
          <div className="grid h-full w-full grid-cols-5 grid-rows-8 gap-[1.5px] p-2">
            {pieces.map((i) => {
              const unlocked = i < unlockedPieces;
              const justUnlocked = newlyUnlockedPieceIndexes.includes(i);
              const row = Math.floor(i / COLS);
              const col = i % COLS;

              return (
                <motion.div
                  key={i}
                  className={`rounded-sm ${
                    unlocked
                      ? "bg-gradient-to-br from-pink-400 to-orange-400"
                      : "bg-white/8"
                  } ${justUnlocked ? "object-piece-pop" : ""}`}
                  style={{
                    animationDelay: justUnlocked ? `${col * 0.04 + row * 0.03}s` : undefined,
                    opacity: unlocked ? 1 : 0.12,
                    transition: "opacity 0.3s ease",
                  }}
                />
              );
            })}
          </div>

          {/* Glass reflection */}
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 via-transparent to-transparent" />

          {/* Top notch */}
          <div className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-stone-900">
            <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-stone-700" />
          </div>

          {/* Bottom home bar */}
          <div className="absolute bottom-2 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-white/30" />

          {/* Energy orb (warm-up animation) */}
          {warmUpNextPiece && (
            <motion.div
              className="absolute bottom-8 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.6)]"
              initial={{ opacity: 0, y: 30, scale: 0.3 }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                y: [30, -80, -180],
                scale: [0.3, 1.2, 0.8, 0.3],
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}
        </div>
      </div>

      {/* Next piece progress */}
      {showNextPieceInfo && (
        <div className="w-full max-w-[200px] space-y-1.5 text-center">
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

      {/* Completion */}
      {!showNextPieceInfo && (
        <p className="text-center text-sm font-medium text-pink-500">
          🎉 愿望全部拼回来了！
        </p>
      )}
    </motion.div>
  );
}
