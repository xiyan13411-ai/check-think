 export type WishFragmentAsset = {
   id: string;
   /** Image source path (e.g. /wish-assets/phone/fragments/fragment-01.png) */
   src: string;
   /** SVG polygon points for fallback rendering (viewBox 0 0 200 420) */
   fallbackPoints: string;
   /** Target offset from phone center (x, in viewBox units) when assembled */
   targetX: number;
   targetY: number;
   /** Starting offset from phone center (x) for fly-in animation */
   startX: number;
   startY: number;
   /** Rotation at target (degrees) */
   targetRotate: number;
   /** Progress threshold (0–1) at which this fragment unlocks */
   unlockAt: number;
   /** Fragment width hint (px in viewBox units) */
   width: number;
   height: number;
 };
 
 export type WishPhoneAssets = {
   baseSrc: string;
   completeSrc: string;
   fragments: WishFragmentAsset[];
 };
 
 const UNLOCK_STEP = 1 / 14;
 
 export const phoneWishAssets: WishPhoneAssets = {
   baseSrc: "/wish-assets/phone/phone-base.png",
   completeSrc: "/wish-assets/phone/phone-complete.png",
   fragments: [
     {
       id: "shard-00",
       src: "/wish-assets/phone/fragments/fragment-01.png",
       fallbackPoints: "15,15 55,15 50,60 35,50 15,55",
       targetX: -65, targetY: -168,
       startX: -160, startY: -200,
       targetRotate: -8,
       unlockAt: UNLOCK_STEP,
       width: 45, height: 50,
     },
     {
       id: "shard-01",
       src: "/wish-assets/phone/fragments/fragment-02.png",
       fallbackPoints: "55,15 95,15 90,65 70,60 50,60",
       targetX: -28, targetY: -165,
       startX: -40, startY: -210,
       targetRotate: 5,
       unlockAt: UNLOCK_STEP * 2,
       width: 45, height: 50,
     },
     {
       id: "shard-02",
       src: "/wish-assets/phone/fragments/fragment-03.png",
       fallbackPoints: "95,15 140,15 135,55 110,65 90,65",
       targetX: 15, targetY: -165,
       startX: 80, startY: -200,
       targetRotate: -3,
       unlockAt: UNLOCK_STEP * 3,
       width: 50, height: 50,
     },
     {
       id: "shard-03",
       src: "/wish-assets/phone/fragments/fragment-04.png",
       fallbackPoints: "140,15 185,15 185,60 165,70 135,55",
       targetX: 60, targetY: -163,
       startX: 180, startY: -60,
       targetRotate: 10,
       unlockAt: UNLOCK_STEP * 4,
       width: 50, height: 55,
     },
     {
       id: "shard-04",
       src: "/wish-assets/phone/fragments/fragment-05.png",
       fallbackPoints: "15,55 35,50 50,60 70,60 75,115 55,120 35,110 15,115",
       targetX: -55, targetY: -120,
       startX: -180, startY: -80,
       targetRotate: -12,
       unlockAt: UNLOCK_STEP * 5,
       width: 60, height: 65,
     },
     {
       id: "shard-05",
       src: "/wish-assets/phone/fragments/fragment-06.png",
       fallbackPoints: "50,60 70,60 90,65 110,65 115,110 95,120 75,115",
       targetX: -18, targetY: -115,
       startX: 0, startY: -220,
       targetRotate: 6,
       unlockAt: UNLOCK_STEP * 6,
       width: 65, height: 60,
     },
     {
       id: "shard-06",
       src: "/wish-assets/phone/fragments/fragment-07.png",
       fallbackPoints: "110,65 135,55 165,70 185,60 185,120 170,125 145,120 115,110",
       targetX: 47, targetY: -110,
       startX: 190, startY: 20,
       targetRotate: -7,
       unlockAt: UNLOCK_STEP * 7,
       width: 75, height: 65,
     },
     {
       id: "shard-07",
       src: "/wish-assets/phone/fragments/fragment-08.png",
       fallbackPoints: "15,115 35,110 55,120 75,115 95,120 90,185 70,195 50,185 30,190 15,185",
       targetX: -45, targetY: -55,
       startX: -190, startY: 30,
       targetRotate: 4,
       unlockAt: UNLOCK_STEP * 8,
       width: 80, height: 75,
     },
     {
       id: "shard-08",
       src: "/wish-assets/phone/fragments/fragment-09.png",
       fallbackPoints: "75,115 95,120 115,110 145,120 170,125 185,120 185,195 170,200 145,195 120,190 95,185 90,185",
       targetX: 30, targetY: -50,
       startX: 0, startY: -180,
       targetRotate: -5,
       unlockAt: UNLOCK_STEP * 9,
       width: 110, height: 85,
     },
     {
       id: "shard-09",
       src: "/wish-assets/phone/fragments/fragment-10.png",
       fallbackPoints: "145,120 170,125 185,120 185,195 170,200 145,195",
       targetX: 65, targetY: -55,
       startX: 170, startY: 100,
       targetRotate: 9,
       unlockAt: UNLOCK_STEP * 10,
       width: 40, height: 80,
     },
     {
       id: "shard-10",
       src: "/wish-assets/phone/fragments/fragment-11.png",
       fallbackPoints: "15,185 30,190 50,185 70,195 90,185 95,185 95,270 75,280 55,275 30,280 15,270",
       targetX: -45, targetY: 20,
       startX: -170, startY: 120,
       targetRotate: -10,
       unlockAt: UNLOCK_STEP * 11,
       width: 80, height: 95,
     },
     {
       id: "shard-11",
       src: "/wish-assets/phone/fragments/fragment-12.png",
       fallbackPoints: "95,185 120,190 145,195 170,200 185,195 185,280 165,285 145,280 120,285 95,270",
       targetX: 40, targetY: 27,
       startX: 0, startY: 240,
       targetRotate: 8,
       unlockAt: UNLOCK_STEP * 12,
       width: 90, height: 95,
     },
     {
       id: "shard-12",
       src: "/wish-assets/phone/fragments/fragment-13.png",
       fallbackPoints: "145,195 170,200 185,195 185,280 165,285 145,280",
       targetX: 65, targetY: 32,
       startX: 160, startY: 180,
       targetRotate: -6,
       unlockAt: UNLOCK_STEP * 13,
       width: 40, height: 90,
     },
     {
       id: "shard-13",
       src: "/wish-assets/phone/fragments/fragment-14.png",
       fallbackPoints: "15,270 30,280 55,275 75,280 95,270 95,285 120,285 145,280 165,285 185,280 185,405 170,410 145,405 120,410 95,405 75,410 55,405 30,410 15,405",
       targetX: 0, targetY: 130,
       startX: 0, startY: 260,
       targetRotate: 0,
       unlockAt: 1.0,
       width: 170, height: 140,
     },
   ],
 };
 
 /** Utility: given progress 0–1, return indices of unlocked fragments */
 export function getUnlockedFragmentIndices(
   progress: number,
   fragments: WishFragmentAsset[],
 ): number[] {
   return fragments
     .map((f, i) => ({ i, f }))
     .filter(({ f }) => progress >= f.unlockAt)
     .map(({ i }) => i);
 }
 
 /** Utility: given progress 0–1, return percentage of fragments unlocked (0–1) */
 export function getUnlockedFragmentRatio(
   progress: number,
   fragments: WishFragmentAsset[],
 ): number {
   return fragments.filter((f) => progress >= f.unlockAt).length / fragments.length;
 }
