import type { WishType } from "@/lib/wish-presets";

export type ProductAsset = {
  src: string;
  completeSrc?: string;
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

const version = "png3";
const generated = (name: string) => `/wish-assets/generated/${name}-hero.png?v=${version}`;

const productRegistry: Partial<Record<WishType, ProductAsset>> = {
  macbook: {
    src: generated("macbook"),
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.18,
    liveOpacity: 0.9,
  },
  phone: {
    src: generated("phone"),
    className: "h-[388px] w-[388px]",
    ghostOpacity: 0.18,
    liveOpacity: 0.9,
  },
  camera: {
    src: generated("camera"),
    className: "h-[382px] w-[382px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.86,
  },
  travel: {
    src: generated("travel"),
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.86,
  },
  gift: {
    src: generated("gift"),
    className: "h-[360px] w-[360px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.88,
  },
  home: {
    src: generated("home"),
    className: "h-[372px] w-[372px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.86,
  },
  earphone: {
    src: generated("earphone"),
    className: "h-[370px] w-[370px]",
    ghostOpacity: 0.16,
    liveOpacity: 0.86,
  },
};

export function getWishAsset(type: WishType): ProductAsset {
  return productRegistry[type] ?? productRegistry.phone!;
}
