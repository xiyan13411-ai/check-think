import type { WishType } from "@/lib/wish-presets";

export type ProductAsset = {
  src: string;
  completeSrc?: string;
  fallbackSrcs?: string[];
  className: string;
  ghostOpacity: number;
  liveOpacity: number;
};

const HERO_ASSET_BASE =
  "https://cdn.jsdelivr.net/gh/xiyan13411-ai/check-think@master/public/wish-assets/generated";

const generated = (name: string) => `${HERO_ASSET_BASE}/${name}-hero.png`;

const productRegistry: Partial<Record<WishType, ProductAsset>> = {
  macbook: {
    src: generated("macbook"),
    fallbackSrcs: ["/wish-assets/macbook/macbook-render.svg"],
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.55,
    liveOpacity: 1,
  },
  phone: {
    src: generated("phone"),
    fallbackSrcs: ["/wish-assets/phone/phone-render.svg"],
    className: "h-[388px] w-[388px]",
    ghostOpacity: 0.55,
    liveOpacity: 1,
  },
  camera: {
    src: generated("camera"),
    className: "h-[382px] w-[382px]",
    ghostOpacity: 0.52,
    liveOpacity: 1,
  },
  travel: {
    src: generated("travel"),
    className: "h-[390px] w-[390px]",
    ghostOpacity: 0.52,
    liveOpacity: 1,
  },
  gift: {
    src: generated("gift"),
    className: "h-[360px] w-[360px]",
    ghostOpacity: 0.52,
    liveOpacity: 1,
  },
  home: {
    src: generated("home"),
    className: "h-[372px] w-[372px]",
    ghostOpacity: 0.52,
    liveOpacity: 1,
  },
  earphone: {
    src: generated("earphone"),
    className: "h-[370px] w-[370px]",
    ghostOpacity: 0.52,
    liveOpacity: 1,
  },
};

export function getWishAsset(type: WishType): ProductAsset {
  return productRegistry[type] ?? productRegistry.phone!;
}
