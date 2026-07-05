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

type ProductShard = {
  id: string;
  clipPath: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  z: number;
};

type GenericWishType = Exclude<WishType, "macbook" | "phone">;

const productAssets: Record<"macbook" | "phone", { src: string; className: string }> = {
  macbook: {
    src: "/wish-assets/macbook/macbook-render.svg",
    className: "h-[340px] w-[397px]",
  },
  phone: {
    src: "/wish-assets/phone/phone-render.svg",
    className: "h-[430px] w-[210px]",
  },
};

const productShards: ProductShard[] = [
  { id: "top-left", clipPath: "polygon(9% 8%, 35% 5%, 42% 25%, 22% 35%, 8% 25%)", x: -140, y: -100, rotate: -24, scale: 0.92, z: 26 },
  { id: "top-screen", clipPath: "polygon(34% 6%, 62% 7%, 60% 28%, 42% 32%, 36% 22%)", x: -20, y: -136, rotate: 17, scale: 0.9, z: 30 },
  { id: "top-right", clipPath: "polygon(62% 7%, 91% 10%, 87% 36%, 64% 30%)", x: 140, y: -104, rotate: 24, scale: 0.9, z: 25 },
  { id: "left-screen", clipPath: "polygon(8% 24%, 28% 35%, 31% 58%, 9% 66%, 4% 45%)", x: -176, y: 18, rotate: -18, scale: 0.94, z: 29 },
  { id: "screen-core", clipPath: "polygon(28% 31%, 58% 28%, 64% 55%, 39% 63%, 30% 50%)", x: 16, y: -52, rotate: 12, scale: 0.96, z: 36 },
  { id: "screen-right", clipPath: "polygon(59% 30%, 88% 35%, 82% 63%, 63% 57%)", x: 164, y: 8, rotate: 19, scale: 0.92, z: 31 },
  { id: "hinge-left", clipPath: "polygon(17% 61%, 40% 58%, 44% 73%, 22% 78%, 8% 70%)", x: -142, y: 112, rotate: 21, scale: 0.9, z: 33 },
  { id: "keyboard-main", clipPath: "polygon(35% 59%, 66% 58%, 72% 78%, 41% 82%, 35% 72%)", x: 12, y: 128, rotate: -11, scale: 0.92, z: 38 },
  { id: "keyboard-right", clipPath: "polygon(66% 59%, 93% 66%, 87% 84%, 70% 79%)", x: 146, y: 140, rotate: -19, scale: 0.9, z: 32 },
  { id: "palm-left", clipPath: "polygon(10% 73%, 38% 80%, 36% 97%, 6% 91%)", x: -106, y: 206, rotate: -13, scale: 0.93, z: 34 },
  { id: "trackpad", clipPath: "polygon(38% 78%, 62% 77%, 61% 95%, 37% 96%)", x: 0, y: 212, rotate: 10, scale: 0.94, z: 40 },
  { id: "palm-right", clipPath: "polygon(61% 78%, 91% 83%, 97% 96%, 62% 96%)", x: 122, y: 202, rotate: 18, scale: 0.92, z: 35 },
  { id: "tiny-left", clipPath: "polygon(0% 50%, 12% 55%, 11% 78%, 0% 73%)", x: -210, y: 92, rotate: 29, scale: 0.78, z: 41 },
  { id: "tiny-right", clipPath: "polygon(88% 42%, 100% 50%, 97% 72%, 84% 63%)", x: 210, y: 86, rotate: -28, scale: 0.78, z: 42 },
  { id: "bottom-edge", clipPath: "polygon(19% 93%, 82% 92%, 96% 100%, 8% 100%)", x: 0, y: 258, rotate: -7, scale: 0.88, z: 44 },
];

function Sparkles() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.96)]"
          style={{ left: `${16 + i * 12}%`, top: `${23 + (i % 3) * 17}%` }}
          animate={{ opacity: [0.12, 0.95, 0.12], scale: [0.55, 1.55, 0.55] }}
          transition={{ duration: 2.2 + i * 0.18, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function LightTrails() {
  return (
    <svg className="pointer-events-none absolute left-1/2 top-[10%] -translate-x-1/2 opacity-60" width="360" height="250" viewBox="0 0 360 250" fill="none">
      <path d="M26 196C92 72 142 50 182 68C236 92 270 120 334 185" stroke="#bfdbfe" strokeWidth="1.8" />
      <path d="M12 218C90 65 151 30 206 52C258 74 298 113 346 174" stroke="#dbeafe" strokeWidth="1.1" />
      <path d="M60 206C122 116 178 96 238 130" stroke="#eff6ff" strokeWidth="2.2" opacity="0.75" />
    </svg>
  );
}

function SimpleWishArt({ type }: { type: GenericWishType }) {
  const config = {
    camera: { emoji: "📷", label: "相机", bg: "from-violet-100 to-blue-100" },
    travel: { emoji: "🧳", label: "旅行", bg: "from-teal-100 to-blue-100" },
    gift: { emoji: "🎁", label: "礼物", bg: "from-orange-100 to-pink-100" },
    home: { emoji: "🏠", label: "小家", bg: "from-emerald-100 to-lime-100" },
  }[type];

  return (
    <div className={`relative flex h-[300px] w-[300px] items-center justify-center rounded-[42px] bg-gradient-to-br ${config.bg} shadow-[0_28px_50px_rgba(15,23,42,0.12)]`}>
      <div className="absolute inset-6 rounded-[34px] bg-white/45 blur-sm" />
      <div className="relative text-[92px] drop-shadow-[0_20px_28px_rgba(15,23,42,0.16)]">{config.emoji}</div>
      <div className="absolute bottom-9 rounded-full bg-white/70 px-4 py-1 text-xs font-semibold text-stone-500 shadow-sm backdrop-blur">{config.label}心愿</div>
    </div>
  );
}

function AssetFragmentHero({
  type,
  progress,
  saveAnimation,
  warmUpNextPiece,
}: {
  type: "macbook" | "phone";
  progress: number;
  saveAnimation: ReferenceWishHeroProps["saveAnimation"];
  warmUpNextPiece: boolean;
}) {
  const asset = productAssets[type];
  const isPristine = progress <= 0;
  const isComplete = progress >= 1;
  const visualProgress = Math.min(1, progress * 2.15);
  const visibleCount = isPristine || isComplete ? 0 : Math.max(6, Math.ceil(visualProgress * productShards.length));
  const shownShards = productShards.slice(0, visibleCount);

  return (
    <div className={`absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 ${asset.className}`}>
      <motion.img
        src={asset.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        initial={false}
        animate={saveAnimation ? { scale: [1, 1.025, 1], rotate: [0, -0.6, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.58, ease: "easeOut" }}
        style={{
          opacity: isComplete ? 1 : isPristine ? 0.16 : 0.32,
          filter: isComplete ? "none" : isPristine ? "grayscale(0.75) saturate(0.6)" : "grayscale(0.12)",
        }}
      />

      {shownShards.map((shard, index) => {
        const finalPull = Math.min(0.78, visualProgress * 0.74);
        const targetX = shard.x * (1 - finalPull);
        const targetY = shard.y * (1 - finalPull);
        const targetRotate = shard.rotate * (1 - finalPull);
        const newest = saveAnimation?.mode === "unlock" && index >= Math.max(0, shownShards.length - 3);

        return (
          <motion.div
            key={shard.id}
            className="absolute inset-0"
            style={{ zIndex: shard.z, transformOrigin: "center" }}
            initial={newest ? { x: shard.x, y: shard.y, rotate: shard.rotate, scale: shard.scale, opacity: 0 } : false}
            animate={{ x: targetX, y: targetY, rotate: targetRotate, scale: 1, opacity: 1 }}
            transition={newest ? { duration: 0.74, ease: [0.34, 1.56, 0.64, 1] } : { duration: 0.5, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: shard.clipPath,
                background: "linear-gradient(145deg, rgba(71,85,105,0.98), rgba(248,250,252,0.92) 42%, rgba(15,23,42,0.98))",
                transform: "translate(7px, 8px)",
                filter: "drop-shadow(0 20px 28px rgba(15,23,42,0.24))",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath: shard.clipPath,
                backgroundImage: `url(${asset.src})`,
                backgroundSize: "100% 100%",
                filter: "drop-shadow(0 16px 24px rgba(15,23,42,0.22))",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath: shard.clipPath,
                background: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.10) 38%, transparent 62%)",
                mixBlendMode: "screen",
              }}
            />
            {newest && (
              <motion.div
                className="absolute inset-0"
                style={{ clipPath: shard.clipPath, background: "radial-gradient(circle, rgba(255,255,255,0.92), transparent 58%)", mixBlendMode: "screen" }}
                initial={{ opacity: 0.9, scale: 0.92 }}
                animate={{ opacity: 0, scale: 1.18 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            )}
          </motion.div>
        );
      })}

      {isPristine && (
        <motion.div className="absolute left-1/2 top-[48%] z-50 -translate-x-1/2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-stone-400 shadow-sm backdrop-blur" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          存第一笔，开始拼回心愿
        </motion.div>
      )}

      {warmUpNextPiece && !isComplete && (
        <motion.div className="pointer-events-none absolute left-1/2 top-[74%] z-50 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.95)]" initial={{ opacity: 0, y: 44 }} animate={{ opacity: [0, 1, 0], y: [44, -76, -164], scale: [0.45, 1.7, 0.3] }} transition={{ duration: 1.05, ease: "easeOut" }} />
      )}
    </div>
  );
}

function GenericHero({ type, progress, saveAnimation }: { type: GenericWishType; progress: number; saveAnimation: ReferenceWishHeroProps["saveAnimation"] }) {
  return (
    <div className="absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2">
      <motion.div initial={false} animate={saveAnimation ? { scale: [1, 1.035, 1] } : { scale: 1 }} transition={{ duration: 0.58, ease: "easeOut" }} style={{ opacity: progress <= 0 ? 0.55 : 0.78 + progress * 0.2 }}>
        <SimpleWishArt type={type} />
      </motion.div>
    </div>
  );
}

export default function ReferenceWishHero({ wishType, currentAmount, targetAmount, warmUpNextPiece = false, saveAnimation = null }: ReferenceWishHeroProps) {
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isComplete = progress >= 1;

  return (
    <section className="relative mt-4 h-[440px] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#fffdf8] via-[#f5f0e7] to-[#e7dfd1] shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.98),transparent_43%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[84%] h-8 w-64 -translate-x-1/2 rounded-full bg-black/12 blur-xl" />
      <Sparkles />
      <LightTrails />

      {wishType === "phone" || wishType === "macbook" ? (
        <AssetFragmentHero type={wishType} progress={progress} saveAnimation={saveAnimation} warmUpNextPiece={warmUpNextPiece} />
      ) : (
        <GenericHero type={wishType} progress={progress} saveAnimation={saveAnimation} />
      )}

      {saveAnimation && (
        <div key={saveAnimation.key} className="pointer-events-none absolute inset-0 z-40">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.span key={i} className="absolute left-1/2 top-[50%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(147,197,253,0.95)]" initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.6 }} animate={{ x: Math.cos((i / 8) * Math.PI * 2) * 118, y: Math.sin((i / 8) * Math.PI * 2) * 88, opacity: 0, scale: 1.4 }} transition={{ duration: 0.75, ease: "easeOut" }} />
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e7dfd1] to-transparent" />
      {isComplete && <div className="absolute right-5 top-5 z-50 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">已完成</div>}
    </section>
  );
}
