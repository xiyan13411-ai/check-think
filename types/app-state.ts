import type { Goal } from "./goal";
import type { SavingRecord } from "./record";

export type AppState = {
  goal: Goal;
  records: SavingRecord[];
  unlockedAchievements: string[];
};

export type { Goal, SavingRecord };
