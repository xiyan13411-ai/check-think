"use client";
import type { ReactNode } from "react";
type ReferenceAppShellProps = { children: ReactNode };

export default function ReferenceAppShell({ children }: ReferenceAppShellProps) {
  return (
    <div className="safe-area-bottom relative mx-auto flex min-h-screen max-w-md flex-col bg-[#f5f2eb]">
      {/* Top header */}
      <div className="flex items-center justify-between px-1 pb-2 pt-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-stone-400 shadow-sm">★</button>
        <h1 className="text-base font-bold text-stone-700">心愿罐</h1>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-stone-400 shadow-sm">＋</button>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">{children}</div>
      {/* Bottom Tab Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] rounded-t-[18px] border-t border-black/5 bg-white/95 px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-0.5 text-pink-500"><span className="text-xl leading-none">🏠</span><span className="text-[10px] font-medium">心愿</span></button>
          <button className="flex flex-col items-center gap-0.5 text-stone-300"><span className="text-xl leading-none">🎯</span><span className="text-[10px] font-medium">计划</span></button>
          <button className="flex flex-col items-center gap-0.5 text-stone-300"><span className="text-xl leading-none">📋</span><span className="text-[10px] font-medium">明细</span></button>
          <button className="flex flex-col items-center gap-0.5 text-stone-300"><span className="text-xl leading-none">😊</span><span className="text-[10px] font-medium">我的</span></button>
        </div>
      </nav>
    </div>
  );
}
