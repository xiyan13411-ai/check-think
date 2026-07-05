"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/progress";

type ReferenceProgressCardProps = {
  currentAmount: number;
  targetAmount: number;
  progress: number;
  lastRecordAmount?: number;
  lastRecordTimeLabel?: string;
  onSaveAmount: (amount: number) => void;
};

const quickAmounts = [20, 80, 100, 500];

export default function ReferenceProgressCard({
  currentAmount,
  targetAmount,
  progress,
  lastRecordAmount,
  lastRecordTimeLabel,
  onSaveAmount,
}: ReferenceProgressCardProps) {
  const [amountText, setAmountText] = useState("80");
  const remaining = Math.max(targetAmount - currentAmount, 0);
  const progressPct = Math.floor(progress * 100);
  const parsedAmount = useMemo(() => {
    const parsed = Number(amountText);
    if (!Number.isFinite(parsed)) return 0;
    return Math.floor(parsed);
  }, [amountText]);
  const canSave = parsedAmount > 0 && remaining > 0;

  const submitSave = () => {
    if (!canSave) return;
    onSaveAmount(Math.min(parsedAmount, remaining));
  };

  return (
    <motion.div
      className="relative z-10 -mt-1 rounded-[20px] bg-white px-5 pb-5 pt-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[11px] font-medium text-stone-400">已存</span>
          <p className="text-[28px] font-bold leading-none text-stone-950 tabular-nums">
            {formatCurrency(currentAmount)}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[34px] font-bold text-blue-500 tabular-nums">{progressPct}</span>
          <span className="text-[11px] font-medium text-stone-400">%</span>
        </div>
      </div>

      <p className="mt-0.5 text-[11px] text-stone-400">目标 {formatCurrency(targetAmount)}</p>

      <div className="relative mt-4 h-4 w-full overflow-hidden rounded-full bg-stone-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div
          className="absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
          style={{
            left: `calc(${progress * 100}% - 10px)`,
            transition: "left 0.6s ease",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#60a5fa" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>

      <p className="mt-2 text-xs text-stone-500">
        再存 <span className="font-semibold text-emerald-600">{formatCurrency(remaining)}</span> 就能完成心愿啦！
      </p>

      {lastRecordAmount !== undefined && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2">
          <span className="text-sm font-semibold text-blue-600 tabular-nums">
            刚刚存入 {formatCurrency(lastRecordAmount)}
          </span>
          <span className="text-[11px] text-stone-400">{lastRecordTimeLabel ?? ""}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-4 gap-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setAmountText(String(amount))}
            className={`h-10 rounded-xl text-sm font-semibold transition ${
              parsedAmount === amount
                ? "bg-blue-500 text-white shadow-[0_8px_18px_rgba(59,130,246,0.22)]"
                : "bg-blue-50 text-blue-600 active:bg-blue-100"
            }`}
          >
            ¥{amount}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <label className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-400">¥</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={remaining || undefined}
            value={amountText}
            onChange={(event) => setAmountText(event.target.value)}
            placeholder="输入本次存入金额"
            className="h-14 w-full rounded-[18px] border border-stone-100 bg-stone-50 pl-8 pr-3 text-base font-semibold text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <motion.button
          type="button"
          onClick={submitSave}
          disabled={!canSave}
          className={`flex h-14 min-w-[112px] items-center justify-center rounded-[18px] text-base font-bold text-white transition ${
            canSave
              ? "bg-blue-500 shadow-[0_10px_20px_rgba(59,130,246,0.28)] active:bg-blue-600"
              : "cursor-not-allowed bg-stone-200 text-stone-400"
          }`}
          whileTap={canSave ? { scale: 0.96 } : undefined}
        >
          存一笔
        </motion.button>
      </div>
    </motion.div>
  );
}
