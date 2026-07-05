"use client";

import { motion } from "framer-motion";
import type { WishType } from "@/lib/wish-presets";

export type ProductAsset = {
  src: string;
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

const assetRegistry: Partial<Record<WishType, ProductAsset>> = {
  macbook: {
    src: "/wish-assets/generated/macbook-hero.webp",
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.34,
  },
  phone: {
    src: "/wish-assets/generated/phone-hero.webp",
    className: "h-[388px] w-[388px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.34,
  },
  camera: {
    src: "/wish-assets/generated/camera-hero.webp",
    className: "h-[382px] w-[382px]",
    ghostOpacity: 0.15,
    liveOpacity: 0.33,
  },
  travel: {
    src: "/wish-assets/generated/travel-hero.webp",
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.15,
    liveOpacity: 0.34,
  },
  gift: {
    src: "/wish-assets/generated/gift-hero.webp",
    className: "h-[360px] w-[360px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.36,
  },
  home: {
    src: "/wish-assets/generated/home-hero.webp",
    className: "h-[372px] w-[372px]",
    ghostOpacity: 0.15,
    liveOpacity: 0.33,
  },
  earphone: {
    src: "/wish-assets/generated/现代耳机爆炸视图.webp",
    className: "h-[370px] w-[370px]",
    ghostOpacity: 0.15,
    liveOpacity: 0.33,
  },
};

function getWishAsset(type: WishType): ProductAsset {
  return assetRegistry[type] ?? assetRegistry.phone!;
}

export default function ReferenceWishHero(props: any) {
  const asset = getWishAsset(props.wishType);

  const progress = Math.min(props.currentAmount / props.targetAmount, 1);
  const isComplete = progress >= 1;

  return (
    <div className={`absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 ${asset.className}`}>
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
