"use client";

import { motion } from "framer-motion";
import type { WishType } from "@/lib/wish-presets";

type ReferenceWishHeroProps = {
  wishType: WishType;
  currentAmount: number;
  targetAmount: number;
  warmUpNextPiece?: boolean;
  saveAnimation?: {
    key: number;
    mode: "warmup" | "unlock" | "complete";
    count: number;
  } | null;
};

type ProductAsset = {
  src: string;
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

type ProductShard = {
  id: string;
  clipPath: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  z: number;
};

const productAssets: Record<WishType, ProductAsset> = {
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
    src: "/wish-assets/generated/modern-earphone.webp",
    className: "h-[370px] w-[370px]",
    ghostOpacity: 0.15,
    liveOpacity: 0.33,
  },
};

const productShards: ProductShard[] = [
  { id: "upper-left", clipPath: "polygon(9% 9%, 34% 5%, 42% 24%, 22% 35%, 7% 27%)", x: -154, y: -106, rotate: -25, scale: 0.9, z: 28 },
  { id: "upper-core", clipPath: "polygon(33% 6%, 62% 6%, 61% 29%, 43% 34%, 36% 22%)", x: -18, y: -144, rotate: 16, scale: 0.9, z: 34 },
  { id: "upper-right", clipPath: "polygon(62% 8%, 91% 10%, 87% 36%, 64% 31%)", x: 150, y: -108, rotate: 24, scale: 0.9, z: 29 },
  { id: "left-mid", clipPath: "polygon(7% 26%, 30% 34%, 32% 58%, 9% 67%, 3% 46%)", x: -192, y: 18, rotate: -18, scale: 0.92, z: 30 },
  { id: "center-large", clipPath: "polygon(28% 31%, 58% 28%, 66% 56%, 39% 65%, 30% 50%)", x: 16, y: -56, rotate: 12, scale: 0.95, z: 40 },
  { id: "right-mid", clipPath: "polygon(59% 30%, 90% 35%, 83% 64%, 63% 58%)", x: 176, y: 8, rotate: 19, scale: 0.9, z: 32 },
  { id: "left-lower", clipPath: "polygon(17% 61%, 40% 58%, 45% 74%, 22% 80%, 8% 71%)", x: -150, y: 122, rotate: 21, scale: 0.9, z: 35 },
  { id: "center-lower", clipPath: "polygon(35% 58%, 66% 58%, 72% 78%, 41% 83%, 35% 72%)", x: 14, y: 138, rotate: -11, scale: 0.9, z: 42 },
  { id: "right-lower", clipPath: "polygon(66% 59%, 94% 66%, 88% 85%, 70% 80%)", x: 156, y: 148, rotate: -19, scale: 0.9, z: 33 },
  { id: "bottom-left", clipPath: "polygon(10% 73%, 38% 80%, 36% 97%, 6% 91%)", x: -112, y: 220, rotate: -13, scale: 0.92, z: 36 },
  { id: "bottom-core", clipPath: "polygon(38% 78%, 62% 77%, 61% 95%, 37% 96%)", x: 0, y: 226, rotate: 10, scale: 0.92, z: 44 },
  { id: "bottom-right", clipPath: "polygon(61% 78%, 91% 83%, 97% 96%, 62% 96%)", x: 130, y: 216, rotate: 18, scale: 0.9, z: 37 },
  { id: "tiny-left", clipPath: "polygon(0% 50%, 12% 55%, 11% 78%, 0% 73%)", x: -220, y: 94, rotate: 29, scale: 0.78, z: 46 },
  { id: "tiny-right", clipPath: "polygon(88% 42%, 100% 50%, 97% 72%, 84% 63%)", x: 220, y: 88, rotate: -28, scale: 0.78, z: 47 },
  { id: "thin-bottom", clipPath: "polygon(19% 93%, 82% 92%, 96% 100%, 8% 100%)", x: 0, y: 272, rotate: -7, scale: 0.86, z: 48 },
];

export default function ReferenceWishHero({ wishType, currentAmount, targetAmount, warmUpNextPiece = false, saveAnimation = null }: ReferenceWishHeroProps) {
  const asset = productAssets[wishType];
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isPristine = progress <= 0;
  const isComplete = progress >= 1;
  const visualProgress = Math.min(1, progress * 2.05);
  const visibleCount = isPristine || isComplete ? 0 : Math.max(5, Math.ceil(visualProgress * productShards.length));
  const shownShards = productShards.slice(0, visibleCount);

  return (
    <div className={`absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 ${asset.className}`}>
      <motion.img
        src={asset.src}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}
