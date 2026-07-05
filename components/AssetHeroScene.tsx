"use client";

import ReferenceWishHero from "@/components/ReferenceWishHero";

type AssetHeroSceneProps = {
  totalPieces: number;
  unlockedPieces: number;
  currentAmount: number;
  targetAmount: number;
  newlyUnlockedPieceIndexes?: number[];
  warmUpNextPiece?: boolean;
  saveAnimation?: {
    key: number;
    mode: "warmup" | "unlock" | "complete";
    count: number;
  } | null;
};

export default function AssetHeroScene({
  currentAmount,
  targetAmount,
  warmUpNextPiece = false,
  saveAnimation = null,
}: AssetHeroSceneProps) {
  return (
    <ReferenceWishHero
      wishType="phone"
      currentAmount={currentAmount}
      targetAmount={targetAmount}
      warmUpNextPiece={warmUpNextPiece}
      saveAnimation={saveAnimation}
    />
  );
}
