"use client";

 import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import GoalCard from "@/components/GoalCard";
import WishHeroScene from "@/components/WishHeroScene";
 import AssetHeroScene from "@/components/AssetHeroScene";
import FragmentedPhoneScene from "@/components/FragmentedPhoneScene";
import SavePanel from "@/components/SavePanel";
import HistoryReceipt from "@/components/HistoryReceipt";
import AchievementModal from "@/components/AchievementModal";
 import AppUpdateNotice from "@/components/AppUpdateNotice";
import ReferenceAppShell from "@/components/ReferenceAppShell";
import WishHeaderRow from "@/components/WishHeaderRow";
import ReferencePhoneHero from "@/components/ReferencePhoneHero";
import ReferenceProgressCard from "@/components/ReferenceProgressCard";

import { loadAppState, saveAppState, resetAppState } from "@/lib/storage";
import { calculateProgress, calculateUnlockedPieces } from "@/lib/progress";
import { getRandomMessage } from "@/lib/copywriting";
import { checkNewAchievements } from "@/lib/achievements";
import { vibrate } from "@/lib/vibration";
import type { AppState } from "@/types/app-state";
import type { SavingRecord } from "@/types/record";
import type { Achievement } from "@/types/achievement";
 
// Toggle: "fragmented" = FragmentedPhoneScene (V7), "asset" = AssetHeroScene (V5), "svg" = WishHeroScene (V4)
const HERO_MODE: "fragmented" | "asset" | "svg" = "fragmented";
 

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
 const [warmUpNextPiece, setWarmUpNextPiece] = useState(false);
   type SaveAnimationMode = "warmup" | "unlock" | "complete";
   const [saveAnimation, setSaveAnimation] = useState<{
     key: number;
     mode: SaveAnimationMode;
     count: number;
   } | null>(null);
   const animKeyRef = useRef(0);
   const initialized = useRef(false);

  // Load state on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const loaded = loadAppState();
    setState(loaded);
    setNewlyUnlockedPieceIndexes([]);
  }, []);

 const handleSave = useCallback(
   (amount: number) => {
     if (!state) return;
     if (amount <= 0 || isNaN(amount)) return;

     vibrate();
 
      // Generate animation key before computing state changes
      const animKey = ++animKeyRef.current;

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

      // Differentiated message
     const message = getRandomMessage(newlyUnlocked.length > 0);
 
      // Determine save animation mode
      let animMode: SaveAnimationMode;
      let animCount: number;
      if (newProgress >= 1) {
        animMode = "complete";
        animCount = 10;
      } else if (newlyUnlocked.length > 0) {
        animMode = "unlock";
        animCount = Math.min(4 + newlyUnlocked.length, 8);
      } else {
        animMode = "warmup";
        animCount = 2;
      }
      setSaveAnimation({ key: animKey, mode: animMode, count: animCount });

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
        setTimeout(() => setNewlyUnlockedPieceIndexes([]), 1200);
        setWarmUpNextPiece(false);
      } else {
        // No piece unlocked — warm up the next one
        if (oldUnlocked < state.goal.totalPieces) {
          setWarmUpNextPiece(true);
          setTimeout(() => setWarmUpNextPiece(false), 1500);
        }
      }

      // Flash and message
     setFlashAmount(true);
     setSaveMessage(message);
      setTimeout(() => setSaveAnimation(null), 2000);
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

  const heroScene =
    HERO_MODE === "fragmented" ? (
      <FragmentedPhoneScene
        totalPieces={state.goal.totalPieces}
        unlockedPieces={unlockedPieces}
        currentAmount={state.goal.currentAmount}
        targetAmount={state.goal.targetAmount}
        newlyUnlockedPieceIndexes={newlyUnlockedPieceIndexes}
        warmUpNextPiece={warmUpNextPiece}
        saveAnimation={saveAnimation}
      />
    ) : HERO_MODE === "asset" ? (
      <AssetHeroScene
        totalPieces={state.goal.totalPieces}
        unlockedPieces={unlockedPieces}
        currentAmount={state.goal.currentAmount}
        targetAmount={state.goal.targetAmount}
        newlyUnlockedPieceIndexes={newlyUnlockedPieceIndexes}
        warmUpNextPiece={warmUpNextPiece}
        saveAnimation={saveAnimation}
      />
    ) : (
      <WishHeroScene
        totalPieces={state.goal.totalPieces}
        unlockedPieces={unlockedPieces}
        currentAmount={state.goal.currentAmount}
        targetAmount={state.goal.targetAmount}
        newlyUnlockedPieceIndexes={newlyUnlockedPieceIndexes}
        warmUpNextPiece={warmUpNextPiece}
        saveAnimation={saveAnimation}
      />
    );
  return (
    <ReferenceAppShell>
      <WishHeaderRow title={state.goal.name} streakDays={7} />

      <ReferencePhoneHero
        totalPieces={state.goal.totalPieces}
        unlockedPieces={unlockedPieces}
        currentAmount={state.goal.currentAmount}
        targetAmount={state.goal.targetAmount}
        newlyUnlockedPieceIndexes={newlyUnlockedPieceIndexes}
        warmUpNextPiece={warmUpNextPiece}
        saveAnimation={saveAnimation}
      />

      <ReferenceProgressCard
        currentAmount={state.goal.currentAmount}
        targetAmount={state.goal.targetAmount}
        progress={progress}
        lastRecordAmount={state.records.length > 0 ? state.records[state.records.length - 1].amount : undefined}
        lastRecordTimeLabel="今天"
        onPrimarySave={() => handleSave(80)}
      />

      <AchievementModal achievement={currentAchievement} onClose={closeAchievement} />
      <AppUpdateNotice />
    </ReferenceAppShell>
  );
}
