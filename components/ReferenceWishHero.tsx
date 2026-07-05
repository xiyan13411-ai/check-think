"use client";

import { motion } from "framer-motion";
import type { WishType } from "@/lib/wish-presets";
import { getWishAsset } from "@/lib/wish-assets";

export default function ReferenceWishHero(props: any) {
  const asset = getWishAsset(props.wishType);

  const progress = Math.min(props.currentAmount / props.targetAmount, 1);
  const isComplete = progress >= 1;

  return (
    <div
      className={`absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 ${asset.className}`}
    >
      <motion.img
        src={asset.src}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center text-white/60">
          ✓
        </div>
      )}
    </div>
  );
}