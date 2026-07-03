"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/progress";

type PuzzleViewProps = {
  totalPieces: number;
  unlockedPieces: number;
  currentAmount: number;
  targetAmount: number;
  newlyUnlockedPieceIndexes?: number[];
  warmUpNextPiece?: boolean;
};

export default function PuzzleView({
  totalPieces = 40,
  unlockedPieces,
  currentAmount,
  targetAmount,
  newlyUnlockedPieceIndexes = [],
  warmUpNextPiece = false,
}: PuzzleViewProps) {
  const pieces = useMemo(
    () => Array.from({ length: totalPieces }, (_, i) => i),
    [totalPieces],
  );

  // Next piece progress calculation
  const pieceValue = targetAmount / totalPieces;
  const currentPieceRemainder = currentAmount % pieceValue;
  const nextPieceProgress = Math.min(currentPieceRemainder / pieceValue, 1);
  const amountToNextPiece = Math.ceil(pieceValue - currentPieceRemainder);
  const showNextPieceInfo = unlockedPieces < totalPieces;

  return (
    <motion.div
      className="rounded-2xl bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-stone-500">愿望拼图</h2>
        <span className="text-xs text-stone-400">
          {unlockedPieces} / {totalPieces}
        </span>
      </div>

      {/* Puzzle grid */}
      <div className="grid grid-cols-8 gap-1.5">
        {pieces.map((i) => {
          const unlocked = i < unlockedPieces;
          const justUnlocked = newlyUnlockedPieceIndexes.includes(i);
          const isNextLocked = i === unlockedPieces && unlockedPieces < totalPieces;
          const showWarmUp = isNextLocked && warmUpNextPiece;

          return (
            <motion.div
              key={i}
              className={`aspect-square rounded-md transition-colors ${
                unlocked
                  ? "bg-gradient-to-br from-pink-300 to-orange-300"
                  : "bg-stone-100"
              } ${justUnlocked ? "puzzle-pop-in" : ""} ${showWarmUp ? "piece-warm-up" : ""}`}
              style={
                justUnlocked
                  ? { animationDelay: `${i * 0.025}s` }
                  : undefined
              }
              whileHover={unlocked ? { scale: 1.15 } : {}}
            />
          );
        })}
      </div>

      {/* Next piece progress */}
      {showNextPieceInfo && (
        <div className="mt-3 space-y-1.5">
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

      {/* Footer */}
      {unlockedPieces >= totalPieces && (
        <p className="mt-3 text-center text-xs font-medium text-pink-500">
          🎉 愿望全部拼回来了！
        </p>
      )}
    </motion.div>
  );
}
