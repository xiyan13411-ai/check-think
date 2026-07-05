import type { WishType } from "@/lib/wish-presets";

export type ProductAsset = {
  src: string;
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

/**
 * Runtime registry used by the main Hero system.
 * Keep it partial + fallback based so adding wish types does not break builds.
 */
const productRegistry: Partial<Record<WishType, ProductAsset>> = {
  macbook: {
    src: "/wish-assets/generated/macbook-hero.webp",
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.14,
    liveOpacity: 0.36,
  },
  phone: {
    src: "/wish-assets/generated/phone-hero.webp",
    className: "h-[388px] w-[388px]",
    ghostOpacity: 0.14,
    liveOpacity: 0.36,
  },
  camera: {
    src: "/wish-assets/generated/camera-hero.webp",
    className: "h-[382px] w-[382px]",
    ghostOpacity: 0.14,
    liveOpacity: 0.35,
  },
  travel: {
    src: "/wish-assets/generated/travel-hero.webp",
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.14,
    liveOpacity: 0.36,
  },
  gift: {
    src: "/wish-assets/generated/gift-hero.webp",
    className: "h-[360px] w-[360px]",
    ghostOpacity: 0.15,
    liveOpacity: 0.38,
  },
  home: {
    src: "/wish-assets/generated/home-hero.webp",
    className: "h-[372px] w-[372px]",
    ghostOpacity: 0.14,
    liveOpacity: 0.35,
  },
  earphone: {
    src: "/wish-assets/generated/earphone-hero.svg",
    className: "h-[370px] w-[370px]",
    ghostOpacity: 0.14,
    liveOpacity: 0.35,
  },
};

export function getWishAsset(type: WishType): ProductAsset {
  return productRegistry[type] ?? productRegistry.phone!;
}

/**
 * Compatibility exports for legacy lab/experimental components.
 * These keep TypeScript checking green even though the app now uses ReferenceWishHero.
 */
export const phoneRenderAsset = {
  png: "/wish-assets/generated/phone-hero.webp",
  fallbackSvg: "/wish-assets/phone/phone-render.svg",
};

export type WishFragmentAsset = {
  id: string;
  unlockAt: number;
  fallbackPoints: string;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  targetRotate: number;
};

export const phoneWishAssets: { fragments: WishFragmentAsset[] } = {
  fragments: [
    { id: "lens", unlockAt: 0.04, fallbackPoints: "38,34 75,40 70,94 32,88", targetX: 0, targetY: 0, startX: -70, startY: -105, targetRotate: -16 },
    { id: "top", unlockAt: 0.09, fallbackPoints: "78,28 148,34 152,94 72,92", targetX: 0, targetY: 0, startX: 56, startY: -120, targetRotate: 14 },
    { id: "left-top", unlockAt: 0.14, fallbackPoints: "16,84 74,92 68,158 18,168", targetX: 0, targetY: 0, startX: -105, startY: -54, targetRotate: -22 },
    { id: "right-top", unlockAt: 0.2, fallbackPoints: "132,86 184,96 176,176 124,156", targetX: 0, targetY: 0, startX: 110, startY: -40, targetRotate: 24 },
    { id: "center-a", unlockAt: 0.28, fallbackPoints: "66,150 126,138 136,212 72,226", targetX: 0, targetY: 0, startX: -34, startY: 36, targetRotate: 10 },
    { id: "center-b", unlockAt: 0.36, fallbackPoints: "126,158 176,178 164,252 122,232", targetX: 0, targetY: 0, startX: 98, startY: 54, targetRotate: -18 },
    { id: "left-mid", unlockAt: 0.44, fallbackPoints: "20,170 72,226 64,286 16,270", targetX: 0, targetY: 0, startX: -128, startY: 72, targetRotate: 28 },
    { id: "lower-mid", unlockAt: 0.52, fallbackPoints: "66,226 122,232 130,310 58,318", targetX: 0, targetY: 0, startX: -18, startY: 122, targetRotate: -12 },
    { id: "right-mid", unlockAt: 0.6, fallbackPoints: "130,232 166,252 178,332 128,310", targetX: 0, targetY: 0, startX: 124, startY: 118, targetRotate: 20 },
    { id: "bottom-left", unlockAt: 0.68, fallbackPoints: "18,270 62,318 58,398 18,386", targetX: 0, targetY: 0, startX: -92, startY: 178, targetRotate: -18 },
    { id: "bottom-core", unlockAt: 0.76, fallbackPoints: "58,318 130,310 136,400 56,402", targetX: 0, targetY: 0, startX: 20, startY: 214, targetRotate: 9 },
    { id: "bottom-right", unlockAt: 0.84, fallbackPoints: "128,310 178,332 174,388 136,400", targetX: 0, targetY: 0, startX: 104, startY: 198, targetRotate: 22 },
    { id: "edge-left", unlockAt: 0.92, fallbackPoints: "14,92 22,386 14,386 12,96", targetX: 0, targetY: 0, startX: -154, startY: 8, targetRotate: -34 },
    { id: "edge-right", unlockAt: 1, fallbackPoints: "176,96 186,98 178,386 174,388", targetX: 0, targetY: 0, startX: 158, startY: 8, targetRotate: 34 },
  ],
};

export function getUnlockedFragmentIndices(progress: number, fragments: WishFragmentAsset[] = phoneWishAssets.fragments): number[] {
  return fragments
    .map((fragment, index) => (progress >= fragment.unlockAt ? index : -1))
    .filter((index) => index >= 0);
}
