 "use client";
 
 import { useMemo } from "react";
 
 type FloatingFragmentsProps = {
   /** How many visual fragments are unlocked on the phone (0–16) */
   unlockedVisualPieces: number;
   /** Total visual count */
   totalVisualPieces?: number;
   /** "back" = blurred behind, "front" = clear in-front */
   layer: "back" | "front";
 };
 
 type FragmentDef = {
   /** Absolute x position in the hero scene (px-like relative to container) */
   x: string;
   y: string;
   /** Rotation in degrees */
   rotate: number;
   /** Width/height in rem-ish */
   size: string;
   /** CSS filter blur (only for back layer) */
   blur?: string;
   /** Gradient class */
   gradient: string;
   /** Opacity */
   opacity: number;
 };
 
 // ── Stable layout for 10 floating fragments ──
 // Positioned around a roughly 200×420 phone centered in the container.
 // "back" layer fragments appear behind the phone (z-index lower).
 // "front" layer fragments appear in front of the phone (z-index higher).
 
 const BACK_FRAGMENTS: FragmentDef[] = [
   {
     x: "-12%", y: "-8%",
     rotate: -25, size: "2.2rem", blur: "blur(5px)",
     gradient: "from-pink-200 to-rose-100", opacity: 0.5,
   },
   {
     x: "75%", y: "2%",
     rotate: 30, size: "1.8rem", blur: "blur(4px)",
     gradient: "from-rose-100 to-amber-100", opacity: 0.45,
   },
   {
     x: "-5%", y: "60%",
     rotate: 15, size: "2rem", blur: "blur(5px)",
     gradient: "from-amber-100 to-pink-100", opacity: 0.4,
   },
   {
     x: "80%", y: "55%",
     rotate: -20, size: "1.5rem", blur: "blur(4px)",
     gradient: "from-rose-200 to-amber-100", opacity: 0.35,
   },
 ];
 
 const FRONT_FRAGMENTS: FragmentDef[] = [
   {
     x: "-18%", y: "15%",
     rotate: 35, size: "1.4rem",
     gradient: "from-pink-300 to-rose-200", opacity: 0.7,
   },
   {
     x: "78%", y: "25%",
     rotate: -30, size: "1.2rem",
     gradient: "from-rose-200 to-amber-200", opacity: 0.65,
   },
   {
     x: "-10%", y: "38%",
     rotate: -15, size: "1rem",
     gradient: "from-amber-200 to-pink-200", opacity: 0.6,
   },
   {
     x: "70%", y: "40%",
     rotate: 20, size: "1.1rem",
     gradient: "from-pink-200 to-rose-100", opacity: 0.6,
   },
   {
     x: "-15%", y: "72%",
     rotate: 40, size: "1.3rem",
     gradient: "from-rose-200 to-amber-100", opacity: 0.55,
   },
   {
     x: "75%", y: "75%",
     rotate: -18, size: "1rem",
     gradient: "from-amber-100 to-pink-200", opacity: 0.5,
   },
 ];
 
 // ── Component ──
 
 export default function FloatingFragments({
   unlockedVisualPieces,
   totalVisualPieces = 16,
   layer,
 }: FloatingFragmentsProps) {
   const pool = layer === "back" ? BACK_FRAGMENTS : FRONT_FRAGMENTS;
 
   // How many fragments should still be floating outside:
   // When 0 unlocked → all visible
   // When all unlocked → none visible
   const maxVisible = pool.length;
   const hiddenCount = Math.min(
     Math.floor((unlockedVisualPieces / totalVisualPieces) * maxVisible),
     maxVisible,
   );
   const visibleCount = maxVisible - hiddenCount;
 
   const visible = useMemo(
     () => pool.slice(0, Math.max(visibleCount, 0)),
     [visibleCount],
   );
 
   return (
     <>
       {visible.map((f, i) => (
         <div
           key={i}
           className={`absolute pointer-events-none ${
             layer === "back" ? "z-0" : "z-20"
           }`}
           style={{
             left: f.x,
             top: f.y,
             width: f.size,
             height: f.size,
             transform: `rotate(${f.rotate}deg)`,
             filter: f.blur ?? "none",
             opacity: f.opacity,
             transition: "opacity 0.6s ease, filter 0.6s ease",
             borderRadius: "35% 65% 40% 60% / 55% 40% 60% 45%",
           }}
         >
           <div
             className={`h-full w-full bg-gradient-to-br ${f.gradient} shadow-sm`}
             style={{
               borderRadius: "inherit",
               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
             }}
           />
         </div>
       ))}
     </>
   );
 }
