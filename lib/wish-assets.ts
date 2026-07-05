export type WishType =
  | "phone"
  | "macbook"
  | "camera"
  | "travel"
  | "gift"
  | "home"
  | "earphone";

export type ProductAsset = {
  src: string;
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

/**
 * Simple runtime registry used by main Hero system (all products)
 */
const productRegistry: Partial<Record<WishType, ProductAsset>> = {
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

export function getWishAsset(type: WishType): ProductAsset {
  return productRegistry[type] ?? productRegistry.phone!;
}

/**
 * Experimental: phone fragment-based system (used for future upgrade)
 * Keeps current advanced decomposition system isolated
 */
export * from "./wish-phone-fragments";
