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

const floatingShards = [
  { left: "6%", top: "54%", width: 50, height: 94, rotate: -26, delay: 0, clipPath: "polygon(34% 0%, 100% 18%, 72% 100%, 0% 72%)", dark: true },
  { left: "19%", top: "67%", width: 66, height: 74, rotate: 24, delay: 0.18, clipPath: "polygon(18% 0%, 100% 34%, 78% 92%, 0% 100%, 26% 48%)", dark: false },
  { left: "75%", top: "22%", width: 52, height: 76, rotate: 18, delay: 0.1, clipPath: "polygon(0% 12%, 82% 0%, 100% 74%, 28% 100%)", dark: false },
  { left: "82%", top: "58%", width: 54, height: 70, rotate: -17, delay: 0.26, clipPath: "polygon(28% 0%, 100% 34%, 74% 100%, 0% 78%)", dark: true },
  { left: "10%", top: "28%", width: 38, height: 58, rotate: 30, delay: 0.36, clipPath: "polygon(0% 20%, 72% 0%, 100% 82%, 24% 100%)", dark: false },
  { left: "58%", top: "72%", width: 44, height: 62, rotate: -9, delay: 0.44, clipPath: "polygon(18% 0%, 100% 26%, 80% 100%, 0% 74%)", dark: false },
];

const attachedShards = [
  { left: "43%", top: "25%", width: 70, height: 68, rotate: 16, delay: 0.02, clipPath: "polygon(18% 0%, 100% 16%, 82% 100%, 0% 72%)" },
  { left: "52%", top: "38%", width: 58, height: 78, rotate: -10, delay: 0.08, clipPath: "polygon(0% 24%, 86% 0%, 100% 76%, 26% 100%)" },
  { left: "40%", top: "54%", width: 74, height: 64, rotate: 9, delay: 0.12, clipPath: "polygon(16% 0%, 100% 30%, 72% 100%, 0% 78%)" },
  { left: "30%", top: "62%", width: 64, height: 50, rotate: -14, delay: 0.16, clipPath: "polygon(0% 18%, 86% 0%, 100% 70%, 22% 100%)" },
  { left: "60%", top: "62%", width: 54, height: 72, rotate: 18, delay: 0.2, clipPath: "polygon(20% 0%, 100% 32%, 76% 100%, 0% 68%)" },
];

const sideMaterial = "linear-gradient(145deg, rgba(148,163,184,0.98) 0%, rgba(241,245,249,0.82) 38%, rgba(51,65,85,0.94) 100%)";
const faceMaterial = "linear-gradient(135deg, #ffffff 0%, #e5e7eb 48%, #cbd5e1 100%)";
const darkMaterial = "linear-gradient(135deg, rgba(219,234,254,0.14), rgba(29,78,216,0.46) 48%, rgba(2,6,23,0.56))";
const shineMaterial = "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.12) 38%, transparent 62%)";

function MacbookArt() {
  return (
    <svg viewBox="0 0 320 300" className="h-full w-full drop-shadow-[0_28px_36px_rgba(15,23,42,0.20)]" fill="none">
      <defs>
        <linearGradient id="macScreen" x1="70" y1="45" x2="250" y2="188" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#020617" />
          <stop offset="0.38" stopColor="#1e3a8a" />
          <stop offset="0.62" stopColor="#9333ea" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="macBody" x1="48" y1="190" x2="286" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="0.46" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <path d="M78 44 H245 C257 44 266 53 266 65 V194 C266 207 257 215 245 215 H76 C64 215 56 207 56 194 V65 C56 53 65 44 78 44Z" fill="#111827" />
      <path d="M82 54 H240 C248 54 254 60 254 68 V187 C254 195 248 201 240 201 H82 C74 201 68 195 68 187 V68 C68 60 74 54 82 54Z" fill="url(#macScreen)" />
      <path d="M84 184 C128 104 172 78 238 62 C210 95 208 151 246 197 H86Z" fill="#ffffff" opacity="0.18" />
      <path d="M102 57 C150 68 177 105 198 196" stroke="#ffffff" strokeWidth="15" strokeLinecap="round" opacity="0.16" />
      <path d="M42 209 L278 209 L309 257 C311 262 306 268 296 268 H24 C14 268 10 262 13 257 L42 209Z" fill="url(#macBody)" />
      <path d="M58 219 H262 L278 247 H42Z" fill="#e5e7eb" opacity="0.95" />
      <rect x="130" y="234" width="61" height="18" rx="5" fill="#cbd5e1" stroke="#f8fafc" />
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 13 }).map((__, col) => (
          <rect key={`${row}-${col}`} x={62 + col * 15} y={219 + row * 5.5} width="10" height="3.2" rx="1" fill="#1f2937" opacity="0.72" />
        )),
      )}
      <path d="M18 257 H303 C296 269 282 275 260 275 H60 C38 275 25 269 18 257Z" fill="#64748b" opacity="0.32" />
    </svg>
  );
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 220 340" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.22)]" fill="none">
      <defs>
        <linearGradient id="phoneBody" x1="44" y1="20" x2="180" y2="322" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.48" stopColor="#e5e7eb" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <rect x="47" y="14" width="130" height="312" rx="34" fill="#64748b" />
      <rect x="51" y="18" width="122" height="304" rx="31" fill="url(#phoneBody)" />
      <path d="M134 28 C161 86 159 234 174 312 L174 18 H127Z" fill="#1d4ed8" opacity="0.16" />
      <rect x="67" y="39" width="62" height="80" rx="17" fill="#f8fafc" stroke="#cbd5e1" />
      {[ [84,58,13], [111,58,11], [96,88,11] ].map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill="#cbd5e1" />
          <circle cx={cx} cy={cy} r={r - 3} fill="#020617" />
          <circle cx={cx - 3} cy={cy - 4} r="2.4" fill="#ffffff" opacity="0.76" />
        </g>
      ))}
      <circle cx="117" cy="89" r="4" fill="#fbbf24" opacity="0.72" />
      <path d="M72 122 C116 153 125 245 145 306" stroke="#ffffff" strokeWidth="17" strokeLinecap="round" opacity="0.28" />
    </svg>
  );
}

function CameraArt() {
  return (
    <svg viewBox="0 0 320 260" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.22)]" fill="none">
      <rect x="58" y="79" width="206" height="132" rx="26" fill="#d1d5db" />
      <rect x="70" y="90" width="182" height="110" rx="20" fill="#f8fafc" />
      <path d="M98 80 L116 52 H176 L193 80Z" fill="#94a3b8" />
      <circle cx="160" cy="145" r="55" fill="#334155" />
      <circle cx="160" cy="145" r="42" fill="#020617" />
      <circle cx="160" cy="145" r="25" fill="#1d4ed8" opacity="0.45" />
      <circle cx="142" cy="126" r="8" fill="#ffffff" opacity="0.8" />
      <rect x="213" y="102" width="28" height="16" rx="5" fill="#fbbf24" opacity="0.8" />
      <rect x="78" y="104" width="34" height="18" rx="5" fill="#94a3b8" />
    </svg>
  );
}

function TravelArt() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.20)]" fill="none">
      <rect x="88" y="69" width="124" height="190" rx="28" fill="#14b8a6" />
      <rect x="101" y="82" width="98" height="164" rx="22" fill="#ccfbf1" opacity="0.95" />
      <path d="M119 70 V54 C119 42 130 33 150 33 C170 33 181 42 181 54 V70" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
      <path d="M126 94 V235" stroke="#0f766e" strokeWidth="8" opacity="0.42" />
      <path d="M174 94 V235" stroke="#0f766e" strokeWidth="8" opacity="0.42" />
      <circle cx="111" cy="264" r="8" fill="#475569" />
      <circle cx="189" cy="264" r="8" fill="#475569" />
      <path d="M118 135 C142 120 166 120 190 135" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

function GiftArt() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.22)]" fill="none">
      <rect x="63" y="116" width="174" height="130" rx="18" fill="#fb923c" />
      <rect x="51" y="92" width="198" height="48" rx="16" fill="#fed7aa" />
      <rect x="136" y="92" width="30" height="154" fill="#f97316" opacity="0.75" />
      <rect x="51" y="121" width="198" height="24" fill="#ffffff" opacity="0.22" />
      <path d="M147 90 C112 70 110 44 132 42 C151 40 158 63 150 90Z" fill="#fdba74" />
      <path d="M153 90 C188 70 190 44 168 42 C149 40 142 63 150 90Z" fill="#fdba74" />
      <path d="M82 164 C118 151 170 157 219 177" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}

function HomeArt() {
  return (
    <svg viewBox="0 0 320 300" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.20)]" fill="none">
      <path d="M55 151 L160 63 L266 151" fill="#22c55e" />
      <path d="M80 145 H240 V251 H80Z" fill="#dcfce7" />
      <path d="M109 173 H145 V251 H109Z" fill="#94a3b8" />
      <rect x="173" y="171" width="42" height="34" rx="6" fill="#60a5fa" opacity="0.72" />
      <path d="M64 151 L160 70 L256 151" stroke="#15803d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M91 221 C138 203 185 203 229 224" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

function WishObjectArt({ type }: { type: WishType }) {
  switch (type) {
    case "phone": return <PhoneArt />;
    case "camera": return <CameraArt />;
    case "travel": return <TravelArt />;
    case "gift": return <GiftArt />;
    case "home": return <HomeArt />;
    case "macbook":
    default: return <MacbookArt />;
  }
}

function FloatingShard({ shard, progress, index }: { shard: typeof floatingShards[number]; progress: number; index: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: shard.left, top: shard.top, width: shard.width, height: shard.height, transform: `rotate(${shard.rotate}deg)` }}
      animate={{ y: [0, -9, 0], opacity: [0.58, 0.95, 0.58] }}
      transition={{ duration: 4.4, repeat: Infinity, delay: shard.delay, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 shadow-[0_18px_34px_rgba(15,23,42,0.16)]" style={{ clipPath: shard.clipPath, background: sideMaterial, transform: "translate(6px, 7px)" }} />
      <div className="absolute inset-0 border border-white/70 shadow-[0_14px_28px_rgba(15,23,42,0.11)]" style={{ clipPath: shard.clipPath, background: faceMaterial }} />
      {shard.dark && <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: darkMaterial, mixBlendMode: "multiply" }} />}
      <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: shineMaterial, mixBlendMode: "screen" }} />
      {progress > index / floatingShards.length && (
        <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 62%)", mixBlendMode: "screen" }} />
      )}
    </motion.div>
  );
}

export default function ReferenceWishHero({ wishType, currentAmount, targetAmount, warmUpNextPiece = false, saveAnimation = null }: ReferenceWishHeroProps) {
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isComplete = progress >= 1;
  const unlockedAttachedCount = Math.min(attachedShards.length, Math.floor(progress * attachedShards.length * 1.55));

  return (
    <section className="relative mt-4 h-[430px] overflow-hidden rounded-[26px] bg-gradient-to-b from-[#faf7f0] via-[#f3efe6] to-[#e8e2d6] shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_27%,rgba(255,255,255,0.96),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/55 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[84%] h-8 w-64 -translate-x-1/2 rounded-full bg-black/12 blur-xl" />

      <svg className="pointer-events-none absolute left-1/2 top-[9%] -translate-x-1/2 opacity-40" width="340" height="236" viewBox="0 0 340 236" fill="none">
        <path d="M34 184 C88 82 132 52 170 64 C218 79 254 112 306 178" stroke="#bfdbfe" strokeWidth="1.5" />
        <path d="M18 204 C88 62 142 30 194 48 C242 66 280 108 322 166" stroke="#dbeafe" strokeWidth="0.9" />
        <path d="M62 196 C120 116 168 96 222 124" stroke="#eff6ff" strokeWidth="2" opacity="0.65" />
      </svg>

      {floatingShards.map((shard, index) => <FloatingShard key={index} shard={shard} progress={progress} index={index} />)}

      {warmUpNextPiece && !isComplete && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[76%] z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.9)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: [0, 1, 0], y: [40, -72, -154], scale: [0.45, 1.6, 0.3] }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      )}

      <div className="absolute left-1/2 top-[50%] h-[290px] w-[305px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="absolute inset-0"
          animate={saveAnimation ? { scale: [1, 1.025, 1] } : { scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{ opacity: isComplete ? 1 : 0.66 + progress * 0.22 }}
        >
          <WishObjectArt type={wishType} />
        </motion.div>

        {!isComplete && attachedShards.slice(0, unlockedAttachedCount).map((shard, index) => {
          const isNewest = saveAnimation?.mode === "unlock" && index >= Math.max(0, unlockedAttachedCount - 2);
          return (
            <motion.div
              key={`${shard.left}-${shard.top}`}
              className="absolute"
              style={{ left: shard.left, top: shard.top, width: shard.width, height: shard.height }}
              initial={isNewest ? { x: 120 - index * 35, y: -100 + index * 28, rotate: shard.rotate + 28, opacity: 0, scale: 0.78 } : false}
              animate={{ x: 0, y: 0, rotate: shard.rotate, opacity: 1, scale: 1 }}
              transition={isNewest ? { duration: 0.72, ease: [0.34, 1.56, 0.64, 1], delay: shard.delay } : { duration: 0.4 }}
            >
              <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: sideMaterial, transform: "translate(7px, 8px)", filter: "drop-shadow(0 20px 28px rgba(15,23,42,0.20))" }} />
              <div className="absolute inset-0 border border-white/70" style={{ clipPath: shard.clipPath, background: faceMaterial, filter: "drop-shadow(0 14px 22px rgba(15,23,42,0.18))" }} />
              <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: shineMaterial, mixBlendMode: "screen" }} />
              {isNewest && <motion.div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 60%)", mixBlendMode: "screen" }} initial={{ opacity: 0.8, scale: 0.92 }} animate={{ opacity: 0, scale: 1.18 }} transition={{ duration: 0.65 }} />}
            </motion.div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e8e2d6] to-transparent" />

      {isComplete && (
        <div className="absolute right-5 top-5 z-50 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">
          已完成
        </div>
      )}
    </section>
  );
}
