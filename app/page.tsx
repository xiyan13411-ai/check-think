"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import GoalCard from "@/components/GoalCard";
import PuzzleView from "@/components/PuzzleView";
import SavePanel from "@/components/SavePanel";
import HistoryReceipt from "@/components/HistoryReceipt";
import AchievementModal from "@/components/AchievementModal";

import { loadAppState, saveAppState, resetAppState } from "@/lib/storage";
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
  const [newlyUnlockedPieceIndexes, setNewlyUnlockedPieceIndexes] = useState<number[]>([]);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const initialized = useRef(false);

  // Load state on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const loaded = loadAppState();
    setState(loaded);
    // Initialize with empty — no animation on page load
    setNewlyUnlockedPieceIndexes([]);
  }, []);

  const handleSave = useCallback(
    (amount: number) => {
      if (!state) return;
      if (amount <= 0 || isNaN(amount)) return;

      vibrate();

      // Old unlocked count (before this save)
      const oldProgress = calculateProgress(
        state.goal.currentAmount,
        state.goal.targetAmount,
      );
      const oldUnlocked = calculateUnlockedPieces(
        oldProgress,
        state.goal.totalPieces,
      );

      // New values after save
      const newAmount = state.goal.currentAmount + amount;
      const newProgress = calculateProgress(newAmount, state.goal.targetAmount);
      const newUnlocked = calculateUnlockedPieces(
        newProgress,
        state.goal.totalPieces,
      );

      // Compute newly unlocked piece indexes
      const newlyUnlocked = Array.from(
        { length: Math.max(newUnlocked - oldUnlocked, 0) },
        (_, idx) => oldUnlocked + idx,
      );

      const message = getRandomMessage();

      const record: SavingRecord = {
        id: generateId(),
        goalId: state.goal.id,
        amount,
        createdAt: new Date().toISOString(),
        progressAfter: newProgress,
        unlockedPieces: newUnlocked,
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
        newProgress,
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

      // Set newly unlocked for animation
      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedPieceIndexes(newlyUnlocked);

        // Clear after animation completes
        setTimeout(() => setNewlyUnlockedPieceIndexes([]), 1200);
      }

      // Flash and message
      setFlashAmount(true);
      setSaveMessage(message);
      setTimeout(() => setFlashAmount(false), 500);
      setTimeout(() => setSaveMessage(null), 2500);
    },
    [state],
  );

  const handleReset = useCallback(() => {
    const defaultState = resetAppState();
    setState(defaultState);
    setNewlyUnlockedPieceIndexes([]);
    setCurrentAchievement(null);
    setSaveMessage(null);
    setShowResetConfirm(false);
  }, []);

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
          newlyUnlockedPieceIndexes={newlyUnlockedPieceIndexes}

        />

        {/* Save panel */}
        <SavePanel onSave={handleSave} />

        {/* History receipts */}
        <HistoryReceipt records={state.records} />

        {/* Reset button */}
        <div className="mt-2 text-center">
          {showResetConfirm ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-stone-400">
                确认重置所有数据？当前存钱记录将全部清空。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="text-xs text-red-400 underline underline-offset-2"
                >
                  确认重置
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs text-stone-400 underline underline-offset-2"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-stone-300 hover:text-stone-400 transition-colors"
            >
              重置测试数据
            </button>
          )}
        </div>

        {/* Achievement modal */}
        <AchievementModal
          achievement={currentAchievement}
          onClose={closeAchievement}
        />
      </div>
    </main>
  );
}
