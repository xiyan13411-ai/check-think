// ── Fragmented Phone Map (V11 - handcrafted product-shard layout) ──
// Organic polygons replace the earlier grid-derived shards. The order is deliberate:
// camera/upper body first, then center shell, then lower shell and edge fragments.
export type PhoneShard = {
  id: string;
  clipPath: string;
  startX: number;
  startY: number;
  startRotate: number;
  startScale: number;
  zIndex: number;
  unlockAt: number;
};

type RawShard = Omit<PhoneShard, "clipPath" | "unlockAt"> & {
  clip: string;
};

const rawShards: RawShard[] = [
  {
    id: "camera-island",
    clip: "polygon(12% 6%, 46% 4%, 52% 23%, 34% 31%, 14% 25%)",
    startX: -118,
    startY: -154,
    startRotate: -28,
    startScale: 0.92,
    zIndex: 34,
  },
  {
    id: "upper-glass",
    clip: "polygon(42% 5%, 69% 10%, 63% 31%, 46% 27%, 35% 20%)",
    startX: 2,
    startY: -178,
    startRotate: 16,
    startScale: 0.9,
    zIndex: 31,
  },
  {
    id: "upper-right-rim",
    clip: "polygon(65% 8%, 89% 7%, 93% 33%, 69% 35%, 61% 28%)",
    startX: 126,
    startY: -124,
    startRotate: 24,
    startScale: 0.88,
    zIndex: 29,
  },
  {
    id: "camera-left-break",
    clip: "polygon(11% 24%, 33% 28%, 40% 48%, 18% 55%, 8% 40%)",
    startX: -154,
    startY: -52,
    startRotate: -18,
    startScale: 0.94,
    zIndex: 33,
  },
  {
    id: "camera-core-break",
    clip: "polygon(31% 27%, 57% 24%, 62% 49%, 40% 55%, 35% 41%)",
    startX: -46,
    startY: -132,
    startRotate: 22,
    startScale: 0.9,
    zIndex: 35,
  },
  {
    id: "upper-right-shell",
    clip: "polygon(57% 30%, 92% 31%, 84% 56%, 61% 51%, 52% 43%)",
    startX: 150,
    startY: -36,
    startRotate: 14,
    startScale: 0.93,
    zIndex: 30,
  },
  {
    id: "middle-left-plate",
    clip: "polygon(18% 52%, 41% 48%, 51% 72%, 25% 77%, 10% 62%)",
    startX: -166,
    startY: 26,
    startRotate: -24,
    startScale: 0.9,
    zIndex: 27,
  },
  {
    id: "middle-main-plate",
    clip: "polygon(40% 51%, 64% 48%, 72% 72%, 53% 81%, 48% 70%)",
    startX: 24,
    startY: -118,
    startRotate: 17,
    startScale: 0.93,
    zIndex: 32,
  },
  {
    id: "middle-right-blue",
    clip: "polygon(64% 50%, 91% 54%, 88% 78%, 72% 74%, 65% 63%)",
    startX: 162,
    startY: 70,
    startRotate: 26,
    startScale: 0.9,
    zIndex: 28,
  },
  {
    id: "lower-left-rim",
    clip: "polygon(11% 63%, 25% 76%, 32% 94%, 8% 91%, 7% 76%)",
    startX: -138,
    startY: 130,
    startRotate: 16,
    startScale: 0.91,
    zIndex: 25,
  },
  {
    id: "lower-main-plate",
    clip: "polygon(25% 74%, 54% 79%, 52% 96%, 28% 95%, 18% 86%)",
    startX: -44,
    startY: 184,
    startRotate: -13,
    startScale: 0.92,
    zIndex: 26,
  },
  {
    id: "lower-right-shell",
    clip: "polygon(52% 78%, 89% 77%, 93% 96%, 52% 96%, 47% 88%)",
    startX: 94,
    startY: 174,
    startRotate: 19,
    startScale: 0.9,
    zIndex: 24,
  },
  {
    id: "top-edge-splinter",
    clip: "polygon(22% 2%, 57% 0%, 48% 9%, 25% 11%)",
    startX: -86,
    startY: -214,
    startRotate: 31,
    startScale: 0.82,
    zIndex: 38,
  },
  {
    id: "right-edge-splinter",
    clip: "polygon(87% 19%, 96% 29%, 94% 55%, 84% 50%)",
    startX: 192,
    startY: -18,
    startRotate: -16,
    startScale: 0.86,
    zIndex: 36,
  },
  {
    id: "left-edge-splinter",
    clip: "polygon(5% 32%, 16% 43%, 13% 68%, 4% 61%)",
    startX: -190,
    startY: 72,
    startRotate: 28,
    startScale: 0.86,
    zIndex: 37,
  },
  {
    id: "bottom-rim-splinter",
    clip: "polygon(23% 94%, 76% 93%, 87% 99%, 18% 100%)",
    startX: 0,
    startY: 236,
    startRotate: -9,
    startScale: 0.9,
    zIndex: 39,
  },
  {
    id: "center-crack-small-a",
    clip: "polygon(50% 30%, 63% 35%, 57% 49%, 46% 43%)",
    startX: 72,
    startY: -86,
    startRotate: -31,
    startScale: 0.78,
    zIndex: 41,
  },
  {
    id: "center-crack-small-b",
    clip: "polygon(31% 54%, 45% 58%, 41% 72%, 24% 68%)",
    startX: -96,
    startY: 18,
    startRotate: 34,
    startScale: 0.8,
    zIndex: 42,
  },
  {
    id: "blue-glass-small",
    clip: "polygon(67% 65%, 84% 68%, 78% 83%, 63% 78%)",
    startX: 146,
    startY: 118,
    startRotate: -29,
    startScale: 0.8,
    zIndex: 43,
  },
  {
    id: "bottom-corner-small",
    clip: "polygon(9% 85%, 26% 91%, 18% 99%, 6% 95%)",
    startX: -132,
    startY: 216,
    startRotate: 26,
    startScale: 0.82,
    zIndex: 44,
  },
  {
    id: "camera-glint-small",
    clip: "polygon(37% 11%, 50% 13%, 47% 23%, 34% 22%)",
    startX: -18,
    startY: -214,
    startRotate: -20,
    startScale: 0.76,
    zIndex: 45,
  },
  {
    id: "right-bottom-small",
    clip: "polygon(80% 81%, 96% 86%, 92% 99%, 76% 94%)",
    startX: 188,
    startY: 192,
    startRotate: 21,
    startScale: 0.82,
    zIndex: 46,
  },
];

const TOTAL = rawShards.length;

export const phoneShards: PhoneShard[] = rawShards.map((shard, index) => ({
  id: shard.id,
  clipPath: shard.clip,
  startX: shard.startX,
  startY: shard.startY,
  startRotate: shard.startRotate,
  startScale: shard.startScale,
  zIndex: shard.zIndex,
  unlockAt: Math.min((index + 1) / TOTAL, 1),
}));

export const SHARD_COUNT = phoneShards.length;

export function getUnlockedShardIndices(progress: number): number[] {
  const safeProgress = Math.max(0, Math.min(progress, 1));
  return phoneShards
    .map((shard, i) => ({ i, shard }))
    .filter(({ shard }) => safeProgress >= shard.unlockAt)
    .map(({ i }) => i);
}
