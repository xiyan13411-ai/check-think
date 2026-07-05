"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AchievementModal from "@/components/AchievementModal";
import ReferenceAppShell, { type AppTab } from "@/components/ReferenceAppShell";
import WishHeaderRow from "@/components/WishHeaderRow";
import ReferenceWishHero from "@/components/ReferenceWishHero";
import ReferenceProgressCard from "@/components/ReferenceProgressCard";

import { loadAppState, resetAppState, saveAppState } from "@/lib/storage";
import { calculateProgress, calculateUnlockedPieces, formatCurrency } from "@/lib/progress";
import { getRandomMessage } from "@/lib/copywriting";
import { checkNewAchievements } from "@/lib/achievements";
import { vibrate } from "@/lib/vibration";
import { getWishPreset, wishPresets, type WishPreset, type WishType } from "@/lib/wish-presets";
import type { AppState } from "@/types/app-state";
import type { Goal } from "@/types/goal";
import type { SavingRecord } from "@/types/record";
import type { Achievement } from "@/types/achievement";

type SaveAnimationMode = "warmup" | "unlock" | "complete";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createGoalFromPreset(preset: WishPreset): Goal {
  return {
    id: `goal-${preset.type}`,
    name: preset.name,
    targetAmount: preset.targetAmount,
    currentAmount: preset.currentAmount,
    totalPieces: 40,
    wishType: preset.type,
    createdAt: new Date().toISOString(),
  };
}

function createRecord(goal: Goal, amount: number): SavingRecord {
  const progressAfter = calculateProgress(goal.currentAmount, goal.targetAmount);
  return {
    id: generateId(),
    goalId: goal.id,
    amount,
    createdAt: new Date().toISOString(),
    progressAfter,
    unlockedPieces: calculateUnlockedPieces(progressAfter, goal.totalPieces),
    message: `刚刚存入 ¥${amount}`,
  };
}

function formatTimeLabel(iso: string | undefined): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>("wish");
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

  const commitState = useCallback((nextState: AppState) => {
    setState(nextState);
    saveAppState(nextState);
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

      commitState(nextState);

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
    [commitState, state],
  );

  const handleSelectPreset = useCallback(
    (type: WishType) => {
      const preset = getWishPreset(type);
      const goal = createGoalFromPreset(preset);
      const nextState: AppState = {
        goal,
        records: [createRecord(goal, type === "macbook" ? 100 : 80)],
        unlockedAchievements: [],
      };
      setCurrentAchievement(null);
      setSaveAnimation(null);
      setNewlyUnlockedPieceIndexes([]);
      setWarmUpNextPiece(false);
      commitState(nextState);
      setActiveTab("wish");
    },
    [commitState],
  );

  const handleCycleWish = useCallback(() => {
    if (!state) return;
    const currentType = state.goal.wishType ?? "macbook";
    const currentIndex = wishPresets.findIndex((preset) => preset.type === currentType);
    const nextPreset = wishPresets[(currentIndex + 1 + wishPresets.length) % wishPresets.length];
    handleSelectPreset(nextPreset.type);
  }, [handleSelectPreset, state]);

  const updateGoal = useCallback(
    (patch: Partial<Goal>) => {
      if (!state) return;
      const nextGoal: Goal = {
        ...state.goal,
        ...patch,
      };
      nextGoal.targetAmount = Math.max(1, Math.floor(Number(nextGoal.targetAmount) || 1));
      nextGoal.currentAmount = Math.max(0, Math.min(Math.floor(Number(nextGoal.currentAmount) || 0), nextGoal.targetAmount));
      nextGoal.totalPieces = Math.max(1, nextGoal.totalPieces || 40);
      commitState({ ...state, goal: nextGoal });
    },
    [commitState, state],
  );

  const handleResetDemo = useCallback(() => {
    const nextState = resetAppState();
    setCurrentAchievement(null);
    setSaveAnimation(null);
    setNewlyUnlockedPieceIndexes([]);
    setWarmUpNextPiece(false);
    commitState(nextState);
    setActiveTab("wish");
  }, [commitState]);

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

  const wishType = state.goal.wishType ?? "macbook";
  const preset = getWishPreset(wishType);
  const progress = calculateProgress(state.goal.currentAmount, state.goal.targetAmount);
  const unlockedPieces = calculateUnlockedPieces(progress, state.goal.totalPieces);
  const lastRecord = state.records[state.records.length - 1];

  const content = activeTab === "wish" ? (
    <>
      <WishHeaderRow
        title={state.goal.name}
        streakDays={preset.streakDays}
        thumbnail={preset.thumbnail}
        onClick={() => setActiveTab("plan")}
      />

      <ReferenceWishHero
        wishType={wishType}
        currentAmount={state.goal.currentAmount}
        targetAmount={state.goal.targetAmount}
        warmUpNextPiece={warmUpNextPiece}
        saveAnimation={saveAnimation}
      />

      <ReferenceProgressCard
        currentAmount={state.goal.currentAmount}
        targetAmount={state.goal.targetAmount}
        progress={progress}
        lastRecordAmount={lastRecord?.amount}
        lastRecordTimeLabel={lastRecord ? formatTimeLabel(lastRecord.createdAt) : undefined}
        onSaveAmount={handleSave}
      />
    </>
  ) : activeTab === "plan" ? (
    <section className="space-y-4">
      <div className="rounded-[22px] bg-white p-5 shadow-sm">
        <p className="text-xs font-medium text-stone-400">心愿类型</p>
        <h2 className="mt-1 text-xl font-bold text-stone-900">选择你想拼回来的东西</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {wishPresets.map((item) => {
            const active = item.type === wishType;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleSelectPreset(item.type)}
                className={`rounded-2xl px-3 py-3 text-center shadow-sm transition active:scale-95 ${
                  active ? "bg-blue-500 text-white" : "bg-stone-50 text-stone-600"
                }`}
              >
                <div className="text-2xl">{item.thumbnail}</div>
                <div className="mt-1 text-xs font-semibold">{item.shortName}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[22px] bg-white p-5 shadow-sm">
        <p className="text-xs font-medium text-stone-400">目标设置</p>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs text-stone-400">心愿名称</span>
            <input
              value={state.goal.name}
              onChange={(event) => updateGoal({ name: event.target.value })}
              className="mt-1 h-12 w-full rounded-2xl border border-stone-100 bg-stone-50 px-4 text-sm font-semibold outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-stone-400">目标金额</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={state.goal.targetAmount}
                onChange={(event) => updateGoal({ targetAmount: Number(event.target.value) })}
                className="mt-1 h-12 w-full rounded-2xl border border-stone-100 bg-stone-50 px-4 text-sm font-semibold outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="text-xs text-stone-400">已存金额</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={state.goal.targetAmount}
                value={state.goal.currentAmount}
                onChange={(event) => updateGoal({ currentAmount: Number(event.target.value) })}
                className="mt-1 h-12 w-full rounded-2xl border border-stone-100 bg-stone-50 px-4 text-sm font-semibold outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  ) : activeTab === "detail" ? (
    <section className="rounded-[22px] bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-stone-400">明细</p>
      <h2 className="mt-1 text-xl font-bold text-stone-900">存钱记录</h2>
      <div className="mt-4 space-y-2">
        {state.records.length === 0 ? (
          <p className="rounded-2xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-400">还没有记录，先存一笔。</p>
        ) : (
          [...state.records].reverse().map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-stone-800">存入 {formatCurrency(record.amount)}</p>
                <p className="mt-0.5 text-xs text-stone-400">{record.message}</p>
              </div>
              <span className="text-xs text-stone-400">{formatTimeLabel(record.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </section>
  ) : (
    <section className="space-y-4">
      <div className="rounded-[22px] bg-white p-5 shadow-sm">
        <p className="text-xs font-medium text-stone-400">我的</p>
        <h2 className="mt-1 text-xl font-bold text-stone-900">当前心愿概览</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-xs text-blue-500">进度</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{Math.floor(progress * 100)}%</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs text-emerald-600">记录数</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{state.records.length}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleResetDemo}
          className="mt-4 h-12 w-full rounded-2xl bg-stone-100 text-sm font-semibold text-stone-500 active:scale-[0.99]"
        >
          重置为演示数据
        </button>
      </div>
    </section>
  );

  return (
    <ReferenceAppShell activeTab={activeTab} onTabChange={setActiveTab} onAddWish={handleCycleWish}>
      {content}
      <AchievementModal achievement={currentAchievement} onClose={closeAchievement} />
    </ReferenceAppShell>
  );
}
