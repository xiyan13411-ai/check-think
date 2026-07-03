"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import GoalCard from "@/components/GoalCard";
import PuzzleView from "@/components/PuzzleView";
import SavePanel from "@/components/SavePanel";
import HistoryReceipt from "@/components/HistoryReceipt";
import AchievementModal from "@/components/AchievementModal";

import { loadAppState, saveAppState } from "@/lib/storage";
import { calculateProgress, calculateUnlockedPieces } from "@/lib/progress";
import { getRandomMessage } from "@/lib/copywriting";
import { checkNewAchievements } from "@/lib/achievements";
import { vibrate } from "@/lib/vibration";
import type { AppState } from "@/types/app-state";
import type { SavingRecord } from "@/types/record";
import type { Achievement } from "@/types/achievement";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);
  const [flashAmount, setFlashAmount] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [prevUnlocked, setPrevUnlocked] = useState(0);
  const initialized = useRef(false);

  // Load state on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const loaded = loadAppState();
    setState(loaded);
    setPrevUnlocked(
      calculateUnlockedPieces(
        calculateProgress(loaded.goal.currentAmount, loaded.goal.targetAmount),
        loaded.goal.totalPieces,
      ),
    );
  }, []);

  const handleSave = useCallback(
    (amount: number) => {
      if (!state) return;
      if (amount <= 0 || isNaN(amount)) return;

      vibrate();

      const newAmount = state.goal.currentAmount + amount;
      const progress = calculateProgress(newAmount, state.goal.targetAmount);
      const unlockedPieces = calculateUnlockedPieces(
        progress,
        state.goal.totalPieces,
      );
      const message = getRandomMessage();

      const record: SavingRecord = {
        id: generateId(),
        goalId: state.goal.id,
        amount,
        createdAt: new Date().toISOString(),
        progressAfter: progress,
        unlockedPieces,
        message,
      };

      const newState: AppState = {
        goal: {
          ...state.goal,
          currentAmount: newAmount,
        },
        records: [...state.records, record],
        unlockedAchievements: [...state.unlockedAchievements],
      };

      // Check achievements
      const newAchievement = checkNewAchievements(
        progress,
        newState.unlockedAchievements,
      );
      if (newAchievement) {
        newState.unlockedAchievements = [
          ...newState.unlockedAchievements,
          newAchievement.id,
        ];
        setCurrentAchievement(newAchievement);
      }

      setState(newState);
      saveAppState(newState);

      // Flash and message
      setFlashAmount(true);
      setSaveMessage(message);
      setTimeout(() => setFlashAmount(false), 500);
      setTimeout(() => setSaveMessage(null), 2500);
    },
    [state],
  );

  const closeAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

  // Don't render until state is loaded
  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="text-stone-400">加载中...</div>
      </div>
    );
  }

  const progress = calculateProgress(
    state.goal.currentAmount,
    state.goal.targetAmount,
  );
  const unlockedPieces = calculateUnlockedPieces(
    progress,
    state.goal.totalPieces,
  );

  return (
    <main className="safe-area-bottom min-h-screen bg-orange-50 px-4 py-6 text-stone-900">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        {/* Top greeting area */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-lg font-bold text-pink-500">愿望拼图存钱</h1>
          <p className="mt-0.5 text-xs text-stone-400">
            每存一笔钱，愿望就拼回来一块
          </p>
        </motion.div>

        {/* Save message toast */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              className="rounded-2xl bg-white/80 px-4 py-3 text-center text-sm text-stone-600 shadow-sm backdrop-blur"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {saveMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal card */}
        <GoalCard
          goalName={state.goal.name}
          currentAmount={state.goal.currentAmount}
          targetAmount={state.goal.targetAmount}
          progress={progress}
          flashAmount={flashAmount}
        />

        {/* Puzzle view */}
        <PuzzleView
          totalPieces={state.goal.totalPieces}
          unlockedPieces={unlockedPieces}
        />

        {/* Save panel */}
        <SavePanel onSave={handleSave} />

        {/* History receipts */}
        <HistoryReceipt records={state.records} />

        {/* Achievement modal */}
        <AchievementModal
          achievement={currentAchievement}
          onClose={closeAchievement}
        />
      </div>
    </main>
  );
}
