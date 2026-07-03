"use client";

import { motion } from "framer-motion";
import ProgressText from "./ProgressText";
import { formatCurrency } from "@/lib/progress";

type GoalCardProps = {
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  flashAmount: boolean;
};

export default function GoalCard({
  goalName,
  currentAmount,
  targetAmount,
  progress,
  flashAmount,
}: GoalCardProps) {
  return (
    <motion.div
      className="rounded-2xl bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Goal name */}
      <p className="text-sm font-medium text-stone-500">{goalName}</p>

      {/* Current amount */}
      <motion.p
        className="mt-1 text-3xl font-bold text-stone-900 tabular-nums"
        animate={
          flashAmount
            ? { scale: [1, 1.06, 1], color: ["#1c1917", "#ec4899", "#1c1917"] }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        {formatCurrency(currentAmount)}
      </motion.p>

      {/* Target / progress */}
      <div className="mt-1 flex items-center justify-between">
        <span className="text-sm text-stone-400">
          目标 {formatCurrency(targetAmount)}
        </span>
        <ProgressText progress={progress} />
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-stone-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
