// ── Fragmented Phone Map (V8 - reference-style irregular shards) ──
// 20 irregular shards generated from a grid with aggressive perturbations.
// Perturbations range from -9% to +9% to break grid visual completely.
export type PhoneShard = {
  id: string; clipPath: string; startX: number; startY: number;
  startRotate: number; startScale: number; zIndex: number; unlockAt: number;
};

const COLS = [8, 30, 50, 72, 92];
const ROWS = [5, 27, 48, 72, 95];

// Aggressive perturbations [tlX,tlY, trX,trY, brX,brY, blX,blY] (%)
const P: number[][][] = [
  [[-4,-2,7,-3, -6,8,5,2],  [8,-5,-7,4, 6,-8,-5,6],  [-6,3,9,-7, -8,5,4,-5], [5,-6,-4,7, 8,-3,-7,4]],
  [[7,5,-8,-6, 4,9,-5,-7],  [-5,8,6,-4, -7,5,9,-8],  [4,-7,-5,8, 6,-6,-8,9], [-8,4,7,-5, -4,8,5,-6]],
  [[-7,8,5,-9, -5,7,8,-4],  [9,-5,-8,6, 7,-4,-6,5],  [-5,-8,9,7, -4,5,-7,-9], [6,9,-5,-8, 8,-5,-9,7]],
  [[-8,-5,7,9, -6,-7,5,8],  [5,7,-9,-5, -8,6,7,-9],  [9,6,-7,-8, 5,9,-5,-7], [-7,-9,8,5, -5,-8,9,6]],
  [[-6,7,5,-9, 8,-5,-7,9],  [9,-8,-5,7, -9,6,8,-7],  [5,-9,-7,8, -6,7,9,-5], [-5,6,-8,-7, 9,-5,-8,7]],
];

function clamp(v: number) { return Math.max(0, Math.min(100, v)); }
function genPoly(r: number, c: number, p: number[]): string {
  const cl = COLS[c], cr = COLS[c+1], rt = ROWS[r], rb = ROWS[r+1];
  return `polygon(${clamp(cl+p[0])}% ${clamp(rt+p[1])}%, ${clamp(cr+p[2])}% ${clamp(rt+p[3])}%, ${clamp(cr+p[4])}% ${clamp(rb+p[5])}%, ${clamp(cl+p[6])}% ${clamp(rb+p[7])}%)`;
}

const TOTAL = 20, STEP = 0.95 / TOTAL;
const raw: any[] = [];
let idx = 0;
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 4; c++) {
    const angle = (idx / TOTAL) * Math.PI * 2;
    const d = 90 + (c % 3) * 25;
    raw.push({
      id: `s${String(idx).padStart(2,"0")}`,
      clip: genPoly(r, c, P[r][c]),
      sx: Math.round(Math.cos(angle) * d),
      sy: Math.round(Math.sin(angle) * d),
      rot: ((idx * 17 + c * 7) % 37 - 18),
      scale: 0.88 + (c % 3) * 0.04,
      z: 10 + Math.floor(idx / 5),
      at: Math.min(STEP * (idx + 1), 1),
    });
    idx++;
  }
}

export const phoneShards: PhoneShard[] = raw.map((s: any) => ({
  id: s.id, clipPath: s.clip,
  startX: s.sx, startY: s.sy,
  startRotate: s.rot, startScale: s.scale,
  zIndex: s.z, unlockAt: s.at,
}));

export const SHARD_COUNT = phoneShards.length;
export function getUnlockedShardIndices(progress: number): number[] {
  return phoneShards.map((s, i) => ({ i, s })).filter(({ s }) => progress >= s.unlockAt).map(({ i }) => i);
}