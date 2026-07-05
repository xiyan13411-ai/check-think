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
