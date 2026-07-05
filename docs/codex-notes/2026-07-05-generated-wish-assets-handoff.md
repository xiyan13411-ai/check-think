# Generated Wish Asset Handoff

## Asset paths

Place six transparent WebP files here:

```txt
public/wish-assets/generated/macbook-hero.webp
public/wish-assets/generated/phone-hero.webp
public/wish-assets/generated/camera-hero.webp
public/wish-assets/generated/travel-hero.webp
public/wish-assets/generated/gift-hero.webp
public/wish-assets/generated/home-hero.webp
```

## Intended assets

```txt
macbook-hero.webp  - open silver laptop, purple-blue screen
phone-hero.webp    - silver phone pair, camera and screen
camera-hero.webp   - black mirrorless camera
travel-hero.webp   - navy hard-shell suitcase
gift-hero.webp     - rose-gold gift box
home-hero.webp     - warm small house
```

## ReferenceWishHero target

After the files exist, make every wish type use the same asset-shard renderer.

```ts
const productAssets: Record<WishType, { src: string; className: string }> = {
  macbook: { src: "/wish-assets/generated/macbook-hero.webp", className: "h-[320px] w-[380px]" },
  phone: { src: "/wish-assets/generated/phone-hero.webp", className: "h-[390px] w-[238px]" },
  camera: { src: "/wish-assets/generated/camera-hero.webp", className: "h-[305px] w-[370px]" },
  travel: { src: "/wish-assets/generated/travel-hero.webp", className: "h-[390px] w-[222px]" },
  gift: { src: "/wish-assets/generated/gift-hero.webp", className: "h-[330px] w-[305px]" },
  home: { src: "/wish-assets/generated/home-hero.webp", className: "h-[306px] w-[372px]" },
};
```

## Rules

1. Do not draw extra gray blocks on top of the product.
2. Shard fronts must use `backgroundImage: url(asset.src)` and `clipPath` from the same asset.
3. Side/thickness layers are allowed only behind clipped shards.
4. At `progress >= 1`, hide shard layers and show the full clean asset.
5. At `progress === 0`, show a faint desaturated full asset and an empty-state hint.
6. Bump `STORAGE_KEY` after landing the assets.
