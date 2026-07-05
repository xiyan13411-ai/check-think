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

type Shard = {
  left: string;
  top: string;
  width: number;
  height: number;
  rotate: number;
  delay: number;
  clipPath: string;
  dark?: boolean;
};

const floatingShards: Shard[] = [
  { left: "5%", top: "53%", width: 58, height: 100, rotate: -25, delay: 0, clipPath: "polygon(34% 0%, 100% 18%, 72% 100%, 0% 72%)", dark: true },
  { left: "17%", top: "68%", width: 76, height: 72, rotate: 23, delay: 0.18, clipPath: "polygon(18% 0%, 100% 34%, 78% 92%, 0% 100%, 26% 48%)" },
  { left: "72%", top: "20%", width: 60, height: 80, rotate: 18, delay: 0.1, clipPath: "polygon(0% 12%, 82% 0%, 100% 74%, 28% 100%)" },
  { left: "82%", top: "56%", width: 62, height: 78, rotate: -17, delay: 0.26, clipPath: "polygon(28% 0%, 100% 34%, 74% 100%, 0% 78%)", dark: true },
  { left: "10%", top: "29%", width: 42, height: 62, rotate: 30, delay: 0.36, clipPath: "polygon(0% 20%, 72% 0%, 100% 82%, 24% 100%)" },
  { left: "58%", top: "73%", width: 52, height: 68, rotate: -9, delay: 0.44, clipPath: "polygon(18% 0%, 100% 26%, 80% 100%, 0% 74%)" },
  { left: "87%", top: "34%", width: 36, height: 52, rotate: 32, delay: 0.52, clipPath: "polygon(30% 0%, 100% 42%, 74% 100%, 0% 62%)" },
];

const attachedShards: Shard[] = [
  { left: "44%", top: "24%", width: 74, height: 72, rotate: 14, delay: 0.02, clipPath: "polygon(18% 0%, 100% 16%, 82% 100%, 0% 72%)" },
  { left: "53%", top: "38%", width: 62, height: 82, rotate: -10, delay: 0.08, clipPath: "polygon(0% 24%, 86% 0%, 100% 76%, 26% 100%)" },
  { left: "40%", top: "54%", width: 78, height: 68, rotate: 9, delay: 0.12, clipPath: "polygon(16% 0%, 100% 30%, 72% 100%, 0% 78%)" },
  { left: "30%", top: "63%", width: 68, height: 54, rotate: -14, delay: 0.16, clipPath: "polygon(0% 18%, 86% 0%, 100% 70%, 22% 100%)" },
  { left: "61%", top: "62%", width: 58, height: 76, rotate: 18, delay: 0.2, clipPath: "polygon(20% 0%, 100% 32%, 76% 100%, 0% 68%)" },
];

const sideMaterial = "linear-gradient(145deg, rgba(71,85,105,0.98) 0%, rgba(248,250,252,0.9) 40%, rgba(15,23,42,0.98) 100%)";
const faceMaterial = "linear-gradient(135deg, #ffffff 0%, #eef2f7 42%, #cbd5e1 100%)";
const darkMaterial = "linear-gradient(135deg, rgba(219,234,254,0.16), rgba(29,78,216,0.52) 48%, rgba(2,6,23,0.66))";
const shineMaterial = "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.16) 36%, transparent 62%)";

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

function MacbookArt() {
  return (
    <svg viewBox="0 0 360 330" className="h-full w-full drop-shadow-[0_30px_40px_rgba(15,23,42,0.22)]" fill="none">
      <defs>
        <linearGradient id="macScreenV12" x1="78" y1="48" x2="286" y2="216" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#020617" />
          <stop offset="0.18" stopColor="#172554" />
          <stop offset="0.43" stopColor="#7c3aed" />
          <stop offset="0.7" stopColor="#ec4899" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="macMetalV12" x1="30" y1="210" x2="330" y2="292" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="0.42" stopColor="#d1d5db" />
          <stop offset="0.72" stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="macEdgeV12" x1="60" y1="42" x2="300" y2="226" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#475569" />
          <stop offset="0.35" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <ellipse cx="178" cy="284" rx="124" ry="18" fill="#020617" opacity="0.12" />
      <path d="M86 38 H274 C290 38 302 50 302 66 V204 C302 220 290 232 274 232 H84 C68 232 58 220 58 204 V66 C58 50 70 38 86 38Z" fill="url(#macEdgeV12)" />
      <path d="M91 50 H268 C279 50 288 59 288 71 V193 C288 205 279 214 267 214 H91 C79 214 70 205 70 193 V71 C70 59 79 50 91 50Z" fill="#030712" />
      <path d="M99 60 H260 C270 60 277 67 277 77 V185 C277 195 270 202 260 202 H99 C89 202 82 195 82 185 V77 C82 67 89 60 99 60Z" fill="url(#macScreenV12)" />
      <path d="M97 190 C136 111 185 76 260 64 C230 101 229 154 281 202 H98Z" fill="#ffffff" opacity="0.19" />
      <path d="M110 65 C166 75 203 118 228 199" stroke="#ffffff" strokeWidth="17" strokeLinecap="round" opacity="0.14" />
      <path d="M41 217 L300 217 L336 266 C341 273 335 281 322 281 H31 C18 281 13 273 18 266 L41 217Z" fill="url(#macMetalV12)" />
      <path d="M60 229 H283 L300 256 H43Z" fill="#e5e7eb" opacity="0.98" />
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 14 }).map((__, col) => (
          <rect key={`${row}-${col}`} x={65 + col * 15} y={229 + row * 5.7} width="10.4" height="3.4" rx="1" fill="#1f2937" opacity="0.78" />
        )),
      )}
      <rect x="143" y="244" width="68" height="20" rx="5" fill="#cbd5e1" stroke="#f8fafc" />
      <path d="M21 266 H333 C325 280 309 287 282 287 H72 C45 287 29 280 21 266Z" fill="#64748b" opacity="0.34" />
      <path d="M68 226 C130 208 226 212 293 235" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.38" />
    </svg>
  );
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 250 360" className="h-full w-full drop-shadow-[0_28px_40px_rgba(15,23,42,0.24)]" fill="none">
      <defs>
        <linearGradient id="phoneBodyV12" x1="50" y1="18" x2="198" y2="340" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffffff"/><stop offset="0.5" stopColor="#e5e7eb"/><stop offset="1" stopColor="#94a3b8"/></linearGradient>
        <linearGradient id="phoneBlueV12" x1="152" y1="30" x2="205" y2="330" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#bfdbfe" stopOpacity="0"/><stop offset="0.52" stopColor="#1d4ed8" stopOpacity="0.32"/><stop offset="1" stopColor="#020617" stopOpacity="0.38"/></linearGradient>
      </defs>
      <rect x="52" y="15" width="146" height="326" rx="38" fill="#64748b" />
      <rect x="57" y="20" width="136" height="316" rx="34" fill="url(#phoneBodyV12)" />
      <path d="M149 31 C178 94 176 245 193 326 L193 20 H139Z" fill="url(#phoneBlueV12)" />
      <rect x="74" y="42" width="70" height="88" rx="18" fill="#f8fafc" stroke="#cbd5e1" />
      {[[94,64,14], [124,64,12], [106,97,12]].map(([cx, cy, r]) => (<g key={`${cx}-${cy}`}><circle cx={cx} cy={cy} r={r} fill="#cbd5e1"/><circle cx={cx} cy={cy} r={r - 3} fill="#020617"/><circle cx={cx - 3} cy={cy - 4} r="2.5" fill="#ffffff" opacity="0.78"/></g>))}
      <circle cx="129" cy="98" r="4" fill="#fbbf24" opacity="0.72" />
      <path d="M78 132 C128 164 141 258 166 324" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" opacity="0.28" />
    </svg>
  );
}

function CameraArt() {
  return (
    <svg viewBox="0 0 320 270" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.22)]" fill="none">
      <rect x="55" y="82" width="210" height="136" rx="28" fill="#cbd5e1" />
      <rect x="69" y="94" width="182" height="110" rx="21" fill="#f8fafc" />
      <path d="M98 82 L118 52 H179 L197 82Z" fill="#94a3b8" />
      <circle cx="160" cy="151" r="56" fill="#334155"/><circle cx="160" cy="151" r="43" fill="#020617"/><circle cx="160" cy="151" r="26" fill="#1d4ed8" opacity="0.45"/><circle cx="142" cy="132" r="8" fill="#ffffff" opacity="0.8" />
      <rect x="214" y="106" width="28" height="16" rx="5" fill="#fbbf24" opacity="0.8"/><rect x="78" y="108" width="34" height="18" rx="5" fill="#94a3b8" />
    </svg>
  );
}

function TravelArt() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.20)]" fill="none">
      <rect x="88" y="69" width="124" height="190" rx="28" fill="#14b8a6"/><rect x="101" y="82" width="98" height="164" rx="22" fill="#ccfbf1" opacity="0.95"/><path d="M119 70 V54 C119 42 130 33 150 33 C170 33 181 42 181 54 V70" stroke="#64748b" strokeWidth="12" strokeLinecap="round"/><path d="M126 94 V235" stroke="#0f766e" strokeWidth="8" opacity="0.42"/><path d="M174 94 V235" stroke="#0f766e" strokeWidth="8" opacity="0.42"/><circle cx="111" cy="264" r="8" fill="#475569"/><circle cx="189" cy="264" r="8" fill="#475569"/><path d="M118 135 C142 120 166 120 190 135" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.45"/>
    </svg>
  );
}

function GiftArt() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.22)]" fill="none">
      <rect x="63" y="116" width="174" height="130" rx="18" fill="#fb923c"/><rect x="51" y="92" width="198" height="48" rx="16" fill="#fed7aa"/><rect x="136" y="92" width="30" height="154" fill="#f97316" opacity="0.75"/><rect x="51" y="121" width="198" height="24" fill="#ffffff" opacity="0.22"/><path d="M147 90 C112 70 110 44 132 42 C151 40 158 63 150 90Z" fill="#fdba74"/><path d="M153 90 C188 70 190 44 168 42 C149 40 142 63 150 90Z" fill="#fdba74"/><path d="M82 164 C118 151 170 157 219 177" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" opacity="0.25"/>
    </svg>
  );
}

function HomeArt() {
  return (
    <svg viewBox="0 0 320 300" className="h-full w-full drop-shadow-[0_26px_36px_rgba(15,23,42,0.20)]" fill="none">
      <path d="M55 151 L160 63 L266 151" fill="#22c55e"/><path d="M80 145 H240 V251 H80Z" fill="#dcfce7"/><path d="M109 173 H145 V251 H109Z" fill="#94a3b8"/><rect x="173" y="171" width="42" height="34" rx="6" fill="#60a5fa" opacity="0.72"/><path d="M64 151 L160 70 L256 151" stroke="#15803d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/><path d="M91 221 C138 203 185 203 229 224" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" opacity="0.45"/>
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

function FloatingShard({ shard, progress, index }: { shard: Shard; progress: number; index: number }) {
  return (
    <motion.div className="pointer-events-none absolute" style={{ left: shard.left, top: shard.top, width: shard.width, height: shard.height, transform: `rotate(${shard.rotate}deg)` }} animate={{ y: [0, -12, 0], opacity: [0.62, 0.98, 0.62] }} transition={{ duration: 4.4, repeat: Infinity, delay: shard.delay, ease: "easeInOut" }}>
      <div className="absolute inset-0 shadow-[0_18px_34px_rgba(15,23,42,0.16)]" style={{ clipPath: shard.clipPath, background: sideMaterial, transform: "translate(7px, 8px)" }} />
      <div className="absolute inset-0 border border-white/70 shadow-[0_14px_28px_rgba(15,23,42,0.11)]" style={{ clipPath: shard.clipPath, background: faceMaterial }} />
      {shard.dark && <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: darkMaterial, mixBlendMode: "multiply" }} />}
      <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: shineMaterial, mixBlendMode: "screen" }} />
      {progress > index / floatingShards.length && <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: "radial-gradient(circle, rgba(255,255,255,0.72), transparent 62%)", mixBlendMode: "screen" }} />}
    </motion.div>
  );
}

export default function ReferenceWishHero({ wishType, currentAmount, targetAmount, warmUpNextPiece = false, saveAnimation = null }: ReferenceWishHeroProps) {
  const progress = Math.min(currentAmount / targetAmount, 1);
  const isComplete = progress >= 1;
  const isPristine = currentAmount <= 0;
  const unlockedAttachedCount = Math.min(attachedShards.length, Math.floor(progress * attachedShards.length * 1.6));

  return (
    <section className="relative mt-4 h-[440px] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#fffdf8] via-[#f5f0e7] to-[#e7dfd1] shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.98),transparent_43%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[84%] h-8 w-64 -translate-x-1/2 rounded-full bg-black/12 blur-xl" />
      <Sparkles />

      <svg className="pointer-events-none absolute left-1/2 top-[10%] -translate-x-1/2 opacity-55" width="352" height="250" viewBox="0 0 352 250" fill="none">
        <path d="M30 192 C90 78 138 52 176 68 C228 90 264 118 324 184" stroke="#bfdbfe" strokeWidth="1.8" />
        <path d="M16 214 C90 66 150 30 202 50 C254 70 292 112 338 172" stroke="#dbeafe" strokeWidth="1.1" />
        <path d="M62 204 C122 118 174 96 232 128" stroke="#eff6ff" strokeWidth="2.2" opacity="0.75" />
      </svg>

      {floatingShards.map((shard, index) => <FloatingShard key={index} shard={shard} progress={progress} index={index} />)}

      {warmUpNextPiece && !isComplete && (
        <motion.div className="pointer-events-none absolute left-1/2 top-[78%] z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.95)]" initial={{ opacity: 0, y: 44 }} animate={{ opacity: [0, 1, 0], y: [44, -76, -164], scale: [0.45, 1.7, 0.3] }} transition={{ duration: 1.05, ease: "easeOut" }} />
      )}

      {saveAnimation && (
        <div key={saveAnimation.key} className="pointer-events-none absolute inset-0 z-40">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.span key={i} className="absolute left-1/2 top-[50%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(147,197,253,0.95)]" initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.6 }} animate={{ x: Math.cos((i / 8) * Math.PI * 2) * 118, y: Math.sin((i / 8) * Math.PI * 2) * 88, opacity: 0, scale: 1.4 }} transition={{ duration: 0.75, ease: "easeOut" }} />
          ))}
        </div>
      )}

      <div className="absolute left-1/2 top-[50%] h-[304px] w-[322px] -translate-x-1/2 -translate-y-1/2">
        <motion.div className="absolute inset-0" initial={false} animate={saveAnimation ? { scale: [1, 1.035, 1], rotate: [0, -0.8, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 0.58, ease: "easeOut" }} style={{ opacity: isComplete ? 1 : isPristine ? 0.46 : 0.6 + progress * 0.25, filter: isPristine ? "grayscale(0.55) saturate(0.72)" : "none" }}>
          <WishObjectArt type={wishType} />
        </motion.div>

        {isPristine && (
          <motion.div className="absolute left-1/2 top-[48%] z-30 -translate-x-1/2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-stone-400 shadow-sm backdrop-blur" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            存第一笔，开始拼回心愿
          </motion.div>
        )}

        {!isComplete && attachedShards.slice(0, unlockedAttachedCount).map((shard, index) => {
          const isNewest = saveAnimation?.mode === "unlock" && index >= Math.max(0, unlockedAttachedCount - 2);
          return (
            <motion.div key={`${shard.left}-${shard.top}`} className="absolute" style={{ left: shard.left, top: shard.top, width: shard.width, height: shard.height }} initial={isNewest ? { x: 124 - index * 34, y: -104 + index * 30, rotate: shard.rotate + 32, opacity: 0, scale: 0.78 } : false} animate={{ x: 0, y: 0, rotate: shard.rotate, opacity: 1, scale: 1 }} transition={isNewest ? { duration: 0.72, ease: [0.34, 1.56, 0.64, 1], delay: shard.delay } : { duration: 0.4 }}>
              <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: sideMaterial, transform: "translate(7px, 8px)", filter: "drop-shadow(0 20px 28px rgba(15,23,42,0.20))" }} />
              <div className="absolute inset-0 border border-white/70" style={{ clipPath: shard.clipPath, background: faceMaterial, filter: "drop-shadow(0 14px 22px rgba(15,23,42,0.18))" }} />
              <div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: shineMaterial, mixBlendMode: "screen" }} />
              {isNewest && <motion.div className="absolute inset-0" style={{ clipPath: shard.clipPath, background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 60%)", mixBlendMode: "screen" }} initial={{ opacity: 0.85, scale: 0.92 }} animate={{ opacity: 0, scale: 1.18 }} transition={{ duration: 0.65 }} />}
            </motion.div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e7dfd1] to-transparent" />
      {isComplete && <div className="absolute right-5 top-5 z-50 flex h-9 min-w-[4rem] items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 px-3 text-xs font-bold text-white shadow-md">已完成</div>}
    </section>
  );
}
