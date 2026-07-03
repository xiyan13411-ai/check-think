import type { Achievement } from "@/types/achievement";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "25pct",
    name: "愿望长出边角",
    description: "已经拼出 25%，有点东西了。",
    threshold: 0.25,
  },
  {
    id: "50pct",
    name: "已经拼出一半",
    description: "这不是进度条，是底气条。",
    threshold: 0.5,
  },
  {
    id: "75pct",
    name: "快要摸到了",
    description: "离目标很近了，别停。",
    threshold: 0.75,
  },
  {
    id: "100pct",
    name: "目标达成",
    description: "愿望拼完整了，漂亮。",
    threshold: 1.0,
  },
];

export function isAchievementUnlocked(
  achievementId: string,
  unlockedIds: string[],
): boolean {
  return unlockedIds.includes(achievementId);
}

export function checkNewAchievements(
  progress: number,
  unlockedIds: string[],
): Achievement | null {
  for (const achievement of ACHIEVEMENTS) {
    if (progress >= achievement.threshold && !unlockedIds.includes(achievement.id)) {
      return achievement;
    }
  }
  return null;
}
