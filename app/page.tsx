"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import AchievementModal from "@/components/AchievementModal";
import ReferenceAppShell from "@/components/ReferenceAppShell";
import WishHeaderRow from "@/components/WishHeaderRow";
import ReferencePhoneHero from "@/components/ReferencePhoneHero";
import ReferenceProgressCard from "@/components/ReferenceProgressCard";

import { loadAppState, saveAppState } from "@/lib/storage";
import { calculateProgress, calculateUnlockedPieces } from "@/lib/progress";
import { getRandomMessage } from "@/lib/copywriting";
import { checkNewAchievements } from "@/lib/achievements";
import { vibrate } from "@/lib/vibration";
import type { AppState } from "@/types/app-state";
import type { SavingRecord } from "@/types/record";
import type { Achievement } from "@/types/achievement";

type SaveAnimationMode = "warmup" | "unlock" | "complete";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [newlyUnlockedPieceIndexes, setNewlyUnlockedPieceIndexes] = useState<number[]>([]);
  const [warmUpNextPiece, setWarmUpNextPiece] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState<{
    key: number;
    mode: SaveAnimationMode;
    count: number;
  } | null>(null);

  const animKeyRef = useRef(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setState(loadAppState());
  }, []);

  const handleSave = useCallback(
    (rawAmount: number) => {
      if (!state) return;

      const amount = Math.floor(Number(rawAmount));
      if (!Number.isFinite(amount) || amount <= 0) return;

      const remaining = Math.max(state.goal.targetAmount - state.goal.currentAmount, 0);
      if (remaining <= 0) return;

      const finalAmount = Math.min(amount, remaining);
      vibrate();

      const animKey = ++animKeyRef.current;
      const oldProgress = calculateProgress(state.goal.currentAmount, state.goal.targetAmount);
      const oldUnlocked = calculateUnlockedPieces(oldProgress, state.goal.totalPieces);

      const newAmount = Math.min(state.goal.currentAmount + finalAmount, state.goal.targetAmount);
      const newProgress = calculateProgress(newAmount, state.goal.targetAmount);
      const newUnlocked = calculateUnlockedPieces(newProgress, state.goal.totalPieces);
      const newlyUnlocked = Array.from(
        { length: Math.max(newUnlocked - oldUnlocked, 0) },
        (_, index) => oldUnlocked + index,
      );

      const message = getRandomMessage(newlyUnlocked.length > 0);
      const animMode: SaveAnimationMode =
        newProgress >= 1 ? "complete" : newlyUnlocked.length > 0 ? "unlock" : "warmup";
      const animCount =
        animMode === "complete" ? 10 : animMode === "unlock" ? Math.min(4 + newlyUnlocked.length, 8) : 2;

      setSaveAnimation({ key: animKey, mode: animMode, count: animCount });

      const record: SavingRecord = {
        id: generateId(),
        goalId: state.goal.id,
        amount: finalAmount,
        createdAt: new Date().toISOString(),
        progressAfter: newProgress,
        unlockedPieces: newUnlocked,
        message,
      };

      const nextState: AppState = {
        goal: {
          ...state.goal,
          currentAmount: newAmount,
        },
        records: [...state.records, record],
        unlockedAchievements: [...state.unlockedAchievements],
      };

      const newAchievement = checkNewAchievements(newProgress, nextState.unlockedAchievements);
      if (newAchievement) {
        nextState.unlockedAchievements = [...nextState.unlockedAchievements, newAchievement.id];
        setCurrentAchievement(newAchievement);
      }

      setState(nextState);
      saveAppState(nextState);

      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedPieceIndexes(newlyUnlocked);
        setWarmUpNextPiece(false);
        window.setTimeout(() => setNewlyUnlockedPieceIndexes([]), 1200);
      } else {
        setWarmUpNextPiece(true);
        window.setTimeout(() => setWarmUpNextPiece(false), 1200);
      }

      window.setTimeout(() => setSaveAnimation(null), 1800);
    },
    [state],
  );

  const closeAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2eb]">
        <div className="text-stone-400">加载中...</div>
      </div>
    );
  }

  const progress = calculateProgress(state.goal.currentAmount, state.goal.targetAmount);
  const unlockedPieces = calculateUnlockedPieces(progress, state.goal.totalPieces);
  const lastRecord = state.records[state.records.length - 1];

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
        lastRecordAmount={lastRecord?.amount}
        lastRecordTimeLabel={lastRecord ? "今天" : undefined}
        onSaveAmount={handleSave}
      />

      <AchievementModal achievement={currentAchievement} onClose={closeAchievement} />
    </ReferenceAppShell>
  );
}
