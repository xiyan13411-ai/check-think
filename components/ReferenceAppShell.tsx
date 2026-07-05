"use client";

import type { ReactNode } from "react";

export type AppTab = "wish" | "plan" | "detail" | "profile";

type ReferenceAppShellProps = {
  children: ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onAddWish?: () => void;
};

const tabs: { key: AppTab; label: string; icon: string }[] = [
  { key: "wish", label: "心愿", icon: "⌂" },
  { key: "plan", label: "计划", icon: "◎" },
  { key: "detail", label: "明细", icon: "◷" },
  { key: "profile", label: "我的", icon: "☺" },
];

export default function ReferenceAppShell({ children, activeTab, onTabChange, onAddWish }: ReferenceAppShellProps) {
  return (
    <div className="safe-area-bottom relative mx-auto flex min-h-screen max-w-md flex-col bg-[#f5f2eb]">
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/75 text-stone-400 shadow-sm active:scale-95"
          aria-label="收藏当前心愿"
        >
          ☆
        </button>
        <h1 className="text-base font-bold text-stone-800">心愿罐</h1>
        <button
          type="button"
          onClick={onAddWish}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/75 text-xl text-stone-400 shadow-sm active:scale-95"
          aria-label="切换心愿类型"
        >
          ＋
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] rounded-t-[18px] border-t border-black/5 bg-white/95 px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`flex min-w-12 flex-col items-center gap-0.5 transition active:scale-95 ${
                  active ? "text-blue-500" : "text-stone-300"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
