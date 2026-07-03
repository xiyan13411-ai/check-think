"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type PuzzleViewProps = {
  totalPieces: number;
  unlockedPieces: number;
  newlyUnlockedPieceIndexes?: number[];
};

export default function PuzzleView({
  totalPieces = 40,
  unlockedPieces,
  newlyUnlockedPieceIndexes = [],
}: PuzzleViewProps) {
  const pieces = useMemo(
    () => Array.from({ length: totalPieces }, (_, i) => i),
    [totalPieces],
  );

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
          const staggerDelay = i * 0.025;

          return (
            <motion.div
              key={i}
              className={`aspect-square rounded-md ${
                unlocked
                  ? "bg-gradient-to-br from-pink-300 to-orange-300"
                  : "bg-stone-100"
              } ${justUnlocked ? "puzzle-pop-in" : ""}`}
              style={
                justUnlocked
                  ? { animationDelay: `${staggerDelay}s` }
                  : undefined
              }
              whileHover={unlocked ? { scale: 1.15 } : {}}
            />
          );
        })}
      </div>

      {/* Mini preview piece for recent unlocks */}
      {unlockedPieces > 0 && unlockedPieces < totalPieces && (
        <p className="mt-3 text-center text-xs text-stone-400">
          已解锁 {unlockedPieces} 块碎片，还有 {totalPieces - unlockedPieces} 块等你
        </p>
      )}
      {unlockedPieces >= totalPieces && (
        <p className="mt-3 text-center text-xs font-medium text-pink-500">
          🎉 愿望全部拼回来了！
        </p>
      )}
    </motion.div>
  );
}
