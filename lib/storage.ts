import type { AppState } from "@/types/app-state";
import type { Goal } from "@/types/goal";
import type { SavingRecord } from "@/types/record";

export const STORAGE_KEY = "saving-puzzle-app:v1";

export function createDefaultAppState(): AppState {
  const goal: Goal = {
    id: "default-goal",
    name: "新手机基金",
    targetAmount: 10000,
    currentAmount: 0,
    totalPieces: 40,
    createdAt: new Date().toISOString(),
  };

  return {
    goal,
    records: [],
    unlockedAchievements: [],
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
    // Basic validation
    if (!parsed.goal || typeof parsed.goal.currentAmount !== "number") {
      return createDefaultAppState();
    }
    return parsed;
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
