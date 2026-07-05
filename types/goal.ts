import type { WishType } from "@/lib/wish-presets";

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  totalPieces: number;
  createdAt: string;
  wishType?: WishType;
};
