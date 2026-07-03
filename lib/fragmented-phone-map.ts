 // ── Fragmented Phone Map ──
 // 20 irregular shards that tile the phone body.
 // Each shard is a clip-path polygon (percentages) that shows a portion
 // of the phone image. Together they form the complete phone.
 //
 // "startX/Y" = floating position when locked (outside phone)
 // "unlockAt" = progress threshold (0-1) when this shard flies into place
 
 export type PhoneShard = {
   id: string;
   /** CSS `clipPath: polygon(...)` value using % coordinates */
   clipPath: string;
   /** External floating offset from center (px) when locked */
   startX: number;
   startY: number;
   /** External rotation when locked */
   startRotate: number;
   startScale: number;
   zIndex: number;
   /** Progress threshold 0-1 at which this shard unlocks and flies to target */
   unlockAt: number;
 };
 
 // ── Grid + perturbations → 20 irregular polygons ──
 
 const COLS = [8, 28, 50, 72, 92];
 const ROWS = [6, 24, 42, 60, 78, 94];
 
 // Fixed perturbations for each cell [r][c] → [tlD,tlD, trD,trD, brD,brD, blD,blD] (%,% each)
 const PERTS: number[][][] = [
   // Row 0
   [[-2,0, 2,-1, 1,3, -1,2],  [-1,-1, 2,1, -1,2, 1,2],  [-2,1, 2,-2, 2,2, -1,3],  [1,-1, -2,1, -1,2, 2,1]],
   // Row 1
   [[-1,2, 3,-1, 2,0, -2,2],  [2,-2, -1,2, 1,1, 2,-1],  [1,2, -2,-1, 3,1, -1,2],  [-2,-1, 1,2, -1,3, 2,-2]],
   // Row 2
   [[2,-1, -2,2, 1,1, -1,-2], [-1,-1, 2,2, -2,1, 1,-2], [1,-2, -1,1, 2,-1, -2,2], [2,2, -1,-1, 1,-2, -2,1]],
   // Row 3
   [[-1,1, 2,-2, -2,2, 1,-1], [2,-1, -2,-2, 1,2, -1,1], [-2,2, 1,-1, -1,-2, 2,1], [1,-2, -2,1, 2,-1, -1,2]],
   // Row 4
   [[2,-1, -2,1, 1,-2, -1,2], [1,2, -1,-2, 2,-1, -2,1], [-2,2, 1,-1, -1,1, 2,-2], [-1,2, 2,-2, -2,1, 1,-1]],
 ];
 
 function clamp(v: number): number {
   return Math.max(0, Math.min(100, v));
 }
 
 function genPoly(r: number, c: number, p: number[]): string {
   const cl = COLS[c], cr = COLS[c + 1];
   const rt = ROWS[r], rb = ROWS[r + 1];
   return `polygon(${clamp(cl + p[0])}% ${clamp(rt + p[1])}%, ${clamp(cr + p[2])}% ${clamp(rt + p[3])}%, ${clamp(cr + p[4])}% ${clamp(rb + p[5])}%, ${clamp(cl + p[6])}% ${clamp(rb + p[7])}%)`;
 }
 
 // ── Build 20 shards ──
 
 const TOTAL = 20;
 const STEP = 0.95 / TOTAL; // unlockAt increments
 
 const RAW_SHARDS: { r: number; c: number; id: string; clip: string; startX: number; startY: number; rotate: number; scale: number; z: number; at: number }[] = [];
 
 let idx = 0;
 for (let r = 0; r < 5; r++) {
   for (let c = 0; c < 4; c++) {
     // External floating position — fan out around the phone
     const angle = (idx / TOTAL) * Math.PI * 2;
     const dist = 100 + (c % 3) * 20;
     const sx = Math.cos(angle) * dist;
     const sy = Math.sin(angle) * dist;
     const rot = ((idx * 17 + c * 7) % 37 - 18);
 
     RAW_SHARDS.push({
       r, c,
       id: `shard-${String(idx).padStart(2, "0")}`,
       clip: genPoly(r, c, PERTS[r][c]),
       startX: Math.round(sx),
       startY: Math.round(sy),
       rotate: rot,
       scale: 0.92 + (c % 3) * 0.03,
       z: 10 + Math.floor(idx / 5),
       at: Math.min(STEP * (idx + 1), 1),
     });
     idx++;
   }
 }
 
 export const phoneShards: PhoneShard[] = RAW_SHARDS.map((s) => ({
   id: s.id,
   clipPath: s.clip,
   startX: s.startX,
   startY: s.startY,
   startRotate: s.rotate,
   startScale: s.scale,
   zIndex: s.z,
   unlockAt: s.at,
 }));
 
 export const SHARD_COUNT = phoneShards.length; // 20
 
 /** Returns indices of unlocked shards for a given progress 0–1 */
 export function getUnlockedShardIndices(progress: number): number[] {
   return phoneShards
     .map((s, i) => ({ i, s }))
     .filter(({ s }) => progress >= s.unlockAt)
     .map(({ i }) => i);
 }
