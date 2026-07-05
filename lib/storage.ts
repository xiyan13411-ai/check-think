import { getWishPreset, inferWishType } from "@/lib/wish-presets";
import type { AppState } from "@/types/app-state";
import type { Goal } from "@/types/goal";
import type { SavingRecord } from "@/types/record";

export const STORAGE_KEY = "saving-puzzle-app:v1";

function createDemoRecord(goal: Goal, amount = 100): SavingRecord {
  const progressAfter = Math.min(goal.currentAmount / goal.targetAmount, 1);
  return {
    id: "demo-1",
    goalId: goal.id,
    amount,
    createdAt: new Date().toISOString(),
    progressAfter,
    unlockedPieces: Math.floor(progressAfter * goal.totalPieces),
    message: `刚刚存入 ¥${amount}`,
  };
}

export function createDefaultAppState(): AppState {
  const preset = getWishPreset("macbook");
  const goal: Goal = {
    id: "default-goal",
    name: preset.name,
    targetAmount: preset.targetAmount,
    currentAmount: preset.currentAmount,
    totalPieces: 40,
    wishType: preset.type,
    createdAt: new Date().toISOString(),
  };

  return {
    goal,
    records: [createDemoRecord(goal)],
    unlockedAchievements: [],
  };
}

function migrateAppState(parsed: AppState): AppState {
  const inferredType = parsed.goal.wishType ?? inferWishType(parsed.goal.name);
  const preset = getWishPreset(inferredType);
  const safeTargetAmount = Number.isFinite(parsed.goal.targetAmount) && parsed.goal.targetAmount > 0
    ? parsed.goal.targetAmount
    : preset.targetAmount;
  const safeCurrentAmount = Number.isFinite(parsed.goal.currentAmount) && parsed.goal.currentAmount >= 0
    ? Math.min(parsed.goal.currentAmount, safeTargetAmount)
    : 0;

  return {
    goal: {
      ...parsed.goal,
      id: parsed.goal.id || "default-goal",
      name: parsed.goal.name || preset.name,
      targetAmount: safeTargetAmount,
      currentAmount: safeCurrentAmount,
      totalPieces: parsed.goal.totalPieces || 40,
      wishType: inferredType,
      createdAt: parsed.goal.createdAt || new Date().toISOString(),
    },
    records: Array.isArray(parsed.records) ? parsed.records : [],
    unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
  };
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return createDefaultAppState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultAppState();

    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.goal || typeof parsed.goal.currentAmount !== "number") {
      return createDefaultAppState();
    }
    return migrateAppState(parsed);
  } catch {
    return createDefaultAppState();
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

export function resetAppState(): AppState {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return createDefaultAppState();
}

export type { AppState, Goal, SavingRecord };
