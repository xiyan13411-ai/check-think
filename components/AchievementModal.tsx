"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Achievement } from "@/types/achievement";

type AchievementModalProps = {
  achievement: Achievement | null;
  onClose: () => void;
};

export default function AchievementModal({
  achievement,
  onClose,
}: AchievementModalProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xs rounded-3xl bg-white p-8 text-center shadow-xl"
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Trophy emoji */}
            <motion.div
              className="mb-4 text-6xl"
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              🏆
            </motion.div>

            {/* Achievement name */}
            <h2 className="text-xl font-bold text-stone-900">
              {achievement.name}
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm text-stone-500">
              {achievement.description}
            </p>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="mt-6 min-h-[44px] w-full rounded-xl bg-gradient-to-r from-pink-400 to-orange-400 font-semibold text-white shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              继续拼图
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
