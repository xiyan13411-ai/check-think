import type { WishType } from "@/lib/wish-presets";

export type ProductAsset = {
  src: string;
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

const productRegistry: Partial<Record<WishType, ProductAsset>> = {
  macbook: {
    src: "/wish-assets/generated/macbook-hero.png",
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.18,
    liveOpacity: 0.86,
  },
  phone: {
    src: "/wish-assets/generated/phone-hero.png",
    className: "h-[388px] w-[388px]",
    ghostOpacity: 0.18,
    liveOpacity: 0.86,
  },
  camera: {
    src: "/wish-assets/generated/camera-hero.webp",
    className: "h-[382px] w-[382px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.82,
  },
  travel: {
    src: "/wish-assets/generated/travel-hero.webp",
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.82,
  },
  gift: {
    src: "/wish-assets/generated/gift-hero.webp",
    className: "h-[360px] w-[360px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.84,
  },
  home: {
    src: "/wish-assets/generated/home-hero.webp",
    className: "h-[372px] w-[372px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.82,
  },
  earphone: {
    src: "/wish-assets/generated/earphone-hero.webp",
    className: "h-[370px] w-[370px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.82,
  },
};

export function getWishAsset(type: WishType): ProductAsset {
  return productRegistry[type] ?? productRegistry.phone!;
}
