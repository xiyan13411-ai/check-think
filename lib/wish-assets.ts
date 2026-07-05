import type { WishType } from "@/lib/wish-presets";

export type ProductAsset = {
  src: string;
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

const productRegistry: Partial<Record<WishType, ProductAsset>> = {
  macbook: {
    src: "/wish-assets/macbook/macbook-render.svg",
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.18,
    liveOpacity: 0.5,
  },
  phone: {
    src: "/wish-assets/phone/phone-render.svg",
    className: "h-[388px] w-[388px]",
    ghostOpacity: 0.18,
    liveOpacity: 0.5,
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
    src: "/wish-assets/generated/earphone-hero.webp",
    className: "h-[370px] w-[370px]",
    ghostOpacity: 0.14,
    liveOpacity: 0.35,
  },
};

export function getWishAsset(type: WishType): ProductAsset {
  return productRegistry[type] ?? productRegistry.phone!;
}
