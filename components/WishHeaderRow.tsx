"use client";

type WishHeaderRowProps = {
  title: string;
  streakDays: number;
  thumbnail?: string;
  onClick?: () => void;
};

export default function WishHeaderRow({ title, streakDays, thumbnail = "✨", onClick }: WishHeaderRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur-sm active:scale-[0.99]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-stone-50 to-stone-200 text-xl shadow-inner">
        {thumbnail}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold text-stone-800">{title}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
        <span className="text-xs leading-none">🔥</span>
        <span className="text-[11px] font-semibold text-emerald-600">连续 {streakDays} 天</span>
      </div>
    </button>
  );
}
