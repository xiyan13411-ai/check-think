export type WishType = "phone" | "macbook" | "camera" | "travel" | "gift" | "home" | "earphone";

export type WishPreset = {
  type: WishType;
  name: string;
  shortName: string;
  targetAmount: number;
  currentAmount: number;
  streakDays: number;
  thumbnail: string;
  accent: string;
};

export const wishPresets: WishPreset[] = [
  {
    type: "macbook",
    name: "新 MacBook",
    shortName: "MacBook",
    targetAmount: 12999,
    currentAmount: 0,
    streakDays: 0,
    thumbnail: "💻",
    accent: "#3b82f6",
  },
  {
    type: "phone",
    name: "新 iPhone",
    shortName: "iPhone",
    targetAmount: 7999,
    currentAmount: 0,
    streakDays: 0,
    thumbnail: "📱",
    accent: "#60a5fa",
  },
  {
    type: "camera",
    name: "新相机",
    shortName: "相机",
    targetAmount: 8999,
    currentAmount: 0,
    streakDays: 0,
    thumbnail: "📷",
    accent: "#8b5cf6",
  },
  {
    type: "travel",
    name: "旅行基金",
    shortName: "旅行",
    targetAmount: 6000,
    currentAmount: 0,
    streakDays: 0,
    thumbnail: "🧳",
    accent: "#14b8a6",
  },
  {
    type: "gift",
    name: "礼物基金",
    shortName: "礼物",
    targetAmount: 2999,
    currentAmount: 0,
    streakDays: 0,
    thumbnail: "🎁",
    accent: "#f97316",
  },
  {
    type: "home",
    name: "小家基金",
    shortName: "小家",
    targetAmount: 20000,
    currentAmount: 0,
    streakDays: 0,
    thumbnail: "🏠",
    accent: "#22c55e",
  },
];

export function getWishPreset(type: WishType | string | undefined): WishPreset {
  return wishPresets.find((preset) => preset.type === type) ?? wishPresets[0];
}

export function inferWishType(name: string | undefined): WishType {
  const safeName = name ?? "";
  if (/macbook|电脑|笔记本/i.test(safeName)) return "macbook";
  if (/相机|camera/i.test(safeName)) return "camera";
  if (/旅行|旅游|trip|travel/i.test(safeName)) return "travel";
  if (/礼物|gift/i.test(safeName)) return "gift";
  if (/家|房|home/i.test(safeName)) return "home";
  if (/耳机|earphone|ear/i.test(safeName)) return "earphone";
  return "phone";
}
